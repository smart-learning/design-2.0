package kr.co.influential.youngkangapp.react.view;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

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
}
