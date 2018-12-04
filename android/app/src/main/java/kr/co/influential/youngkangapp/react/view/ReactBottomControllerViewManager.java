package kr.co.influential.youngkangapp.react.view;

import android.support.annotation.Nullable;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class ReactBottomControllerViewManager extends SimpleViewManager<ReactBottomControllerView> {

  public static final String REACT_CLASS = "RCTBottomController";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected ReactBottomControllerView createViewInstance(ThemedReactContext reactContext) {
    return new ReactBottomControllerView(reactContext);
  }

  @Override
  public void onDropViewInstance(ReactBottomControllerView view) {
    super.onDropViewInstance(view);
  }

  @ReactProp(name = "miniPlayer")
  public void setSrc(ReactBottomControllerView view, @Nullable ReadableMap content) {

    view.setMiniPlayer(content);
  }

}
