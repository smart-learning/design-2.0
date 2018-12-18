package kr.co.influential.youngkangapp.player.playback;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.SystemClock;
import android.support.annotation.NonNull;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import com.google.android.exoplayer2.drm.KeysExpiredException;
import com.google.android.exoplayer2.drm.UnsupportedDrmException;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.pallycon.widevinelibrary.DetectedDeviceTimeModifiedException;
import com.pallycon.widevinelibrary.NetworkConnectedException;
import com.pallycon.widevinelibrary.PallyconEventListener;
import com.pallycon.widevinelibrary.PallyconServerResponseException;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import kr.co.influential.youngkangapp.player.DemoUtil;
import kr.co.influential.youngkangapp.player.WebPlayerInfo;
import kr.co.influential.youngkangapp.player.service.MediaService;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.util.HttpConnection;
import kr.co.influential.youngkangapp.util.Preferences;
import kr.co.influential.youngkangapp.util.Utils;
import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONException;
import org.json.JSONObject;

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
  public static final String DRM_CONTENT_TITLE = "drm_content_title";

  // Whether played from mediasession.
  public static final String FROM_MEDIA_SESSION = "from_media_session";

  private Playback mPlayback;
  private MediaSessionCallback mMediaSessionCallback;
  private PlaybackServiceCallback mServiceCallback;
  private MetadataUpdateListener mListener;
  private MediaMetadataCompat currentMedia;

  // Do autoplay.
  private HttpConnection httpConn = HttpConnection.getInstance();
  private int start_current_time;

  private final String API_BASE_URL = Utils.welaaaApiBaseUrl();

  private String callbackMethodName = "";
  private String callbackMethod = "";

  private int contentHistory_seconds = 0;

  private Context context;

  public PlaybackManager(PlaybackServiceCallback serviceCallback,
      MetadataUpdateListener listener,
      Playback playback) {
    context = (Context) serviceCallback;
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

    // Playback speed.
    float playbackSpeed = mPlayback.getPlaybackSpeed();

    //noinspection ResourceType
    stateBuilder.setState(state, position, playbackSpeed, SystemClock.elapsedRealtime());

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
  public void doAutoPlay() {
    handleCompletionRequest();

    int currentId = Preferences.getWelaaaPlayListCId(context);

    Gson gson = new Gson();
    String json = Preferences.getWelaaaWebPlayInfo(context);
    WebPlayerInfo mWebPlayerInfo = gson.fromJson(json, WebPlayerInfo.class);

    int currentPosition = 0;
    for (int i = 0; i < mWebPlayerInfo.getCkey().length; i++) {
      if (mWebPlayerInfo.getCkey()[i].equals(mWebPlayerInfo.getCkey()[currentId])) {
        currentPosition = i;
      }
    }

    if (mWebPlayerInfo.getCkey().length == currentPosition + 1) {
      return;
    }

    int nextPosition = 0;

    nextPosition = currentPosition + 1;
    setContentId(nextPosition);

    if (mWebPlayerInfo.getCon_class().equals("audiobook")) {
      // next chapters , play_seconds 값이 0 , 0.0 이라면 다시 ++
      if (mWebPlayerInfo.getCurl()[nextPosition].equals("0") ||
          mWebPlayerInfo.getCurl()[nextPosition].equals("0.0")) {

        doAutoPlay();
        return;
      }
    }

    callbackMethodName = "play/play-data/";
    callbackMethod = "play";

    sendData(API_BASE_URL + callbackMethodName + mWebPlayerInfo.getCkey()[nextPosition],
        callbackMethodName);

  }

  @Override
  public void onPlaybackStatusChanged(int state) {
    updatePlaybackState(null);
    if (PlaybackStateCompat.STATE_PLAYING == state) {
      playPreview();
    }
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

      if(key.equals("PlaybackDurationRemaining") || key.equals("LicenseDurationRemaining")){
        try {
          if (Long.parseLong(value) == 0x7fffffffffffffffL) {
            value = "Unlimited";
          }
        } catch (Exception e) {
          e.printStackTrace();
        }
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
      if (uri != null && !Uri.EMPTY.equals(uri)) {
        setMediaFromUri(uri, extras);
        handlePlayRequest();
      } else {
        handleStopRequest("Invalid uri.");
      }
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
    String title = extras.getString(PlaybackManager.DRM_CONTENT_TITLE);

    String duration = extras.getString("duration");
    String playInfo = extras.getString("play_info");

    // Set MediaMetadata.
    MediaMetadataCompat.Builder builder = new MediaMetadataCompat.Builder();
    builder.putString(MediaMetadataCompat.METADATA_KEY_MEDIA_URI, uri.toString());
    builder.putString(MediaMetadataCompat.METADATA_KEY_TITLE, name);
    builder.putString(MediaMetadataCompat.METADATA_KEY_ARTIST, title);
    builder.putLong(MediaMetadataCompat.METADATA_KEY_DURATION,
        Utils.webTimeToSec(duration));
    builder.putString(MediaMetadataCompat.METADATA_KEY_DISPLAY_SUBTITLE , title);

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
    builder.putString(PlaybackManager.DRM_CONTENT_TITLE, title);

    // Play information.
    builder.putString("duration", duration);
    builder.putString("play_info", playInfo);

    currentMedia = builder.build();
  }

  private void updateMetadata() {
    if (currentMedia != null) {
      mListener.onMetadataChanged(currentMedia);
    } else {
      mListener.onMetadataRetrieveError();
    }
  }

  /**
   * play preview.
   */
  private void playPreview() {
    try {
      int currentId = Preferences.getWelaaaPlayListCId(context);

      Gson gson = new Gson();
      String json = Preferences.getWelaaaWebPlayInfo(context);
      WebPlayerInfo mWebPlayerInfo = gson.fromJson(json, WebPlayerInfo.class);

      boolean previewPlay = Preferences.getWelaaaPreviewPlay(context);
      String content_type = mWebPlayerInfo.getCon_class();

      mPlayTimeHandler.sendEmptyMessageDelayed(0, 30000);

      if (content_type.equals("audiobook")) {
        if (previewPlay) {

        } else {
          // can_play false 오디오북에서는 재생이 안되야 ..
        }

      } else if (content_type.equals("video-course")) {
        if (previewPlay) {
          mCanPlayTimeHandler.sendEmptyMessageDelayed(0, 1000);
        } else {

        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /**
   * CAN_PLAY ?
   **/
  Handler mCanPlayTimeHandler = new Handler() {
    @SuppressWarnings("unchecked")
    @Override
    public void handleMessage(Message msg) {
      try {
        long currentposition = mPlayback.getCurrentStreamPosition();

        if (mCanPlayTimeHandler != null) {
          // 한개만 호출될 수 있도록 확인 해봅시다
          mCanPlayTimeHandler.removeCallbacksAndMessages(null);

          mCanPlayTimeHandler.sendEmptyMessageDelayed(0, 1000);
        }

        if (currentposition >= 90000) {
          LogHelper.e(TAG, " mCanPlayTimeHandler Stop currentposition is " + currentposition);

          if (mCanPlayTimeHandler != null) {
            // 한개만 호출될 수 있도록 확인 해봅시다
            mCanPlayTimeHandler.removeCallbacksAndMessages(null);

            doAutoPlay();

          }
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  };

  /**
   * LocalPlayback Progress Check
   **/
  Handler mPlayTimeHandler = new Handler() {
    @SuppressWarnings("unchecked")
    @Override
    public void handleMessage(Message msg) {
      try {
        // getState() , 3 Playing ?
        //
        int currentId = Preferences.getWelaaaPlayListCId(context);

        Gson gson = new Gson();
        String json = Preferences.getWelaaaWebPlayInfo(context);
        WebPlayerInfo mWebPlayerInfo = gson.fromJson(json, WebPlayerInfo.class);

        String ckey;
        String gkey;
        String status; // getState()
        long currentposition = mPlayback.getCurrentStreamPosition();
        String nTitle = ""; // NETWORK

        if (start_current_time == 0) {
          status = "START";
        } else {
          status = "ING";
        }

        long duration_time = currentposition - start_current_time;

        String weburl = API_BASE_URL + "play/progress";

        final MediaType JSON
            = MediaType.parse("application/json; charset=utf-8");

        JSONObject postdata = new JSONObject();
        try {
          postdata.put("action", status);
          postdata.put("cid", mWebPlayerInfo.getCkey()[currentId]);
          postdata.put("duration", currentposition);
          postdata.put("end", currentposition);
          postdata.put("error", "NONE");
          postdata.put("net_status", "WIFI");
          postdata.put("platform", "android");
          postdata.put("start", start_current_time);
        } catch (JSONException e) {
          // TODO Auto-generated catch block
          e.printStackTrace();
        }

        RequestBody body = RequestBody.create(JSON, postdata.toString());

        // playing ???
        if (mPlayback.getState() == PlaybackStateCompat.STATE_PLAYING) {
          new Thread() {
            public void run() {
              httpConn.requestWebServer(weburl, "CLIENT_ID", "CLIENT_SECRET",
                  Preferences.getWelaaaOauthToken(context), body, callbackProgressRequest);
            }
          }.start();
        }

        start_current_time = (int) currentposition;

        if (mPlayTimeHandler != null) {
          // 한개만 호출될 수 있도록 확인 해봅시다
          mPlayTimeHandler.removeCallbacksAndMessages(null);

          mPlayTimeHandler.sendEmptyMessageDelayed(0, 30000);
        }

      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  };

  /**
   * 웹 서버로 데이터 전송 // Progress 전용
   */
  private void sendData(String sendUrl) {

    String requestWebUrl = sendUrl;

    LogHelper.e(TAG, " 20180901 requestWebUrl is " + requestWebUrl);
    LogHelper.e(TAG, " 20180901 requestWebUrl is " + Preferences.getWelaaaOauthToken(context));

    new Thread() {
      public void run() {
        httpConn.requestWebServer(requestWebUrl, "CLIENT_ID", "CLIENT_SECRET",
            Preferences.getWelaaaOauthToken(context),
            callbackProgressRequest);
      }
    }.start();
  }

  private final okhttp3.Callback callbackProgressRequest = new okhttp3.Callback() {
    @Override
    public void onFailure(Call call, IOException e) {

      if (mPlayTimeHandler != null) {
        mPlayTimeHandler.removeCallbacksAndMessages(null);
      }
    }

    @Override
    public void onResponse(Call call, Response response) throws IOException {
      String body = response.body().string();

      if (response.code() == 200) {

      } else {

        if (mPlayTimeHandler != null) {
          mPlayTimeHandler.removeCallbacksAndMessages(null);
        }
      }
    }
  };


  /**
   * 웹 서버로 데이터 전송 // play-data
   */
  private void sendData(String sendUrl, String type) {

    String requestWebUrl = sendUrl;

    LogHelper.e(TAG, " requestWebUrl is " + requestWebUrl);
    LogHelper.e(TAG, " requestWebUrl is " + Preferences.getWelaaaOauthToken(context));

    new Thread() {
      public void run() {
        httpConn.requestWebServer(requestWebUrl, "CLIENT_ID", "CLIENT_SECRET",
            Preferences.getWelaaaOauthToken(context),
            callbackRequest);
      }
    }.start();
  }

  private final okhttp3.Callback callbackRequest = new okhttp3.Callback() {
    @Override
    public void onFailure(Call call, IOException e) {

    }

    @Override
    public void onResponse(Call call, Response response) throws IOException {
      String body = response.body().string();

      int currentId = Preferences.getWelaaaPlayListCId(context);

      Gson gson = new Gson();
      String json = Preferences.getWelaaaWebPlayInfo(context);
      WebPlayerInfo mWebPlayerInfo = gson.fromJson(json, WebPlayerInfo.class);

      if (response.code() == 200) {
        LogHelper.e(TAG, "서버에서 응답한 Body:" + callbackMethodName);

        if (callbackMethodName.equals("play/play-data/")) {
          // doAudoPlay 전용
          try {
            JSONObject playDatajson = new JSONObject(body);
            JSONObject media_urlsObject = playDatajson.getJSONObject("media_urls");
            JSONObject permissionObject = playDatajson.getJSONObject("permission");
            JSONObject preview_urlsObject = null;
            JSONObject historyObject = null;

            String dashUrl = media_urlsObject.getString("DASH");
            Boolean can_play = permissionObject.getBoolean("can_play");
            String expire_at = permissionObject.getString("expire_at");
            Boolean is_free = permissionObject.getBoolean("is_free");

            LogHelper.e(TAG, "can_play  Body:" + can_play);
            LogHelper.e(TAG, "expire_at  Body:" + expire_at);
            LogHelper.e(TAG, "is_free  Body:" + is_free);

            String previewDashUrl = "";

            if (!playDatajson.isNull("preview_urls")) {
              LogHelper.e(TAG,
                  " preview_urls is Not null " + playDatajson.getJSONObject("preview_urls"));
              preview_urlsObject = playDatajson.getJSONObject("preview_urls");

              previewDashUrl = preview_urlsObject.getString("DASH");
            }

            if (playDatajson.isNull("history")) {
              LogHelper.e(TAG, " history is null ");
            } else {
              historyObject = playDatajson.getJSONObject("history");

              historyObject.getString("id");
              historyObject.getString("played_at");

              LogHelper.e(TAG, "start_seconds " + historyObject.getInt("start_seconds"));

              contentHistory_seconds = historyObject.getInt("start_seconds");
            }

            if (can_play) {
              Preferences.setWelaaaPreviewPlay(context, false);
            } else {
              Preferences.setWelaaaPreviewPlay(context, true);
            }

            if (Preferences.getWelaaaPlayAutoPlay(context)) {
              Uri uri = Uri.parse(dashUrl);
              if (!can_play) {
                uri = Uri.parse(previewDashUrl);
              } else {
                uri = Uri.parse(dashUrl);
              }

              String name = mWebPlayerInfo.getCname()[currentId];
              String drmSchemeUuid = Utils.welaaaAndroidDrmSchemeUuid();
              String drmLicenseUrl = Utils.welaaaDrmLicenseUrl();
              String userId = Preferences.getWelaaaUserId(context);
              String cId = mWebPlayerInfo.getCkey()[currentId];
              String oId = "";
              String token = "";
              String thumbUrl = "";
              String customData = "";

              MediaMetadataCompat.Builder builder = new MediaMetadataCompat.Builder();
              builder.putString(MediaMetadataCompat.METADATA_KEY_MEDIA_URI, uri.toString());
              builder.putString(MediaMetadataCompat.METADATA_KEY_TITLE, name);
              builder.putLong(MediaMetadataCompat.METADATA_KEY_DURATION,
                  Utils.webTimeToSec(mWebPlayerInfo.getCplayTime()[currentId]));
              // drm information.
              builder.putString(PlaybackManager.DRM_CONTENT_URI_EXTRA, uri.toString());
              builder.putString(PlaybackManager.DRM_CONTENT_NAME_EXTRA, name);
              builder.putString(PlaybackManager.DRM_SCHEME_UUID_EXTRA,
                  DemoUtil.getDrmUuid(drmSchemeUuid).toString());
              builder.putString(PlaybackManager.DRM_LICENSE_URL, drmLicenseUrl);
              builder.putString(PlaybackManager.DRM_USERID, userId);
              builder.putString(PlaybackManager.DRM_CID, cId);
              builder.putString(PlaybackManager.DRM_OID, oId);
              builder.putString(PlaybackManager.DRM_TOKEN, token);
              builder.putString(PlaybackManager.THUMB_URL, thumbUrl);
              builder.putString(PlaybackManager.DRM_CUSTOME_DATA, customData);

              // fromMediaSession 용도
              JsonObject jsonObject = new JsonObject();
              jsonObject.addProperty("type", mWebPlayerInfo.getCon_class());
              jsonObject.addProperty("can_play", can_play);
              jsonObject.addProperty("is_free", is_free);
              jsonObject.addProperty("expire_at", expire_at);
              jsonObject.addProperty("history_start_seconds", contentHistory_seconds);
              String playInfo = gson.toJson(jsonObject);

              LogHelper.e(TAG, " LocalPlayBack playInfo " + playInfo);
              builder.putString("play_info", playInfo);

              currentMedia = builder.build();

              Intent intent = new Intent(context, MediaService.class);

              intent.setData(uri);
              intent.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA,
                  mWebPlayerInfo.getCname()[currentId]);
              intent.putExtra(PlaybackManager.THUMB_URL, "");
              try {

                if ((DemoUtil.getDrmUuid("widevine").toString()) != null) {

                  intent
                      .putExtra(PlaybackManager.DRM_SCHEME_UUID_EXTRA,
                          DemoUtil.getDrmUuid("widevine").toString());
                  intent.putExtra(PlaybackManager.DRM_LICENSE_URL,
                      "http://tokyo.pallycon.com/ri/licenseManager.do");
                  intent.putExtra(PlaybackManager.DRM_MULTI_SESSION, "");
                  intent.putExtra(PlaybackManager.DRM_USERID, userId);
                  intent.putExtra(PlaybackManager.DRM_CID, cId);
                  intent.putExtra(PlaybackManager.DRM_OID, "");
                  intent.putExtra(PlaybackManager.DRM_CUSTOME_DATA, "");
                  intent.putExtra(PlaybackManager.DRM_TOKEN, "");
                  intent
                      .putExtra(PlaybackManager.DRM_CONTENT_TITLE, mWebPlayerInfo.getGroupTitle());
                  intent.putExtra("play_info", playInfo);

                  if (!can_play) {
                    intent.putExtra("duration", "00:01:30");
                  } else {
                    intent.putExtra("duration", mWebPlayerInfo.getCplayTime()[currentId]);
                  }

                }

                // 플레이 버튼 , 자동 재생 할때 , 추천 콘텐츠 뷰 할 때 /play-data/ 들어갈때 .
                // LocalPlayback 에서 참조 함 . MP4 이지만 , audio only 인 케이스
                Preferences.setWelaaaPlayListCKey(context, cId);

              } catch (UnsupportedDrmException e) {
                e.printStackTrace();
              }

              if (mCanPlayTimeHandler != null) {
                mCanPlayTimeHandler.removeCallbacksAndMessages(null);
              }

              mMediaSessionCallback.onPlayFromUri(uri, intent.getExtras());
            }

          } catch (Exception e) {
            e.printStackTrace();
          }
        }

      } else {
        LogHelper.e(TAG, "서버에서 응답한 Body: " + body + " response code " + response.code());
      }
    }
  };

  /**************************************************************************
   *  컨텐츠 id값을 preferences에 set
   **************************************************************************/
  public void setContentId(int id) {

    Preferences.setWelaaaPlayListCId(context, id);
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
