package com.welaaav2.util;

import android.webkit.CookieManager;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by okitoki on 2017. 1. 20..
 */

public class HttpCon {

    public String connection(String _targeturl){

    String targeturl = _targeturl;
    URL url;
    HttpURLConnection connection = null;
    CookieManager mCookieManager = CookieManager.getInstance();

    String m_cookies = mCookieManager.getCookie(Utils.welaaaWebUrl());

    try {

        // Create connection
        url = new URL(targeturl);
        connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty( "Cookie", m_cookies );
        connection.setUseCaches(false);
        connection.setDoInput(true);
        connection.setDoOutput(true);
        // 2017.11.23 TEST api.welaaa.co.kr
        connection.setRequestMethod("POST");

        // Send request
        DataOutputStream wr = new DataOutputStream(
        connection.getOutputStream());
        wr.writeBytes(targeturl);
        wr.flush();
        wr.close();

        // Get Response
        InputStream is = connection.getInputStream();
        BufferedReader rd = new BufferedReader(new InputStreamReader(is));
        String line;
        StringBuffer response = new StringBuffer();
        while ((line = rd.readLine()) != null) {
            response.append(line);
            response.append('\r');
        }
        rd.close();

        return response.toString();

    } catch (Exception e) {

        e.printStackTrace();
        return null;

    } finally {

        if (connection != null) {
            connection.disconnect();
        }
    }
   }
}
