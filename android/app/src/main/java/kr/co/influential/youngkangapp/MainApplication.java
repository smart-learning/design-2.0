package kr.co.influential.youngkangapp;

import android.app.Application;
import android.content.Context;
import android.os.Build;
import android.support.multidex.MultiDex;
import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.core.CrashlyticsCore;
import com.facebook.react.ReactApplication;
//import test.welaaa.WelaaaPackageManager;
import com.brentvatne.react.ReactVideoPackage;
import com.sunyrora.kakaosignin.RNKaKaoSigninPackage;
import com.dooboolab.RNIap.RNIapPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.fabricio.vergal.rnlocalizable.RNLocalizablePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import kr.co.influential.youngkangapp.player.core.PlayerManager;
import kr.co.influential.youngkangapp.player.service.PlayerServiceManager;
import kr.co.influential.youngkangapp.react.pakcage.RNNativePlayerPackage;
import kr.co.influential.youngkangapp.util.ONotificationManager;
import kr.co.influential.youngkangapp.util.WeContentManager;
import io.fabric.sdk.android.Fabric;
import java.util.Arrays;
import java.util.List;
import com.facebook.CallbackManager;
import kr.co.influential.youngkangapp.BuildConfig;
import kr.co.influential.youngkangapp.R;

public class MainApplication extends Application implements ReactApplication {

    private WeContentManager content_manager=null;

    private PlayerServiceManager playerServiceManager;
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
                    new ReactVideoPackage(),
                    new RNKaKaoSigninPackage(),
                    new RNIapPackage(),
                    new FBSDKPackage(mCallbackManager),
            		new RNLocalizablePackage( R.string.class ),
                    new RNNativePlayerPackage()
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

        try{
            initContentManager();
        }catch (Exception e){
            e.printStackTrace();
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ONotificationManager.createChannel(this);
        }

        playerServiceManager = new PlayerServiceManager(this);
    }

    public WeContentManager initContentManager()
    {
        if(content_manager == null){
            // String dbname = Environment.getExternalStoragePublicDirectory(DIRECTORY_DOWNLOADS).toString()+"/CDN.db";
            String dbname = "CDN.db";
            content_manager = new WeContentManager(this,dbname);
        }
        return content_manager;
    }

    public WeContentManager getContentMgr(){
        return content_manager;
    }

    public PlayerServiceManager getPlayerServiceManager() {
        return playerServiceManager;
    }

    public PlayerManager getPlayerManager() {
        return playerServiceManager.getPlayerManager();
    }
}
