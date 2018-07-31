package com.welaaav2;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

import com.welaaav2.player.core.PlayerManager;
import com.welaaav2.player.service.PlayerServiceManager;

public abstract class BaseActivity extends AppCompatActivity {
    protected Context context;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = this;
    }

    protected PlayerServiceManager getPlayerServiceManager() {
        return ((MainApplication) getApplicationContext()).getPlayerServiceManager();
    }

    protected PlayerManager getPlayerManager() {
        return ((MainApplication) getApplicationContext()).getPlayerManager();
    }
}
