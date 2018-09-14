package kr.co.influential.youngkangapp.react.module;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import javax.annotation.Nullable;
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

  @Nullable
  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("deviceId", getDeviceId());
    return constants;
  }

  private String getDeviceId() {
    // Secure Android ID
//    String androidId = Settings.Secure.getString(getCurrentActivity().getContentResolver(),
//        Secure.ANDROID_ID);

    // Use UUID
    Object lock = new Object();
    final String PREF_UNIQUE_ID = "pref_unique_id";
    String uniqueId = "";

    synchronized (lock) {
      SharedPreferences sharedPreferences =
          getCurrentActivity().getSharedPreferences(PREF_UNIQUE_ID, Context.MODE_PRIVATE);
      uniqueId = sharedPreferences.getString(PREF_UNIQUE_ID, null);

      if (uniqueId == null) {
        uniqueId = UUID.randomUUID().toString();
        Editor editor = sharedPreferences.edit();
        editor.putString(PREF_UNIQUE_ID, uniqueId);
        editor.commit();
      }
    }
    return uniqueId;
  }
}
