package kr.co.influential.youngkangapp.player.service;

import static kr.co.influential.youngkangapp.player.utils.MediaIDHelper.MEDIA_ID_ROOT;

import android.annotation.TargetApi;
import android.app.ActivityManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.PowerManager;
import android.os.RemoteException;
import android.os.SystemClock;
import android.support.annotation.NonNull;
import android.support.v4.media.MediaBrowserCompat.MediaItem;
import android.support.v4.media.MediaBrowserServiceCompat;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaButtonReceiver;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.support.v7.media.MediaRouter;
import android.util.Log;
import com.google.android.gms.cast.framework.CastContext;
import com.google.android.gms.cast.framework.CastSession;
import com.google.android.gms.cast.framework.SessionManager;
import com.google.android.gms.cast.framework.SessionManagerListener;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import kr.co.influential.youngkangapp.IdleChangeReceiver;
import kr.co.influential.youngkangapp.R;
import kr.co.influential.youngkangapp.player.PlayerActivity;
import kr.co.influential.youngkangapp.player.notification.MediaNotificationManager;
import kr.co.influential.youngkangapp.player.playback.CastPlayback;
import kr.co.influential.youngkangapp.player.playback.LocalPlayback;
import kr.co.influential.youngkangapp.player.playback.Playback;
import kr.co.influential.youngkangapp.player.playback.PlaybackManager;
import kr.co.influential.youngkangapp.player.utils.CarHelper;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.player.utils.TvHelper;
import kr.co.influential.youngkangapp.player.utils.WearHelper;

public class MediaService extends MediaBrowserServiceCompat implements
    PlaybackManager.PlaybackServiceCallback,
    PlaybackManager.MetadataUpdateListener {

  private static final String TAG = LogHelper.makeLogTag(MediaService.class);

  // Extra on MediaSession that contains the Cast device name currently connected to
  public static final String EXTRA_CONNECTED_CAST = "kr.co.influential.youngkangapp.CAST_NAME";
  // The action of the incoming Intent indicating that it contains a command
  // to be executed (see {@link #onStartCommand})
  public static final String ACTION_CMD = "kr.co.influential.youngkangapp.ACTION_CMD";
  // The key in the extras of the incoming Intent indicating the command that
  // should be executed (see {@link #onStartCommand})
  public static final String CMD_NAME = "CMD_NAME";
  // A value of a CMD_NAME key in the extras of the incoming Intent that
  // indicates that the media playback should be paused (see {@link #onStartCommand})
  public static final String CMD_PAUSE = "CMD_PAUSE";
  // A value of a CMD_NAME key that indicates that the media playback should switch
  // to local playback from cast playback.
  public static final String CMD_STOP_CASTING = "CMD_STOP_CASTING";
  // Delay stopSelf by using a handler.
  private static final int STOP_DELAY = 30000;

  private PlaybackManager mPlaybackManager;

  private MediaSessionCompat mSession;
  private MediaNotificationManager mMediaNotificationManager;
  private Bundle mSessionExtras;
  private final DelayedStopHandler mDelayedStopHandler = new DelayedStopHandler(this);
  private MediaRouter mMediaRouter;
  private SessionManager mCastSessionManager;
  private SessionManagerListener<CastSession> mCastSessionManagerListener;

  private boolean mIsConnectedToCar;
  private BroadcastReceiver mCarConnectionReceiver;
  private BroadcastReceiver receiver = new IdleReceiver();

  private static final int MAX_NETWORK_TRY = 30;

  private int network_try_counter = 0;

  /*
   * (non-Javadoc)
   * @see android.app.Service#onCreate()
   */
  @Override
  public void onCreate() {
    super.onCreate();
    LogHelper.d(TAG, "onCreate");

    LocalPlayback playback = LocalPlayback.getInstance(this);
    mPlaybackManager = new PlaybackManager(this, this, playback);

    // Start a new MediaSession
    mSession = new MediaSessionCompat(this, "MediaService");
    setSessionToken(mSession.getSessionToken());
    mSession.setCallback(mPlaybackManager.getMediaSessionCallback());
    mSession.setFlags(MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS |
        MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS);

    Context context = getApplicationContext();
    Intent intent = new Intent(context, PlayerActivity.class);
    PendingIntent pi = PendingIntent.getActivity(context, 99 /*request code*/,
        intent, PendingIntent.FLAG_UPDATE_CURRENT);
    mSession.setSessionActivity(pi);

    mSessionExtras = new Bundle();
    CarHelper.setSlotReservationFlags(mSessionExtras, true, true, true);
    WearHelper.setSlotReservationFlags(mSessionExtras, true, true);
    WearHelper.setUseBackgroundFromTheme(mSessionExtras, true);
    mSession.setExtras(mSessionExtras);

    mPlaybackManager.updatePlaybackState(null);

    try {
      mMediaNotificationManager = new MediaNotificationManager(this);
    } catch (RemoteException e) {
      throw new IllegalStateException("Could not create a MediaNotificationManager", e);
    }

    int playServicesAvailable =
        GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(this);

    if (!TvHelper.isTvUiMode(this) && playServicesAvailable == ConnectionResult.SUCCESS) {
      mCastSessionManager = CastContext.getSharedInstance(this).getSessionManager();
      mCastSessionManagerListener = new CastSessionManagerListener();
      mCastSessionManager.addSessionManagerListener(mCastSessionManagerListener,
          CastSession.class);
    }

    mMediaRouter = MediaRouter.getInstance(getApplicationContext());

    registerCarConnectionReceiver();

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      registerReceiver(receiver, IdleReceiver.Filter);
    }
  }

  /**
   * (non-Javadoc)
   *
   * @see android.app.Service#onStartCommand(android.content.Intent, int, int)
   */
  @Override
  public int onStartCommand(Intent startIntent, int flags, int startId) {
    if (startIntent != null) {
      String action = startIntent.getAction();
      String command = startIntent.getStringExtra(CMD_NAME);
      if (ACTION_CMD.equals(action)) {
        if (CMD_PAUSE.equals(command)) {
          mPlaybackManager.handlePauseRequest();
        } else if (CMD_STOP_CASTING.equals(command)) {
          CastContext.getSharedInstance(this).getSessionManager().endCurrentSession(true);
        }
      } else {
        // Try to handle the intent as a media button event wrapped by MediaButtonReceiver
        MediaButtonReceiver.handleIntent(mSession, startIntent);
      }
    }
    // Reset the delay handler to enqueue a message to stop the service if
    // nothing is playing.
    mDelayedStopHandler.removeCallbacksAndMessages(null);
    mDelayedStopHandler.sendEmptyMessageDelayed(0, STOP_DELAY);
    return START_STICKY;
  }

  /*
   * Handle case when user swipes the app away from the recents apps list by
   * stopping the service (and any ongoing playback).
   */
  @Override
  public void onTaskRemoved(Intent rootIntent) {
    super.onTaskRemoved(rootIntent);
  }

  /**
   * (non-Javadoc)
   *
   * @see android.app.Service#onDestroy()
   */
  @Override
  public void onDestroy() {
    LogHelper.d(TAG, "onDestroy");
    unregisterCarConnectionReceiver();

    try{
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        unregisterReceiver(receiver);
      }
    }catch (Exception e){
      e.printStackTrace();
    }

    network_try_counter = MAX_NETWORK_TRY;

    // Service is being killed, so make sure we release our resources
    mPlaybackManager.handleStopRequest(null);
    mMediaNotificationManager.stopNotification();

    if (mCastSessionManager != null) {
      mCastSessionManager.removeSessionManagerListener(mCastSessionManagerListener,
          CastSession.class);
    }

    mDelayedStopHandler.removeCallbacksAndMessages(null);
    mSession.release();
  }

  @Override
  public BrowserRoot onGetRoot(@NonNull String clientPackageName, int clientUid,
      Bundle rootHints) {
    LogHelper.d(TAG, "OnGetRoot: clientPackageName=" + clientPackageName,
        "; clientUid=" + clientUid + " ; rootHints=", rootHints);
    //noinspection StatementWithEmptyBody
    if (CarHelper.isValidCarPackage(clientPackageName)) {
      // Optional: if your app needs to adapt the media library to show a different subset
      // when connected to the car, this is where you should handle it.
      // If you want to adapt other runtime behaviors, like tweak ads or change some behavior
      // that should be different on cars, you should instead use the boolean flag
      // set by the BroadcastReceiver mCarConnectionReceiver (mIsConnectedToCar).
    }
    //noinspection StatementWithEmptyBody
    if (WearHelper.isValidWearCompanionPackage(clientPackageName)) {
      // Optional: if your app needs to adapt the media library for when browsing from a
      // Wear device, you should return a different MEDIA ROOT here, and then,
      // on onLoadChildren, handle it accordingly.
    }

    return new BrowserRoot(MEDIA_ID_ROOT, null);
  }

  @Override
  public void onLoadChildren(@NonNull final String parentMediaId,
      @NonNull final Result<List<MediaItem>> result) {
    LogHelper.d(TAG, "OnLoadChildren: parentMediaId=", parentMediaId);
    result.sendResult(Collections.emptyList());
  }

  /**
   * Callback method called from PlaybackManager whenever the media is about to play.
   */
  @Override
  public void onPlaybackStart() {
    mSession.setActive(true);

    mDelayedStopHandler.removeCallbacksAndMessages(null);

    // The service needs to continue running even after the bound client (usually a
    // MediaController) disconnects, otherwise the media playback will stop.
    // Calling startService(Intent) will keep the service running until it is explicitly killed.


    network_try_counter = 0;
    new Thread() {
      @Override
      public void run() {
        while (network_try_counter < MAX_NETWORK_TRY) {
          try {
            startService(new Intent(getApplicationContext(), MediaService.class));
          } catch (Exception e) {
            LogHelper.e(TAG, "Fail to Exception:" + e);
            break;
          }
          SystemClock.sleep(3000);
          ++network_try_counter;
        }
      }
    }.start();
  }


  /**
   * Callback method called from PlaybackManager whenever the media stops playing.
   */
  @Override
  public void onPlaybackStop() {
    mSession.setActive(false);
    // Reset the delayed stop handler, so after STOP_DELAY it will be executed again,
    // potentially stopping the service.
    mDelayedStopHandler.removeCallbacksAndMessages(null);
    mDelayedStopHandler.sendEmptyMessageDelayed(0, STOP_DELAY);
    stopForeground(true);
  }

  @Override
  public void onNotificationRequired() {
    mMediaNotificationManager.startNotification();
  }

  @Override
  public void onPlaybackStateUpdated(PlaybackStateCompat newState) {
    mSession.setPlaybackState(newState);
  }

  @Override
  public void onMetadataChanged(MediaMetadataCompat metadata) {
    mSession.setMetadata(metadata);
  }

  @Override
  public void onMetadataRetrieveError() {
    mPlaybackManager.updatePlaybackState(getString(R.string.error_no_metadata));
  }

  private void registerCarConnectionReceiver() {
    IntentFilter filter = new IntentFilter(CarHelper.ACTION_MEDIA_STATUS);
    mCarConnectionReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        String connectionEvent = intent.getStringExtra(CarHelper.MEDIA_CONNECTION_STATUS);
        mIsConnectedToCar = CarHelper.MEDIA_CONNECTED.equals(connectionEvent);
        LogHelper.i(TAG, "Connection event to Android Auto: ", connectionEvent,
            " isConnectedToCar=", mIsConnectedToCar);
      }
    };
    registerReceiver(mCarConnectionReceiver, filter);
  }

  private void unregisterCarConnectionReceiver() {
    unregisterReceiver(mCarConnectionReceiver);
  }

  /**
   * A simple handler that stops the service if playback is not active (playing)
   */
  private static class DelayedStopHandler extends Handler {

    private final WeakReference<MediaService> mWeakReference;

    private DelayedStopHandler(MediaService service) {
      mWeakReference = new WeakReference<>(service);
    }

    @Override
    public void handleMessage(Message msg) {
      MediaService service = mWeakReference.get();
      if (service != null && service.mPlaybackManager.getPlayback() != null) {
        if (service.mPlaybackManager.getPlayback().isPlaying()) {
          LogHelper.d(TAG, "Ignoring delayed stop since the media player is in use.");
          return;
        }
        LogHelper.d(TAG, "Stopping service with delay handler.");
        service.stopSelf();
      }
    }
  }

  /**
   * Session Manager Listener responsible for switching the Playback instances depending on whether
   * it is connected to a remote player.
   */
  private class CastSessionManagerListener implements SessionManagerListener<CastSession> {

    @Override
    public void onSessionEnded(CastSession session, int error) {
      LogHelper.d(TAG, "onSessionEnded");
      mSessionExtras.remove(EXTRA_CONNECTED_CAST);
      mSession.setExtras(mSessionExtras);
      Playback playback = LocalPlayback.getInstance(MediaService.this);
      mMediaRouter.setMediaSessionCompat(null);
      mPlaybackManager.switchToPlayback(playback, false);
    }

    @Override
    public void onSessionResumed(CastSession session, boolean wasSuspended) {
    }

    @Override
    public void onSessionStarted(CastSession session, String sessionId) {
      // In case we are casting, send the device name as an extra on MediaSession metadata.
      mSessionExtras.putString(EXTRA_CONNECTED_CAST,
          session.getCastDevice().getFriendlyName());
      mSession.setExtras(mSessionExtras);
      // Now we can switch to CastPlayback
      Playback playback = new CastPlayback(MediaService.this);
      mMediaRouter.setMediaSessionCompat(mSession);
      mPlaybackManager.switchToPlayback(playback, true);
    }

    @Override
    public void onSessionStarting(CastSession session) {
    }

    @Override
    public void onSessionStartFailed(CastSession session, int error) {
    }

    @Override
    public void onSessionEnding(CastSession session) {
      // This is our final chance to update the underlying stream position
      // In onSessionEnded(), the underlying CastPlayback#mRemoteMediaClient
      // is disconnected and hence we update our local value of stream position
      // to the latest position.
      mPlaybackManager.getPlayback().updateLastKnownStreamPosition();
    }

    @Override
    public void onSessionResuming(CastSession session, String sessionId) {
    }

    @Override
    public void onSessionResumeFailed(CastSession session, int error) {
    }

    @Override
    public void onSessionSuspended(CastSession session, int reason) {
    }
  }

  private void testNetworkConnection() throws IOException {

    URL url = new URL("http://www.google.com");
    Log.d(TAG,"Trying to connect...");
    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
    conn.setConnectTimeout(5000);
    conn.setReadTimeout(5000);
    conn.connect();
    Log.d(TAG,"ResponseCode:" + conn.getResponseCode());
    conn.disconnect();
  }

  private void dumpProcessPriority() {
    ActivityManager am = (ActivityManager) getSystemService(ACTIVITY_SERVICE);
    List<ActivityManager.RunningAppProcessInfo> processList = am.getRunningAppProcesses();
    for(ActivityManager.RunningAppProcessInfo info : processList) {
      Log.d(TAG, "Process Name:" + info.processName + "["
          + getPriorityDesc(info.importance) + "]");
    }
  }

  private String getPriorityDesc(int priority) {

    if(priority <= 100) {
      return "IMPORTANCE_FOREGROUND";
    } else if (priority <= 125) {
      return "IMPORTANCE_FOREGROUND_SERVICE";
    } else if (priority <=150) {
      return "IMPORTANCE_TOP_SLEEPING";
    } else if (priority <= 200) {
      return "IMPORTANCE_VISIBLE";
    }

    return "IMPORTANCE_ETC";
  }

  public static class IdleReceiver extends IdleChangeReceiver {
    @TargetApi(Build.VERSION_CODES.M)
    @Override
    public void onReceive(Context context, Intent intent) {

      PowerManager pm = (PowerManager) context.getSystemService(POWER_SERVICE);
      if (pm.isDeviceIdleMode()){
        launchMaskActivtiy(context);
      }
    }
  }
}
