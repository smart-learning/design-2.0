package kr.co.influential.youngkangapp.util;

import static android.R.style.Theme_Material_Light_Dialog_Alert;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.app.AlertDialog;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.res.Resources;
import android.graphics.Point;
import android.graphics.drawable.Drawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.provider.Settings;
import android.support.v4.content.ContextCompat;
import android.text.Html;
import android.text.Spanned;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import kr.co.influential.youngkangapp.common.Gateway;

/**
 * Created by okitoki on 2016. 10. 6.
 */

public class Utils {

    /**
     * API Gateway
     */
    public static String welaaaApiBaseUrl() {
        Gateway gateway = Gateway.get();
        String protocol = gateway.getProtocol();
        String apiHost = gateway.getApiHost();
        String webHost = gateway.getWebHost();
        String domain = gateway.getDomain();

        String TYPE = "api";
        String VERSION = "v1.0";

        return protocol + apiHost + "." + domain + "/" + TYPE + "/" + VERSION + "/";
    }

    /************************************************************
     * Comment   :  웹사이트 메인 url
     ************************************************************/
    public static String welaaaWebUrl() {

        // String welaaaDomain = "https://8xwgb17lt1.execute-api.ap-northeast-2.amazonaws.com/dev/";
        String welaaaDomain = "https://api-prod.welaaa.com/";

        String TYPE = "api";
        String VERSION = "v1.0";

    welaaaDomain = welaaaDomain + "dev" + "/" + TYPE + "/" + VERSION + "/";
//    welaaaDomain = welaaaDomain + BuildConfig.FLAVOR + "/" + TYPE + "/" + VERSION + "/";

        return welaaaDomain;

    }

    public static String welaaaAndroidDrmSchemeUuid(){
        String welaaaAndroidDrmSchemeUuid = "widevine";
        return  welaaaAndroidDrmSchemeUuid;
    }

    public static String welaaaDrmLicenseUrl(){
        String welaaaDrmLicenseUrl = "http://tokyo.pallycon.com/ri/licenseManager.do";
        return  welaaaDrmLicenseUrl;
    }

    /************************************************************
     * Comment   :  Toast Massage
     ************************************************************/
    public static void logToast(Context context, String str) {
        Toast msg = Toast.makeText(context, str, Toast.LENGTH_SHORT);
        msg.show();
    }

    /************************************************************
     * Comment   :  RETURN TIME
     ************************************************************/
    public static String timeToString(double time) {
        int nTotal = (int) (time / 1000.0D);
        int nHour = nTotal / 3600;
        int nMin = (nTotal / 60) % 60;
        int nSec = nTotal % 60;

        if (nHour > 0) {
            return String.format("%02d:%02d:%02d", nHour, nMin, nSec);
        }
        return String.format("%02d:%02d", nMin, nSec);
    }

    /************************************************************
     * Comment   :  RETURN TIME
     ************************************************************/
    public static String timeToStringHangul(String time) {
        String[] timesplit = time.split(":");

        if (timesplit[0].equals("00")) {
            return timesplit[1] + "분 " + timesplit[2] + "초";
        }

        return timesplit[0] + "시간 " + timesplit[1] + "분 " + timesplit[2] + "초";
    }

    /************************************************************
     * Comment   :  RETURN TIME
     ************************************************************/
    public static int webTimeToSec(String time) {
        String[] timesplit = time.split(":");

        if (timesplit[0].equals("00")) {
            return ((Integer.parseInt(timesplit[1])*60)+(Integer.parseInt(timesplit[2])))*1000;
        }

        return ((Integer.parseInt(timesplit[0])*60*60)+(Integer.parseInt(timesplit[1])*60)+(Integer.parseInt(timesplit[2]))) *1000;
    }

    /************************************************************
     * Comment   :  RETURN TIME
     ************************************************************/
    public static String timeToReplaceString(String time) {
        String match = "[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]";
        time = time.replaceAll(match, "");
        time = time.replaceAll(" ", "");

        return time;
    }

    /************************************************************
     * Comment   :  RETURN TIME
     ************************************************************/
    public static String timeToConvert(String time) {
        String convertTime =
                time.substring(0, 4) + "-" + time.substring(4, 6) + "-" + time.substring(6, 8) + " " +
                        time.substring(8, 10) + ":" + time.substring(10, 12) + ":" + time.substring(12);

        return convertTime;
    }

    /************************************************************
     * Comment   :  오늘 날짜를 리턴 합니다 24HH
     ************************************************************/
    public static String getCurrentHHDay() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");

        Calendar c1 = Calendar.getInstance();

        String strToday = sdf.format(c1.getTime());

        return strToday;
    }

    /************************************************************
     * Comment   :  오늘 날짜를 리턴 합니다
     ************************************************************/
    public static String getCurrentDay() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddhhmmss");

        Calendar c1 = Calendar.getInstance();

        String strToday = sdf.format(c1.getTime());

        return strToday;
    }

    /************************************************************
     * Comment   :  오늘 날짜와 입력된 날짜와 비교 하고 날짜 차이를 리턴 합니다.
     ************************************************************/
    public static long compareDate(String time) {

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");

        Calendar c1 = Calendar.getInstance();

        Date beginDate = null;
        Date endDate = null;

        String start = formatter.format(c1.getTime());
//        String end = time.substring(0,4) + "-" + time.substring(4,6) + "-" + time.substring(6,8);
        String end = time;

        try {
            beginDate = formatter.parse(start);
            endDate = formatter.parse(end);

        } catch (ParseException e) {
            e.printStackTrace();
        }

        long diff = endDate.getTime() - beginDate.getTime();
        long diffDays = diff / (24 * 60 * 60 * 1000);

        return diffDays;

    }

    /************************************************************
     * Comment   :  yyyyMMddHHmmss Long 타입으로
     ************************************************************/
    public static long compareDatediff(String time) {

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");

        Calendar c1 = Calendar.getInstance();

        Date beginDate = null;
        Date endDate = null;

        String start = formatter.format(c1.getTime());
//        String end = time.substring(0,4) + "-" + time.substring(4,6) + "-" + time.substring(6,8);
        String end = time;

        try {
            beginDate = formatter.parse(start);
            endDate = formatter.parse(end);

        } catch (ParseException e) {
            e.printStackTrace();
        }

        long diff = endDate.getTime() - beginDate.getTime();

        return diff;

    }

    public static void logToast(Context context, String n, int num) {
        String str = n + String.valueOf(num);
        Toast msg = Toast.makeText(context, str, Toast.LENGTH_SHORT);
        msg.show();
    }

    public static void logToast(Context context, long num) {
        String str = String.valueOf(num);
        Toast msg = Toast.makeText(context, str, Toast.LENGTH_SHORT);
        msg.show();
    }


    /************************************************************
     * Comment   : return int view의 위치
     ************************************************************/
    public static int[] getViewPosition(View view) {

        int[] location = new int[2];
        view.getLocationOnScreen(location);

        return location;
    }

    public static void logToast(Context context, float num) {
        String str = String.valueOf(num);
        Toast msg = Toast.makeText(context, str, Toast.LENGTH_SHORT);
        msg.show();
    }

    public static Spanned fromHtml(String source) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            // noinspection deprecation
            return Html.fromHtml(source);
        }
        return Html.fromHtml(source, Html.FROM_HTML_MODE_LEGACY);
    }

    /**
     * @return float pixeltodp
     */
    public static float getpixeltodp(float num, Resources r) {
        DisplayMetrics metrics = r.getDisplayMetrics();
        float mviewHeight_dp = num;
        float fpixels = metrics.density * mviewHeight_dp;

        return fpixels;
    }

    /**
     * @return MD5Hash to string
     */
    public static String getMD5Hash(String s) {
        MessageDigest m = null;
        String hash = null;

        try {
            m = MessageDigest.getInstance("MD5");
            m.update(s.getBytes(), 0, s.length());
            hash = new BigInteger(1, m.digest()).toString(16);
        } catch (NoSuchAlgorithmException e) {

            e.printStackTrace();

        }
        return hash;
    }

    /**
     * @return 화면해상도의 height값
     */
    public static int getWindowHeihgt(Context context) {

        Display display = ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE))
                .getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);

        int windowheight = size.y;

        return windowheight;

    }

    /**
     * @return 화면해상도의 width값
     */
    public static int getWindowWidth(Context context) {

        Display display = ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE))
                .getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);

        int windowWidth = size.x;

        return windowWidth;

    }

    /**
     * 픽셀을 DP 로 변환하는 메소드.
     *
     * @param px 픽셀
     * @return 픽셀에서 dp 로 변환된 값.
     */
    public static int pxToDp(Context context, int px) {
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        int dp = Math.round(px / (displayMetrics.xdpi / DisplayMetrics.DENSITY_DEFAULT));
        return dp;
    }


    /**
     * DP 를 픽셀로 변환하는 메소드.
     *
     * @param dp dp
     * @return dp 에서 변환된 픽셀 값.
     */

    public static int dpToPx(Context context, int dp) {
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        int px = Math.round(dp * (displayMetrics.xdpi / DisplayMetrics.DENSITY_DEFAULT));
        return px;
    }

    public static void alertWindow(Activity activity, String title, String message, String msg1) {
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(
                activity, Theme_Material_Light_Dialog_Alert);

        alertDialogBuilder.setTitle(title);
        alertDialogBuilder
                .setMessage(message)
                .setCancelable(false)
                .setPositiveButton(msg1,
                        new DialogInterface.OnClickListener() {
                            public void onClick(
                                    DialogInterface dialog, int id) {
                                dialog.cancel();
                            }
                        });

        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();
    }


    public static final Drawable getDrawable(Context context, int id) {
        final int version = Build.VERSION.SDK_INT;
        if (version >= 21) {
            return ContextCompat.getDrawable(context, id);
        } else {
            return context.getResources().getDrawable(id);
        }
    }

    public static final int getColor(Context context, int id) {
        final int version = Build.VERSION.SDK_INT;
        if (version >= 23) {
            return ContextCompat.getColor(context, id);
        } else {
            return context.getResources().getColor(id);
        }
    }

    public static Boolean isAirModeOn(Context context) {
        Boolean isAirplaneMode;

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN_MR1) {
            isAirplaneMode =
                    Settings.System.getInt(context.getContentResolver(), Settings.System.AIRPLANE_MODE_ON, 0)
                            == 1;
        } else {
            isAirplaneMode =
                    Settings.Global.getInt(context.getContentResolver(), Settings.Global.AIRPLANE_MODE_ON, 0)
                            == 1;
        }

        try {
            ConnectivityManager cm =
                    (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);

            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            boolean isConnected = activeNetwork != null &&
                    activeNetwork.isConnectedOrConnecting();

            if (!isConnected) {
                if (activeNetwork.isAvailable()) {
                    isAirplaneMode = false;
                } else {
                    isAirplaneMode = true;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();

            isAirplaneMode = true;
        }

        return isAirplaneMode;
    }

    public static Activity getActivity(Context context) {
        while (context instanceof ContextWrapper) {
            if (context instanceof Activity) {
                return (Activity) context;
            }
            context = ((ContextWrapper) context).getBaseContext();
        }
        return null;
    }

    public static boolean checkVersion(String currentVersion, String updateVersion) {
        boolean isUpdateExist = false;

        final String[] CURRENT_VERSION = currentVersion.split("\\.");
        final String[] UPDATE_VERSION = updateVersion.split("\\.");

        for (int i = 0; i < CURRENT_VERSION.length; i++) {
            int updateVersionNumber = Integer.parseInt(UPDATE_VERSION[i]);
            int currentVersionNumber = Integer.parseInt(CURRENT_VERSION[i]);

            if (currentVersionNumber > updateVersionNumber) {
                break;
            }

            if (updateVersionNumber > currentVersionNumber) {
                isUpdateExist = true;
                break;
            }
        }
        return isUpdateExist;
    }

    public static boolean checkCidAudioChapter(String cid){
        boolean checkCidAudioChapter = false;

        if(cid.contains("_")){
            checkCidAudioChapter = true;
        }

        return checkCidAudioChapter;
    }

    public static String getyyyyMMddHHmmss(){
        /** yyyyMMddHHmmss Date Format */
        SimpleDateFormat yyyyMMddHHmmss = new SimpleDateFormat("yyyyMMddHHmmss");
        return yyyyMMddHHmmss.format(new Date());
    }


    public static String encrypt(String strData) { // 암호화 시킬 데이터
        String strOUTData = "";
        try {
            MessageDigest md = MessageDigest.getInstance("MD5"); // "MD5 형식으로 암호화"

            md.reset();
            //byte[] bytData = strData.getBytes();
            //md.update(bytData);
            md.update(strData.getBytes());
            byte[] digest = md.digest();

            StringBuffer hashedpasswd = new StringBuffer();
            String hx;

            for (int i=0;i<digest.length;i++){
                hx =  Integer.toHexString(0xFF & digest[i]);
                //0x03 is equal to 0x3, but we need 0x03 for our md5sum
                if(hx.length() == 1){hx = "0" + hx;}
                hashedpasswd.append(hx);

            }
            strOUTData = hashedpasswd.toString();
            byte[] raw = strOUTData.getBytes();
            byte[] encodedBytes = Base64.encode(raw, 0);
            strOUTData = new String(encodedBytes);
            //strOUTData = new String(raw);
        }
        catch (NoSuchAlgorithmException e) {

        }
        return strOUTData;  // 암호화된 데이터를 리턴...
    }

    public static void AlertDialog(String title,String message,Context context)
    {
        AlertDialog.Builder ab = null;
        ab = new AlertDialog.Builder( context );
        ab.setMessage(message);
        ab.setPositiveButton(android.R.string.ok, null);
        ab.setTitle(title);
        ab.show();
    }


    public static boolean isPackageInstalled(Context ctx, String pkgName) {

        try {
            ctx.getPackageManager().getPackageInfo(pkgName, PackageManager.GET_ACTIVITIES);
        } catch (NameNotFoundException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public static boolean isAppInForeground(Context context) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        if (activityManager == null) return false;

        List<RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
        if (appProcesses == null) return false;

        final String packageName = context.getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (
                appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
                    && appProcess.processName.equals(packageName)
                ) {
                return true;
            }
        }

        return false;
    }
}
