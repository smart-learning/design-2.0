package kr.co.influential.youngkangapp.player;

import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;

import kr.co.influential.youngkangapp.util.Logger;

/**
 * 1. FileNae  : ThreadSleepFragment.java
 * 2. Package  : kr.co.influential.youngkangapp
 * 3. Comment  : 윌라 플레이어 컨트롤러의 sleepmode Thread
 * 4. 작성자   : 오키토키
 * 5. 작성일   : 2017.04. 19.
 **/

public class ThreadSleepFragment extends Fragment {
    private String TAG = "ThreadSleepFragment";
    private Context playercontext;
    private SleepThread sleepThread;

    private class SleepThread extends Thread {
        Boolean roop = true;
        private int timesleep;
        @Override
        public void run() {
        Logger.i(TAG+":SleepThread");
        while(roop){
            try {
                timesleep++;
                sleep(1000);
              // if(playercontext != null) ((WelaaaPlayer)playercontext).setControllSleepText(5000);

                if(timesleep>=20) {
                    roop = false;
                    if(playercontext != null) {
//                        ((WelaaaPlayer)playercontext).mIsPlayed = false;
//                        ((WelaaaPlayer)playercontext).mIsPlayed = true;
//                        ((WelaaaPlayer)playercontext).pause();
//                        ((WelaaaPlayer)playercontext).loadAudioContent(((WelaaaPlayer)playercontext).getCurrentPosition());
//                        ((WelaaaPlayer)playercontext).mpopupVideoService.playerServiceFunc_pause();
                    }
                }
            }catch (InterruptedException e){
                e.printStackTrace();
            }
        }
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRetainInstance(true);
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        this.playercontext = context;
    }

    @Override
    public void onDetach() {
        super.onDetach();
        playercontext = null;
    }

    public void execute(){
        sleepThread = new SleepThread();
        sleepThread.start();
    }
}


