package kr.co.influential.youngkangapp.react.module;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.util.Preferences;

public class RNNativeBaseModule extends ReactContextBaseJavaModule {

  public static final String TAG = LogHelper.makeLogTag(RNNativeBaseModule.class);

  public RNNativeBaseModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "RNNativeBase";
  }

  @ReactMethod
  public void getF_TOKEN(Callback resultCallback) {
    String F_Token = Preferences.getWelaaaLoginToken(getCurrentActivity());
    Preferences.setWelaaaLoginToken(getCurrentActivity(), "");
    resultCallback.invoke(F_Token);
  }
}
