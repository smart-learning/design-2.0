package com.welaaav2.react.module;

import android.content.ContextWrapper;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.welaaav2.pallycon.PallyConMainActivity;

import javax.annotation.Nullable;

public class RNNativePlayerModule extends ReactContextBaseJavaModule {

    ReactApplicationContext reactContext;

    public RNNativePlayerModule(ReactApplicationContext reactContext) {
        super(reactContext);

        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNNativePlayer";
    }

    @ReactMethod
    public void play(ReadableMap content) {
        ContextWrapper contextWrapper = new ContextWrapper(getReactApplicationContext());
        Intent intent = new Intent(contextWrapper, PallyConMainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        contextWrapper.startActivity(intent);
    }

    @ReactMethod
    public void download(ReadableMap content) {
        ContextWrapper contextWrapper = new ContextWrapper(getReactApplicationContext());
        Intent intent = new Intent(contextWrapper, PallyConMainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        contextWrapper.startActivity(intent);
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
    public void welaaaPallyConDownload(String url){
    }

    public void sendEvent(ReactContext reactContext , String eventName , @Nullable WritableMap params){

        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName , params);
    }

    public void testsMethod(String eventName, @Nullable WritableMap params){
        sendEvent(reactContext , "getToken" , params);
    }


}
