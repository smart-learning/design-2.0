package kr.co.influential.youngkangapp.player;

import android.os.AsyncTask;
import android.os.Build;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * 1. FileNae  : SubtitlsJeson.java
 * 2. Package  : kr.co.influential.youngkangapp.player
 * 3. Comment  : 자막 INFO JASON
 * 4. 작성자   : 오키토키
 * 5. 작성일   : 2016.10. 26.
 **/

public class SubtitlsJeson {

    private String mJasonurl;
    public SubtitlsJeson(String url, PlayerActivity playercontroller){

//      url = "http://welearn.co.kr/usingapp/contentsinfo.php?groupkey=6";
        mJasonurl = url;

        if(Build.VERSION.SDK_INT >= 11){
            new JsonLoadingTask(playercontroller).executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
        }
        else{
            new JsonLoadingTask(playercontroller).execute();
        }

    }
    public class JsonLoadingTask extends AsyncTask<String, Void, String> {
        private PlayerActivity mplayerController;

        public JsonLoadingTask(PlayerActivity playerController)
        {
            this.mplayerController = playerController;
        }
        @Override
        protected String doInBackground(String... strs) {
            return getJsonText();
        } // doInBackground : 백그라운드 작업을 진행한다.
        @Override
        protected void onPostExecute(String result) {
            mplayerController.setSubtitls(result);
        } // onPostExecute : 백그라운드 작업이 끝난 후 UI 작업을 진행한다.
    } // JsonLoadingTask

    /**
     * 원격으로부터 JSON형태의 문서를 받아서
     * JSON 객체를 생성한 다음에 객체에서 필요한 데이터 추출
     */
    public String getJsonText() {

        StringBuffer sb = new StringBuffer();
        try {
            //주어진 URL 문서의 내용을 문자열로 얻는다.

            String jsonPage = getStringFromUrl(mJasonurl);

            //읽어들인 JSON포맷의 데이터를 JSON객체로 변환
            JSONArray jArr = new JSONArray(jsonPage);

            //배열의 크기만큼 반복하면서, ksNo과 korName의 값을 추출함
            for (int i=0; i<jArr.length(); i++){

                JSONObject jObject = jArr.getJSONObject(i);
                //값을 추출함
                String time = jObject.getString("time");
                String memo = jObject.getString("memo");

//                System.out.println();

                //StringBuffer 출력할 값을 저장
                sb.append("&time="+time);
                sb.append("&memo="+memo);
            }

        } catch (Exception e) {
            // TODO: handle exception
        }

        return sb.toString();
    }

    // getStringFromUrl : 주어진 URL의 문서내용을 문자열로 변환
    public String getStringFromUrl(String pUrl){

        BufferedReader bufreader=null;
        HttpURLConnection urlConnection = null;

        StringBuffer page=new StringBuffer(); //읽어온 데이터를 저장할 StringBuffer객체 생성

        try {
            URL url= new URL(pUrl);
            urlConnection = (HttpURLConnection) url.openConnection();
            InputStream contentStream = urlConnection.getInputStream();

            bufreader = new BufferedReader(new InputStreamReader(contentStream,"UTF-8"));
            String line = null;

            //버퍼의 웹문서 소스를 줄단위로 읽어(line), Page에 저장함
            while((line = bufreader.readLine())!=null){
                Log.d("line:",line);
                page.append(line);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }finally{
            //자원해제
            try {
                bufreader.close();
                urlConnection.disconnect();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }

        return page.toString();
    }

}
