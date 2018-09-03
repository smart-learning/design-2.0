package kr.co.influential.youngkangapp;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.Nullable;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;

import java.lang.ref.WeakReference;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_splash);
    }

    @Override
    protected void onPostCreate(@Nullable Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

        // TODO: 2018. 9. 3. Do version check, miscellaneous action and so on...
        ScreenChangeHandler handler = new ScreenChangeHandler(this);
        handler.sendEmptyMessageDelayed(0, 2_000l);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    class ScreenChangeHandler extends Handler {
        private WeakReference<AppCompatActivity> activity;

        public ScreenChangeHandler(AppCompatActivity activity) {
            this.activity = new WeakReference<>(activity);
        }

        @Override
        public void handleMessage(Message msg) {
            Intent intent = new Intent(activity.get(), MainActivity.class);
            ContextCompat.startActivity(activity.get(), intent, null);
        }
    }
}
