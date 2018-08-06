package com.welaaav2.player.decorator;

import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.os.Looper;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.support.v4.media.AudioAttributesCompat;
import android.util.Log;
import com.google.android.exoplayer2.ExoPlaybackException;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.PlaybackParameters;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.PlayerMessage;
import com.google.android.exoplayer2.PlayerMessage.Target;
import com.google.android.exoplayer2.SeekParameters;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.Timeline;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.TrackGroupArray;
import com.google.android.exoplayer2.trackselection.TrackSelectionArray;
import com.welaaav2.player.core.PlayerHolder;

/**
 * Wrapper around a [SimpleExoPlayer] simplifies playback by automatically handling audio focus
 * using [AudioFocusRequest] on Oreo+ devices, and an [AudioManager.OnAudioFocusChangeListener] on
 * previous versions.
 */
public class AudioFocusExoPlayerDecorator implements ExoPlayer {

  private static final String TAG = AudioFocusExoPlayerDecorator.class.getSimpleName();
  private static final float MEDIA_VOLUME_DEFAULT = 1.f;
  private static final float MEDIA_VOLUME_DUCK = .2f;

  private AudioAttributesCompat audioAttributes;
  private AudioManager audioManager;
  private PlayerHolder playerHolder;

  /**
   * Similar to [Player.getPlayWhenReady], but reflects the intent to play.
   */
  private boolean shouldPlayWhenReady = false;

  private AudioManager.OnAudioFocusChangeListener audioFocusChangeListener =
      focusChange -> {
        SimpleExoPlayer player = playerHolder.getPlayer();

        switch (focusChange) {
          case AudioManager.AUDIOFOCUS_GAIN:
            if (shouldPlayWhenReady || player.getPlayWhenReady()) {
              player.setPlayWhenReady(true);
              player.setVolume(MEDIA_VOLUME_DEFAULT);
            }
            shouldPlayWhenReady = false;
            break;

          case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK:
            // Lost focus for a short time, but it's ok to keep playing
            // at an attenuated level.
            if (player.getPlayWhenReady()) {
              player.setVolume(MEDIA_VOLUME_DUCK);
            }
            break;

          case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
            // Lost focus for a short time, but we have to stop
            // playback. We don't release the media player because playback
            // is likely to resume.
            shouldPlayWhenReady = player.getPlayWhenReady();
            player.setPlayWhenReady(false);
            break;

          case AudioManager.AUDIOFOCUS_LOSS:
            setPlayWhenReady(false);
            break;
        }
      };

  private AudioFocusRequest audioFocusRequest;

  public AudioFocusExoPlayerDecorator(
      AudioAttributesCompat audioAttributes, AudioManager audioManager, PlayerHolder playerHolder) {
    this.audioAttributes = audioAttributes;
    this.audioManager = audioManager;
    this.playerHolder = playerHolder;

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      audioFocusRequest = buildAudioFocusRequest();
    }
  }

  public PlayerHolder getPlayerHolder() {
    return playerHolder;
  }

  @Override
  public void setPlayWhenReady(boolean playWhenReady) {
    if (playWhenReady) {
      requestAudioFocus();
    } else {
      SimpleExoPlayer player = playerHolder.getPlayer();

      if (shouldPlayWhenReady) {
        shouldPlayWhenReady = false;
        playerHolder.getPlayerEventListener()
            .onPlayerStateChanged(false, player.getPlaybackState());
      }
      player.setPlayWhenReady(false);
      abandonAudioFocus();
    }
  }

  /**
   * @return 'true' when the underlying player's 'playWhenReady' is true OR when it would be true,
   * but [AudioManager.AUDIOFOCUS_LOSS_TRANSIENT] has forced a temporary pause in playback.
   * @see [Player.getPlayWhenReady]
   */
  @Override
  public boolean getPlayWhenReady() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getPlayWhenReady() || shouldPlayWhenReady;
  }

  private void requestAudioFocus() {
    int result;

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      result = requestAudioFocusOreo();
    } else {
      result = audioManager.requestAudioFocus(audioFocusChangeListener,
          audioAttributes.getLegacyStreamType(),
          AudioManager.AUDIOFOCUS_GAIN);
    }

    // Call the listener whenever focus is granted - even the first time!
    if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
      shouldPlayWhenReady = true;
      audioFocusChangeListener.onAudioFocusChange(AudioManager.AUDIOFOCUS_GAIN);
    } else {
      Log.i(TAG, "Playback not started: Audio focus request denied");
    }
  }

  private void abandonAudioFocus() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      abandonAudioFocusOreo();
    } else {
      audioManager.abandonAudioFocus(audioFocusChangeListener);
    }
  }


  @RequiresApi(Build.VERSION_CODES.O)
  private int requestAudioFocusOreo() {
    return audioManager.requestAudioFocus(audioFocusRequest);
  }

  @RequiresApi(Build.VERSION_CODES.O)
  private void abandonAudioFocusOreo() {
    audioManager.abandonAudioFocusRequest(audioFocusRequest);
  }

  @RequiresApi(Build.VERSION_CODES.O)
  private AudioFocusRequest buildAudioFocusRequest() {
    return new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
        .setAudioAttributes((AudioAttributes) audioAttributes.unwrap())
        .setOnAudioFocusChangeListener(audioFocusChangeListener)
        .build();
  }

  @Override
  public Looper getPlaybackLooper() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getPlaybackLooper();
  }

  @Override
  public void prepare(MediaSource mediaSource) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.prepare(mediaSource);
  }

  @Override
  public void prepare(MediaSource mediaSource, boolean resetPosition, boolean resetState) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.prepare(mediaSource, resetPosition, resetState);
  }

  @Override
  public PlayerMessage createMessage(Target target) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.createMessage(target);
  }

  @Override
  public void sendMessages(ExoPlayerMessage... messages) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.sendMessages(messages);
  }

  @Override
  public void blockingSendMessages(ExoPlayerMessage... messages) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.blockingSendMessages(messages);
  }

  @Override
  public void setSeekParameters(@Nullable SeekParameters seekParameters) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.setSeekParameters(seekParameters);
  }

  @Nullable
  @Override
  public VideoComponent getVideoComponent() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getVideoComponent();
  }

  @Nullable
  @Override
  public TextComponent getTextComponent() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getTextComponent();
  }

  @Override
  public int getPlaybackState() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getPlaybackState();
  }

  @Nullable
  @Override
  public ExoPlaybackException getPlaybackError() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getPlaybackError();
  }

  @Override
  public void addListener(Player.EventListener listener) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.addListener(listener);
  }

  @Override
  public void removeListener(Player.EventListener listener) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.removeListener(listener);
  }

  @Override
  public void setRepeatMode(int repeatMode) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.setRepeatMode(repeatMode);
  }

  @Override
  public int getRepeatMode() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getRepeatMode();
  }

  @Override
  public void setShuffleModeEnabled(boolean shuffleModeEnabled) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.setShuffleModeEnabled(shuffleModeEnabled);
  }

  @Override
  public boolean getShuffleModeEnabled() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getShuffleModeEnabled();
  }

  @Override
  public boolean isLoading() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.isLoading();
  }

  @Override
  public void seekToDefaultPosition() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.seekToDefaultPosition();
  }

  @Override
  public void seekToDefaultPosition(int windowIndex) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.seekToDefaultPosition();
  }

  @Override
  public void seekTo(long positionMs) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.seekTo(positionMs);
  }

  @Override
  public void seekTo(int windowIndex, long positionMs) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.seekTo(windowIndex, positionMs);
  }

  @Override
  public void setPlaybackParameters(@Nullable PlaybackParameters playbackParameters) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.setPlaybackParameters(playbackParameters);
  }

  @Override
  public PlaybackParameters getPlaybackParameters() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getPlaybackParameters();
  }

  @Override
  public void stop() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.stop();
  }

  @Override
  public void stop(boolean reset) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.stop(reset);
  }

  @Override
  public void release() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    player.release();
  }

  @Override
  public int getRendererCount() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getRendererCount();
  }

  @Override
  public int getRendererType(int index) {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getRendererType(index);
  }

  @Override
  public TrackGroupArray getCurrentTrackGroups() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getCurrentTrackGroups();
  }

  @Override
  public TrackSelectionArray getCurrentTrackSelections() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getCurrentTrackSelections();
  }

  @Nullable
  @Override
  public Object getCurrentManifest() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getCurrentManifest();
  }

  @Override
  public Timeline getCurrentTimeline() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getCurrentTimeline();
  }

  @Override
  public int getCurrentPeriodIndex() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getCurrentPeriodIndex();
  }

  @Override
  public int getCurrentWindowIndex() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getCurrentWindowIndex();
  }

  @Override
  public int getNextWindowIndex() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getNextWindowIndex();
  }

  @Override
  public int getPreviousWindowIndex() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getPreviousWindowIndex();
  }

  @Nullable
  @Override
  public Object getCurrentTag() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getCurrentTag();
  }

  @Override
  public long getDuration() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getDuration();
  }

  @Override
  public long getCurrentPosition() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getCurrentPosition();
  }

  @Override
  public long getBufferedPosition() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getBufferedPosition();
  }

  @Override
  public int getBufferedPercentage() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getBufferedPercentage();
  }

  @Override
  public boolean isCurrentWindowDynamic() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.isCurrentWindowDynamic();
  }

  @Override
  public boolean isCurrentWindowSeekable() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.isCurrentWindowSeekable();
  }

  @Override
  public boolean isPlayingAd() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.isPlayingAd();
  }

  @Override
  public int getCurrentAdGroupIndex() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getCurrentAdGroupIndex();
  }

  @Override
  public int getCurrentAdIndexInAdGroup() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getCurrentAdIndexInAdGroup();
  }

  @Override
  public long getContentPosition() {
    SimpleExoPlayer player = playerHolder.getPlayer();
    return player.getContentPosition();
  }
}
