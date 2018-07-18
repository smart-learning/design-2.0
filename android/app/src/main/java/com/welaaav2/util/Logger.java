package com.welaaav2.util;

/**
 * Created by okitoki on 2016. 12. 10..
 */

import android.content.Context;
import android.util.Log;

/**
 * @author    yongduk.lim
 */
public class Logger {

    /**
     * @uml.property  name="lOG"
     */
    private static boolean LOG = true;
    private static String TAG = "CDN";
    private static String TAG_PLAY = "CDNPLAY";
    private static String TAG_INFO = "CDNINFO";
    private static String TAG_NET = "CDNNET";

    /**
     * @return
     * @uml.property  name="lOG"
     */
    public static boolean isLOG() {
        return LOG;
    }

    /**
     * @param  lOG
     * @uml.property  name="lOG"
     */
    public static void setLOG(boolean lOG) {
        LOG = lOG;
    }
    public static void player(String msg){
        if(LOG)
            Log.d(TAG_PLAY, msg);
    }
    public static void class_info(Context context)
    {
        if(LOG)
            d("[ "+context.getClass().getName()+" ]");
    }

    @SuppressWarnings("rawtypes")
    public static void class_info(Class cls)
    {
        if(LOG)
            Log.d(TAG, "[ "+cls.getName()+" ]");
    }
    public static void net(String task)
    {
        if(LOG)
            Log.d(TAG_NET, "[ "+task+" ]");
    }
    public static void netError(String task)
    {
        if(LOG)
            Log.i(TAG_NET, "[ "+task+" ]");
    }
    public static void netEx(String task, Throwable t)
    {
        if(LOG)
            Log.i(TAG_NET, "[ "+task+" ]", t);
    }
    public static void v(String msg)
    {
        if(LOG)
            Log.v(TAG, msg);
    }
    public static void d(String msg)
    {
        if(LOG)
            Log.d(TAG, msg);
    }
    public static void w(String msg)
    {
        if(LOG)
            Log.w(TAG, msg);
    }
    public static void i(String msg)
    {
        if(LOG)
            Log.i(TAG, msg);
    }
    public static void e(String msg)
    {
        if(LOG)
            Log.i(TAG, msg);
    }
    public static void e(String msg, Throwable e)
    {
        if(LOG)
            Log.i(TAG, msg, e);
    }
    public static void video(String msg)
    {
        if(LOG)
            Log.i(TAG, msg);
    }
    public static void c2dm(String msg)
    {
        if(LOG)
            Log.i(TAG, msg);
    }

}
