package com.welaaav2.react.view;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.os.RemoteException;
import android.support.annotation.NonNull;
import android.support.v4.media.MediaBrowserCompat;
import android.support.v4.media.MediaDescriptionCompat;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaControllerCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import com.welaaav2.R;
import com.welaaav2.player.service.MediaService;
import com.welaaav2.player.utils.LogHelper;
import com.welaaav2.util.Utils;

public class ReactBottomControllerView extends FrameLayout {

  public static final String TAG = LogHelper.makeLogTag(ReactBottomControllerView.class);

  private TextView title;
  private TextView currentTime;
  private TextView durationTime;
  private ImageButton pause;
  private ImageButton play;
  private ProgressBar timeBar;
  private ProgressBar loading;

  private MediaBrowserCompat mediaBrowser;

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

    // event listener.
    pause.setOnClickListener(v -> pause());
    play.setOnClickListener(v -> play());

    // MediaBrowser.
    mediaBrowser = new MediaBrowserCompat(context, new ComponentName(context, MediaService.class),
        connectionCallback, null);
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    LogHelper.d(TAG, "onAttachedToWindow");
    mediaBrowser.connect();
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    LogHelper.d(TAG, "onDetachedFromWindow");
    mediaBrowser.disconnect();
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
    }

    @Override
    public void onMetadataChanged(MediaMetadataCompat metadata) {
      if (metadata != null) {
        updateMediaDescription(metadata.getDescription());
      }
    }
  };

  private void updatePlaybackState(PlaybackStateCompat state) {
    if (state == null) {
      return;
    }

    LogHelper.d(TAG, "playbackstate", state.getPlaybackState());
    switch (state.getState()) {
      case PlaybackStateCompat.STATE_PLAYING:
        loading.setVisibility(View.GONE);
        pause.setVisibility(View.VISIBLE);
        play.setVisibility(View.GONE);
        break;
      case PlaybackStateCompat.STATE_PAUSED:
        loading.setVisibility(View.GONE);
        pause.setVisibility(View.GONE);
        play.setVisibility(View.VISIBLE);
        break;
      case PlaybackStateCompat.STATE_NONE:
      case PlaybackStateCompat.STATE_STOPPED:
        loading.setVisibility(View.GONE);
        pause.setVisibility(View.GONE);
        play.setVisibility(View.VISIBLE);
        break;
      case PlaybackStateCompat.STATE_BUFFERING:
        loading.setVisibility(View.VISIBLE);
        pause.setVisibility(View.GONE);
        play.setVisibility(View.GONE);
        break;
      default:
        LogHelper.d(TAG, "Unhandled state ", state.getState());
        loading.setVisibility(View.GONE);
        pause.setVisibility(View.GONE);
        play.setVisibility(View.GONE);
    }
  }

  private void updateMediaDescription(MediaDescriptionCompat description) {
    if (description == null) {
      title.setText("");
      return;
    }

    LogHelper.d(TAG, "description", description.getTitle());
    title.setText(description.getTitle());
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

    updatePlaybackState(mediaController.getPlaybackState());
    if (mediaController.getMetadata() != null) {
      updateMediaDescription(mediaController.getMetadata().getDescription());
    }
  }

  private void pause() {
    Activity activity = Utils.getActivity(getContext());
    MediaControllerCompat mediaController = MediaControllerCompat
        .getMediaController(activity);
    if (mediaController == null) {
      return;
    }
    mediaController.getTransportControls().pause();
  }

  private void play() {
    Activity activity = Utils.getActivity(getContext());
    MediaControllerCompat mediaController = MediaControllerCompat
        .getMediaController(activity);
    if (mediaController == null) {
      return;
    }
    mediaController.getTransportControls().play();
  }
}
