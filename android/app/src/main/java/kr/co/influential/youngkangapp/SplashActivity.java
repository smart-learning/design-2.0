package kr.co.influential.youngkangapp;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import java.io.IOException;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.util.BaseAlertDialog;
import kr.co.influential.youngkangapp.util.Utils;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONException;
import org.json.JSONObject;

public class SplashActivity extends AppCompatActivity {

  public static final String TAG = LogHelper.makeLogTag(SplashActivity.class);

  private final String API_BASE_URL = Utils.welaaaApiBaseUrl();

  private final String API_ENDPOINT = "platform/versions/android";

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

      String description = body.getString("description");
      boolean forceUpdate = body.getBoolean("force_update");
      String storeUrl = body.getString("store_url");
      JSONObject version = body.getJSONObject("version");
      String currentVersion = version.getString("current");
      String minVersion = version.getString("min");

      if (forceUpdate && Utils.checkVersion(BuildConfig.VERSION_NAME, minVersion)) {
        forceUpdateDialog(description, storeUrl);
      } else if (Utils.checkVersion(BuildConfig.VERSION_NAME, currentVersion)) {
        updateDialog(storeUrl);
      } else {
        launchMain();
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

  private void launchMain() {
    Intent intent = new Intent(this, MainActivity.class);
    if (getIntent() != null && getIntent().getExtras() != null) {
      intent.putExtras(getIntent().getExtras());
    }
    ContextCompat.startActivity(this, intent, null);
    finish();
  }

  private void forceUpdateDialog(String description, String url) {
    BaseAlertDialog.Builder builder = new BaseAlertDialog.Builder(this);
    builder.setTitle(R.string.notice_dialog_update_title);
    builder.setMessage(description);
    builder.setNegativeButton(R.string.info_dial_cancel,
        v -> finish());
    builder.setPositiveButton(R.string.info_dial_ok,
        v -> launchMarket(url));
    runOnUiThread(() -> builder.build().show());
  }

  private void updateDialog(String url) {
    BaseAlertDialog.Builder builder = new BaseAlertDialog.Builder(this);
    builder.setTitle(R.string.notice_dialog_update_title);
    builder.setMessage(R.string.notice_dialog_update_message);
    builder.setNegativeButton(R.string.info_dial_cancel,
        v -> launchMain());
    builder.setPositiveButton(R.string.info_dial_ok,
        v -> launchMarket(url));
    runOnUiThread(() -> builder.build().show());
  }

  private void launchMarket(String url) {
    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
    finish();
  }
}
