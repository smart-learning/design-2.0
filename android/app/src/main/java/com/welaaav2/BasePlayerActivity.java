package com.welaaav2;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import com.welaaav2.player.MediaSessionConnection;
import com.welaaav2.player.core.PlayerHolder;

public abstract class BasePlayerActivity extends AppCompatActivity {

  protected Context context;

  protected MediaSessionConnection mediaSessionConnection;

  protected PlayerHolder playerHolder;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    context = this;

    mediaSessionConnection = ((MainApplication) getApplication()).getMediaSessionConnection();

    playerHolder = PlayerHolder.getInstance(context);
  }

}
