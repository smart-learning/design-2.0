package com.welaaav2;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.media.session.MediaControllerCompat;
import android.support.v7.app.AppCompatActivity;

public abstract class BasePlayerActivity extends AppCompatActivity {

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  protected MediaControllerCompat.TransportControls getTransportControls() {
    MediaControllerCompat mediaController = MediaControllerCompat.getMediaController(this);
    if (mediaController != null) {
      return mediaController.getTransportControls();
    }
    return null;
  }
}
