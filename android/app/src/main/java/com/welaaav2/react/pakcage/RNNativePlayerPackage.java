package com.welaaav2.react.pakcage;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.welaaav2.react.manager.ReactBottomControllerViewManager;
import com.welaaav2.react.module.RNNativePlayerModule;

import java.util.Arrays;
import java.util.List;

public class RNNativePlayerPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.asList(
                new RNNativePlayerModule(reactContext)
        );
    }

    @Override
    public List<ViewManager> createViewManagers(
            ReactApplicationContext reactContext) {
        return Arrays.asList(
                new ReactBottomControllerViewManager()
        );
    }
}
