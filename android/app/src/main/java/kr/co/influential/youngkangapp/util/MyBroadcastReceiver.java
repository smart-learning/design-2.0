package kr.co.influential.youngkangapp.util;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import kr.co.influential.youngkangapp.player.PlayerActivity;

public class MyBroadcastReceiver extends BroadcastReceiver {

  public PlayerListener mplayerListener;

  public interface PlayerListener {

    void isNetworkType(String type);

    void isNotConnected();
  }

  private PlayerActivity superclass = null;

  public MyBroadcastReceiver(PlayerActivity _superclass) {
    if (superclass == null) {
      superclass = _superclass;
    }
  }

  final String CONNECTIVITY_CHANGE = "android.net.conn.CONNECTIVITY_CHANGE";
  final String WIFI_STATE_CHANGED = "android.net.wifi.WIFI_STATE_CHANGED";

  final String AIRPLANE_MODE_CHANGED = "android.intent.action.AIRPLANE_MODE_CHANGED";

  public void setPlayerListener(PlayerListener mListener) {
    mplayerListener = mListener;
  }

  @Override
  public void onReceive(Context context, Intent intent) {

    String action = intent.getAction();
    String status = NetworkUtil.getConnectivityStatusString(context);

    if (superclass != null) {

      if (status != null) {
        if (status.equals("TYPE_WIFI")) {
          mplayerListener.isNetworkType(status);
        } else if (status.equals("TYPE_MOBILE")) {
          mplayerListener.isNetworkType(status);
        } else if (status.equals("TYPE_NOT_CONNECTED")) {
          mplayerListener.isNotConnected();
        }
      }
    }
  }
}