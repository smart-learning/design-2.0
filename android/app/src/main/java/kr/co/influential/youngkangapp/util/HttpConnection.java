package kr.co.influential.youngkangapp.util;

import android.util.Log;

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

    public void requestWebServer(String requestUrl ,String parameter, String parameter2, Callback callback) {
        RequestBody body = new FormBody.Builder()
                .add("client_id", parameter)
                .add("client_secret", parameter2)
                .build();

        String token = "5m0LNpR1E35Ic3V7Vwk0ImB8E0jxTq4IQr3gP2u43q";

        Request request = new Request.Builder()
                .url(requestUrl)
                .addHeader("Authorization" , "Bearer "+token)
                .post(body)
                .build();
        client.newCall(request).enqueue(callback);
    }


    public void requestWebServer(String requestUrl ,String parameter, String parameter2, String parameter3, Callback callback) {
        String token = "5m0LNpR1E35Ic3V7Vwk0ImB8E0jxTq4IQr3gP2u43q";
        OkHttpClient client = new OkHttpClient.Builder()
                .build();

        RequestBody body = new FormBody.Builder()
//                .add("client_id", "android")
//                .add("client_secret", parameter2)
                .build();

        Request request = new Request.Builder()
                .url(requestUrl)
                .addHeader("Authorization" , "Bearer "+token)
//                .post(body)
                .build();

        client.newCall(request).enqueue(callback);
    }

    public void requestWebServer(String requestUrl ,String parameter, String parameter2, String parameter3, RequestBody body , Callback callback) {
        String token = "5m0LNpR1E35Ic3V7Vwk0ImB8E0jxTq4IQr3gP2u43q";
        OkHttpClient client = new OkHttpClient.Builder()
                .build();

        // body {"error":true,"message":"validation error"} response code 400
        // String , int 타입 잘 확인 해주세요 .

        Request request = new Request.Builder()
                .url(requestUrl)
                .addHeader("Content-Type" , "application/json")
                .addHeader("Authorization" , "Bearer "+token)
                .post(body)
                .build();

        Log.e("HttpConnection Call " , "requestUrl " + requestUrl);
        Log.e("HttpConnection Call " , "Authorization Bearer " + token);
        Log.e("HttpConnection Call " , "body my " + body.toString());

        client.newCall(request).enqueue(callback);

    }
}
