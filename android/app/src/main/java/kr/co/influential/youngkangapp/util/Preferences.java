package kr.co.influential.youngkangapp.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

/**
 * 1. FileNae  : SettingFragment.java
 * 2. Package  : kr.co.influential.youngkangapp
 * 3. Comment  : 윌라 세팅 페이지 Preferences
 * 4. 작성자   : 오키토키
 * 5. 작성일   : 2016.11. 04.
 **/
public class Preferences {
    public static final String NAME = "WELAAA";

    private static String PLAYERGROUPID = "PLAYERGROUPID";
    private static String PLAYERCKEY = "PLAYERCKEY";
    private static String PLAYERCID = "PLAYERCID";
    private static String ISAUTOLOGIN = "ISAUTOLOGIN";
    private static String ONLYWIFIVIEW = "ONLYWIFIVIEW";
    private static String ONLYWIFIDOWNLOAD = "ONLYWIFIDOWNLOAD";
    private static String PUSHNOTICEARROW = "PUSHNOTICEARROW";
    private static String EMAILRECEIVE_ARROW = "EMAILRECEIVE_ARROW";
    private static String SDCARDDOWNLOAD = "SDCARDDOWNLOAD";
    private static String SPEEDRATE = "SPEEDRATE";
    private static String AUTOPLAY = "AUTOPLAY";
    private static String SLEEPMODE = "SLEEPMODE";
    private static String PLAYEND = "PLAYEND";
    private static String WELAAAPLAYER_DESTROY_INFO = "WELAAAPLAYER_DESTROY_INFO";
    private static String MOBILE_3GDOWNLOAD = "DOWNLOAD";
    private static String STORAGE = "STORAGE";

    private static String PLAY_LIST_COUNT = "PLAY_LIST_COUNT";
    private static String PLAY_LIST_CURRENT_GKEY = "PLAY_LIST_CURRENT_GKEY";
    private static String PLAY_LIST_CURRENT_CKEY = "PLAY_LIST_CURRENT_CKEY";
    private static String PLAY_LIST_USE = "PLAY_LIST_USE";

    private static String FACEBOOKID = "FACEBOOKID";

    private static String RECENT_PLAY_LIST = "RECENT_PLAY_LIST";

    private static String DOWNLOADCHECK_STATUS = "DOWNLOADCHECK_STATUS";

    private static String PLAY_LOCK_USE = "PLAY_LOCK_USE";
    private static String PLAY_AUDIO_USE = "PLAY_AUDIO_USE";
    private static String PLAY_ORIENTATION_TIME_USE = "PLAY_ORIENTATION_TIME_USE";
    private static String PLAY_AUDIOBOOK_REFRESH_VIEW = "PLAY_AUDIOBOOK_REFRESH_VIEW";

    private static String PLAY_AUDIOBOOK_DOAUTOPLAY = "PLAY_AUDIOBOOK_DOAUTOPLAY";

    private static String PLAY_LIST_JUMP_TIME_USE = "PLAY_LIST_JUMP_TIME_USE";
    private static String F_TOKEN_VALUE = "F_TOKEN_VALUE";

    private static String PLAY_LIST_ONCLICK_POS = "PLAY_LIST_ONCLICK_POS";
    private static String PLAY_LIST_ONCLICK_ENDTIME = "PLAY_LIST_ONCLICK_ENDTIME";

    private static String PLAY_CUSTOM_WEBVIEW_CHECKED = "PLAY_CUSTOM_WEBVIEW_CHECKED";
    private static String PLAY_CLIP_TITLE_USE = "PLAY_CLIP_TITLE_USE";

    private static String ON_HOME_KEY = "ON_HOME_KEY";
    private static String POPUPVIEWWINDOW_ONCLICK = "POPUPVIEWWINDOW_ONCLICK";
    private static String PLAYER_ISPLAY = "PLAYER_ISPLAY";

    private static String LISTDOWNLOADACTIVITY_USE_POPUPVIDEOWINDOW = "LISTDOWNLOADACTIVITY_USE_POPUPVIDEOWINDOW";
    private static String LISTDOWNLOADACTIVITY_NOUSE_POPUPVIDEOWINDOW = "LISTDOWNLOADACTIVITY_NOUSE_POPUPVIDEOWINDOW";
    private static String FACEBOOK_DEEPLINK = "FACEBOOK_DEEPLINK";
    private static String WELAAA_POWERBOARDCAST_CURRENTTIME = "WELAAA_POWERBOARDCAST_CURRENTTIME";
    private static String WELAAA_POWERBOARDCAST_AUTOMODE = "WELAAA_POWERBOARDCAST_AUTOMODE";

    private static String WELAAA_SCREEN_ONOFF = "WELAAA_SCREEN_ONOFF";

    private static String WELAAA_ADWORDS_URL = "WELAAA_ADWORDS_URL";

    private static String WELAAA_VIEWGUIDE_CHECK = "WELAAA_VIEWGUIDE_CHECK";

    private static String WELAAA_LOGOUT_BOTTOMWRAP = "WELAAA_LOGOUT_BOTTOMWRAP";

    private static String WELAAA_PREVIEW_GROUPKEY = "WELAAA_PREVIEW_GROUPKEY";
    private static String WELAAA_PREVIEW_CKEY = "WELAAA_PREVIEW_CKEY";
    private static String WELAAA_PREVIEW_PLAY = "WELAAA_PREVIEW_PLAY";

    private static String WELAAA_MYREPU_STAR = "WELAAA_MYREPU_STAR";
    private static String WELAAA_DRAWER_MENU_ITEM = "WELAAA_DRAWER_MENU_ITEM";

    private static String WELAAA_BOTTOM_PLAYER_CKEY = "WELAAA_BOTTOM_PLAYER_CKEY";
    private static String WELAAA_BOTTOM_PLAYER_MODE = "WELAAA_BOTTOM_PLAYER_MODE";

    private static String WELAAA_MYREPU_CHECKBOX = "WELAAA_MYREPU_CHECKBOX";
    private static String WELAAA_OAUTH_TOKEN = "WELAAA_OAUTH_TOKEN";
    private static String WELAAA_PLAYER_INFO = "WELAAA_PLAYER_INFO";
    private static String WELAAA_UESR_ID = "WELAAA_UESR_ID";

    /************************************************************************
     * FOR SETTING : MAIN ACTIVITY 자동로그인
     ************************************************************************/

    public static Boolean getAutoLogin(Context context){
    SharedPreferences pref = context.getSharedPreferences(ISAUTOLOGIN, Context.MODE_PRIVATE);
    return pref.getBoolean(ISAUTOLOGIN, true);
    }

    public static void setAutoLogin(Context context, Boolean value){
        SharedPreferences pref = context.getSharedPreferences(ISAUTOLOGIN, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(ISAUTOLOGIN, value);
        edit.commit();
    }

    /************************************************************************
     * FOR SETTING : Player WIFI 일때만 재생
     ************************************************************************/

    public static Boolean getOnlyWifiView(Context context){
        SharedPreferences pref = context.getSharedPreferences(ONLYWIFIVIEW, Context.MODE_PRIVATE);
        return pref.getBoolean(ONLYWIFIVIEW, true);
    }
    public static void setOnlyWifiView(Context context, Boolean value){
        SharedPreferences pref = context.getSharedPreferences(ONLYWIFIVIEW, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(ONLYWIFIVIEW, value);
        edit.commit();
    }

    /************************************************************************
     * FOR SETTING : Player WIFI 일때만 다운로드
     ************************************************************************/
    public static Boolean getOnlyWifiDownload(Context context){
        SharedPreferences pref = context.getSharedPreferences(ONLYWIFIDOWNLOAD, Context.MODE_PRIVATE);
        return pref.getBoolean(ONLYWIFIDOWNLOAD, true);
    }
    public static void setOnlyWifiDownload(Context context, Boolean value){
        SharedPreferences pref = context.getSharedPreferences(ONLYWIFIDOWNLOAD, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(ONLYWIFIDOWNLOAD, value);
        edit.commit();
    }

    /************************************************************************
     * FOR SETTING : SD카드에 다운로드
     ************************************************************************/
    public static Boolean getSdCardDownload(Context context){
        SharedPreferences pref = context.getSharedPreferences(SDCARDDOWNLOAD, Context.MODE_PRIVATE);
        return pref.getBoolean(SDCARDDOWNLOAD, false);
    }
    public static void setSdCardDownload(Context context, Boolean value){
        SharedPreferences pref = context.getSharedPreferences(SDCARDDOWNLOAD, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(SDCARDDOWNLOAD, value);
        edit.commit();
    }

    /************************************************************************
     * FOR SETTING : 푸쉬 알림 적용
     ************************************************************************/
    public static Boolean getPushNotictArrow(Context context){
        SharedPreferences pref = context.getSharedPreferences(PUSHNOTICEARROW, Context.MODE_PRIVATE);
        return pref.getBoolean(PUSHNOTICEARROW, true);
    }
    public static void setPushNotictArrow(Context context, Boolean value){
        SharedPreferences pref = context.getSharedPreferences(PUSHNOTICEARROW, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(PUSHNOTICEARROW, value);
        edit.commit();
    }

    /************************************************************************
     * FOR SETTING : 이메일 수신 동의
     ************************************************************************/
    public static Boolean getEmailReceiveArrow(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(EMAILRECEIVE_ARROW, true);
    }
    public static void setEmailReceiveArrow(Context context, Boolean value){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(EMAILRECEIVE_ARROW, value);
        edit.commit();
    }

    /************************************************************************
     * WelaaaPlayer 가 destroy 되었는지 체크 되어야 한다.
     * (destroy가 되지 않을때 WelaaaPlayer 인스턴스를 실행시키면 오류가 발생하는 것을 방지하기 위함 )
     ************************************************************************/
    public static void setWelaaaPlayerDestroyInfo(Context context, boolean falg)
    {
        SharedPreferences pref = context.getSharedPreferences(WELAAAPLAYER_DESTROY_INFO, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(WELAAAPLAYER_DESTROY_INFO, falg);
        edit.commit();
    }
    public static boolean getWelaaaPlayerDestroyInfo(Context context)
    {
        SharedPreferences pref = context.getSharedPreferences(WELAAAPLAYER_DESTROY_INFO, Context.MODE_PRIVATE);
        return pref.getBoolean(WELAAAPLAYER_DESTROY_INFO, true);
    }


    /************************************************************************
     * FOR PLAYER   :   Player AUTO PLAY SETTING
     ************************************************************************/
    public static void setWelaaaPlayAutoPlay(Context context, Boolean value){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(AUTOPLAY, value);
        edit.commit();
    }

    public static Boolean getWelaaaPlayAutoPlay(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(AUTOPLAY, true);
    }

    /************************************************************************
     * FOR PLAYER   :
     ************************************************************************/
    public static boolean isNetworkAvailable(Context context)
    {
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(MOBILE_3GDOWNLOAD, false);
    }

    /************************************************************************
     * FOR PLAYER   :   layer 플레이어 END CHECK
     ************************************************************************/
    public static void setWelaaaPlayEnd(Context context, Boolean value){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(PLAYEND, value);
        edit.commit();
    }
    public static Boolean getWelaaaPlayEnd(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(PLAYEND, false);
    }

    /************************************************************************
     * FOR PLAYER   :   Player 플레이어 SLEEP MODE
     ************************************************************************/
    public static void setWelaaaPlayerSleepMode(Context context, Boolean value){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(SLEEPMODE, value);
        edit.commit();
    }

    public static Boolean getWelaaaPlayerSleepMode(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(SLEEPMODE, false);
    }

    /************************************************************************
     * FOR PLAYER   :   Player 플레이어  현재 재생중인 파일의 CKEY
     ************************************************************************/
    public static void setWelaaaPlayListCKey(Context context, String ckey){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(PLAYERCKEY, ckey);
        edit.commit();

//        Log.i("Preferences" , "Welaaa PlayList ckey==>"+ckey);
    }

    public static String getWelaaaPlayListCkey(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(PLAYERCKEY, "0");
    }

    /************************************************************************
     * FOR PLAYER   :   Player 플레이어  speedrate
     ************************************************************************/
    public static void setWelaaaPlaySpeedrate(Context context, String speedrate){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(SPEEDRATE, speedrate);
        edit.commit();
//        Log.i("Preferences" , "Welaaa setWelaaaPlaySpeedrate ==>"+speedrate);
    }

    public static String getWelaaaPlaySpeedrate(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(SPEEDRATE,"1.0");
    }
    /************************************************************************
     * FOR PLAYER   :   Player 플레이어  현재 재생중인 파일의 그룹내에 ID
     ************************************************************************/
    public static void setWelaaaPlayListCId(Context context, int cId){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putInt(PLAYERCID, cId);
        edit.commit();

        Log.i("Preferences" , " doAutoPlay Welaaa PlayList Cid==>"+cId);
    }

    public static int getWelaaaPlayListCId(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getInt(PLAYERCID, 0);
    }

    /************************************************************************
     * Player 배속 초기화 설정  / 외장 메모리 지원 옵션
     ************************************************************************/
    public static boolean isStorageOption(Context context){
        boolean buse = false;
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        buse=pref.contains(STORAGE);

        return buse;
    }

    public static String getStoageRootPath(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        String path=pref.getString(STORAGE, "");

        return path;
    }

    public static void setStoageRootPath(Context context, String path){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(STORAGE, path);
        edit.commit();

    }

    /***********************************************************************************
     * Player 관련하여 CDN Webserver에  useInterface 를 사용할 것이냐 말 것이냐 // 기본 false
     **********************************************************************************/
    public static boolean getUseInterface(Context context)
    {
        return false;
    }


    /************************************************************************
     * Player GROUP ID
     ************************************************************************/
    public static void setWelaaaPlayListGroupId(Context context, String gId){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(PLAYERGROUPID, gId);
        edit.commit();

    }

    public static String getWelaaaPlayListGroupId(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(PLAYERGROUPID, "0");
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LIST COUNT
     ************************************************************************/
    public static void setWelaaaPlayListCount(Context context, int count , int total){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(PLAY_LIST_COUNT, String.valueOf(count)+":"+ String.valueOf(total) );
        edit.commit();

    }

    public static String getWelaaaPlayListCount(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(PLAY_LIST_COUNT, "0");
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LIST CURRENT GROUP KEY
     ************************************************************************/
    public static void setWelaaaPlayListCurrnetGroupKey(Context context, String gkey){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(PLAY_LIST_CURRENT_GKEY, gkey );
        edit.commit();

    }

    public static String getWelaaaPlayListCurrnetGroupKey(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(PLAY_LIST_CURRENT_GKEY, "0");
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LIST CURRENT C KEY
     ************************************************************************/
    public static void setWelaaaPlayListCurrnetCKey(Context context, String ckey){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(PLAY_LIST_CURRENT_CKEY, ckey );
        edit.commit();

    }

    public static String getWelaaaPlayListCurrnetCKey(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(PLAY_LIST_CURRENT_CKEY, "0");
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LIST USE ?
     ************************************************************************/
    public static void setWelaaaPlayListUsed(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(PLAY_LIST_USE, values );
        edit.commit();

    }

    public static Boolean getWelaaaPlayListUsed(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(PLAY_LIST_USE, false);
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LIST CURRENT C KEY
     ************************************************************************/
    public static void setFaceBookId(Context context, String facebookid){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(FACEBOOKID, facebookid );
        edit.commit();

    }

    public static String getFaceBookId(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(FACEBOOKID, "0");
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , RECENT_PLAY_LIST USE ?
     ************************************************************************/
    public static void setWelaaaRecentPlayListUse(Context context, boolean values , String listKey){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();

        if(values==true){
            edit.putString(RECENT_PLAY_LIST, listKey);
        }else{
            edit.putString(RECENT_PLAY_LIST, "0");
        }


        edit.commit();

    }

    public static String getWelaaaRecentPlayListUse(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(RECENT_PLAY_LIST, "0");
    }


    /************************************************************************
     * FOR ListDownloadActivity   :  ListDownloadActivity , Check Status
     ************************************************************************/
    public static void setWelaaaDownloadStatus(Context context, String downloadCkey , boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(downloadCkey, values );
        edit.commit();

    }

    public static Boolean getWelaaaDownloadStatus(Context context , String downloadCkey){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(downloadCkey, false);
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LOCK_USE ?
     ************************************************************************/
    public static void setWelaaaPlayLockUsed(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(PLAY_LOCK_USE, values );
        edit.commit();

    }

    public static Boolean getWelaaaPlayLockUsed(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(PLAY_LOCK_USE, false);
    }


    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LOCK_USE ?
     ************************************************************************/
    public static void setWelaaaPlayAudioUsed(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(PLAY_AUDIO_USE, values );
        edit.commit();

    }

    public static Boolean getWelaaaPlayAudioUsed(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(PLAY_AUDIO_USE, false);
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LOCK_USE ?
     ************************************************************************/
    public static void setWelaaaPlayOrientationTimeUsed(Context context, int values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putInt(PLAY_ORIENTATION_TIME_USE, values );
        edit.commit();

    }

    public static int getWelaaaPlayOrientationTimeUsed(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getInt(PLAY_ORIENTATION_TIME_USE, 0);
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LOCK_USE ?
     ************************************************************************/
    public static void setWelaaaAudioRefreshViewUsed(Context context, String values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(PLAY_AUDIOBOOK_REFRESH_VIEW, values );
        edit.commit();

    }

    public static String getWelaaaAudioRefreshViewUsed(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(PLAY_AUDIOBOOK_REFRESH_VIEW, "0");
    }

    /************************************************************************
     * FOR PLAYER   :   AUDIO BOOK ONLY Player , WelaaaPlayAudioAutoPlayUsed ?
     ************************************************************************/
    public static void setWelaaaPlayAudioAutoPlayUsed(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(PLAY_AUDIOBOOK_DOAUTOPLAY, values );
        edit.commit();

    }

    public static Boolean getWelaaaPlayAudioAutoPlayUsed(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(PLAY_AUDIOBOOK_DOAUTOPLAY, false);
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LIST_JUMP_TIME_USE ?
     ************************************************************************/
    public static void setWelaaaPlayListTimeUsed(Context context, int values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putInt(PLAY_LIST_JUMP_TIME_USE, values );
        edit.commit();

    }

    public static int getWelaaaPlayListTimeUsed(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getInt(PLAY_LIST_JUMP_TIME_USE, 0);
    }

    /************************************************************************
     * FOR PLAYER   :   TOKEN //
     ************************************************************************/
    public static void setWelaaaLoginToken(Context context, String values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(F_TOKEN_VALUE, values );
        edit.commit();

    }

    public static String getWelaaaLoginToken(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(F_TOKEN_VALUE, "0");
    }

    /************************************************************************
     * FOR PLAYER  List Adapter : onClick End Time
     ************************************************************************/
    public static void setWelaaaPlayerOnClickEndTime(Context context, String values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(PLAY_LIST_ONCLICK_ENDTIME, values );
        edit.commit();

    }

    public static String getWelaaaPlayerOnClickEndTime(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(PLAY_LIST_ONCLICK_ENDTIME, "");
    }

    /************************************************************************
     * FOR PLAYER  List Adapter : onClick Pos
     ************************************************************************/
    public static void setWelaaaPlayerOnClickPos(Context context, int values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putInt(PLAY_LIST_ONCLICK_POS, values );
        edit.commit();

    }

    public static int getWelaaaPlayerOnClickPos(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getInt(PLAY_LIST_ONCLICK_POS, 0);
    }

    /************************************************************************
     * FOR PLAYER   :   PreView Mode , webView Confirm Check box
     ************************************************************************/
    public static void setWelaaaCustomWebViewChecked(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(PLAY_CUSTOM_WEBVIEW_CHECKED, values );
        edit.commit();

    }

    public static Boolean getWelaaaCustomWebViewChecked(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(PLAY_CUSTOM_WEBVIEW_CHECKED, false);
    }


    /************************************************************************
     * FOR PLAYER  PLAY_CLIP_TITLE_USE
     ************************************************************************/
    public static void setWelaaaPlayerClipUseTitle(Context context, String values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(PLAY_CLIP_TITLE_USE, values );
        edit.commit();

    }

    public static String getWelaaaPlayerClipUseTitle(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(PLAY_CLIP_TITLE_USE, "");
    }

    /************************************************************************
     * FOR PLAYER   :   On Home Key Event !
     ************************************************************************/
    public static void setWelaaaOnHomeKey(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(ON_HOME_KEY, values );
        edit.commit();

    }

    public static Boolean getWelaaaOnHomeKey(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(ON_HOME_KEY, false);
    }

    /************************************************************************
     * FOR PLAYER   :   POPUPVIEWWINDOW_ONCLICK !
     ************************************************************************/
    public static void setWelaaaPopupVideoWindowOnClick(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(POPUPVIEWWINDOW_ONCLICK, values );
        edit.commit();

    }

    public static Boolean getWelaaaPopupVideoWindowOnClick(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(POPUPVIEWWINDOW_ONCLICK, false);
    }

    /************************************************************************
     * FOR PLAYER   :   FOR ORIENTATION PLAYER ISPLAY ?
     ************************************************************************/
    public static void setWelaaaPlayerIsPlay(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(PLAYER_ISPLAY, values );
        edit.commit();

    }

    public static Boolean getWelaaaPlayerIsPlay(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(PLAYER_ISPLAY, false);
    }

    /************************************************************************
     * FOR LISTDOWNOLOADACTIVITY   :   FOR WelaaaMainActivity onResume !
     ************************************************************************/
    public static void setWelaaaListDownloadActivityUsePopupVideoWindow(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(LISTDOWNLOADACTIVITY_USE_POPUPVIDEOWINDOW, values );
        edit.commit();

    }

    public static Boolean getWelaaaListDownloadActivityUsePopupVideoWindow(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(LISTDOWNLOADACTIVITY_USE_POPUPVIDEOWINDOW, false);
    }

    /************************************************************************
     * FOR LISTDOWNOLOADACTIVITY   :   FOR WelaaaMainActivity onResume !
     ************************************************************************/
    public static void setWelaaaListDownloadActivityNoUsePopupVideoWindow(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(LISTDOWNLOADACTIVITY_NOUSE_POPUPVIDEOWINDOW, values );
        edit.commit();

    }

    public static Boolean getWelaaaListDownloadActivityNoUsePopupVideoWindow(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(LISTDOWNLOADACTIVITY_NOUSE_POPUPVIDEOWINDOW, false);
    }

    /************************************************************************
     * FOR FACEBOOK DEEPLINK   :   FOR FACEBOOK DEEPLINK
     ************************************************************************/
    public static void setWelaaaFaceBookDeepLink(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(FACEBOOK_DEEPLINK, values );
        edit.commit();

    }

    public static Boolean getWelaaaFaceBookDeepLink(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(FACEBOOK_DEEPLINK, false);
    }

    /************************************************************************
     * FOR PLAYER   :   New Player , PLAY_LIST_JUMP_TIME_USE ?
     ************************************************************************/
    public static void setWelaaaPlayPowerBoardCastReceiver(Context context, int values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putInt(WELAAA_POWERBOARDCAST_CURRENTTIME, values );
        edit.commit();

    }

    public static int getWelaaaPlayPowerBoardCastReceiver(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getInt(WELAAA_POWERBOARDCAST_CURRENTTIME, 0);
    }


    /************************************************************************
     * FOR FACEBOOK DEEPLINK   :   Power Off Screen Off 지식영상 재생 중
     *                              그리고 자동재생옵션 으로 다음 영상이 재생 될 때
     *                              WelaaaPlayer 에서 ListView 목차 정보를 갱신하기 위해서
     ************************************************************************/
    public static void setWelaaaPlayerScreenOffAutoPlayMode(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(WELAAA_POWERBOARDCAST_AUTOMODE, values );
        edit.commit();

    }

    public static Boolean getWelaaaPlayerScreenOffAutoPlayMode(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(WELAAA_POWERBOARDCAST_AUTOMODE, false);
    }

    /************************************************************************
     * FOR isScreenOn Off   :   WelaaaPlayer , onWindowFocusChanged 대비용
     ************************************************************************/
    public static void setWelaaaPlayerScreenOnOff(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(WELAAA_SCREEN_ONOFF, values );
        edit.commit();

    }

    public static Boolean getWelaaaPlayerScreenOnOff(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(WELAAA_SCREEN_ONOFF, false);
    }


    /************************************************************************
     * FOR adwords google , Sending URL
     ************************************************************************/
    public static void setWelaaaAdwordsUrl(Context context, String values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(WELAAA_ADWORDS_URL, values );
        edit.commit();

    }

    public static String getWelaaaAdwordsUrl(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(WELAAA_ADWORDS_URL, "");
    }

    /************************************************************************
     * FOR quick guide check    :   WelaaaMainActivity , quick Guide Check
     ************************************************************************/
    public static void setWelaaaQuickGuideCheck(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(WELAAA_VIEWGUIDE_CHECK, values );
        edit.commit();

    }

    public static Boolean getWelaaaQuickGuideCheck(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(WELAAA_VIEWGUIDE_CHECK, false);
    }

    /************************************************************************
     * FOR Logout and onResume check BottomWrap :   WelaaaMainActivity
     ************************************************************************/
    public static void setWelaaaLogoutBottomwrap(Context context, boolean values){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(WELAAA_LOGOUT_BOTTOMWRAP, values );
        edit.commit();

    }

    public static Boolean getWelaaaLogoutBottomwrap(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(WELAAA_LOGOUT_BOTTOMWRAP, false);
    }

    /************************************************************************
     * FOR PLAYER   :   Preview group key
     ************************************************************************/
    public static void setWelaaaPreviewCurrnetGroupKey(Context context, String ckey){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(WELAAA_PREVIEW_GROUPKEY, ckey );
        edit.commit();

    }

    public static String getWelaaaPreviewCurrnetGroupKey(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(WELAAA_PREVIEW_GROUPKEY, "0");
    }

    /************************************************************************
     * FOR PLAYER   :   Preview c key
     ************************************************************************/
    public static void setWelaaaPreviewCurrnetCKey(Context context, String ckey){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(WELAAA_PREVIEW_CKEY, ckey );
        edit.commit();

    }

    public static String getWelaaaPreviewCurrnetCKey(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(WELAAA_PREVIEW_CKEY, "0");
    }

    /************************************************************************
     * FOR PLAYER   :   use Preview Play
     ************************************************************************/
    public static void setWelaaaPreviewPlay(Context context, boolean type){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(WELAAA_PREVIEW_PLAY, type );
        edit.commit();

    }

    public static Boolean getWelaaaPreviewPlay(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(WELAAA_PREVIEW_PLAY, false);
    }

    /************************************************************************
     * FOR PLAYER   :   My reputation
     ************************************************************************/
    public static void setWelaaaMyReputation(Context context, String star){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(WELAAA_MYREPU_STAR, star );
        edit.commit();

    }

    public static String getWelaaaMyReputation(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(WELAAA_MYREPU_STAR, "0");
    }

    /************************************************************************
     * FOR DRAWER_MENU_ITEM   :   WELAAA_DRAWER_MENU_ITEM
     ************************************************************************/
    public static void setWelaaaDrawerMenuItem(Context context, String star){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(WELAAA_DRAWER_MENU_ITEM, star );
        edit.commit();

    }

    public static String getWelaaaDrawerMenuItem(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(WELAAA_DRAWER_MENU_ITEM, "0");
    }


    /************************************************************************
     * FOR BOTTOM PLAYER   :   WELAAA_BOTTOM_PLAYER_CKEY
     ************************************************************************/
    public static void setWelaaaBottomPlayerCkey(Context context, String ckey){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(WELAAA_BOTTOM_PLAYER_CKEY, ckey );
        edit.commit();

    }

    public static String getWelaaaBottomPlayerCkey(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(WELAAA_BOTTOM_PLAYER_CKEY, "0");
    }

    /************************************************************************
     * FOR BOTTOM PLAYER   :   WELAAA_BOTTOM_PLAYER_MODE
     ************************************************************************/
    public static void setWelaaaBottomPlayerMode(Context context, boolean type){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(WELAAA_BOTTOM_PLAYER_MODE, type );
        edit.commit();

    }

    public static boolean getWelaaaBottomPlayerMode(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(WELAAA_BOTTOM_PLAYER_MODE, false);
    }

    /************************************************************************
     * FOR My Repu  : 별점 주기 자동 제시 해제 여부 2018.02.26
     ************************************************************************/

    public static Boolean getMyreCheckBox(Context context){
        SharedPreferences pref = context.getSharedPreferences(WELAAA_MYREPU_CHECKBOX, Context.MODE_PRIVATE);
        return pref.getBoolean(WELAAA_MYREPU_CHECKBOX, true);
    }
    public static void setMyreCheckBox(Context context, Boolean value){
        SharedPreferences pref = context.getSharedPreferences(WELAAA_MYREPU_CHECKBOX, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putBoolean(WELAAA_MYREPU_CHECKBOX, value);
        edit.commit();
    }

    /************************************************************************
     * FOR API CALL    :   WELAAA_OAUTH_TOKEN
     ************************************************************************/
    public static void setWelaaaOauthToken(Context context, String token){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(WELAAA_OAUTH_TOKEN, token );
        edit.commit();

    }

    public static String getWelaaaOauthToken(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(WELAAA_OAUTH_TOKEN, "");
    }

    /************************************************************************
     * FOR webPlayerInfo    :   webPlayerInfo
     ************************************************************************/
    public static void setWelaaaWebPlayInfo(Context context, String webPlayerInfo){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = pref.edit();
        edit.putString(WELAAA_PLAYER_INFO, webPlayerInfo );
        edit.commit();

    }

    public static String getWelaaaWebPlayInfo(Context context){
        SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
        return pref.getString(WELAAA_PLAYER_INFO, "");
    }

  /************************************************************************
   * FOR User ID ( SEQ )     :   USER ID
   ************************************************************************/
  public static void setWelaaaUserId(Context context, String userId){
    SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
    SharedPreferences.Editor edit = pref.edit();
    edit.putString(WELAAA_UESR_ID, userId );
    edit.commit();

  }

  public static String getWelaaaUserId(Context context){
    SharedPreferences pref = context.getSharedPreferences(NAME, Context.MODE_PRIVATE);
    return pref.getString(WELAAA_UESR_ID, "");
  }
}
