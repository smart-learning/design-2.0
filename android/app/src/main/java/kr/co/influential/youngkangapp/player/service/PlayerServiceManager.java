package kr.co.influential.youngkangapp.player.service;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.support.annotation.NonNull;

import kr.co.influential.youngkangapp.player.core.PlayerManager;

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

    public PlayerManager getPlayerManager() {
        if (isServiceConnected) {
            return service.getPlayerManager();
        }
        return new PlayerManager(context);
    }
}
