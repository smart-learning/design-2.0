package kr.co.influential.youngkangapp.react.view;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.RemoteException;
import android.os.SystemClock;
import android.support.annotation.NonNull;
import android.support.v4.content.ContextCompat;
import android.support.v4.media.MediaBrowserCompat;
import android.support.v4.media.MediaDescriptionCompat;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaControllerCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.text.format.DateUtils;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import kr.co.influential.youngkangapp.R;
import kr.co.influential.youngkangapp.player.PlayerActivity;
import kr.co.influential.youngkangapp.player.playback.PlaybackManager;
import kr.co.influential.youngkangapp.player.service.MediaService;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.util.Utils;

public class ReactBottomControllerView extends FrameLayout {

  public static final String TAG = LogHelper.makeLogTag(ReactBottomControllerView.class);

  private static final long PROGRESS_UPDATE_INTERNAL = 100l;
  private static final long PROGRESS_UPDATE_INITIAL_INTERVAL = 100;

  private ProgressBar timeBar;
  private TextView title;
  private TextView currentTime;
  private TextView durationTime;
  private ImageButton pause;
  private ImageButton play;
  private ProgressBar loading;

  private MediaBrowserCompat mediaBrowser;

  private final Handler handler = new Handler();

  private final Runnable updateProgressTask = () -> updateProgress();

  private final ScheduledExecutorService executorService =
      Executors.newSingleThreadScheduledExecutor();

  private ScheduledFuture<?> scheduleFuture;

  private PlaybackStateCompat lastPlaybackState;

  private static final int SWIPE_MIN_DISTANCE = 50;
  private static final int SWIPE_MAX_OFF_PATH = 250;

  private GestureDetector mgestureScanner;

  public ReactBottomControllerView(@NonNull Context context) {
    super(context);
    inflate(context, R.layout.bottom_controller, this);

    title = findViewById(R.id.mini_title);
    currentTime = findViewById(R.id.mini_current_time);
    durationTime = findViewById(R.id.mini_duration_time);
    pause = findViewById(R.id.mini_btn_pause);
    play = findViewById(R.id.mini_btn_play);
    timeBar = findViewById(R.id.mini_time_bar);
    loading = findViewById(R.id.mini_loading);

    // initialize.
    initializeViews();

    // MediaBrowser.
    mediaBrowser = new MediaBrowserCompat(context, new ComponentName(context, MediaService.class),
        connectionCallback, null);
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    LogHelper.d(TAG, "onAttachedToWindow");
    if (mediaBrowser != null) {
      mediaBrowser.connect();
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    try {
      super.onDetachedFromWindow();
    } catch (NullPointerException e) {
      e.printStackTrace();
    }
    LogHelper.d(TAG, "onDetachedFromWindow");
    if (mediaBrowser != null) {
      mediaBrowser.disconnect();
    }
    Activity activity = Utils.getActivity(getContext());
    MediaControllerCompat mediaController = MediaControllerCompat
        .getMediaController(activity);
    if (mediaController != null) {
      mediaController.unregisterCallback(callback);
    }

    stopSeekbarUpdate();
    executorService.shutdown();
  }

  private final MediaBrowserCompat.ConnectionCallback connectionCallback =
      new MediaBrowserCompat.ConnectionCallback() {
        @Override
        public void onConnected() {
          LogHelper.d(TAG, "onConnected");
          try {
            connectToSession(mediaBrowser.getSessionToken());
          } catch (RemoteException e) {
            LogHelper.e(TAG, e, "could not connect media controller");
          }
        }
      };

  private final MediaControllerCompat.Callback callback = new MediaControllerCompat.Callback() {
    @Override
    public void onPlaybackStateChanged(@NonNull PlaybackStateCompat state) {
      LogHelper.d(TAG, "onPlaybackstate changed", state);
      updatePlaybackState(state);
      Activity activity = Utils.getActivity(getContext());
      MediaControllerCompat mediaController = MediaControllerCompat.getMediaController(activity);
      MediaMetadataCompat metadata = mediaController.getMetadata();
      if (metadata != null) {
        updateMediaDescription(metadata.getDescription());
        updateDuration(metadata);
      }
    }
  };

  private void updatePlaybackState(PlaybackStateCompat state) {
    if (state == null) {
      return;
    }

    lastPlaybackState = state;
    LogHelper.d(TAG, "playbackstate", state.getPlaybackState());
    switch (state.getState()) {
      case PlaybackStateCompat.STATE_PLAYING:
        loading.setVisibility(View.GONE);
        pause.setVisibility(View.VISIBLE);
        play.setVisibility(View.GONE);
        scheduleSeekbarUpdate();
        break;
      case PlaybackStateCompat.STATE_PAUSED:
        loading.setVisibility(View.GONE);
        pause.setVisibility(View.GONE);
        play.setVisibility(View.VISIBLE);
        stopSeekbarUpdate();
        break;
      case PlaybackStateCompat.STATE_NONE:
      case PlaybackStateCompat.STATE_STOPPED:
        loading.setVisibility(View.GONE);
        pause.setVisibility(View.GONE);
        play.setVisibility(View.VISIBLE);
        stopSeekbarUpdate();
        break;
      case PlaybackStateCompat.STATE_BUFFERING:
        loading.setVisibility(View.VISIBLE);
        pause.setVisibility(View.GONE);
        play.setVisibility(View.GONE);
        stopSeekbarUpdate();
        break;
      default:
        LogHelper.d(TAG, "Unhandled state ", state.getState());
        loading.setVisibility(View.GONE);
        pause.setVisibility(View.GONE);
        play.setVisibility(View.GONE);
    }
  }

  private void updateMediaDescription(MediaDescriptionCompat description) {
    LogHelper.d(TAG, "updateMediaDescription called");
    if (description != null) {
      title.setText(description.getTitle());
    }
  }

  private void updateDuration(MediaMetadataCompat metadata) {
    LogHelper.d(TAG, "updateDuration called");
    if (metadata != null) {
      int duration = (int) (metadata.getLong(MediaMetadataCompat.METADATA_KEY_DURATION) / 1_000l);
      timeBar.setMax(duration);
      durationTime.setText(DateUtils.formatElapsedTime(duration));
    }
  }

  private void connectToSession(MediaSessionCompat.Token token) throws RemoteException {
    Activity activity = Utils.getActivity(getContext());
    MediaControllerCompat mediaController = MediaControllerCompat
        .getMediaController(activity);
    if (mediaController == null) {
      mediaController = new MediaControllerCompat(activity, token);
    }
    MediaControllerCompat.setMediaController(activity, mediaController);
    mediaController.registerCallback(callback);
    PlaybackStateCompat state = mediaController.getPlaybackState();
    updatePlaybackState(state);
    MediaMetadataCompat metadata = mediaController.getMetadata();
    if (metadata != null) {
      updateMediaDescription(metadata.getDescription());
      updateDuration(metadata);
    }
    updateProgress();
    if (state != null && (PlaybackStateCompat.STATE_PLAYING == state.getState() ||
        PlaybackStateCompat.STATE_BUFFERING == state.getState())) {
      scheduleSeekbarUpdate();
    }
  }

  private void initializeViews() {
    // event listener.
    getRootView().setOnClickListener(v -> moveToPlayer());
    pause.setOnClickListener(v -> pause());
    play.setOnClickListener(v -> play());

    if (mgestureScanner == null) {
      mgestureScanner = new GestureDetector(getContext(), mGestureListener);
    }

    getRootView().setOnTouchListener(new View.OnTouchListener() {
      @Override
      public boolean onTouch(View v, MotionEvent event) {
        return mgestureScanner.onTouchEvent(event);
      }
    });
  }

  private void moveToPlayer() {
    Intent intent = new Intent(getContext(), PlayerActivity.class);
    intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
    intent.putExtra(PlaybackManager.FROM_MEDIA_SESSION, true);
    ContextCompat.startActivity(getContext(), intent, null);
  }

  private void pause() {
    Activity activity = Utils.getActivity(getContext());
    MediaControllerCompat mediaController = MediaControllerCompat
        .getMediaController(activity);
    if (mediaController != null) {
      mediaController.getTransportControls().pause();
    }
  }

  private void play() {
    Activity activity = Utils.getActivity(getContext());
    MediaControllerCompat mediaController = MediaControllerCompat
        .getMediaController(activity);
    if (mediaController != null) {
      mediaController.getTransportControls().play();
    }
  }

  private void scheduleSeekbarUpdate() {
    stopSeekbarUpdate();
    if (!executorService.isShutdown()) {
      scheduleFuture = executorService.scheduleAtFixedRate(
          () -> handler.post(updateProgressTask),
          PROGRESS_UPDATE_INITIAL_INTERVAL, PROGRESS_UPDATE_INTERNAL, TimeUnit.MILLISECONDS);
    }
  }

  private void stopSeekbarUpdate() {
    if (scheduleFuture != null) {
      scheduleFuture.cancel(false);
    }
  }

  private void updateProgress() {
    if (lastPlaybackState == null) {
      return;
    }
    long currentPosition = lastPlaybackState.getPosition();
    if (PlaybackStateCompat.STATE_PLAYING == lastPlaybackState.getState()) {
      // Calculate the elapsed time between the last position update and now and unless
      // paused, we can assume (delta * speed) + current position is approximately the
      // latest position. This ensure that we do not repeatedly call the getPlaybackState()
      // on MediaControllerCompat.
      long timeDelta = SystemClock.elapsedRealtime() -
          lastPlaybackState.getLastPositionUpdateTime();
      currentPosition += timeDelta * lastPlaybackState.getPlaybackSpeed();
    }
    int current = (int) (currentPosition / 1_000l);
    if (timeBar.getProgress() != current) {
      timeBar.setProgress(current);
      currentTime.setText(DateUtils.formatElapsedTime(current));
    }
  }

  GestureDetector.OnGestureListener mGestureListener = new GestureDetector.OnGestureListener() {

    @Override
    public boolean onDown(MotionEvent e) {
      return false;
    }

    @Override
    public void onShowPress(MotionEvent e) {

    }

    @Override
    public boolean onSingleTapUp(MotionEvent e) {
      return false;
    }

    @Override
    public boolean onScroll(MotionEvent e1, MotionEvent e2, float distanceX, float distanceY) {
      return false;
    }

    @Override
    public void onLongPress(MotionEvent e) {

    }

    @Override
    public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX, float velocityY) {
      float dd = e1.getX() - e2.getX();
      LogHelper.e(TAG,
          ":Gesture onFling!! [e1왼쪽]:" + e1.getX() + " [e2오른쪽]:" + e2.getX() + "====>[MIN] " + dd);

      if (Math.abs(e1.getY() - e2.getY()) > SWIPE_MAX_OFF_PATH) {
        return false;
      }

      if (e1.getX() - e2.getX() > SWIPE_MIN_DISTANCE) {
        hideBottomcontrol();
      } else if (e2.getX() - e1.getX() > SWIPE_MIN_DISTANCE) {
        hideBottomcontrol();
      }
      return true;

    }
  };

  public void hideBottomcontrol() {

//    Activity activity = Utils.getActivity(getContext());
//    MediaControllerCompat mediaController = MediaControllerCompat
//        .getMediaController(activity);
//    if (mediaController != null) {
//      mediaController.getTransportControls().stop();
//    }

    try{
      if (mediaBrowser != null) {
        mediaBrowser.disconnect();
      }

      Activity activity = Utils.getActivity(getContext());
      MediaControllerCompat mediaController = MediaControllerCompat
          .getMediaController(activity);
      if (mediaController != null) {
        mediaController.getTransportControls().stop();
        mediaController.unregisterCallback(callback);
      }

      stopSeekbarUpdate();
      executorService.shutdown();
    }catch (Exception e){
      e.printStackTrace();
      LogHelper.e(TAG , " hideBottomContorl " + e.toString());
    }
  }
}
