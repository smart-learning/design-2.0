package com.welaaav2.player;

import com.welaaav2.util.Logger;

import java.io.Serializable;

/**
 * 1. FileNae  : NewWebPlayerInfo.java
 * 2. Package  : kr.co.influential.youngkangapp.player
 * 3. Comment  : 플레이어 리스트 정보 (group Id)
 * 4. 작성자   : woohyuk
 * 5. 작성일   : 2017.05. 22.
 **/

public class NewWebPlayerInfo implements Serializable {

    private String TAG = "NewWebPlayerInfo";
    private boolean isNative = false;
    private boolean isFile = false;

    //지식 영상 정보
    private String[] group_title;
    private String[] group_teachername;
    private String[] con_class;
    private String[] end_time;
    private String[] group_key;

    private String[] group_img;
    private String[] group_likecnt;
    private String[] group_hitcnt;
    private String[] group_zzimcnt;
    private String[] ckey;

    //강의 정보
    private String[] cmemo;
    private String[] cname;
    private String[] clist_img;
    private String[] curl;
    private String[] cplay_time;

    private String[] cpay;
    private String[] cpay_money;
    private String[] ccon_class;
    private String[] csmi;

    private String[] listkey;

    public NewWebPlayerInfo(String data){
        playerInfoSet(data);
    }

    public void playerInfoSet(String data) {

        String params = data;
        String[] paramArray = params.split("&");

        listkey = new String[params.split("listkey=").length-1];

        group_title = new String[params.split("grouptitle=").length-1];
        group_teachername = new String[params.split("teachername=").length-1];
        con_class = new String[params.split("con_class=").length-1];
        end_time = new String[params.split("end_time=").length-1];
        group_key = new String[params.split("groupkey=").length-1];

        group_img = new String[params.split("group_img=").length-1];
        group_hitcnt = new String[params.split("group_hitcnt=").length-1];
        group_likecnt = new String[params.split("group_likecnt=").length-1];
        group_zzimcnt = new String[params.split("group_zzimcnt=").length-1];
        ckey = new String[params.split("ckey=").length-1];

        cname = new String[params.split("cname=").length-1];
        cmemo = new String[params.split("cmemo=").length-1];
        clist_img = new String[params.split("clist_img=").length-1];
        curl = new String[params.split("curl=").length-1];
        cplay_time = new String[params.split("cplay_time=").length-1];

        cpay = new String[params.split("cpay=").length-1];
        cpay_money = new String[params.split("cpay_money=").length-1];
        ccon_class = new String[params.split("ccon_class=").length-1];
        csmi = new String[params.split("csmi=").length-1];


        int arr1Idx = 0;int arr2Idx = 0;int arr3Idx = 0;int arr4Idx = 0;int arr5Idx = 0;int arr6Idx = 0;int arr7Idx = 0;int arr8Idx = 0;int arr9Idx = 0; int arr10Idx=0;
        int arr11Idx=0; int arr12Idx=0; int arr13Idx=0; int arr14Idx=0;int arr15Idx=0;int arr16Idx=0;int arr17Idx=0;int arr18Idx=0;int arr19Idx=0;
        int arr20Idx=0;

        for (String param : paramArray) {

            if(param.startsWith("listkey=")) {
                String _listkey = param.substring("listkey=".length());
                csmi[arr20Idx] = _listkey;
                Logger.i(TAG + " : listkey:" + csmi[arr20Idx]);
                ++arr20Idx;
            }else if (param.startsWith("grouptitle=")) {

                String _group_title = param.substring("grouptitle=".length());
                group_title[arr1Idx]= _group_title;
                Logger.i(TAG + " : grouptitle:"+_group_title);
                ++arr1Idx;

            }else if (param.startsWith("teachername=")){

                String _group_teachername = param.substring("teachername=".length());
                group_teachername[arr2Idx]= _group_teachername;
                Logger.i(TAG + " : teachername:"+_group_teachername);
                ++arr2Idx;

            }else if(param.startsWith("con_class=")){

                String _con_class = param.substring("con_class=".length());
                con_class[arr3Idx]= _con_class;
                Logger.i(TAG + " : con_class:" + _con_class);
                ++arr3Idx;

            }else if(param.startsWith("end_time=")){

                String _end_time= param.substring("end_time=".length());
                end_time[arr4Idx]=_end_time;
                Logger.i(TAG + " : end_time:" + _end_time);
                ++arr4Idx;

            }else if(param.startsWith("groupkey=")){

                String _groupkey = param.substring("groupkey=".length());
                group_key[arr5Idx]=_groupkey;
                Logger.i(TAG + " : groupkey:" + group_key[arr5Idx]);
                ++arr5Idx;

            }else if(param.startsWith("group_img=")){

                String _group_img = param.substring("group_img=".length());
                group_img[arr6Idx]=_group_img;
                Logger.i(TAG + " : curl:" + group_img[arr6Idx]);
                ++arr6Idx;

            }else if(param.startsWith("group_hitcnt=")){
                String _group_hitcnt = param.substring("group_hitcnt=".length());
                group_hitcnt[arr7Idx]=_group_hitcnt;
                Logger.i(TAG + " : group_hitcnt:" + group_hitcnt[arr7Idx]);
                ++arr7Idx;

            }else if(param.startsWith("group_likecnt=")){
                String _group_likecnt = param.substring("group_likecnt=".length());
                group_likecnt[arr8Idx]=_group_likecnt;
                Logger.i(TAG + " : group_likecnt:" + group_likecnt[arr8Idx]);
                ++arr8Idx;

            }else if(param.startsWith("group_zzimcnt=")){
                String _group_zzimcnt = param.substring("group_zzimcnt=".length());
                group_zzimcnt[arr9Idx]= _group_zzimcnt;
                Logger.i(TAG + " : group_zzimcnt:" + group_zzimcnt[arr9Idx]);
                ++arr9Idx;

            }else if(param.startsWith("ckey=")){
                String _ckey = param.substring("ckey=".length());
                ckey[arr10Idx]= _ckey;
                Logger.i(TAG + " : ckey:" + ckey[arr10Idx]);
                ++arr10Idx;
            }else if(param.startsWith("cname=")){
                String _cname = param.substring("cname=".length());
                cname[arr11Idx]= _cname;
                Logger.i("cname:" + cname[arr11Idx]);
                ++arr11Idx;
            }else if(param.startsWith("cmemo=")){
                String _cmemo = param.substring("cmemo=".length());
                cmemo[arr12Idx]= _cmemo;
                Logger.i(TAG + " : cmemo:" + cmemo[arr12Idx]);
                ++arr12Idx;
            }else if(param.startsWith("clist_img=")) {
                String _clist_img = param.substring("clist_img=".length());
                clist_img[arr13Idx] = _clist_img;
                Logger.i(TAG + " : clist_img:" + clist_img[arr13Idx]);
                ++arr13Idx;
            }else if(param.startsWith("curl=")) {
                String _curl = param.substring("curl=".length());
                curl[arr14Idx] = _curl;
                Logger.i(TAG + " : curl:" + curl[arr14Idx]);
                ++arr14Idx;
            }else if(param.startsWith("cplay_time=")) {
                String _cplay_time = param.substring("cplay_time=".length());
                cplay_time[arr15Idx] = _cplay_time;
                Logger.i(TAG + " : cplay_time:" + cplay_time[arr15Idx]);
                ++arr15Idx;
            }else if(param.startsWith("cpay=")) {
                String _cpay = param.substring("cpay=".length());
                cpay[arr16Idx] = _cpay;
                Logger.i(TAG + " : cpay:" + cpay[arr16Idx]);
                ++arr16Idx;
            }else if(param.startsWith("cpay_money=")) {
                String _cpay_money = param.substring("cpay_money=".length());
                cpay_money[arr17Idx] = _cpay_money;
                Logger.i(TAG + " : cpay_money:" + cpay_money[arr17Idx]);
                ++arr17Idx;
            }else if(param.startsWith("ccon_class=")) {
                String _ccon_class = param.substring("ccon_class=".length());
                ccon_class[arr18Idx] = _ccon_class;
                Logger.i(TAG + " : ccon_class:" + ccon_class[arr18Idx]);
                ++arr18Idx;
            }else if(param.startsWith("csmi=")) {
                String _csmi = param.substring("csmi=".length());
                csmi[arr19Idx] = _csmi;
                Logger.i(TAG + " : csmi:" + csmi[arr19Idx]);
                ++arr19Idx;
            }
        }
    }

    public String[] getGroup_title() {
        return group_title;
    }

    public void setGroup_title(String[] group_title) {
        this.group_title = group_title;
    }

    public String[] getGroup_teachername() {
        return group_teachername;
    }

    public void setGroup_teachername(String[] group_teachername) {
        this.group_teachername = group_teachername;
    }

    public String[] getCon_class() {
        return con_class;
    }

    public void setCon_class(String[] con_class) {
        this.con_class = con_class;
    }

    public String[] getEnd_time() {
        return end_time;
    }

    public void setEnd_time(String[] end_time) {
        this.end_time = end_time;
    }

    public String[] getGroup_key() {
        return group_key;
    }

    public void setGroup_key(String[] group_key) {
        this.group_key = group_key;
    }

    public String[] getGroup_img() {
        return group_img;
    }

    public void setGroup_img(String[] group_img) {
        this.group_img = group_img;
    }

    public String[] getGroup_hitcnt() {
        return group_hitcnt;
    }

    public void setGroup_hitcnt(String[] group_hitcnt) {
        this.group_hitcnt = group_hitcnt;
    }

    public String[] getGroup_zzimcnt() {
        return group_zzimcnt;
    }

    public void setGroup_zzimcnt(String[] group_zzimcnt) {
        this.group_zzimcnt = group_zzimcnt;
    }

    public String[] getCkey() {
        return ckey;
    }

    public void setCkey(String[] ckey) {
        this.ckey = ckey;
    }

    public String[] getCmemo() {
        return cmemo;
    }

    public void setCmemo(String[] cmemo) {
        this.cmemo = cmemo;
    }

    public String[] getClist_img() {
        return clist_img;
    }

    public void setClist_img(String[] clist_img) {
        this.clist_img = clist_img;
    }

    public String[] getCurl() {
        return curl;
    }

    public void setCurl(String[] curl) {
        this.curl = curl;
    }

    public String[] getCplay_time() {
        return cplay_time;
    }

    public void setCplay_time(String[] cplay_time) {
        this.cplay_time = cplay_time;
    }

    public String[] getCpay() {
        return cpay;
    }

    public void setCpay(String[] cpay) {
        this.cpay = cpay;
    }

    public String[] getCpay_money() {
        return cpay_money;
    }

    public void setCpay_money(String[] cpay_money) {
        this.cpay_money = cpay_money;
    }

    public String[] getCcon_class() {
        return ccon_class;
    }

    public void setCcon_class(String[] ccon_class) {
        this.ccon_class = ccon_class;
    }

    public String[] getCsmi() {
        return csmi;
    }

    public void setCsmi(String[] csmi) {
        this.csmi = csmi;
    }

    public String[] getGroup_likecnt() {
        return group_likecnt;
    }

    public void setGroup_likecnt(String[] group_likecnt) {
        this.group_likecnt = group_likecnt;
    }

    public String[] getCname() {
        return cname;
    }

    public void setCname(String[] cname) {
        this.cname = cname;
    }

    public String[] getListkey() {
        return listkey;
    }

    public void setListkey(String[] listkey) {
        this.listkey = listkey;
    }
}
