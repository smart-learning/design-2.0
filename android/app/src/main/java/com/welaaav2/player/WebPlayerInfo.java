package com.welaaav2.player;

import com.welaaav2.util.Logger;

import java.io.Serializable;

/**
 * 1. FileNae  : WebPlayerInfo.java
 * 2. Package  : kr.co.influential.youngkangapp.player
 * 3. Comment  : 플레이어 리스트 정보 (group Id)
 * 4. 작성자   : 오키토키
 * 5. 작성일   : 2016.10. 06.
 **/

public class WebPlayerInfo implements Serializable {

    private String TAG = "WebPlayerInfo";
    private boolean isNative = false;
    private boolean isFile = false;

    //강좌 정보
    private String groupId;
    private String group_title;
    private String group_memo;
    private String group_teachername;
    private String group_teachermemo;
    private String group_img;
    private String group_previewcontent;
    private String allplay_time;
    private String contentscnt;
    private String likecnt;
    private String hitcnt;
    private String zzimcnt;
    private String staravg;
    private String con_class;

    private String downloadcnt;

    private String audiobookbuy;
    private String audiobookbuy_limitdate;

    //강의 정보
    private String[] ckey;
    private String[] cname;
    private String[] cmemo;
    private String[] curl;
    private String[] cplay_time;
    private String[] cpay;
    private String[] cpay_money;
    private String[] clist_img;
    private String[] chitcnt;
    private String[] csmi;

    private String[] a_depth;
    private String[] history_endtime;

    private String[] first_play;
    private String[] calign;

    private String[] audio_preview;



    public WebPlayerInfo(String data){
        playerInfoSet(data);
    }

    public void playerInfoSet(String data) {

        String params = data;
        String[] paramArray = params.split("&");

        ckey = new String[params.split("ckey=").length-1];

        cname = new String[params.split("cname=").length-1];

        cmemo = new String[params.split("cmemo=").length-1];

        curl = new String[params.split("curl=").length-1];

        cplay_time = new String[params.split("cplay_time=").length-1];

        cpay = new String[params.split("cpay=").length-1];

        cpay_money = new String[params.split("cpay_money=").length-1];

        clist_img = new String[params.split("clist_img=").length-1];

        chitcnt = new String[params.split("chitcnt=").length-1];

        csmi = new String[params.split("csmi=").length-1];

        a_depth = new String[params.split("a_depth=").length-1];

        history_endtime = new String[params.split("history_endtime=").length-1];

        first_play = new String[params.split("first_play=").length-1];
        calign = new String[params.split("calign=").length-1];
        audio_preview = new String[params.split("audio_preview=").length-1];

        int arr1Idx = 0;int arr2Idx = 0;int arr3Idx = 0;int arr4Idx = 0;int arr5Idx = 0;int arr6Idx = 0;int arr7Idx = 0;int arr8Idx = 0;int arr9Idx = 0; int arr10Idx=0;
        int arr11Idx = 0;int arr12Idx = 0; int arr13Idx = 0; int arr14Idx = 0; int arr15Idx = 0;

        for (String param : paramArray) {

            if (param.startsWith("group_title=")) {

                String _group_title = param.substring("group_title=".length());
                setGroupTitle(_group_title);
                Logger.i(TAG + " : grop_title:"+_group_title);

            }else if (param.startsWith("group_memo=")){

                String _group_memo = param.substring("group_memo=".length());
                setGroupMemo(_group_memo);
                Logger.i(TAG + " : group_memo:"+_group_memo);

            }else if (param.startsWith("group_teachername=")){

                String _group_teachername = param.substring("group_teachername=".length());
                setGroupTeachername(_group_teachername);
                Logger.i(TAG + " : group_teachername:"+_group_teachername);

            }else if (param.startsWith("group_teachermemo=")){

                String _group_teachermemo = param.substring("group_teachermemo=".length());
                setGroupTeachermemo(_group_teachermemo);
                Logger.i(TAG + " : group_teachermemo:"+_group_teachermemo);

            }else if (param.startsWith("group_img=")){

                String _group_img = param.substring("group_img=".length());
                setGroupImg(_group_img);
                Logger.i(TAG + " : group_img:"+_group_img);

            }else if (param.startsWith("group_previewcontent=")){

                String _group_previewcontent = param.substring("group_previewcontent=".length());
                setGroupPreviewcontent(_group_previewcontent);
                Logger.i(TAG + " : group_previewcontent:"+_group_previewcontent);

            }else if (param.startsWith("allplay_time=")){

                String _allplay_time = param.substring("allplay_time=".length());
                setAllplayTime(_allplay_time);
                Logger.i(TAG + " : allplay_time:"+_allplay_time);

            }else if (param.startsWith("contentscnt=")){

                String _contentscnt = param.substring("contentscnt=".length());
                setContentScnt(_contentscnt);
                Logger.i(TAG + " : contentscnt:"+_contentscnt);

            }else if (param.startsWith("hitcnt=")){

                String _hitcnt = param.substring("hitcnt=".length());
                setHitCnt(_hitcnt);
                Logger.i(TAG + " : hitcnt:"+_hitcnt);

            }else if (param.startsWith("likecnt=")){

                String _likecnt = param.substring("likecnt=".length());
                setLikeCnt(_likecnt);
                Logger.i(TAG + " : likecnt:"+_likecnt);

            }else if (param.startsWith("zzimcnt=")){

                String _zzimcnt = param.substring("zzimcnt=".length());
                setZzimcnt(_zzimcnt);
                Logger.i(TAG + " : zzimcnt:"+_zzimcnt);

            }else if (param.startsWith("staravg=")){

                String _staravg = param.substring("staravg=".length());
                setStaravg(_staravg);
                Logger.i(TAG + " : staravg:"+_staravg);

            }else if (param.startsWith("con_class=")){

                String _con_class = param.substring("con_class=".length());
                setCon_class(_con_class);
                Logger.i(TAG + " : con_class:"+_con_class);

            }else if(param.startsWith("ckey=")){

                String _ckey = param.substring("ckey=".length());
                ckey[arr1Idx]= _ckey;
                Logger.i(TAG + " : ckey:" + ckey[arr1Idx]);
                ++arr1Idx;

            }else if(param.startsWith("cname=")){

                String _cname= param.substring("cname=".length());
                cname[arr2Idx]=_cname;
                Logger.i(TAG + " : cname:" + cname[arr2Idx]);
                ++arr2Idx;

            }else if(param.startsWith("cmemo=")){

                String _cmemo = param.substring("cmemo=".length());
                cmemo[arr3Idx]=_cmemo;
                Logger.i(TAG + " : cmemo:" + cmemo[arr3Idx]);
                ++arr3Idx;

            }else if(param.startsWith("curl=")){

                String _curl = param.substring("curl=".length());
                curl[arr4Idx]=_curl;
                Logger.i(TAG + " : curl:" + curl[arr4Idx]);
                ++arr4Idx;

            }else if(param.startsWith("cplay_time=")){
                String _csmi = param.substring("cplay_time=".length());
                cplay_time[arr5Idx]=_csmi;
                Logger.i(TAG + " : cplay_time:" + cplay_time[arr5Idx]);
                ++arr5Idx;

            }else if(param.startsWith("cpay=")){
                String _csmi = param.substring("cpay=".length());
                cpay[arr6Idx]=_csmi;
                Logger.i(TAG + " : cpay:" + cpay[arr6Idx]);
                ++arr6Idx;

            }else if(param.startsWith("cpay_money=")){
                String _cpay_money = param.substring("cpay_money=".length());
                cpay_money[arr7Idx]= _cpay_money;
                Logger.i(TAG + " : cpay_money:" + cpay_money[arr7Idx]);
                ++arr7Idx;

            }else if(param.startsWith("chitcnt=")){
                String _chitcnt = param.substring("chitcnt=".length());
                chitcnt[arr8Idx]= _chitcnt;
                Logger.i(TAG + " : chitcnt:" + chitcnt[arr8Idx]);
                ++arr8Idx;
            }else if(param.startsWith("csmi=")){
                String _csmi = param.substring("csmi=".length());
                csmi[arr9Idx]= _csmi;
                Logger.i("csmi:" + csmi[arr9Idx]);
                ++arr9Idx;
            }else if(param.startsWith("clist_img=")){
                String _clist_img = param.substring("clist_img=".length());
                clist_img[arr10Idx]= _clist_img;
                Logger.i(TAG + " : clist_img:" + clist_img[arr10Idx]);
                ++arr10Idx;
            }else if(param.startsWith("a_depth=")) {
                String _a_depth = param.substring("a_depth=".length());
                a_depth[arr11Idx] = _a_depth;
                Logger.i(TAG + " : a_depth:" + a_depth[arr11Idx]);
                ++arr11Idx;
            }
            else if(param.startsWith("history_endtime=")) {
                String _history_endtime = param.substring("history_endtime=".length());
                history_endtime[arr12Idx] = _history_endtime;
                Logger.i(TAG + " : history_endtime:" + history_endtime[arr12Idx]);
                ++arr12Idx;
            }
            else if(param.startsWith("first_play=")) {
                String _first_play = param.substring("first_play=".length());
                first_play[arr13Idx] = _first_play;
                Logger.i(TAG + " : first_play:" + first_play[arr13Idx]);
                ++arr13Idx;
            }
            else if(param.startsWith("calign=")) {
                String _calign = param.substring("calign=".length());
                calign[arr14Idx] = _calign;
                Logger.i(TAG + " : calign:" + calign[arr14Idx]);
                ++arr14Idx;
            }
            else if(param.startsWith("downloadcnt=")) {
                String _downloadcnt = param.substring("downloadcnt=".length());
                setDownloadcnt(_downloadcnt);
            }
            else if(param.startsWith("audio_preview=")) {
                String _audio_preview = param.substring("audio_preview=".length());
                audio_preview[arr15Idx] = _audio_preview;
                Logger.i(TAG + " : audio_preview:" + audio_preview[arr15Idx]);
                ++arr15Idx;
            }
            else if(param.startsWith("audiobookbuy=")) {
                String _audiobookbuy = param.substring("audiobookbuy=".length());
                setAudiobookbuy(_audiobookbuy);

            }
            else if(param.startsWith("audiobookbuy_limitdate=")) {
                String _audiobookbuy_limitdate = param.substring("audiobookbuy_limitdate=".length());
                setAudiobookbuy_limitdate(_audiobookbuy_limitdate);
            }
        }
    }

    public void setGroupId(String str){
        this.groupId=str;
    }
    public String getGroupId (){
        return this.groupId;
    }

    public void setGroupTitle(String str){
        this.group_title=str;
    }
    public String getGroupTitle (){
        return this.group_title;
    }

    public void setGroupMemo(String str){
        this.group_memo=str;
    }
    public String geGroupMemo (){
        return this.group_memo;
    }

    public void setGroupTeachername(String str){
        this.group_teachername=str;
    }
    public String getGroupTeachername (){
        return this.group_teachername;
    }

    public void setGroupTeachermemo(String str){
        this.group_teachermemo=str;
    }
    public String getGroupTeachermemo (){
        return this.group_teachermemo;
    }

    public void setGroupImg(String str){
        this.group_img=str;
    }
    public String getGroupImg (){
        return this.group_img;
    }

    public void setGroupPreviewcontent(String str){
        this.group_previewcontent=str;
    }
    public String getGroupPreviewcontent (){ return this.group_previewcontent;}

    public void setAllplayTime(String str){
        this.allplay_time=str;
    }
    public String getAllplayTime (){ return this.allplay_time;}

    public void setContentScnt(String str){
        this.contentscnt=str;
    }
    public String getContentScnt (){
        return this.contentscnt;
    }

    public void setHitCnt(String str){
        this.hitcnt=str;
    }
    public String getHitCnt(){
        return this.hitcnt;
    }

    public void setLikeCnt(String str){
        this.likecnt=str;
    }
    public String getLikeCnt(){
        return this.likecnt;
    }

    public void setZzimcnt(String str){
        this.zzimcnt=str;
    }
    public String getZzimcnt(){
        return this.zzimcnt;
    }

    public void setStaravg(String str){
        this.staravg=str;
    }
    public String getStaravg(){return this.staravg;}

    public void setCon_class(String str){ this.con_class= str; }
    public String getCon_class(){return this.con_class;}

    public String[] getCkey(){ return  ckey;}
    public String[] getCname(){ return  cname;}
    public String[] getCmemo(){ return  cmemo;}
    public String[] getCurl(){ return curl;}
    public String[] getCplayTime(){ return  cplay_time;}
    public String[] getCpay(){ return  cpay;}
    public String[] getCpayMoney(){ return  cpay_money;}
    public String[] getChitcnt(){ return  chitcnt;}
    public String[] getCsmi(){ return csmi;}
    public String[] getClist_img(){ return clist_img;}

    public String[] getA_depth() {
        return a_depth;
    }
    public String[] getHistory_endtime() {
        return history_endtime;
    }

    public String[] getFirst_play() {
        return first_play;
    }

    public String[] getCalign() {
        return calign;
    }

    public void setCalign(String[] calign) {
        this.calign = calign;
    }

    public String getDownloadcnt() {
        return downloadcnt;
    }

    public void setDownloadcnt(String downloadcnt) {
        this.downloadcnt = downloadcnt;
    }

    public String[] getAudio_preview() {
        return audio_preview;
    }

    public void setAudio_preview(String[] audio_preview) {
        this.audio_preview = audio_preview;
    }

    public String getAudiobookbuy() {
        return audiobookbuy;
    }

    public void setAudiobookbuy(String audiobookbuy) {
        this.audiobookbuy = audiobookbuy;
    }

    public String getAudiobookbuy_limitdate() {
        return audiobookbuy_limitdate;
    }

    public void setAudiobookbuy_limitdate(String audiobookbuy_limitdate) {
        this.audiobookbuy_limitdate = audiobookbuy_limitdate;
    }
}
