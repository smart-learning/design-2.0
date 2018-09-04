package kr.co.influential.youngkangapp;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.util.Utils;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class SplashActivity extends AppCompatActivity {

    public static final String TAG = LogHelper.makeLogTag(SplashActivity.class);

    private final String API_BASE_URL = Utils.welaaaApiBaseUrl();

    private final String API_ENDPOINT = "platform/versions";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_splash);
    }

    @Override
    protected void onPostCreate(@Nullable Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

        // Request version.
        request(API_BASE_URL + API_ENDPOINT, new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                call.cancel();
                handleError("Request error");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (response.isSuccessful()) {
                    handleResponse(response.body().string());
                } else {
                    handleError("Request error");
                }
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    public void request(String requestUrl, Callback callback) {
        OkHttpClient client = new OkHttpClient.Builder()
                .build();

        Request request = new Request.Builder()
                .url(requestUrl)
                .build();

        client.newCall(request).enqueue(callback);
    }

    private void handleResponse(final String responseBody) {
        try {
            JSONObject body = new JSONObject(responseBody);
            JSONObject android = body.getJSONObject("android");
            String description = android.getString("description");
            boolean forceUpdate = android.getBoolean("force_update");
            String storeUrl = android.getString("store_url");
            JSONObject version = android.getJSONObject("version");
            String currentVersion = version.getString("current");
            String minVersion = version.getString("min");

            if (forceUpdate) {
                // TODO: 2018. 9. 3. Show dialog to launch store page.
            } else if (Utils.checkVersion(BuildConfig.VERSION_NAME, minVersion)) {
                // TODO: 2018. 9. 3. Equals force update.
            } else if (Utils.checkVersion(BuildConfig.VERSION_NAME, currentVersion)) {
                // TODO: 2018. 9. 3. Notice new version available.
            } else {
                Intent intent = new Intent(this, MainActivity.class);
                ContextCompat.startActivity(this, intent, null);
                finish();
            }
        } catch (JSONException e) {
            e.printStackTrace();
            handleError("Parse JSON error");
        }
    }

    private void handleError(String message) {
        LogHelper.d(TAG, "message: ", message);
        finish();
    }
}
