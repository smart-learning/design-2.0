package com.welaaav2.player.service;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.support.annotation.NonNull;

public class PlayerServiceManager {
    private Context context;
    private IPlayerAidlInterface binder;
    private IPlayerAidlInterfaceCallback callback;
    private boolean isServiceConnected;

    public PlayerServiceManager(@NonNull Context context,
                                @NonNull IPlayerAidlInterfaceCallback callback) {
        this.context = context;
        this.callback = callback;
        binder = null;
        isServiceConnected = false;
    }

    private ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            binder = IPlayerAidlInterface.Stub.asInterface(iBinder);
            try {
                binder.registerCallback(callback);
            } catch (RemoteException e) {
                e.printStackTrace();
            }

            isServiceConnected = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            try {
                binder.unregisterCallback(callback);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
            binder = null;

            isServiceConnected = false;
        }
    };

    public void bind() {
        if (!isServiceConnected) {
            Intent intent = new Intent(context, PlayerService.class);
            intent.setAction(IPlayerAidlInterface.class.getName());
            context.bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
        }
    }

    public void unBind() {
        if (isServiceConnected) {
            context.unbindService(serviceConnection);
        }
    }

    public void play() {
        if (binder != null) {
            try {
                binder.play();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }
    }

    public void pause() {
        if (binder != null) {
            try {
                binder.pause();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }
    }

    public void seekTo(int position) {
        if (binder != null) {
            try {
                binder.seekTo(position);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }
    }

    public boolean isPlaying() {
        if (binder != null) {
            try {
                return binder.isPlaying();
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }
        return false;
    }
}
