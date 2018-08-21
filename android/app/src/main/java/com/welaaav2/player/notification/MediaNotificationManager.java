package com.welaaav2.player.notification;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.RemoteException;
import android.support.annotation.NonNull;
import android.support.annotation.RequiresApi;
import android.support.v4.app.NotificationCompat;
import android.support.v4.media.MediaDescriptionCompat;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaControllerCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.view.View;
import android.widget.RemoteViews;
import com.welaaav2.R;
import com.welaaav2.player.PlayerActivity;
import com.welaaav2.player.service.MediaService;
import com.welaaav2.player.utils.LogHelper;

/**
 * Keeps track of a notification and updates it automatically for a given MediaSession. Maintaining
 * a visible notification (usually) guarantees that the music service won't be killed during
 * playback.
 */
public class MediaNotificationManager extends BroadcastReceiver {

  private static final String TAG = LogHelper.makeLogTag(MediaNotificationManager.class);

  private static final String CHANNEL_ID = "com.welaaav2.MEDIA_CHANNEL_ID";

  private static final int NOTIFICATION_ID = 412;
  private static final int REQUEST_CODE = 100;

  public static final String ACTION_PAUSE = "com.welaaav2.pause";
  public static final String ACTION_PLAY = "com.welaaav2.play";
  public static final String ACTION_STOP = "com.welaaav2.stop";
  public static final String ACTION_STOP_CASTING = "com.welaaav2.stop_cast";

  private final MediaService mService;
  private MediaSessionCompat.Token mSessionToken;
  private MediaControllerCompat mController;
  private MediaControllerCompat.TransportControls mTransportControls;

  private PlaybackStateCompat mPlaybackState;
  private MediaMetadataCompat mMetadata;

  private final NotificationManager mNotificationManager;

  private final PendingIntent mPlayIntent;
  private final PendingIntent mPauseIntent;
  private final PendingIntent mStopIntent;

  private final PendingIntent mStopCastIntent;

  private boolean mStarted = false;

  public MediaNotificationManager(MediaService service) throws RemoteException {
    mService = service;
    updateSessionToken();

    mNotificationManager = (NotificationManager) mService
        .getSystemService(Context.NOTIFICATION_SERVICE);

    String pkg = mService.getPackageName();
    mPauseIntent = PendingIntent.getBroadcast(mService, REQUEST_CODE,
        new Intent(ACTION_PAUSE).setPackage(pkg), PendingIntent.FLAG_CANCEL_CURRENT);
    mPlayIntent = PendingIntent.getBroadcast(mService, REQUEST_CODE,
        new Intent(ACTION_PLAY).setPackage(pkg), PendingIntent.FLAG_CANCEL_CURRENT);
    mStopIntent = PendingIntent.getBroadcast(mService, REQUEST_CODE,
        new Intent(ACTION_STOP).setPackage(pkg), PendingIntent.FLAG_CANCEL_CURRENT);
    mStopCastIntent = PendingIntent.getBroadcast(mService, REQUEST_CODE,
        new Intent(ACTION_STOP_CASTING).setPackage(pkg),
        PendingIntent.FLAG_CANCEL_CURRENT);

    // Cancel all notifications to handle the case where the Service was killed and
    // restarted by the system.
    mNotificationManager.cancelAll();
  }

  /**
   * Posts the notification and starts tracking the session to keep it updated. The notification
   * will automatically be removed if the session is destroyed before {@link #stopNotification} is
   * called.
   */
  public void startNotification() {
    if (!mStarted) {
      mMetadata = mController.getMetadata();
      mPlaybackState = mController.getPlaybackState();

      // The notification must be updated after setting started to true
      Notification notification = createNotification();
      if (notification != null) {
        mController.registerCallback(mCb);
        IntentFilter filter = new IntentFilter();
        filter.addAction(ACTION_PAUSE);
        filter.addAction(ACTION_PLAY);
        filter.addAction(ACTION_STOP_CASTING);
        mService.registerReceiver(this, filter);

        mService.startForeground(NOTIFICATION_ID, notification);
        mStarted = true;
      }
    }
  }

  /**
   * Removes the notification and stops tracking the session. If the session was destroyed this has
   * no effect.
   */
  public void stopNotification() {
    if (mStarted) {
      mStarted = false;
      mController.unregisterCallback(mCb);
      try {
        mNotificationManager.cancel(NOTIFICATION_ID);
        mService.unregisterReceiver(this);
      } catch (IllegalArgumentException ex) {
        // ignore if the receiver is not registered.
      }
      mService.stopForeground(true);
    }
  }

  @Override
  public void onReceive(Context context, Intent intent) {
    final String action = intent.getAction();
    LogHelper.d(TAG, "Received intent with action " + action);
    switch (action) {
      case ACTION_PAUSE:
        mTransportControls.pause();
        break;
      case ACTION_PLAY:
        mTransportControls.play();
        break;
      case ACTION_STOP_CASTING:
        Intent i = new Intent(context, MediaService.class);
        i.setAction(MediaService.ACTION_CMD);
        i.putExtra(MediaService.CMD_NAME, MediaService.CMD_STOP_CASTING);
        mService.startService(i);
        break;
      default:
        LogHelper.w(TAG, "Unknown intent ignored. Action=", action);
    }
  }

  /**
   * Update the state based on a change on the session token. Called either when we are running for
   * the first time or when the media session owner has destroyed the session (see {@link
   * android.media.session.MediaController.Callback#onSessionDestroyed()})
   */
  private void updateSessionToken() throws RemoteException {
    MediaSessionCompat.Token freshToken = mService.getSessionToken();
    if (mSessionToken == null && freshToken != null ||
        mSessionToken != null && !mSessionToken.equals(freshToken)) {
      if (mController != null) {
        mController.unregisterCallback(mCb);
      }
      mSessionToken = freshToken;
      if (mSessionToken != null) {
        mController = new MediaControllerCompat(mService, mSessionToken);
        mTransportControls = mController.getTransportControls();
        if (mStarted) {
          mController.registerCallback(mCb);
        }
      }
    }
  }

  private PendingIntent createContentIntent(MediaDescriptionCompat description) {
    Intent openUI = new Intent(mService, PlayerActivity.class);
    openUI.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
    if (description != null) {
//      openUI.putExtra(PlayerActivity.EXTRA_CURRENT_MEDIA_DESCRIPTION, description);
    }
    return PendingIntent.getActivity(mService, REQUEST_CODE, openUI,
        PendingIntent.FLAG_CANCEL_CURRENT);
  }

  private final MediaControllerCompat.Callback mCb = new MediaControllerCompat.Callback() {
    @Override
    public void onPlaybackStateChanged(@NonNull PlaybackStateCompat state) {
      mPlaybackState = state;
      LogHelper.d(TAG, "Received new playback state", state);
      if (state.getState() == PlaybackStateCompat.STATE_STOPPED ||
          state.getState() == PlaybackStateCompat.STATE_NONE) {
        stopNotification();
      } else {
        Notification notification = createNotification();
        if (notification != null) {
          mNotificationManager.notify(NOTIFICATION_ID, notification);
        }
      }
    }

    @Override
    public void onMetadataChanged(MediaMetadataCompat metadata) {
      mMetadata = metadata;
      LogHelper.d(TAG, "Received new metadata ", metadata);
      Notification notification = createNotification();
      if (notification != null) {
        mNotificationManager.notify(NOTIFICATION_ID, notification);
      }
    }

    @Override
    public void onSessionDestroyed() {
      super.onSessionDestroyed();
      LogHelper.d(TAG, "Session was destroyed, resetting to the new session token");
      try {
        updateSessionToken();
      } catch (RemoteException e) {
        LogHelper.e(TAG, e, "could not connect media controller");
      }
    }
  };

  private Notification createNotification() {
    LogHelper.d(TAG, "updateNotificationMetadata. mMetadata=" + mMetadata);
    if (mMetadata == null || mPlaybackState == null) {
      return null;
    }

    // Notification channels are only supported on Android O+.
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      createNotificationChannel();
    }

    final RemoteViews notificationLayout = new RemoteViews(mService.getPackageName(),
        R.layout.welaaa_player_notify);
    setNotificationLayout(notificationLayout);

    final NotificationCompat.Builder notificationBuilder =
        new NotificationCompat.Builder(mService, CHANNEL_ID);
    notificationBuilder.setSmallIcon(R.drawable.notify_logo_player)
        .setContent(notificationLayout)
        .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
        .setPriority(NotificationCompat.PRIORITY_MAX)
        .setOnlyAlertOnce(true)
        .setDeleteIntent(mStopIntent)
        .setContentIntent(createContentIntent(mMetadata.getDescription()));

    if (mController != null && mController.getExtras() != null) {
      String castName = mController.getExtras().getString(MediaService.EXTRA_CONNECTED_CAST);
      if (castName != null) {
        String castInfo = mService.getResources()
            .getString(R.string.casting_to_device, castName);
        notificationBuilder.setSubText(castInfo);
        notificationBuilder.addAction(R.drawable.btn_close,
            mService.getString(R.string.stop_casting), mStopCastIntent);
      }
    }

    setNotificationPlaybackState(notificationBuilder);

    return notificationBuilder.build();
  }

  private void setNotificationLayout(RemoteViews remoteViews) {
    MediaDescriptionCompat description = mMetadata.getDescription();

    remoteViews.setTextViewText(R.id.text_title, description.getTitle());
    remoteViews.setOnClickPendingIntent(R.id.text_title, createContentIntent(description));
    remoteViews.setOnClickPendingIntent(R.id.btn_remote_play, mPlayIntent);
    remoteViews.setOnClickPendingIntent(R.id.btn_remote_pause, mPauseIntent);
    remoteViews.setOnClickPendingIntent(R.id.btn_remote_close, mStopIntent);

    // Play or pause button, depending on the current state.
    if (PlaybackStateCompat.STATE_PLAYING == mPlaybackState.getState()) {
      remoteViews.setViewVisibility(R.id.btn_remote_play, View.GONE);
      remoteViews.setViewVisibility(R.id.btn_remote_pause, View.VISIBLE);
    } else {
      remoteViews.setViewVisibility(R.id.btn_remote_play, View.VISIBLE);
      remoteViews.setViewVisibility(R.id.btn_remote_pause, View.GONE);
    }
  }

  private void setNotificationPlaybackState(NotificationCompat.Builder builder) {
    LogHelper.d(TAG, "updateNotificationPlaybackState. mPlaybackState=" + mPlaybackState);
    if (mPlaybackState == null || !mStarted) {
      LogHelper.d(TAG, "updateNotificationPlaybackState. cancelling notification!");
      mService.stopForeground(true);
      return;
    }

    // Make sure that the notification can be dismissed by the user when we are not playing:
    builder.setOngoing(mPlaybackState.getState() == PlaybackStateCompat.STATE_PLAYING);
  }

  /**
   * Creates Notification Channel. This is required in Android O+ to display notifications.
   */
  @RequiresApi(Build.VERSION_CODES.O)
  private void createNotificationChannel() {
    if (mNotificationManager.getNotificationChannel(CHANNEL_ID) == null) {
      NotificationChannel notificationChannel =
          new NotificationChannel(CHANNEL_ID,
              mService.getString(R.string.notification_channel),
              NotificationManager.IMPORTANCE_LOW);

      notificationChannel.setDescription(
          mService.getString(R.string.notification_channel_description));

      mNotificationManager.createNotificationChannel(notificationChannel);
    }
  }
}
