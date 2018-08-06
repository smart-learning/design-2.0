package com.welaaav2.player.service;

import static com.welaaav2.player.notification.NotificationBuilder.NOW_PLAYING_NOTIFICATION;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.os.Bundle;
import android.os.RemoteException;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationManagerCompat;
import android.support.v4.media.AudioAttributesCompat;
import android.support.v4.media.MediaBrowserCompat.MediaItem;
import android.support.v4.media.MediaBrowserServiceCompat;
import android.support.v4.media.session.MediaControllerCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import com.google.android.exoplayer2.ext.mediasession.MediaSessionConnector;
import com.welaaav2.R;
import com.welaaav2.player.PlayerActivity;
import com.welaaav2.player.core.PlayerHolder;
import com.welaaav2.player.decorator.AudioFocusExoPlayerDecorator;
import com.welaaav2.player.extension.WelaaaPlaybackPrepare;
import com.welaaav2.player.notification.NotificationBuilder;
import java.util.List;

public class MediaService extends MediaBrowserServiceCompat {

  private MediaSessionCompat mediaSession;
  private MediaControllerCompat mediaController;
  private MediaSessionConnector mediaSessionConnector;

  private NotificationManagerCompat notificationManager;
  private NotificationBuilder notificationBuilder;

  private BecomingNoisyReceiver becomingNoisyRecevier;

  private boolean isForegroundService = false;

  private AudioAttributesCompat audioAttributes;


  @Override
  public void onCreate() {
    super.onCreate();

    // Build a PendingIntent that can be used to launch the UI.
    Context context = getApplicationContext();
    Intent intent = new Intent(context, PlayerActivity.class);
    PendingIntent pi = PendingIntent
        .getActivity(context, 99, intent, PendingIntent.FLAG_UPDATE_CURRENT);

    // Create a new MediaSession.
    mediaSession = new MediaSessionCompat(this, "MediaService");
    mediaSession.setSessionActivity(pi);
    mediaSession.setActive(true);

    /**
     * In order for [MediaBrowserCompat.ConnectionCallback.onConnected] to be called,
     * a [MediaSessionCompat.Token] needs to be set on the [MediaBrowserServiceCompat].
     *
     * It is possible to wait to set the session token, if required for a specific use-case.
     * However, the token *must* be set by the time [MediaBrowserServiceCompat.onGetRoot]
     * returns, or the connection will fail silently. (The system will not even call
     * [MediaBrowserCompat.ConnectionCallback.onConnectionFailed].)
     */
    setSessionToken(mediaSession.getSessionToken());

    // Because ExoPlayer will manage the MediaSession, add the service as a callback for
    // state changes.
    mediaController = new MediaControllerCompat(this, mediaSession);
    mediaController.registerCallback(new MediaControllerCallback());

    notificationBuilder = new NotificationBuilder(this);
    notificationManager = NotificationManagerCompat.from(this);

    becomingNoisyRecevier = new BecomingNoisyReceiver(this, mediaSession.getSessionToken());

    audioAttributes = new AudioAttributesCompat.Builder()
        .setContentType(AudioAttributesCompat.CONTENT_TYPE_MUSIC)
        .setUsage(AudioAttributesCompat.USAGE_MEDIA)
        .build();
    AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
    PlayerHolder playerHolder = PlayerHolder.getInstance(context);
    AudioFocusExoPlayerDecorator player = new AudioFocusExoPlayerDecorator(
        audioAttributes, audioManager, playerHolder);
    WelaaaPlaybackPrepare playbackPrepare = new WelaaaPlaybackPrepare(player);

    // ExoPlayer will manage the MediaSession for us.
    mediaSessionConnector = new MediaSessionConnector(mediaSession);
    mediaSessionConnector.setPlayer(player, playbackPrepare);
  }

  @Override
  public void onTaskRemoved(Intent rootIntent) {
    super.onTaskRemoved(rootIntent);
    stopSelf();
  }

  @Override
  public void onDestroy() {
    mediaSession.setActive(false);
    mediaSession.release();
  }

  @Nullable
  @Override
  public BrowserRoot onGetRoot(@NonNull String clientPackageName, int clientUid,
      @Nullable Bundle rootHints) {
    return new BrowserRoot(getString(R.string.app_name), null);
  }

  @Override
  public void onLoadChildren(@NonNull String parentId, @NonNull Result<List<MediaItem>> result) {
    result.sendResult(null);
  }


  /**
   * Class to receive callbacks about state changes to the [MediaSessionCompat]. In response to
   * those callbacks, this class:
   *
   * - Build/update the service's notification. - Register/unregister a broadcast receiver for
   * [AudioManager.ACTION_AUDIO_BECOMING_NOISY]. - Calls [Service.startForeground] and
   * [Service.stopForeground].
   */
  private class MediaControllerCallback extends MediaControllerCompat.Callback {

    @Override
    public void onPlaybackStateChanged(PlaybackStateCompat state) {
      if (state == null) {
        return;
      }

      int updateState = state.getState();

      // Skip building a notification when state is "none".
      Notification notification = null;
      if (PlaybackStateCompat.STATE_NONE == updateState) {
        notification = notificationBuilder.buildNotification(mediaSession.getSessionToken());
      }

      switch (updateState) {
        case PlaybackStateCompat.STATE_BUFFERING:
        case PlaybackStateCompat.STATE_PLAYING:
          becomingNoisyRecevier.register();

          startForeground(NOW_PLAYING_NOTIFICATION, notification);
          isForegroundService = true;
          break;

        default:
          becomingNoisyRecevier.unregister();

          if (isForegroundService) {
            stopForeground(false);

            if (notification != null) {
              notificationManager.notify(NOW_PLAYING_NOTIFICATION, notification);
            } else {
              stopForeground(true);
            }
            isForegroundService = false;
          }
          break;
      }
    }
  }

  /**
   * Helper class for listening for when headphone are unplugged (or the audio will otherwise cause
   * playback to becom "noisy".
   */
  private class BecomingNoisyReceiver extends BroadcastReceiver {

    private Context context;

    private IntentFilter noisyIntentFilter;
    private MediaControllerCompat mediaController;

    private boolean isRegistered = false;

    public BecomingNoisyReceiver(Context context, MediaSessionCompat.Token sessionToken) {
      this.context = context;
      noisyIntentFilter = new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY);
      try {
        mediaController = new MediaControllerCompat(context, sessionToken);
      } catch (RemoteException e) {
        e.printStackTrace();
      }
    }

    public void register() {
      if (!isRegistered) {
        context.registerReceiver(this, noisyIntentFilter);
        isRegistered = true;
      }
    }

    public void unregister() {
      if (isRegistered) {
        context.unregisterReceiver(this);
        isRegistered = false;
      }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
      if (AudioManager.ACTION_AUDIO_BECOMING_NOISY == intent.getAction()) {
        mediaController.getTransportControls().pause();
      }
    }
  }
}
