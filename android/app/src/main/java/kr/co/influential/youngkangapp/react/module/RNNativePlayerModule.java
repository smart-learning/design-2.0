package kr.co.influential.youngkangapp.react.module;

import android.content.ContextWrapper;
import android.content.Intent;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.ParserException;

import org.json.JSONObject;

import java.io.IOException;
import java.util.UUID;

import kr.co.influential.youngkangapp.download.DownloadService;
import kr.co.influential.youngkangapp.player.PlayerActivity;
import kr.co.influential.youngkangapp.player.WebPlayerInfo;
import kr.co.influential.youngkangapp.player.playback.PlaybackManager;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.react.RNEventEmitter;
import kr.co.influential.youngkangapp.util.HttpConnection;
import kr.co.influential.youngkangapp.util.Logger;
import kr.co.influential.youngkangapp.util.Utils;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class RNNativePlayerModule extends ReactContextBaseJavaModule
    implements RNEventEmitter {

  public static final String TAG = LogHelper.makeLogTag(RNNativePlayerModule.class);

  public RNNativePlayerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  private HttpConnection httpConn = HttpConnection.getInstance();
  private final String WELEARN_WEB_URL = Utils.welaaaWebUrl();
  private String contentUrl = "";
  private String contentName = "";
  private String contentUuid = "";
  private String contentDrmLicenseUrl = "";
  private String contentUserId = "";
  private String contentCid = "";
  private String contentToken = "";
  private String callbackMethodName = "";
  private String contentType = "";

  private WebPlayerInfo mWebPlayerInfo = null;

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

        Log.e(TAG , "contentUrl is " + contentUrl );

        callbackMethodName = "play/contents-info";

        sendData(WELEARN_WEB_URL + "play/contents-info/" + content.getString("cid"));
    }

    @ReactMethod
    public void download(ReadableMap content) {
        ContextWrapper contextWrapper = new ContextWrapper(getReactApplicationContext());
//        Intent intent = new Intent(contextWrapper, PallyConMainActivity.class);
//        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
//        contextWrapper.startActivity(intent);

        // 인텐트를 통해서 전환이 되는 케이스입니다.

        Intent service = new Intent(contextWrapper, DownloadService.class);

        service.putExtra(PlaybackManager.DRM_CONTENT_URI_EXTRA, "https://contents.welaaa.com/public/contents/DASH_0028_001_mp4/stream.mpd");
        service.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA, "140년 지속 성장을 이끈 MLB 사무국의 전략");
        service.putExtra(PlayerActivity.DOWNLOAD_SERVICE_TYPE , false);

        contextWrapper.startService(service);
        // 데이터 바인딩 없이 ? 일단 테스트 하고 확인 하도록 합시다.
    }

    @ReactMethod
    public void downloadDelete(ReadableMap content) {
        ContextWrapper contextWrapper = new ContextWrapper(getReactApplicationContext());
//        Intent intent = new Intent(contextWrapper, PallyConMainActivity.class);
//        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
//        contextWrapper.startActivity(intent);

        // 인텐트를 통해서 전환이 되는 케이스입니다.

        Intent service = new Intent(contextWrapper, DownloadService.class);

        service.putExtra(PlaybackManager.DRM_CONTENT_URI_EXTRA, "https://contents.welaaa.com/public/contents/DASH_0028_001_mp4/stream.mpd");
        service.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA, "140년 지속 성장을 이끈 MLB 사무국의 전략");
        service.putExtra(PlayerActivity.DOWNLOAD_SERVICE_TYPE , true);

        contextWrapper.startService(service);
        // 데이터 바인딩 없이 ? 일단 테스트 하고 확인 하도록 합시다.

        content.getString("DOWNLOAD_SERVICE_TYPE");
        Logger.e(TAG + " DOWNLOAD_SERVICE_TYPE " + content.getString("DOWNLOAD_SERVICE_TYPE"));
    }

    @ReactMethod
    public void welaaaPallyConPlay(String url) {
//        try {
//            ReactApplicationContext context = getReactApplicationContext();
//            getReac
////
//            Intent intent = new Intent(context, PallyConMainActivity.class);
//            intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
//
////            intent.putExtra("ckey", "3025");
////            intent.putExtra("view_time", 0);
////            intent.putExtra("speedrate","1.0");
////            intent.putExtra("position","keepgoing");
////            intent.putExtra("isPause", false);
////            intent.putExtra("con_class", "1");
////            intent.putExtra("call_type","react-native");
//            context.startActivity(intent);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//
//            Log.e("welaaa" , "Exception " + e.toString() );
//        }
    }

  @ReactMethod
  public void welaaaPallyConDownload(String url) {
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

    @Deprecated
    @ReactMethod
    public void toast(String message) {
        Toast.makeText(getCurrentActivity(), message, Toast.LENGTH_SHORT).show();
    }

    /** 웹 서버로 데이터 전송 */
    private void sendData(String sendUrl) {

        String requestWebUrl = sendUrl;

        Log.e(TAG , " requestWebUrl is " + requestWebUrl );

        new Thread() {
            public void run() {
                httpConn.requestWebServer(requestWebUrl,"CLIENT_ID","CLIENT_SECRET","" , callback);
            }
        }.start();
    }

    private final Callback callback = new Callback() {
        @Override
        public void onFailure(Call call, IOException e) {
            Log.e(TAG, "콜백오류:"+e.getMessage());
        }
        @Override
        public void onResponse(Call call, Response response) throws IOException {
            String body = response.body().string();

            ContextWrapper contextWrapper = new ContextWrapper(getReactApplicationContext());
            Intent intent = new Intent(contextWrapper, PlayerActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

            if(response.code() == 200){
                if(callbackMethodName.contains("play/contents-info")){

                    try{
                        JSONObject json = new JSONObject(body);
                        contentType = json.getString("type");
                    }catch (Exception e){
                        e.printStackTrace();
                    }

                    callbackMethodName = "play/play-data/";

                    sendData(WELEARN_WEB_URL + callbackMethodName + contentCid);

                }else if(callbackMethodName.contains("play/play-data")){
                    try{
                        JSONObject json = new JSONObject(body);
                        JSONObject media_urlsObject = json.getJSONObject("media_urls");
                        JSONObject permissionObject = json.getJSONObject("permission");

                        String dashUrl = media_urlsObject.getString("DASH");
                        Boolean can_play = permissionObject.getBoolean("can_play");
                        String expire_at = permissionObject.getString("expire_at");
                        Boolean is_free = permissionObject.getBoolean("is_free");

                        if(contentType.equals("audiobook")){
                            JSONObject historyObject = json.getJSONObject("history");
                        }
//uri: "https://contents.welaaa.com/media/b100001/DASH_b100001_002/stream.mpd"
//dashUrl is https://contents.welaaa.com/media/v100015/DASH_v100015_001/stream.mpd contentCid v100015_001
                        Log.e(TAG , "dashUrl is " + dashUrl + " contentCid " + contentCid);

                        intent.setData(Uri.parse(dashUrl));
                        intent.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA, contentName);
                        intent.putExtra(PlaybackManager.THUMB_URL, "");
                        if (contentUuid != null) {
                            intent.putExtra(PlaybackManager.DRM_SCHEME_UUID_EXTRA, getDrmUuid(contentUuid).toString() );
                            intent.putExtra(PlaybackManager.DRM_LICENSE_URL, contentDrmLicenseUrl);
                            intent.putExtra(PlaybackManager.DRM_MULTI_SESSION, "");
                            intent.putExtra(PlaybackManager.DRM_USERID, contentUserId);
                            intent.putExtra(PlaybackManager.DRM_CID, contentCid);
                            intent.putExtra(PlaybackManager.DRM_OID, "");
                            intent.putExtra(PlaybackManager.DRM_CUSTOME_DATA, "");
                            intent.putExtra(PlaybackManager.DRM_TOKEN, "");
                            intent.putExtra("type" , contentType);
                            intent.putExtra("can_play" , can_play);
                            intent.putExtra("expire_at" , expire_at);
                            intent.putExtra("is_free" , is_free);
                        }
                        contextWrapper.startActivity(intent);

                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }else{

            }
        }
    };

}
