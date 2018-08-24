package kr.co.influential.youngkangapp.player.service;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.os.Binder;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;

import kr.co.influential.youngkangapp.common.Constants;
import kr.co.influential.youngkangapp.player.core.PlayerManager;

/**
 * https://developer.android.com/guide/components/bound-services.html?hl=ko#Lifecycle
 */
public class PlayerService extends Service implements AudioManager.OnAudioFocusChangeListener {
    private final IBinder binder = new PlayerBinder();
    private AudioManager audioManager;
    private PlayerManager playerManager;

    class PlayerBinder extends Binder {
        PlayerService getService() {
            return PlayerService.this;
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i("jungon", "onCreate:" + getClass().getSimpleName());
        audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        playerManager = new PlayerManager(this);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent.getAction();
        Log.i("jungon", "onStartCommand: " + action);
        if (TextUtils.isEmpty(action)) {
            return START_NOT_STICKY;
        }

        int result = audioManager.requestAudioFocus(this, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
        if (result != AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
            stopSelf();
            return START_NOT_STICKY;
        }

        if (Constants.ACTION_PLAY.equals(action)) {

        } else if (Constants.ACTION_PUASE.equals(action)) {

        } else if (Constants.ACTION_STOP.equals(action)) {

        }
        return START_NOT_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        Log.i("jungon", "onBind");
        return binder;
    }

    @Override
    public boolean onUnbind(Intent intent) {
        Log.i("jungon", "onUnbind");
        return super.onUnbind(intent);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.i("jungon", "onDestroy:" + getClass().getSimpleName());
        playerManager.releasePlayer();
        playerManager = null;
    }

    @Override
    public void onAudioFocusChange(int focusChange) {
        switch (focusChange) {
            case AudioManager.AUDIOFOCUS_GAIN:
                break;

            case AudioManager.AUDIOFOCUS_LOSS:
                break;

            case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
                // Lost focus for a short time, but we have to stop
                // playback. We don't release the media player because playback
                // is likely to resume
                break;

            case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK:
                // Lost focus for a short time, but it's ok to keep playing
                // at an attenuated level
                break;
        }
    }

    public PlayerManager getPlayerManager() {
        return playerManager;
    }
}
