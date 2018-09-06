package kr.co.influential.youngkangapp.react.module;

import android.app.Activity;
import android.content.ContextWrapper;
import android.content.Intent;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.ParserException;
import java.io.IOException;
import java.util.UUID;
import kr.co.influential.youngkangapp.BuildConfig;
import kr.co.influential.youngkangapp.download.DownloadService;
import kr.co.influential.youngkangapp.player.PlayerActivity;
import kr.co.influential.youngkangapp.player.WebPlayerInfo;
import kr.co.influential.youngkangapp.player.playback.PlaybackManager;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.react.RNEventEmitter;
import kr.co.influential.youngkangapp.util.HttpConnection;
import kr.co.influential.youngkangapp.util.Logger;
import kr.co.influential.youngkangapp.util.Preferences;
import kr.co.influential.youngkangapp.util.Utils;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import org.json.JSONArray;
import org.json.JSONObject;

public class RNNativePlayerModule extends ReactContextBaseJavaModule
    implements RNEventEmitter {

  public static final String TAG = LogHelper.makeLogTag(RNNativePlayerModule.class);

  public RNNativePlayerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  private HttpConnection httpConn = HttpConnection.getInstance();
  private final String WELEARN_WEB_URL = Utils.welaaaApiBaseUrl();
  private String contentUrl = "";
  private String contentName = "";
  private String contentUuid = "";
  private String contentDrmLicenseUrl = "";
  private String contentUserId = "";
  private String contentCid = "";
  private String contentToken = "";
  private String callbackMethodName = "";
  private String callbackMethod = "";
  private String contentType = "";
  private int contentId = 0;

  private WebPlayerInfo mWebPlayerInfo = null;
  private RNEventEmitter eventEmitter;

  @Override
  public String getName() {
    return "RNNativePlayer";
  }

  @ReactMethod
  public void play(ReadableMap content) {
    contentUrl = content.getString("uri");
    contentName = content.getString("name");
    contentUuid = content.getString("drmSchemeUuid");
    contentDrmLicenseUrl = content.getString("drmLicenseUrl");
    contentUserId = content.getString("userId");
    contentCid = content.getString("cid");
    contentToken = content.getString("token");

    Preferences.setWelaaaOauthToken(getReactApplicationContext(), contentToken);

    callbackMethodName = "play/contents-info";
    callbackMethod = "play";

    sendData(WELEARN_WEB_URL + "play/contents-info/" + content.getString("cid"));
  }

  @ReactMethod
  public void download(ReadableMap content) {

    // 2018.08.29
    contentUrl = content.getString("uri");
    contentName = content.getString("name");
    contentUuid = content.getString("drmSchemeUuid");
    contentDrmLicenseUrl = content.getString("drmLicenseUrl");
    contentUserId = content.getString("userId");
    contentCid = content.getString("cid");
    contentToken = content.getString("token");

    Preferences.setWelaaaOauthToken(getReactApplicationContext(), contentToken);

    callbackMethodName = "play/contents-info";
    callbackMethod = "download";

    sendData(WELEARN_WEB_URL + "play/contents-info/" + content.getString("cid"));

  }

  @ReactMethod
  public void downloadDelete(ReadableMap content) {
    ContextWrapper contextWrapper = new ContextWrapper(getReactApplicationContext());
//        Intent intent = new Intent(contextWrapper, PallyConMainActivity.class);
//        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
//        contextWrapper.startActivity(intent);

    // 인텐트를 통해서 전환이 되는 케이스입니다.

    Intent service = new Intent(contextWrapper, DownloadService.class);

    service.putExtra(PlaybackManager.DRM_CONTENT_URI_EXTRA,
        "https://contents.welaaa.com/public/contents/DASH_0028_001_mp4/stream.mpd");
    service.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA, "140년 지속 성장을 이끈 MLB 사무국의 전략");
    service.putExtra(PlayerActivity.DOWNLOAD_SERVICE_TYPE, true);

    contextWrapper.startService(service);

    content.getString("DOWNLOAD_SERVICE_TYPE");
    Logger.e(TAG + " DOWNLOAD_SERVICE_TYPE " + content.getString("DOWNLOAD_SERVICE_TYPE"));
  }

  @ReactMethod
  public void setting(ReadableMap content) {
    // 2018.09.03
    boolean cellularDataUsePlay = content.getBoolean("cellularDataUsePlay");
    boolean cellularDataUseDownload = content.getBoolean("cellularDataUseDownload");
    String token = content.getString("token");

    Preferences.setWelaaaOauthToken(getReactApplicationContext(), contentToken);

    Preferences.setOnlyWifiView(getReactApplicationContext(), cellularDataUsePlay);
    Preferences.setOnlyWifiDownload(getReactApplicationContext(), cellularDataUseDownload);

    Preferences.setWelaaaOauthToken(getReactApplicationContext(), token);
  }

  @ReactMethod
  public void versionInfo(ReadableMap content) {
    // 2018.09.03
    String token = content.getString("token");

    Preferences.setWelaaaOauthToken(getReactApplicationContext(), contentToken);

    Preferences.setWelaaaOauthToken(getReactApplicationContext(), token);

    String versionInfo = BuildConfig.VERSION_NAME;
    String versionType = BuildConfig.BUILD_TYPE;
    String versionName = BuildConfig.APPLICATION_ID;

    WritableMap params = Arguments.createMap();

    params.putString("versionInfo", versionInfo);
    params.putString("versionType", versionType);
    params.putString("versionName", versionName);

    eventEmitter.sendEvent("versionInfo", params);
  }

  @Override
  public void sendEvent(String eventName, @Nullable WritableMap params) {
    sendEvent(getReactApplicationContext(), eventName, params);
  }

  private void sendEvent(ReactContext reactContext, String eventName,
      @Nullable WritableMap params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }

  private UUID getDrmUuid(String typeString) throws ParserException {
    switch (typeString.toLowerCase()) {
      case "widevine":
        return C.WIDEVINE_UUID;
      case "playready":
        return C.PLAYREADY_UUID;
      default:
        try {
          return UUID.fromString(typeString);
        } catch (RuntimeException e) {
          throw new ParserException("Unsupported drm type: " + typeString);
        }
    }
  }

  /**
   * 웹 서버로 데이터 전송
   */
  private void sendData(String sendUrl) {

    String requestWebUrl = sendUrl;

    Log.e(TAG, " requestWebUrl is " + requestWebUrl);
    Log.e(TAG, " requestWebUrl is " + Preferences.getWelaaaOauthToken(getCurrentActivity()));

    new Thread() {
      public void run() {
        httpConn.requestWebServer(requestWebUrl, "CLIENT_ID", "CLIENT_SECRET",
            Preferences.getWelaaaOauthToken(getCurrentActivity()), callback);
      }
    }.start();
  }

  private final Callback callback = new Callback() {
    @Override
    public void onFailure(Call call, IOException e) {
      Log.e(TAG, "콜백오류:" + e.getMessage());
    }

    @Override
    public void onResponse(Call call, Response response) throws IOException {
      String body = response.body().string();

      Activity activity = getCurrentActivity();
      ContextWrapper contextWrapper = new ContextWrapper(activity);
      Intent intent = new Intent(contextWrapper, PlayerActivity.class);
      intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
      StringBuffer sb = new StringBuffer();

      Log.e(TAG, " response.code() is " + response.code() + " response " + body);

      if (response.code() == 200) {
        if (callbackMethodName.contains("play/contents-info")) {

          try {
            JSONObject json = new JSONObject(body);
            contentType = json.getString("type");

            if (contentType.equals("video-course")) {
              JSONObject dataObject = json.getJSONObject("data");
              String group_title = dataObject.getString("title");

              JSONObject historyObject = null;

              if (json.isNull("history")) {
                Log.e(TAG, " history is null ");
              } else {
                historyObject = json.getJSONObject("history");
              }

              JSONObject permissionObject = json.getJSONObject("permission");

//        String group_memo = json.getString("group_memo");
              String group_memo = "";

              String group_teachername = dataObject.getJSONObject("teacher").getString("name");
              String group_teachermemo = dataObject.getJSONObject("teacher").getString("memo");

              String group_img = "";
              String group_previewcontent = "";
              String allplay_time = dataObject.getString("play_time");

              String contentscnt = dataObject.getString("clip_count");
              String hitcnt = dataObject.getString("hit_count");
              String likecnt = dataObject.getString("like_count");
              String zzimcnt = "";
              String staravg = dataObject.getString("star_avg");

              String con_class = json.getString("type");

              String downloadcnt = "";
              String audiobookbuy = "";
              String audiobookbuy_limitdate = "";

              sb.append("group_title=" + group_title);
              sb.append("&group_memo=" + group_memo);
              sb.append("&group_teachername=" + group_teachername);
              sb.append("&group_teachermemo=" + group_teachermemo);
              sb.append("&group_img=" + group_img);
              sb.append("&group_previewcontent=" + group_previewcontent);
              sb.append("&allplay_time=" + allplay_time);
              sb.append("&contentscnt=" + contentscnt);
              sb.append("&hitcnt=" + hitcnt);
              sb.append("&likecnt=" + likecnt);
              sb.append("&zzimcnt=" + zzimcnt);
              sb.append("&staravg=" + staravg);
              sb.append("&con_class=" + con_class);
              sb.append("&downloadcnt=" + downloadcnt);
              sb.append("&audiobookbuy=" + audiobookbuy);
              sb.append("&audiobookbuy_limitdate=" + audiobookbuy_limitdate);

              JSONArray jArr = dataObject.getJSONArray("clips");

              for (int i = 0; i < jArr.length(); i++) {

                json = jArr.getJSONObject(i);
                //값을 추출함
                String ckey = json.getString("cid");
                String cname = json.getString("title");
                String cmemo = json.getString("memo");

                String curl = ""; // play_data 에서

                String cplay_time = json.getString("play_time");
                String cpay = json.getString("pay_type");
                String cpay_money = json.getString("price");

                String clist_img = json.getJSONObject("images").getString("list");

                String chitcnt = "";
                String csmi = "";

                String a_depth = "";
                String history_endtime = json.getString("end_seconds");

                String first_play = "";
                String calign = "";
                String audio_preview = "";

                sb.append("&ckey=" + ckey);
                sb.append("&cname=" + cname);
                sb.append("&cmemo=" + cmemo);
                sb.append("&curl=" + curl);
                sb.append("&cplay_time=" + cplay_time);
                sb.append("&cpay=" + cpay);
                sb.append("&cpay_money=" + cpay_money);
                sb.append("&clist_img=" + clist_img);
                sb.append("&chitcnt=" + chitcnt);
                sb.append("&history_endtime=" + history_endtime);
                sb.append("&a_depth=" + a_depth);
                sb.append("&first_play=" + first_play);
                sb.append("&calign=" + calign);
                sb.append("&audio_preview=" + audio_preview);

                if (csmi.equals("")) {
                  sb.append("&csmi=" + "none");
                } else {
                  sb.append("&csmi=" + csmi);
                }

                if (historyObject != null) {
                  if (historyObject.getString("id").equals(json.getString("id"))) {

                    historyObject.getString("id");
                    historyObject.getString("played_at");
                    historyObject.getString("start_seconds");

//                    cid 값을 가져와서 셋팅 해주는 과정이 필요 .
                    Log.e(TAG, "contentType " + contentType + " history Object " + historyObject
                        .getString("id"));
                    Log.e(TAG, "contentType " + contentType + " history Object " + historyObject
                        .getString("played_at"));
                    Log.e(TAG, "contentType " + contentType + " history Object " + historyObject
                        .getString("start_seconds"));

                    contentName = json.getString("title");

                    contentCid = json.getString("cid");
                    contentId = i;

                  }

                } else {
                  if (contentCid.equals(json.getString("cid"))) {
                    contentId = i;
                  }
                }
              }

              if (mWebPlayerInfo != null) {
                mWebPlayerInfo = null;
              }

              mWebPlayerInfo = new WebPlayerInfo(sb.toString());
            } else if (contentType.equals("audiobook")) {

              JSONObject dataObject = json.getJSONObject("data");
              JSONObject historyObject = null;

              if (json.isNull("history")) {
                Log.e(TAG, " history is null ");
              } else {
                historyObject = json.getJSONObject("history");
              }

              JSONObject permissionObject = json.getJSONObject("permission");

              String group_title = dataObject.getString("title");
//        String group_memo = json.getString("group_memo");
              String group_memo = "";

              String group_teachername = dataObject.getJSONObject("teacher").getString("name");
              String group_teachermemo = dataObject.getJSONObject("teacher").getString("memo");

              String group_img = "";
              String group_previewcontent = "";

              String allplay_time = "";  //  다운로드 데이터에서도 필요 요청 할 것
              String contentscnt = "";  //  다운로드 데이터에서도 필요 요청 할 것

//              String allplay_time = dataObject.getString("play_time");  //  다운로드 데이터에서도 필요 요청 할 것
//              String contentscnt = dataObject.getString("clip_count");  //  다운로드 데이터에서도 필요 요청 할 것

              String hitcnt = "";
              String likecnt = "";
              String zzimcnt = "";
              String staravg = "";

              String con_class = json.getString("type");

              String downloadcnt = "";
              String audiobookbuy = "";
              String audiobookbuy_limitdate = "";

              sb.append("group_title=" + group_title);
              sb.append("&group_memo=" + group_memo);
              sb.append("&group_teachername=" + group_teachername);
              sb.append("&group_teachermemo=" + group_teachermemo);
              sb.append("&group_img=" + group_img);
              sb.append("&group_previewcontent=" + group_previewcontent);
              sb.append("&allplay_time=" + allplay_time);
              sb.append("&contentscnt=" + contentscnt);
              sb.append("&hitcnt=" + hitcnt);
              sb.append("&likecnt=" + likecnt);
              sb.append("&zzimcnt=" + zzimcnt);
              sb.append("&staravg=" + staravg);
              sb.append("&con_class=" + con_class);
              sb.append("&downloadcnt=" + downloadcnt);
              sb.append("&audiobookbuy=" + audiobookbuy);
              sb.append("&audiobookbuy_limitdate=" + audiobookbuy_limitdate);

              JSONArray jArr = dataObject.getJSONArray("chapters");

              for (int i = 0; i < jArr.length(); i++) {

                json = jArr.getJSONObject(i);
                //값을 추출함
                String ckey = json.getString("cid");
                String cname = json.getString("title");
                String cmemo = json.getString("memo");

                String curl = ""; // play_data 에서

                String cplay_time = json.getString("play_time");
                String cpay = "";
                String cpay_money = json.getString("price");
                String clist_img = "";

                String chitcnt = "";
                String csmi = "";

                String a_depth = json.getString("depth");
                String history_endtime = "";

                String first_play = "";
                String calign = json.getString("align");
                String audio_preview = "";

                sb.append("&ckey=" + ckey);
                sb.append("&cname=" + cname);
                sb.append("&cmemo=" + cmemo);
                sb.append("&curl=" + curl);
                sb.append("&cplay_time=" + cplay_time);
                sb.append("&cpay=" + cpay);
                sb.append("&cpay_money=" + cpay_money);
                sb.append("&clist_img=" + clist_img);
                sb.append("&chitcnt=" + chitcnt);
                sb.append("&history_endtime=" + history_endtime);
                sb.append("&a_depth=" + a_depth);
                sb.append("&first_play=" + first_play);
                sb.append("&calign=" + calign);
                sb.append("&audio_preview=" + audio_preview);

                if (csmi.equals("")) {
                  sb.append("&csmi=" + "none");
                } else {
                  sb.append("&csmi=" + csmi);
                }

                if (historyObject != null) {

                  if (historyObject.getString("id").equals(json.getString("id")))

                  {

                    historyObject.getString("id");
                    historyObject.getString("played_at");
                    historyObject.getString("start_seconds");

                    Log.e(TAG, "contentType " + contentType + " history Object " + historyObject
                        .getString("id"));
                    Log.e(TAG, "contentType " + contentType + " history Object " + historyObject
                        .getString("played_at"));
                    Log.e(TAG, "contentType " + contentType + " history Object " + historyObject
                        .getString("start_seconds"));

//                    cid 값을 가져와서 셋팅 해주는 과정이 필요 .

                    contentName = json.getString("title");

                    contentCid = json.getString("cid");
                    contentId = i;

                  }

                } else {
                  // 처음 부터 재생할 수 있게 끔 ?
                  Log.e(TAG, " history is null ");

                  if (i == 0) {
                    contentCid = json.getString("cid");
                    contentName = json.getString("title");
                    contentId = i;
                  }
                }
              }

              if (mWebPlayerInfo != null) {
                mWebPlayerInfo = null;
              }

              mWebPlayerInfo = new WebPlayerInfo(sb.toString());
            }

          } catch (Exception e) {
            e.printStackTrace();
          }

          callbackMethodName = "play/play-data/";

          sendData(WELEARN_WEB_URL + callbackMethodName + contentCid);

        } else if (callbackMethodName.contains("play/play-data")) {

          try {
            JSONObject json = new JSONObject(body);
            JSONObject media_urlsObject = null;

            if (json.isNull("media_urls")) {
              Log.e(TAG, " media_urls is null");
            } else {
              media_urlsObject = json.getJSONObject("media_urls");
            }

            JSONObject permissionObject = json.getJSONObject("permission");

            String dashUrl = media_urlsObject.getString("DASH");
            Boolean can_play = permissionObject.getBoolean("can_play");
            String expire_at = permissionObject.getString("expire_at");
            Boolean is_free = permissionObject.getBoolean("is_free");

            if (contentType.equals("audiobook")) {

              if (json.isNull("history")) {

              } else {
                JSONObject historyObject = json.getJSONObject("history");
              }

            }

            if (callbackMethod.equals("play")) {
              //
              if (contentType.equals("video-course")) {
                Preferences.setWelaaaPlayListCId(getReactApplicationContext(), contentId);
              } else if (contentType.equals("audiobook")) {
                Preferences.setWelaaaPlayListCId(getReactApplicationContext(), contentId);
              }

              if (can_play) {
                Preferences.setWelaaaPreviewPlay(getReactApplicationContext(), false);
              } else {
                Preferences.setWelaaaPreviewPlay(getReactApplicationContext(), true);
              }

              intent.setData(Uri.parse(dashUrl));
              intent.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA, contentName);
              intent.putExtra(PlaybackManager.THUMB_URL, "");
              if (contentUuid != null) {
                intent.putExtra(PlaybackManager.DRM_SCHEME_UUID_EXTRA,
                    getDrmUuid(contentUuid).toString());
                intent.putExtra(PlaybackManager.DRM_LICENSE_URL, contentDrmLicenseUrl);
                intent.putExtra(PlaybackManager.DRM_MULTI_SESSION, "");
                intent.putExtra(PlaybackManager.DRM_USERID, contentUserId);
                intent.putExtra(PlaybackManager.DRM_CID, contentCid);
                intent.putExtra(PlaybackManager.DRM_OID, "");
                intent.putExtra(PlaybackManager.DRM_CUSTOME_DATA, "");
                intent.putExtra(PlaybackManager.DRM_TOKEN, "");
                intent.putExtra("type", contentType);
                intent.putExtra("can_play", can_play);
                intent.putExtra("expire_at", expire_at);
                intent.putExtra("is_free", is_free);
                intent.putExtra("webPlayerInfo", mWebPlayerInfo);
              }
              ContextCompat.startActivity(activity, intent, null);
            } else if (callbackMethod.equals("download")) {

              // group key => cid v100015
              // ckey => cid v100015_001
              // userId => 94
              // drmSchemeUuid = > widevine , fairplay
              // drmLicenseUrl = >
              // cid
              // oid // no use
              // contentPath 저장소 경로 확인
              // totalSize 파일용량 정보
              // gTitle
              // cTitle
              // groupImg
              // thumbnailImg
              // audioVideoType => video-course , audiobook
              // groupTeacherName
              // cPlayTime
              // groupContentScnt
              // groupAllPlayTime
              // view_limitdate
              // modified

              Intent service = new Intent(contextWrapper, DownloadService.class);

              service.putExtra(PlaybackManager.DRM_CONTENT_URI_EXTRA, dashUrl);
              service.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA, contentName);
              service.putExtra(PlayerActivity.DOWNLOAD_SERVICE_TYPE, false);
              service.putExtra("contentCid", contentCid);
              intent.putExtra("expire_at", expire_at);
              service.putExtra("webPlayerInfo", mWebPlayerInfo);

              contextWrapper.startService(service);
            } else {
              Log.e(TAG, " No Action .. ");
            }

          } catch (Exception e) {
            e.printStackTrace();
          }
        }
      } else {

      }
    }
  };

}
