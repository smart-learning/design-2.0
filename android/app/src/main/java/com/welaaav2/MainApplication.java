package com.welaaav2;

import android.app.Application;
import android.content.ComponentName;
import android.content.Context;
import android.os.Build;
import android.support.multidex.MultiDex;
import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.core.CrashlyticsCore;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.welaaav2.player.MediaSessionConnection;
import com.welaaav2.player.service.MediaService;
import com.welaaav2.react.pakcage.RNNativePlayerPackage;
import com.welaaav2.util.ONotificationManager;
import com.welaaav2.util.WeContentManager;
import io.fabric.sdk.android.Fabric;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private WeContentManager content_manager=null;

    private MediaSessionConnection mediaSessionConnection;

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
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

        Context context = getApplicationContext();
        mediaSessionConnection = MediaSessionConnection
            .getInstance(context, new ComponentName(context, MediaService.class));
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

    public MediaSessionConnection getMediaSessionConnection() {
        return mediaSessionConnection;
    }
}
