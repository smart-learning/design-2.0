package kr.co.influential.youngkangapp.player;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import kr.co.influential.youngkangapp.R;
import kr.co.influential.youngkangapp.util.Logger;
import kr.co.influential.youngkangapp.util.Preferences;

import java.util.Timer;


/**
 * 1. FileNae  : BottomControlbarFragment.java
 * 2. Package  : kr.co.influential.youngkangapp
 * 3. Comment  : 윌라 하단 미니 플레이어
 * 4. 작성자   : 오키토키
 * 5. 작성일   : 2016.10. 06.
 **/

public class BottomControlbarFragment extends Fragment {

    String TAG="BottomControlbarFragment";
    private View mview;
    private Handler mHandler = new Handler();
    private Timer mTimer;
    private ProgressBar mprogressBar;
    public ImageButton btnplay;
    public ImageButton btnpause;
    private TextView mcurrentTime;
    private TextView mtotalTime;
    private TextView mmini_subject;
    static Boolean startTimer;
    private RelativeLayout btns;
    private GestureDetector mgestureScanner;
    private Context mcontext;
    private static final int SWIPE_MIN_DISTANCE = 50;
    private static final int SWIPE_MAX_OFF_PATH = 250;
    private static final int SWIPE_THRESHOLD_VELOCITY = 200;
    private int mSwipeDrection = 0;
    public boolean FLAG_HIDE_BOTTOMMINICONTROL = false;
    public RelativeLayout minibarloading_wrap;

    static Boolean mPreView = false;

    @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {

            if(mview!=null) mview = null;
            mview = inflater.inflate(R.layout.fragment_control, container, false);
            mcontext = getActivity();

            mprogressBar = mview.findViewById(R.id.bottomControlProgressBar);
            mprogressBar.setVisibility(ProgressBar.VISIBLE);

            mcurrentTime = mview.findViewById(R.id.mini_currentTime);
            mtotalTime = mview.findViewById(R.id.mini_totalTime);
            mmini_subject = mview.findViewById(R.id.mini_subject);

            if (mgestureScanner == null) mgestureScanner = new GestureDetector(mcontext,mGestureListener);

            mview.setOnTouchListener(new View.OnTouchListener(){
                @Override
                public boolean onTouch(View v, MotionEvent event) {
                    return mgestureScanner.onTouchEvent(event);
                }
            });

            btnInit();
            return mview;
        }

    GestureDetector.OnGestureListener mGestureListener = new GestureDetector.OnGestureListener() {

        @Override
        public boolean onDown(MotionEvent e) {
            Logger.i(TAG+":Gesture onDownl!!");
            return true;
        }

        @Override
        public void onShowPress(MotionEvent e) {
            Logger.i(TAG+":Gesture onShowPress!!");
        }

        @Override
        public boolean onSingleTapUp(MotionEvent e) {
            Logger.i(TAG+":Gesture onSingleTapUp!!");
//            if(mSwipeDrection==0)((WelaaaMainActivity) getActivity()).goCurrentPlayingPlayer();
            // 탭 플레이어 올리기
            return true;
        }

        @Override
        public boolean onScroll(MotionEvent e1, MotionEvent e2, float distanceX, float distanceY) {
            //Logger.i(TAG+":Gesture onScroll!!");
            return true;
        }

        @Override
        public void onLongPress(MotionEvent e) {
            Logger.i(TAG+":Gesture onLongPress!!");
        }

        @Override
        public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX, float velocityY) {
            float dd = e1.getX() - e2.getX();
            Logger.i(TAG+":Gesture onFling!! [e1왼쪽]:"+e1.getX()+" [e2오른쪽]:"+e2.getX()+"====>[MIN] "+dd);

            if(Math.abs(e1.getY() - e2.getY()) > SWIPE_MAX_OFF_PATH) return false;

            if(e1.getX() - e2.getX() > SWIPE_MIN_DISTANCE){
                mSwipeDrection = 1;
                hideBottomcontrol(mSwipeDrection);
                Preferences.setWelaaaPlayerSleepMode(getActivity(), false);
                Preferences.setWelaaaPlayAudioUsed(getActivity() , false);
                Logger.i(TAG+"leftSwipeDrection");

            }else if(e2.getX() - e1.getX() > SWIPE_MIN_DISTANCE){
                mSwipeDrection = 2;
                hideBottomcontrol(mSwipeDrection);
                Preferences.setWelaaaPlayerSleepMode(getActivity(), false);
                Preferences.setWelaaaPlayAudioUsed(getActivity() , false);
                Logger.i(TAG+"rightSwipeDrection");
            }
            return true;
        }
    };
    public void btnInit(){
        minibarloading_wrap = mview.findViewById(R.id.minibarloading_wrap);
        btns = mview.findViewById(R.id.botom_btn_wrap);
        minibarloading_wrap.setVisibility(View.INVISIBLE);
        btns.setVisibility(View.VISIBLE);
        mmini_subject.setText("");
    }


    public void stopTimer(){
        if (mTimer != null) {
            mTimer.cancel();
            mTimer = null;
        }
    }

    public void hideBottomcontrol(int derection){
        FLAG_HIDE_BOTTOMMINICONTROL = true;
    }



    @Override
    public void onStart() {
        Logger.i(TAG+":onStart");
        super.onStart();
    }

    @Override
    public void onResume() {
        Logger.i(TAG+": 20170901 onResume");
        FLAG_HIDE_BOTTOMMINICONTROL=false;
        super.onResume();
    }

    @Override
    public void onPause() {
        Logger.i(TAG+":onPause");
        super.onPause();
    }

    @Override
    public void onStop() {
        Logger.i(TAG+":onStop");
        stopTimer();
        startTimer=false;
        mmini_subject.setText("");
        mSwipeDrection=0;
        super.onStop();
    }

    @Override
    public void onDestroy() {
        Logger.i(TAG+":onDestroy");
        super.onDestroy();
    }
}