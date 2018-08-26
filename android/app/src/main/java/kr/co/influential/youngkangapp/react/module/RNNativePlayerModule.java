package kr.co.influential.youngkangapp.react.module;

import android.content.ContextWrapper;
import android.content.Intent;
import android.net.Uri;
import android.support.annotation.Nullable;
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
import kr.co.influential.youngkangapp.download.DownloadService;
import kr.co.influential.youngkangapp.player.PlayerActivity;
import kr.co.influential.youngkangapp.player.playback.PlaybackManager;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.react.RNEventEmitter;
import kr.co.influential.youngkangapp.util.Logger;

import java.util.UUID;

public class RNNativePlayerModule extends ReactContextBaseJavaModule
    implements RNEventEmitter {

  public static final String TAG = LogHelper.makeLogTag(RNNativePlayerModule.class);

  public RNNativePlayerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "RNNativePlayer";
  }

    @ReactMethod
    public void play(ReadableMap content) {
        ContextWrapper contextWrapper = new ContextWrapper(getReactApplicationContext());
        Intent intent = new Intent(contextWrapper, PlayerActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

        try {
            intent.setData(Uri.parse(content.getString("uri")));
            intent.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA, content.getString("name"));
            intent.putExtra(PlaybackManager.THUMB_URL, "");
            if (content.getString("drmSchemeUuid") != null) {
                intent.putExtra(PlaybackManager.DRM_SCHEME_UUID_EXTRA, getDrmUuid(content.getString("drmSchemeUuid")).toString() );
                intent.putExtra(PlaybackManager.DRM_LICENSE_URL, content.getString("drmLicenseUrl"));
                intent.putExtra(PlaybackManager.DRM_MULTI_SESSION, "");
                intent.putExtra(PlaybackManager.DRM_USERID, content.getString("userId"));
                intent.putExtra(PlaybackManager.DRM_CID, content.getString("cid"));
                intent.putExtra(PlaybackManager.DRM_OID, "");
                intent.putExtra(PlaybackManager.DRM_CUSTOME_DATA, "");
                intent.putExtra(PlaybackManager.DRM_TOKEN, "");
            }
            contextWrapper.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
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
}
