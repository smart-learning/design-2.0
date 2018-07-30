package com.welaaav2.react.view;

import android.content.Context;
import android.support.annotation.NonNull;
import android.widget.FrameLayout;
import android.widget.Toast;
import com.welaaav2.R;

public class ReactBottomControllerView extends FrameLayout {

  public ReactBottomControllerView(@NonNull Context context) {
    super(context);
    inflate(context, R.layout.bottom_controller, this);
    findViewById(R.id.iv_icon).setOnClickListener(view -> {
      Toast.makeText(getContext(), "Clicked", Toast.LENGTH_LONG).show();
    });
  }
}
