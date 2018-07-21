package com.welaaav2.player.service;

import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.media.AudioManager;
import android.os.IBinder;
import android.os.RemoteCallbackList;
import android.os.RemoteException;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

/**
 * https://developer.android.com/guide/components/bound-services.html?hl=ko#Lifecycle
 */
public class PlayerService extends Service implements AudioManager.OnAudioFocusChangeListener {
    private NotificationManager notificationManager;
    private NotificationCompat.Builder notificationBuilder;

    private final RemoteCallbackList<IPlayerAidlInterfaceCallback> callbacks = new RemoteCallbackList<>();

    private final IPlayerAidlInterface.Stub binder = new IPlayerAidlInterface.Stub() {
        @Override
        public void play() throws RemoteException {
        }

        @Override
        public void pause() throws RemoteException  {

        }

        @Override
        public void seekTo(int position) throws RemoteException  {

        }

        @Override
        public boolean isPlaying() throws RemoteException  {
            return false;
        }

        @Override
        public boolean registerCallback(IPlayerAidlInterfaceCallback callback) throws RemoteException  {
            return callbacks.register(callback);
        }

        @Override
        public boolean unregisterCallback(IPlayerAidlInterfaceCallback callback) throws RemoteException  {
            return callbacks.unregister(callback);
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i("jungon", "onCreate:" + getClass().getSimpleName());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent.getAction();
        Log.i("jungon", "onStartCommand: " + action);
        return super.onStartCommand(intent, flags, startId);
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
        if (callbacks.getRegisteredCallbackCount() == 0) {
            callbacks.kill();
        }
        return super.onUnbind(intent);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.i("jungon", "onDestroy:" + getClass().getSimpleName());
        callbacks.kill();
    }

    @Override
    public void onAudioFocusChange(int focusChange) {
        switch (focusChange) {
            case AudioManager.AUDIOFOCUS_GAIN:
            case AudioManager.AUDIOFOCUS_GAIN_TRANSIENT:
                break;

            case AudioManager.AUDIOFOCUS_LOSS:
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

    private void initialize() {
        // TODO: 2018. 7. 21. initialize player and so on
    }

    private void release() {
        // TODO: 2018. 7. 21. release player and so on
    }
}
