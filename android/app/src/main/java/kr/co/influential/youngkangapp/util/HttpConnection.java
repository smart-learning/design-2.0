package kr.co.influential.youngkangapp.util;

import java.util.concurrent.TimeUnit;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

public class HttpConnection {

    private OkHttpClient client;
    private static HttpConnection instance = new HttpConnection();
    public static HttpConnection getInstance() {
        return instance;
    }

    private HttpConnection(){ this.client = new OkHttpClient(); }

    public void requestWebServer(String requestUrl ,String parameter, String parameter2, String parameter3, Callback callback) {

        OkHttpClient client = new OkHttpClient.Builder()
            .writeTimeout(5000, TimeUnit.SECONDS)
            .readTimeout(5000, TimeUnit.SECONDS)
                .build();

        RequestBody body = new FormBody.Builder()
//                .add("client_id", "android")
//                .add("client_secret", parameter2)
                .build();

        Request request = new Request.Builder()
                .url(requestUrl)
                .addHeader("Authorization" , "Bearer "+parameter3)
//                .post(body)
                .build();

        client.newCall(request).enqueue(callback);
    }

    public void requestWebServer(String requestUrl ,String parameter, String parameter2, String parameter3, RequestBody body , Callback callback) {

        OkHttpClient client = new OkHttpClient.Builder()
            .writeTimeout(5000 , TimeUnit.SECONDS)
            .readTimeout(5000 , TimeUnit.SECONDS)
                .build();

        // body {"error":true,"message":"validation error"} response code 400
        // String , int 타입 잘 확인 해주세요 .

        Request request = new Request.Builder()
                .url(requestUrl)
                .addHeader("Content-Type" , "application/json")
                .addHeader("Authorization" , "Bearer "+parameter3)
                .post(body)
                .build();

        client.newCall(request).enqueue(callback);

    }
}
