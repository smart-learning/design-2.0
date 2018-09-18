package kr.co.influential.youngkangapp.react.module;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.support.v4.content.ContextCompat;
import android.support.v4.media.session.MediaControllerCompat;
import android.view.View;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.ParserException;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.UUID;
import kr.co.influential.youngkangapp.BuildConfig;
import kr.co.influential.youngkangapp.MainApplication;
import kr.co.influential.youngkangapp.R;
import kr.co.influential.youngkangapp.download.DownloadService;
import kr.co.influential.youngkangapp.player.PlayerActivity;
import kr.co.influential.youngkangapp.player.WebPlayerInfo;
import kr.co.influential.youngkangapp.player.playback.PlaybackManager;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.react.RNEventEmitter;
import kr.co.influential.youngkangapp.util.CustomDialog;
import kr.co.influential.youngkangapp.util.HttpConnection;
import kr.co.influential.youngkangapp.util.Logger;
import kr.co.influential.youngkangapp.util.Preferences;
import kr.co.influential.youngkangapp.util.Utils;
import kr.co.influential.youngkangapp.util.WeContentManager;
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

  private int contentHistory_seconds = 0;

  private WebPlayerInfo mWebPlayerInfo = null;
  private RNEventEmitter eventEmitter;
  ProgressDialog mProgressDialog;
  public static String mszMsgLoading = "로딩 중 입니다.\n잠시만 기다려주세요";

  private final int FLAG_PLAY_NETWORK_CHECK = 6;
  private final int FLAG_DOWNLOAD_NETWORK_CHECK = 7;

  @Override
  public String getName() {
    return "RNNativePlayer";
  }

  @ReactMethod
  public void play(ReadableMap content) {

    ConnectivityManager cmgr = (ConnectivityManager) getReactApplicationContext()
        .getSystemService(Context.CONNECTIVITY_SERVICE);
    NetworkInfo netInfo = cmgr.getActiveNetworkInfo();

    boolean isOnlywifiView = Preferences.getOnlyWifiView(getReactApplicationContext());
    contentUrl = content.getString("uri");
    contentName = content.getString("name");
    contentUuid = content.getString("drmSchemeUuid");
    contentDrmLicenseUrl = content.getString("drmLicenseUrl");
    contentUserId = content.getString("userId");
    contentCid = content.getString("cid");
    contentToken = content.getString("token");

    Preferences.setWelaaaOauthToken(getReactApplicationContext(), contentToken);
    Preferences.setWelaaaUserId(getReactApplicationContext(), contentUserId);

    if (isOnlywifiView && netInfo.isConnected() && !netInfo.getTypeName().equals("WIFI")) {

      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          alertDownloadWindow(getReactApplicationContext().getString(R.string.info_dial_notice),
              "현재 네트워크 환경이  Wi-Fi 가 아닙니다.\n Wi-Fi 환경이 아닌 3G/LTE 상에 재생시 가입하신 요금제 따라 데이터 요금이 발생할 수 있습니다. \n 계속 진행 하시겠습니까 ?",
              getReactApplicationContext().getString(R.string.info_dial_ok),
              getReactApplicationContext().getString(R.string.info_dial_cancel),
              FLAG_PLAY_NETWORK_CHECK, "");
        }
      });

      return;
    } else {
      callbackMethodName = "play/contents-info";
      callbackMethod = "play";

      sendData(WELEARN_WEB_URL + "play/contents-info/" + content.getString("cid"));
    }

    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        Activity activity = getCurrentActivity();
        mProgressDialog = ProgressDialog.show(activity, null, mszMsgLoading, true, true);
      }
    });


  }

  @ReactMethod
  public void stop() {
    MediaControllerCompat mediaController = MediaControllerCompat
        .getMediaController(getCurrentActivity());
    if (mediaController != null) {
      mediaController.getTransportControls().stop();
    }
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
    Preferences.setWelaaaUserId(getReactApplicationContext(), contentUserId);

    ConnectivityManager cmgr = (ConnectivityManager) getReactApplicationContext()
        .getSystemService(Context.CONNECTIVITY_SERVICE);
    NetworkInfo netInfo = cmgr.getActiveNetworkInfo();

    boolean isOnlyWifiDownload = Preferences.getOnlyWifiDownload(getReactApplicationContext());

    if (BuildConfig.BUILD_TYPE.equals("debug")) {
      // cid , v100XXX
      // cid ,
    }

    if (isOnlyWifiDownload && netInfo.isConnected() && !netInfo.getTypeName().equals("WIFI")) {

      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          alertDownloadWindow(getReactApplicationContext().getString(R.string.info_dial_notice),
              "현재 네트워크 환경이  Wi-Fi 가 아닙니다.\n Wi-Fi 환경이 아닌 3G/LTE 상에 재생시 가입하신 요금제 따라 데이터 요금이 발생할 수 있습니다. \n 계속 진행 하시겠습니까 ?",
              getReactApplicationContext().getString(R.string.info_dial_ok),
              getReactApplicationContext().getString(R.string.info_dial_cancel),
              FLAG_DOWNLOAD_NETWORK_CHECK, "");
        }
      });

      return;
    } else {
      callbackMethodName = "play/contents-info";
      callbackMethod = "download";

      sendData(WELEARN_WEB_URL + "play/contents-info/" + content.getString("cid"));
    }
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
  public void selectDatabase(ReadableMap content) {
    // 2018.09.06
    try {
      Gson gson = new Gson();
      String json = gson.toJson(ContentManager().getDatabase());

      WritableMap params = Arguments.createMap();

      params.putString("selectDatabase", json);
      sendEvent("selectDatabase", params);

      // Log.e("DOWNLOAD:", json.toString() );

    } catch (Exception e) {
      e.printStackTrace();
    }

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

    LogHelper.e(TAG, " requestWebUrl is " + requestWebUrl);
    LogHelper.e(TAG, " requestWebUrl is " + Preferences.getWelaaaOauthToken(getCurrentActivity()));

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
      LogHelper.e(TAG, "콜백오류:" + e.getMessage());

      if (mProgressDialog != null) {
        mProgressDialog.dismiss();
      }

//      UiThreadUtil.runOnUiThread(new Runnable() {
//        @Override
//        public void run() {
//          Activity activity = getCurrentActivity();
//
//          new AlertDialog.Builder(activity)
//              .setTitle("알림")
//              .setMessage(
//                  "서비스 이용에 장애가 발생하였습니다. \n Exception cause " + e.getCause() + " \n Exception Msg "
//                      + e
//                      .getMessage())
//              .setPositiveButton("확인", new DialogInterface.OnClickListener() {
//                @Override
//                public void onClick(DialogInterface arg0, int arg1) {
//                }
//              }).show();
//        }
//      });

    }

    @Override
    public void onResponse(Call call, Response response) throws IOException {
      String body = response.body().string();

      Activity activity = getCurrentActivity();
      ContextWrapper contextWrapper = new ContextWrapper(activity);
      Intent intent = new Intent(contextWrapper, PlayerActivity.class);
      intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
      StringBuffer sb = new StringBuffer();

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
                LogHelper.e(TAG, " history is null ");
              } else {
                historyObject = json.getJSONObject("history");

                historyObject.getString("id");
                historyObject.getString("played_at");

                LogHelper.e(TAG, "start_seconds " + historyObject.getInt("start_seconds"));

                contentHistory_seconds = historyObject.getInt("start_seconds");
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
              String historyId = "";
              String historyPlayed_At = "";
              String history_start_seconds = "";

              if (!json.isNull("history")) {

                historyObject = json.getJSONObject("history");

                historyId = historyObject.getString("id");
                historyPlayed_At = historyObject.getString("played_at");
                history_start_seconds = historyObject.getString("start_seconds");

                contentHistory_seconds = historyObject.getInt("start_seconds");
              }

              JSONObject permissionObject = json.getJSONObject("permission");

              String group_title = dataObject.getString("title");
//        String group_memo = json.getString("group_memo");
              String group_memo = "";

              String group_teachername = dataObject.getJSONObject("teacher").getString("name");
              String group_teachermemo = dataObject.getJSONObject("teacher").getString("memo");

              String group_img = dataObject.getJSONObject("images").getString("background");
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

                String curl = json.getString("play_seconds"); // play_data 에서

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

                if (historyId.equals("")) {
                  if (i == 0) {
                    // v200072  , 001 로 리턴되고 , 해당 클래식은 002 가 가장 처음이고,
                    // 001 은 마지막에서 두개 전 .. for 문에서 신기하게 들어가는건가요 ..

                    contentCid = json.getString("cid");
                    contentName = json.getString("title");
                    contentId = i;
                  }
                } else {

                  if (historyId.equals(json.getString("id"))) {
                    contentName = json.getString("title");

                    contentCid = json.getString("cid");
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

//            UiThreadUtil.runOnUiThread(new Runnable() {
//              @Override
//              public void run() {
//                Activity activity = getCurrentActivity();
//
//                new AlertDialog.Builder(activity)
//                    .setTitle("알림")
//                    .setMessage(
//                        "서비스 이용에 장애가 발생하였습니다. \n Exception cause " + e.getCause()
//                            + " \n Exception Msg " + e
//                            .getMessage())
//                    .setPositiveButton("확인", new DialogInterface.OnClickListener() {
//                      @Override
//                      public void onClick(DialogInterface arg0, int arg1) {
//                      }
//                    }).show();
//              }
//            });

          }

          callbackMethodName = "play/play-data/";

          sendData(WELEARN_WEB_URL + callbackMethodName + contentCid);

        } else if (callbackMethodName.contains("play/play-data")) {

          try {
            JSONObject json = new JSONObject(body);
            JSONObject media_urlsObject = null;
            JSONObject preview_urlsObject = null;

            if (json.isNull("media_urls")) {

            } else {
              media_urlsObject = json.getJSONObject("media_urls");
            }

            String previewDashUrl = "";

            if (!json.isNull("preview_urls")) {
              LogHelper.e(TAG, " preview_urls is Not null " + json.getJSONObject("preview_urls"));
              preview_urlsObject = json.getJSONObject("preview_urls");

              previewDashUrl = preview_urlsObject.getString("DASH");

            } else {
              LogHelper.e(TAG, " preview_urls is null ");
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

              Preferences.setWelaaaPlayListCId(getReactApplicationContext(), contentId);

              // 플레이 버튼 , 자동 재생 할때 , 추천 콘텐츠 뷰 할 때 /play-data/ 들어갈때 .
              // LocalPlayback 에서 참조 함 . MP4 이지만 , audio only 인 케이스
              Preferences.setWelaaaPlayListCKey(getReactApplicationContext(), contentCid);

              if (can_play) {
                Preferences.setWelaaaPreviewPlay(getReactApplicationContext(), false);
              } else {
                Preferences.setWelaaaPreviewPlay(getReactApplicationContext(), true);
              }

              if (mProgressDialog != null) {
                mProgressDialog.dismiss();
              }

              LogHelper.e(TAG, " 20180901 for callbackMethod" + callbackMethod);
              LogHelper.e(TAG, " 20180901 for contentType" + contentType);

              if (contentType.equals("audiobook")) {
                if (!can_play) {

                  if (mProgressDialog != null) {
                    mProgressDialog.dismiss();
                  }

                  UiThreadUtil.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                      Activity activity = getCurrentActivity();

                      new AlertDialog.Builder(activity)
                          .setTitle("알림")
                          .setMessage(
                              "구매 후 이용할 수 있습니다.")
                          .setPositiveButton("확인", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface arg0, int arg1) {
                              return;
                            }
                          }).show();
                    }
                  });

                } else {

                  if (mWebPlayerInfo.getCurl()[contentId].equals("0") ||
                      mWebPlayerInfo.getCurl()[contentId].equals("0.0")) {

                    LogHelper
                        .e(TAG, " 20180901 for play_seconds" + mWebPlayerInfo.getCurl()[contentId]);

                    // 처음 들어올 때 용도
                    for (int i = 0; i < mWebPlayerInfo.getCkey().length; i++) {

                      LogHelper.e(TAG, " 20180901 for play_seconds" + mWebPlayerInfo.getCurl()[i]);
                      LogHelper.e(TAG, " 20180901 for contentCid" + i);

                      if (!(mWebPlayerInfo.getCurl()[i].equals("0") ||
                          mWebPlayerInfo.getCurl()[i].equals("0.0"))) {
                        LogHelper
                            .e(TAG, " 20180901 for play_seconds" + mWebPlayerInfo.getCurl()[i]);
                        LogHelper.e(TAG, " 20180901 for contentCid" + i);

                        contentId = i;
                        contentCid = mWebPlayerInfo.getCkey()[i];

                        doNextPlay(contentCid);

                        return;
                      }
                    }
                  }

                  intent.setData(Uri.parse(dashUrl));
                  intent.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA,
                      mWebPlayerInfo.getCname()[contentId]);
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
                    intent.putExtra("duration", mWebPlayerInfo.getCplayTime()[contentId]);
                    intent.putExtra("type", contentType);
                    intent.putExtra("can_play", can_play);
                    intent.putExtra("expire_at", expire_at);
                    intent.putExtra("is_free", is_free);
                    intent.putExtra("webPlayerInfo", mWebPlayerInfo);
                    intent.putExtra("history_start_seconds", contentHistory_seconds);
                    intent.putExtra(PlaybackManager.DRM_CONTENT_TITLE , mWebPlayerInfo.getGroupTitle());
                  }

                  LogHelper.e(TAG, "url : " + dashUrl);
                  LogHelper.e(TAG, "contentName : " + contentName);
                  LogHelper.e(TAG, "contentType : " + contentType);
                  LogHelper.e(TAG, "contentCid : " + contentCid);
                  LogHelper.e(TAG, "contentHistory_seconds : " + contentHistory_seconds);
                  LogHelper.e(TAG, "can_play : " + can_play);
                  LogHelper.e(TAG, "Pre can_play : " + Preferences
                      .getWelaaaPreviewPlay(getReactApplicationContext()));
                  ContextCompat.startActivity(activity, intent, null);
                }

                return;

              } else {
                // previewDashUrl
//                previewDashUrl = "https://contents.welaaa.com/media/v100001/DASH_v100001_001_preview/stream.mpd";
                // 1876년 메이저 리그 원년
//                previewDashUrl = "https://contents.welaaa.com/media/v100001/DASH_v100001_002_preview/stream.mpd";
                // 21초 전체 구단의 총 수입

                LogHelper.e(TAG, " can_play " + can_play);
                LogHelper.e(TAG, " PreviewDashUrl " + previewDashUrl);

                if (!can_play) {
                  dashUrl = previewDashUrl;

                  LogHelper.e(TAG, " can_play FALSE !  PLAY PreviewDashUrl " + previewDashUrl);

                }

                intent.setData(Uri.parse(dashUrl));
                intent.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA,
                    mWebPlayerInfo.getCname()[contentId]);
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
                  intent.putExtra(PlaybackManager.DRM_CONTENT_TITLE , mWebPlayerInfo.getGroupTitle());

                  if (!can_play) {
                    // 미리 듣기 90초
                    intent.putExtra("duration", "00:01:30");
                  }else{
                    intent.putExtra("duration", mWebPlayerInfo.getCplayTime()[contentId]);
                  }
                  intent.putExtra("type", contentType);
                  intent.putExtra("can_play", can_play);
                  intent.putExtra("expire_at", expire_at);
                  intent.putExtra("is_free", is_free);
                  intent.putExtra("webPlayerInfo", mWebPlayerInfo);
                  intent.putExtra("history_start_seconds", contentHistory_seconds);
                }

                LogHelper.e(TAG, "url : " + dashUrl);
                LogHelper.e(TAG, "contentName : " + contentName);
                LogHelper.e(TAG, "contentType : " + contentType);
                LogHelper.e(TAG, "contentCid : " + contentCid);
                LogHelper.e(TAG, "contentHistory_seconds : " + contentHistory_seconds);
                LogHelper.e(TAG, "can_play : " + can_play);

                LogHelper.e(TAG, "getGroupTitle : " + mWebPlayerInfo.getGroupTitle());

                LogHelper.e(TAG, "Pre can_play : " + Preferences
                    .getWelaaaPreviewPlay(getReactApplicationContext()));
                ContextCompat.startActivity(activity, intent, null);
              }

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

              // cid 클래스 강좌 전체가 들어오는 케이스
              if (BuildConfig.BUILD_TYPE.equals("debug")) {

                // 다운로드 경로가 없는 경우 ?
                // dashUrl 정보를 얻기 위해서는 또 반복 해야 할 것 같습니다.
                for (int i = 0; i < mWebPlayerInfo.getCkey().length; i++) {

                  if (!(mWebPlayerInfo.getCurl()[i].equals("0") || mWebPlayerInfo.getCurl()[i]
                      .equals("0.0"))) {
                    Intent service = new Intent(contextWrapper, DownloadService.class);

                    service.putExtra(PlaybackManager.DRM_CONTENT_URI_EXTRA, dashUrl);
                    service.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA,
                        mWebPlayerInfo.getCname()[i]);
                    service.putExtra(PlayerActivity.DOWNLOAD_SERVICE_TYPE, false);
                    service.putExtra("contentCid", mWebPlayerInfo.getCkey()[i]);
                    intent.putExtra("expire_at", expire_at);
                    service.putExtra("webPlayerInfo", mWebPlayerInfo);

                    contextWrapper.startService(service);
                  }
                }

              } else {
                Intent service = new Intent(contextWrapper, DownloadService.class);

                service.putExtra(PlaybackManager.DRM_CONTENT_URI_EXTRA, dashUrl);
                service.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA,
                    mWebPlayerInfo.getCname()[contentId]);
                service.putExtra(PlayerActivity.DOWNLOAD_SERVICE_TYPE, false);
                service.putExtra("contentCid", contentCid);
                intent.putExtra("expire_at", expire_at);
                service.putExtra("webPlayerInfo", mWebPlayerInfo);

                contextWrapper.startService(service);
              }


            } else {
              LogHelper.e(TAG, " No Action .. ");
            }

          } catch (Exception e) {
            e.printStackTrace();
          }
        }
      } else {

        if (mProgressDialog != null) {
          mProgressDialog.dismiss();
        }

//        UiThreadUtil.runOnUiThread(new Runnable() {
//          @Override
//          public void run() {
//            Activity activity = getCurrentActivity();
//
//            new AlertDialog.Builder(activity)
//                .setTitle("알림")
//                .setMessage(
//                    "서비스 이용에 장애가 발생하였습니다. \n Response Code " + response.code() + " \n Response Msg "
//                        + response)
//                .setPositiveButton("확인", new DialogInterface.OnClickListener() {
//                  @Override
//                  public void onClick(DialogInterface arg0, int arg1) {
//                  }
//                }).show();
//
//          }
//        });
      }
    }
  };

  public CustomDialog mCustomDialog;

  public void alertDownloadWindow(String title, String message, String str2, String str1,
      final int alertWindowId, final String startwithUrl) {

    View.OnClickListener leftListner = new View.OnClickListener() {
      @Override
      public void onClick(View v) {

        switch (alertWindowId) {
          case FLAG_PLAY_NETWORK_CHECK:
            break;
          case FLAG_DOWNLOAD_NETWORK_CHECK:
            break;
        }

        mCustomDialog.dismiss();
      }
    };

    View.OnClickListener rightListner = new View.OnClickListener() {
      @Override
      public void onClick(View v) {

        switch (alertWindowId) {
          case FLAG_PLAY_NETWORK_CHECK:
            callbackMethodName = "play/contents-info";
            callbackMethod = "play";

            sendData(WELEARN_WEB_URL + "play/contents-info/" + contentCid);
            break;
          case FLAG_DOWNLOAD_NETWORK_CHECK:
            callbackMethodName = "play/contents-info";
            callbackMethod = "download";

            sendData(WELEARN_WEB_URL + "play/contents-info/" + contentCid);

            break;
        }
        mCustomDialog.dismiss();
      }
    };

    Activity activity = getCurrentActivity();

    mCustomDialog = new CustomDialog(activity, title, message, str1, str2,
        leftListner, rightListner);
    mCustomDialog.show();
  }

  /******************************
   * Comment   : 등록된 컨텐츠 매니져
   ******************************/
  public WeContentManager ContentManager() {
    Activity activity = getCurrentActivity();

    MainApplication myApp = (MainApplication) activity.getApplicationContext();
    return myApp.getContentMgr();
  }

  public void doNextPlay(String contendCid) {
    LogHelper.e(TAG, " doNextPlay " + contendCid);
    LogHelper.e(TAG, " doNextPlay sendData !! request ~  ");

    callbackMethodName = "play/play-data/";

    sendData(WELEARN_WEB_URL + callbackMethodName + contendCid);
  }

}
