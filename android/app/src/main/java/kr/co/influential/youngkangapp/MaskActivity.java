package kr.co.influential.youngkangapp;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import kr.co.influential.youngkangapp.player.utils.LogHelper;

public class MaskActivity extends Activity {

  private static final String TAG = "MaskActivity";
  private BroadcastReceiver receiver = new MaskIdleReceiver();

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    LogHelper.e(TAG, "onCreate: ");


    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      registerReceiver(receiver, IdleChangeReceiver.Filter);
    }
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      unregisterReceiver(receiver);
    }
  }

  private class MaskIdleReceiver extends IdleChangeReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
      LogHelper.e(TAG, "Intent:" + intent);
      finish();
    }
  }
}