package com.welaaav2.player.playback;

import android.support.v4.media.MediaMetadataCompat;
import com.pallycon.widevinelibrary.PallyconEventListener;
import com.welaaav2.player.service.MediaService;

/**
 * Interface representing either Local or Remote Playback. The {@link MediaService} works directly
 * with an instance of the Playback object to make the various calls such as play, pause etc.
 */
public interface Playback {

  /**
   * Start/setup the playback. Resources/listeners would be allocated by implementations.
   */
  void start();

  /**
   * Stop the playback. All resources can be de-allocated by implementations here.
   *
   * @param notifyListeners if true and a callback has been set by setCallback,
   * callback.onPlaybackStatusChanged will be called after changing the state.
   */
  void stop(boolean notifyListeners);

  /**
   * Set the latest playback state as determined by the caller.
   */
  void setState(int state);

  /**
   * Get the current {@link android.media.session.PlaybackState#getState()}
   */
  int getState();

  /**
   * @return boolean that indicates that this is ready to be used.
   */
  boolean isConnected();

  /**
   * @return boolean indicating whether the player is playing or is supposed to be playing when we
   * gain audio focus.
   */
  boolean isPlaying();

  /**
   * @return pos if currently playing an item
   */
  long getCurrentStreamPosition();

  /**
   * Queries the underlying stream and update the internal last known stream position.
   */
  void updateLastKnownStreamPosition();

  void play(MediaMetadataCompat item);

  void pause();

  void completion();

  void seekTo(long position);

  void setCurrentMedia(MediaMetadataCompat item);

  MediaMetadataCompat getCurrentMedia();

  interface Callback {

    /**
     * On current media completed.
     */
    void onCompletion();

    /**
     * on Playback status changed Implementations can use this callback to update playback state on
     * the media sessions.
     */
    void onPlaybackStatusChanged(int state);

    /**
     * @param error to be added to the PlaybackState
     */
    void onError(String error);

    /**
     * @param item being currently played
     */
    void setCurrentMedia(MediaMetadataCompat item);
  }

  void setCallback(Callback callback);

  void setPallyconEventListener(PallyconEventListener listener);
}
