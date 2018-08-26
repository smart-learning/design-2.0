package kr.co.influential.youngkangapp.react;

import android.support.annotation.Nullable;
import com.facebook.react.bridge.WritableMap;

public interface RNEventEmitter {

  void sendEvent(String eventName, @Nullable WritableMap params);
}
