package com.welaaav2.player.service;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.support.annotation.NonNull;

import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.ui.PlayerView;
import com.pallycon.widevinelibrary.PallyconEventListener;
import com.welaaav2.player.core.PlayerManager;

public class PlayerServiceManager {
    private Context context;
    private PlayerService service;
    private boolean isServiceConnected;

    public PlayerServiceManager(@NonNull Context context) {
        this.context = context;
        isServiceConnected = false;
    }

    private ServiceConnection serviceConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            service = ((PlayerService.PlayerBinder) iBinder).getService();

            isServiceConnected = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            service = null;

            isServiceConnected = false;
        }
    };

    public void bind() {
        if (!isServiceConnected) {
            Intent intent = new Intent(context, PlayerService.class);
            context.bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
        }
    }

    public void unBind() {
        if (isServiceConnected) {
            context.unbindService(serviceConnection);
        }
    }

    public boolean isServiceConnected() {
        return isServiceConnected;
    }

    public void initializePlayer() {
        if (isServiceConnected) {
            service.getPlayerManager().initializePlayer();
        }
    }

    public void releasePlayer() {
        if (isServiceConnected) {
            service.getPlayerManager().releasePlayer();
        }
    }

    public void setSource(PlayerManager.Content content) {
        if (isServiceConnected) {
            service.getPlayerManager().setSource(content);
        }
    }

    public void setPlayerView(PlayerView playerView) {
        if (isServiceConnected) {
            service.getPlayerManager().setPlayerView(playerView);
        }
    }

    public void addPlayerEventListener(Player.EventListener listener) {
        if (isServiceConnected) {
            service.getPlayerManager().addPlayerEventListener(listener);
        }
    }

    public void setPallconEventListener(PallyconEventListener listener) {
        if (isServiceConnected) {
            service.getPlayerManager().setPallyconEventListener(listener);
        }
    }

    public void onStart() {
        if (isServiceConnected) {
            service.getPlayerManager().onStart();
        }
    }

    public void onResume() {
        if (isServiceConnected) {
            service.getPlayerManager().onResume();
        }
    }

    public void onPause() {
        if (isServiceConnected) {
            service.getPlayerManager().onPause();
        }
    }

    public void onStop() {
        if (isServiceConnected) {
            service.getPlayerManager().onStop();
        }
    }
}
