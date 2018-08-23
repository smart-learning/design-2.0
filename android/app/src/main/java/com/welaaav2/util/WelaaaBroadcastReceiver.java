package com.welaaav2.util;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.welaaav2.download.DownloadService;
import com.welaaav2.player.PlayerActivity;

public class WelaaaBroadcastReceiver extends BroadcastReceiver {
    private static final String TAG = "MyBroadcastReceiver";
    public ScreenListener mscreenListener;
    public PlayerListener mplayerListener;
    public DownloadServiceListener mDownloadServiceListener;
    public VolumeChangeListener mVolumeChangeListener;

    public NetworkConnectivityListener mNetworkConnectivityListener;

    public interface ScreenListener {
        void isScreenOn();
        void isScreenOff();
        void isHomeShortKey();
        void isHomeLongKey();
        void isNetworkType(String type);
        void isNotConnected();
        void isAirPlaneMode();
    }
    public interface PlayerListener {
        void onPlayClick();
        void onPauseClick();
        void onCloseClick();
        void onGoplayerClick();
        void isNetworkType(String type);
        void isNotConnected();
    }
    public interface DownloadServiceListener {

        void onCloseClick();
        void onPauseClick();
    }

    public interface  VolumeChangeListener {
        void changedVolume();
    }

    public interface  NetworkConnectivityListener {
        void onConnect();
        void onDisConnect();
    }

    private PlayerActivity playerClass = null;
    private DownloadService downloadClass = null;


    public WelaaaBroadcastReceiver(){

    }

    public WelaaaBroadcastReceiver(PlayerActivity _superclass){
        if (playerClass ==null){
            playerClass = _superclass;
        }
    }

    public WelaaaBroadcastReceiver(DownloadService _superserviceclass){
        if (downloadClass ==null){
            downloadClass = _superserviceclass;
        }
    }

    final String ACTION_PLAY ="PopupVideoWindow.remoteViews.onClick_play";
    final String ACTION_PAUSE ="PopupVideoWindow.remoteViews.onClick_pause";
    final String ACTION_CLOSE ="PopupVideoWindow.remoteViews.onClick_close";
    final String ACTION_GOPLAYER ="PopupVideoWindow.remoteViews.onClick_goplayer";
    final String SCREEN_ON ="android.intent.action.SCREEN_ON";
    final String SCREEN_OFF ="android.intent.action.SCREEN_OFF";

    final String DOWNLOAD_ACTION_CLOSE ="DownloadService.remoteViews.onClick_close";
    final String DOWNLOAD_ACTION_PAUSE ="DownloadService.remoteViews.onClick_pause";

    static final String SYSTEM_DIALOG_REASON_KEY = "reason";
    static final String SYSTEM_DIALOG_REASON_RECENT_APPS = "recentapps";
    static final String SYSTEM_DIALOG_REASON_HOME_KEY = "homekey";

    final String CONNECTIVITY_CHANGE = "android.net.conn.CONNECTIVITY_CHANGE";
    final String WIFI_STATE_CHANGED = "android.net.wifi.WIFI_STATE_CHANGED";

    final String AIRPLANE_MODE_CHANGED = "android.intent.action.AIRPLANE_MODE_CHANGED";

    public void setScreenStateListener(ScreenListener mListener){
        mscreenListener = mListener;
    }

    public void setPlayerListener(PlayerListener mListener){
        mplayerListener = mListener;
    }

    public void setDownloadServiceListener(DownloadServiceListener mListener){
        mDownloadServiceListener = mListener;
    }

    public void setVolumeChangeListener(VolumeChangeListener mListener ){
        mVolumeChangeListener = mListener;
    }

    @Override
    public void onReceive(Context context, Intent intent) {

        String action = intent.getAction();
        String status = NetworkUtil.getConnectivityStatusString(context);

        if (playerClass != null) {
            if (action.equals(SCREEN_OFF)) mscreenListener.isScreenOff();
            if (action.equals(SCREEN_ON)) mscreenListener.isScreenOn();

            if(status!=null){
                if (status.equals("TYPE_WIFI")){
                    mscreenListener.isNetworkType(status);
                }else if (status.equals("TYPE_MOBILE")){
                    mscreenListener.isNetworkType(status);
                }else if (status.equals("TYPE_NOT_CONNECTED")){
                    mscreenListener.isNotConnected();
                }
            }

            if (action.equals(Intent.ACTION_CLOSE_SYSTEM_DIALOGS)) {
                String reason = intent.getStringExtra(SYSTEM_DIALOG_REASON_KEY);
                if (reason != null) {
                    if (reason.equals(SYSTEM_DIALOG_REASON_HOME_KEY)) {
                        Logger.i(TAG + ":HOMEKEY[" + action + "]");
                        mscreenListener.isHomeShortKey();
                    } else if (reason.equals(SYSTEM_DIALOG_REASON_RECENT_APPS)) {
                        Logger.i(TAG + ":HOMELONGKEY[" + action + "]");
                        mscreenListener.isHomeLongKey();
                    }
                }
            }
        }

        if (downloadClass !=null){
            if(action.equals(DOWNLOAD_ACTION_CLOSE)) mDownloadServiceListener.onCloseClick();
            if(action.equals(DOWNLOAD_ACTION_PAUSE)) mDownloadServiceListener.onPauseClick();
        }
    }
}