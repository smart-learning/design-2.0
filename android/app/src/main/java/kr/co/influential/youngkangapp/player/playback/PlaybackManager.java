package kr.co.influential.youngkangapp.player.playback;

import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.SystemClock;
import android.support.annotation.NonNull;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import com.google.android.exoplayer2.drm.KeysExpiredException;
import com.pallycon.widevinelibrary.DetectedDeviceTimeModifiedException;
import com.pallycon.widevinelibrary.NetworkConnectedException;
import com.pallycon.widevinelibrary.PallyconEventListener;
import com.pallycon.widevinelibrary.PallyconServerResponseException;
import java.util.Iterator;
import java.util.Map;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.util.Utils;

/**
 * Manage the interactions among the container service, the queue manager and the actual playback.
 */
public class PlaybackManager implements Playback.Callback, PallyconEventListener {

  private static final String TAG = LogHelper.makeLogTag(PlaybackManager.class);
  // Action to thumbs up a media item
  private static final String CUSTOM_ACTION_THUMBS_UP = "kr.co.influential.youngkangapp.THUMBS_UP";

  // Pallycon Widevine data.
  public static final String DRM_CONTENT_URI_EXTRA = "drm_content_uri_extra";
  public static final String DRM_CONTENT_NAME_EXTRA = "drm_content_name_extra";
  public static final String DRM_SCHEME_UUID_EXTRA = "drm_scheme_uuid";
  public static final String DRM_LICENSE_URL = "drm_license_url";
  public static final String DRM_USERID = "drm_userid";
  public static final String DRM_OID = "drm_oid";
  public static final String DRM_CID = "drm_cid";
  public static final String DRM_TOKEN = "drm_token";
  public static final String DRM_CUSTOME_DATA = "drm_custom_data";
  public static final String DRM_MULTI_SESSION = "drm_multi_session";
  public static final String THUMB_URL = "thumb_url";

  // Whether played from mediasession.
  public static final String FROM_MEDIA_SESSION = "from_media_session";

  private Playback mPlayback;
  private MediaSessionCallback mMediaSessionCallback;
  private PlaybackServiceCallback mServiceCallback;
  private MetadataUpdateListener mListener;
  private MediaMetadataCompat currentMedia;

  public PlaybackManager(PlaybackServiceCallback serviceCallback,
      MetadataUpdateListener listener,
      Playback playback) {
    mServiceCallback = serviceCallback;
    mListener = listener;
    mMediaSessionCallback = new MediaSessionCallback();
    mPlayback = playback;
    mPlayback.setCallback(this);
    mPlayback.setPallyconEventListener(this);
  }

  public Playback getPlayback() {
    return mPlayback;
  }

  public MediaSessionCompat.Callback getMediaSessionCallback() {
    return mMediaSessionCallback;
  }

  /**
   * Handle a request to play media
   */
  public void handlePlayRequest() {
    LogHelper.d(TAG, "handlePlayRequest: mState=" + mPlayback.getState());
    if (currentMedia != null) {
      mServiceCallback.onPlaybackStart();
      mPlayback.play(currentMedia);
    }
  }

  /**
   * Handle a request to pause media
   */
  public void handlePauseRequest() {
    LogHelper.d(TAG, "handlePauseRequest: mState=" + mPlayback.getState());
    if (mPlayback.isPlaying()) {
      mPlayback.pause();
      mServiceCallback.onPlaybackStop();
    }
  }

  /**
   * Handle a request to completion media
   */
  public void handleCompletionRequest() {
    LogHelper.d(TAG, "handleCompletionRequest: mState=" + mPlayback.getState());
    mPlayback.completion();
    mServiceCallback.onPlaybackStop();
    updatePlaybackState(null);
  }

  /**
   * Handle a request to stop media
   *
   * @param withError Error message in case the stop has an unexpected cause. The error message will
   * be set in the PlaybackState and will be visible to MediaController clients.
   */
  public void handleStopRequest(String withError) {
    LogHelper.d(TAG, "handleStopRequest: mState=" + mPlayback.getState() + " error=", withError);
    mPlayback.stop(true);
    mServiceCallback.onPlaybackStop();
    updatePlaybackState(withError);
  }


  /**
   * Update the current media player state, optionally showing an error message.
   *
   * @param error if not null, error message to present to the user.
   */
  public void updatePlaybackState(String error) {
    LogHelper.d(TAG, "updatePlaybackState, playback state=" + mPlayback.getState());
    long position = PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN;
    if (mPlayback != null && mPlayback.isConnected()) {
      position = mPlayback.getCurrentStreamPosition();
    }

    //noinspection ResourceType
    PlaybackStateCompat.Builder stateBuilder = new PlaybackStateCompat.Builder()
        .setActions(getAvailableActions());

    setCustomAction(stateBuilder);
    int state = mPlayback.getState();

    // If there is an error message, send it to the playback state:
    if (error != null) {
      // Error states are really only supposed to be used for errors that cause playback to
      // stop unexpectedly and persist until the user takes action to fix it.
      stateBuilder.setErrorMessage(500, error);
      state = PlaybackStateCompat.STATE_ERROR;
    }
    //noinspection ResourceType
    stateBuilder.setState(state, position, 1.0f, SystemClock.elapsedRealtime());

    mServiceCallback.onPlaybackStateUpdated(stateBuilder.build());

    if (state == PlaybackStateCompat.STATE_PLAYING ||
        state == PlaybackStateCompat.STATE_PAUSED) {
      mServiceCallback.onNotificationRequired();
    }
  }

  private void setCustomAction(PlaybackStateCompat.Builder stateBuilder) {
    if (currentMedia == null) {
      return;
    }
    // Set appropriate "Favorite" icon on Custom action:
    String mediaId = currentMedia.getDescription().getMediaId();
    if (mediaId == null) {
      return;
    }
  }

  private long getAvailableActions() {
    long actions =
        PlaybackStateCompat.ACTION_PLAY_PAUSE |
            PlaybackStateCompat.ACTION_PLAY_FROM_MEDIA_ID |
            PlaybackStateCompat.ACTION_PLAY_FROM_SEARCH |
            PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS |
            PlaybackStateCompat.ACTION_SKIP_TO_NEXT;
    if (mPlayback.isPlaying()) {
      actions |= PlaybackStateCompat.ACTION_PAUSE;
    } else {
      actions |= PlaybackStateCompat.ACTION_PLAY;
    }
    return actions;
  }

  /**
   * Implementation of the Playback.Callback interface
   */
  @Override
  public void onCompletion() {
    handleCompletionRequest();
  }

  @Override
  public void onPlaybackStatusChanged(int state) {
    updatePlaybackState(null);
  }

  @Override
  public void onError(String error) {
    updatePlaybackState(error);
  }

  @Override
  public void setCurrentMedia(MediaMetadataCompat item) {
    LogHelper.d(TAG, "setCurrentMedia", item);
  }

  @Override
  public void onDrmKeysLoaded(Map<String, String> licenseInfo) {
    StringBuilder stringBuilder = new StringBuilder();

    Iterator<String> keys = licenseInfo.keySet().iterator();
    while (keys.hasNext()) {
      String key = keys.next();
      String value = licenseInfo.get(key);
      try {
        if (Long.parseLong(value) == 0x7fffffffffffffffL) {
          value = "Unlimited";
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
      stringBuilder.append(key).append(" : ").append(value);
      if (keys.hasNext()) {
        stringBuilder.append("\n");
      }
    }

    LogHelper.d(TAG, "onDrmKeysLoaded", stringBuilder.toString());
  }

  @Override
  public void onDrmSessionManagerError(Exception e) {
    StringBuilder stringBuilder = new StringBuilder();
    if (e instanceof NetworkConnectedException) {
      stringBuilder.append(e.getMessage());
    } else if (e instanceof PallyconServerResponseException) {
      stringBuilder.append("errorCode");
      stringBuilder.append(((PallyconServerResponseException) e).getErrorCode());
      stringBuilder.append("message");
      stringBuilder.append(e.getMessage());
    } else if (e instanceof KeysExpiredException) {
      stringBuilder
          .append("license has been expired. please remove the license first and try again.");
    } else if (e instanceof DetectedDeviceTimeModifiedException) {
      stringBuilder.append(
          "Device time has been changed. go to [Settings] > [Date & time] and use [Automatic date & time] and Connect Internet");
    } else {
      stringBuilder.append(e.getMessage());
    }

    LogHelper.d(TAG, "onDrmSessionManangerError", stringBuilder.toString());
  }

  @Override
  public void onDrmKeysRestored() {
    LogHelper.d("Drm key Restored");
  }

  @Override
  public void onDrmKeysRemoved() {
    LogHelper.d("Drm key Removed");
  }

  /**
   * Switch to a different Playback instance, maintaining all playback state, if possible.
   *
   * @param playback switch to this playback
   */
  public void switchToPlayback(Playback playback, boolean resumePlaying) {
    if (playback == null) {
      throw new IllegalArgumentException("Playback cannot be null");
    }
    // Suspends current state.
    int oldState = mPlayback.getState();
    long pos = mPlayback.getCurrentStreamPosition();
    MediaMetadataCompat currentMedia = mPlayback.getCurrentMedia();
    mPlayback.stop(false);
    playback.setCallback(this);
    playback.setCurrentMedia(currentMedia);
    playback.seekTo(pos < 0 ? 0 : pos);
    playback.start();
    // Swaps instance.
    mPlayback = playback;
    switch (oldState) {
      case PlaybackStateCompat.STATE_BUFFERING:
      case PlaybackStateCompat.STATE_CONNECTING:
      case PlaybackStateCompat.STATE_PAUSED:
        mPlayback.pause();
        break;
      case PlaybackStateCompat.STATE_PLAYING:
        if (resumePlaying && currentMedia != null) {
          mPlayback.play(currentMedia);
        } else if (!resumePlaying) {
          mPlayback.pause();
        } else {
          mPlayback.stop(true);
        }
        break;
      case PlaybackStateCompat.STATE_NONE:
        break;
      default:
        LogHelper.d(TAG, "Default called. Old state is ", oldState);
    }
  }


  private class MediaSessionCallback extends MediaSessionCompat.Callback {

    @Override
    public void onPlay() {
      LogHelper.d(TAG, "play");
      handlePlayRequest();
    }

    @Override
    public void onSkipToQueueItem(long queueId) {
      LogHelper.d(TAG, "OnSkipToQueueItem:" + queueId);
    }

    @Override
    public void onSeekTo(long position) {
      LogHelper.d(TAG, "onSeekTo:", position);
      mPlayback.seekTo((int) position);
    }

    @Override
    public void onPlayFromMediaId(String mediaId, Bundle extras) {
      LogHelper.d(TAG, "playFromMediaId mediaId:", mediaId, "  extras=", extras);
      handlePlayRequest();
    }

    @Override
    public void onPlayFromUri(Uri uri, Bundle extras) {
      LogHelper.d(TAG, "playFromUri: ", uri, " extras=" + extras);
      setMediaFromUri(uri, extras);
      handlePlayRequest();
    }

    @Override
    public void onPause() {
      LogHelper.d(TAG, "pause. current state=" + mPlayback.getState());
      handlePauseRequest();
    }

    @Override
    public void onStop() {
      LogHelper.d(TAG, "stop. current state=" + mPlayback.getState());
      // Stop and release the resources.
      handleStopRequest(null);
    }

    @Override
    public void onSkipToNext() {
      LogHelper.d(TAG, "skipToNext");
    }

    @Override
    public void onSkipToPrevious() {
      LogHelper.d(TAG, "skipToPrevious");
    }

    @Override
    public void onCustomAction(@NonNull String action, Bundle extras) {
      if (CUSTOM_ACTION_THUMBS_UP.equals(action)) {
        LogHelper.i(TAG, "onCustomAction: favorite for current track");
        // playback state needs to be updated because the "Favorite" icon on the
        // custom action will change to reflect the new favorite state.
        updatePlaybackState(null);
      } else {
        LogHelper.e(TAG, "Unsupported action: ", action);
      }
    }

    /**
     * Handle free and contextual searches.
     * <p/>
     * All voice searches on Android Auto are sent to this method through a connected {@link
     * android.support.v4.media.session.MediaControllerCompat}.
     * <p/>
     * Threads and async handling: Search, as a potentially slow operation, should run in another
     * thread.
     * <p/>
     * Since this method runs on the main thread, most apps with non-trivial metadata should defer
     * the actual search to another thread (for example, by using an {@link AsyncTask} as we do
     * here).
     **/
    @Override
    public void onPlayFromSearch(final String query, final Bundle extras) {
      LogHelper.d(TAG, "playFromSearch  query=", query, " extras=", extras);
      mPlayback.setState(PlaybackStateCompat.STATE_CONNECTING);
    }
  }

  private void setMediaFromUri(Uri uri, Bundle extras) {
    LogHelper.d(TAG, "setMediaFromUri");
    setCurrentMedia(uri, extras);
    updateMetadata();
  }

  private void setCurrentMedia(Uri uri, Bundle extras) {
    if (extras == null) {
      currentMedia = null;
    }

    String name = extras.getString(PlaybackManager.DRM_CONTENT_NAME_EXTRA);
    String drmSchemeUuid = extras.getString(PlaybackManager.DRM_SCHEME_UUID_EXTRA);
    String drmLicenseUrl = extras.getString(PlaybackManager.DRM_LICENSE_URL);
    String userId = extras.getString(PlaybackManager.DRM_USERID);
    String cId = extras.getString(PlaybackManager.DRM_CID);
    String oId = extras.getString(PlaybackManager.DRM_OID);
    String token = extras.getString(PlaybackManager.DRM_TOKEN);
    String thumbUrl = extras.getString(PlaybackManager.THUMB_URL);
    String customData = extras.getString(PlaybackManager.DRM_CUSTOME_DATA);

    String duration = extras.getString("duration");
    String playerInfo = extras.getString("webPlayerInfo");
    String type = extras.getString("type");
    String canPlay = extras.getString("can_play");
    String isFree = extras.getString("is_free");
    String expiredAt = extras.getString("expire_at");
    long contentHistorySecond = extras.getLong("history_start_seconds");

    MediaMetadataCompat.Builder builder = new MediaMetadataCompat.Builder();
    builder.putString(MediaMetadataCompat.METADATA_KEY_MEDIA_URI, uri.toString());
    builder.putString(MediaMetadataCompat.METADATA_KEY_TITLE, name);
    builder.putLong(MediaMetadataCompat.METADATA_KEY_DURATION,
        Utils.webTimeToSec(duration));

    // drm information.
    builder.putString(PlaybackManager.DRM_CONTENT_NAME_EXTRA, name);
    builder.putString(PlaybackManager.DRM_SCHEME_UUID_EXTRA, drmSchemeUuid);
    builder.putString(PlaybackManager.DRM_LICENSE_URL, drmLicenseUrl);
    builder.putString(PlaybackManager.DRM_USERID, userId);
    builder.putString(PlaybackManager.DRM_CID, cId);
    builder.putString(PlaybackManager.DRM_OID, oId);
    builder.putString(PlaybackManager.DRM_TOKEN, token);
    builder.putString(PlaybackManager.THUMB_URL, thumbUrl);
    builder.putString(PlaybackManager.DRM_CUSTOME_DATA, customData);

    // Play information.
    builder.putString("duration", duration);
    builder.putString("webPlayerInfo", playerInfo);
    builder.putString("type", type);
    builder.putString("can_play", canPlay);
    builder.putString("is_free", isFree);
    builder.putString("expire_at", expiredAt);
    builder.putLong("history_start_seconds", contentHistorySecond);

    currentMedia = builder.build();
  }

  private void updateMetadata() {
    if (currentMedia != null) {
      mListener.onMetadataChanged(currentMedia);
    } else {
      mListener.onMetadataRetrieveError();
    }
  }

  public interface PlaybackServiceCallback {

    void onPlaybackStart();

    void onNotificationRequired();

    void onPlaybackStop();

    void onPlaybackStateUpdated(PlaybackStateCompat newState);
  }

  public interface MetadataUpdateListener {

    void onMetadataChanged(MediaMetadataCompat metadata);

    void onMetadataRetrieveError();
  }
}
