package com.welaaav2.player;

/**
 * 1. FileNae  : SubtitlsInfo.java
 * 2. Package  : kr.co.influential.youngkangapp.player
 * 3. Comment  : 자막 INFO
 * 4. 작성자   : 오키토키
 * 5. 작성일   : 2016.11. 7.
 **/

public class SubtitlsInfo {
    private String mSubtitls;
    private int[] mtime;
    private String[] mmemo = null;
    public SubtitlsInfo(String subtitls)
    {
        mSubtitls = subtitls;
        init();
    }

    public void init(){
        String[] values = mSubtitls.split("&");

        mmemo = mSubtitls.split("memo=");
        mtime = new int[mmemo.length];

        int i = 0;
        int j = 0;

        for (String txt : values) {

            if (txt.startsWith("time=")) {

                String bb = txt.substring("time=".length());
                int aa = Integer.parseInt(bb);
                mtime[i] = aa;
                ++i;

            }else if(txt.startsWith("memo=")) {

                mmemo[j] = txt.substring("memo=".length());
                ++j;
            }
        }
    }

    public int[] getTime(){
     return mtime;
    }
    public String[] getMemo(){
        return mmemo;
    }
}
