package kr.co.influential.youngkangapp;

import android.app.Application;
import android.content.ComponentName;
import android.content.Context;
import android.os.Build;
import android.os.RemoteException;
import android.support.annotation.NonNull;
import android.support.multidex.MultiDex;
import android.support.v4.media.MediaBrowserCompat;
import android.support.v4.media.session.MediaControllerCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import com.appsflyer.reactnative.RNAppsFlyerPackage;
import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.core.CrashlyticsCore;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.jeongjuwon.iamport.IAmPortPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.sunyrora.kakaosignin.RNKaKaoSigninPackage;
import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import java.util.Arrays;
import java.util.List;
import kr.co.influential.youngkangapp.player.service.MediaService;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.react.RNEventEmitter;
import kr.co.influential.youngkangapp.react.pakcage.RNNativePlayerPackage;
import kr.co.influential.youngkangapp.util.ONotificationManager;
import kr.co.influential.youngkangapp.util.WeContentManager;

//import test.welaaa.WelaaaPackageManager;

public class MainApplication extends Application implements ReactApplication {

  public static final String TAG = LogHelper.makeLogTag(MainApplication.class);

  private WeContentManager content_manager = null;

  private RNEventEmitter eventEmitter;

  private MediaBrowserCompat mediaBrowser;

  private MediaControllerCompat mediaController;

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

  private final MediaControllerCompat.Callback mediaControllerCallback = new MediaControllerCompat.Callback() {
    @Override
    public void onPlaybackStateChanged(@NonNull PlaybackStateCompat state) {
      LogHelper.d(TAG, "onPlaybackstate changed", state);
      if (state != null && eventEmitter != null) {
        WritableMap params = Arguments.createMap();
        switch (state.getState()) {
          // Hide mini player.
          case PlaybackStateCompat.STATE_NONE:      // 0
          case PlaybackStateCompat.STATE_STOPPED:   // 1
          case PlaybackStateCompat.STATE_ERROR:     // 7
            params.putBoolean("visible", false);
            eventEmitter.sendEvent("miniPlayer", params);
            break;

          // Show mini player.
          case PlaybackStateCompat.STATE_PLAYING:   // 3
          case PlaybackStateCompat.STATE_BUFFERING: // 6
            params.putBoolean("visible", true);
            eventEmitter.sendEvent("miniPlayer", params);
            break;

          default:
            break;
        }
      }
    }
  };

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNAppsFlyerPackage(),
          new IAmPortPackage(),
          new VectorIconsPackage(),
          new RNFirebasePackage(),
          new RNFirebaseMessagingPackage(),
          new RNFirebaseNotificationsPackage(),
          new RNFirebaseAnalyticsPackage(),
          new RNKaKaoSigninPackage(),
          new FBSDKPackage(mCallbackManager),
          new RNNativePlayerPackage(MainApplication.this)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    Fabric.with(this, new Crashlytics.Builder()
        .core(new CrashlyticsCore.Builder()
            .disabled(BuildConfig.DEBUG)
            .build())
        .build());

    try {
      initContentManager();
    } catch (Exception e) {
      e.printStackTrace();
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      ONotificationManager.createChannel(this);
    }

    eventEmitter = null;

    // MediaBrowser.
    mediaBrowser = new MediaBrowserCompat(this, new ComponentName(this, MediaService.class),
        connectionCallback, null);
    mediaBrowser.connect();
  }

  public WeContentManager initContentManager() {
    if (content_manager == null) {
      // String dbname = Environment.getExternalStoragePublicDirectory(DIRECTORY_DOWNLOADS).toString()+"/CDN.db";
      String dbname = "welaaa.db";
      content_manager = new WeContentManager(this, dbname);
    }
    return content_manager;
  }

  public WeContentManager getContentMgr() {
    return content_manager;
  }

  private void connectToSession(MediaSessionCompat.Token token) throws RemoteException {
    mediaController = new MediaControllerCompat(this, token);
    mediaController.registerCallback(mediaControllerCallback);
  }

  public MediaControllerCompat getMediaController() {
    return mediaController;
  }

  public void setEventEmitter(RNEventEmitter eventEmitter) {
    this.eventEmitter = eventEmitter;
  }
}
