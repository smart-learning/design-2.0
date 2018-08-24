package kr.co.influential.youngkangapp.react.pakcage;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import kr.co.influential.youngkangapp.MainApplication;
import kr.co.influential.youngkangapp.react.module.RNNativePlayerModule;
import kr.co.influential.youngkangapp.react.view.ReactBottomControllerViewManager;
import java.util.Arrays;
import java.util.List;

public class RNNativePlayerPackage implements ReactPackage {

  private MainApplication mainApplication;

  public RNNativePlayerPackage(MainApplication mainApplication) {
    this.mainApplication = mainApplication;
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    RNNativePlayerModule playerModule = new RNNativePlayerModule(reactContext);
    mainApplication.setEventEmitter(playerModule);
    return Arrays.asList(
        playerModule
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
