package kr.co.influential.youngkangapp.util;

import static android.view.View.VISIBLE;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import java.io.InputStream;
import kr.co.influential.youngkangapp.R;

public class CustomDialog extends Dialog {

    private final String WELEARN_WEB_URL = Utils.welaaaApiBaseUrl();
    private final String TAG = "CustomDialog";

    private String mTitle;
    private String mContent;
    private String mRightButtonName;
    private String mLeftButtonName;
    private int mType;
    private String mCkey;

    private String mThumbNailUrl;

    private String mRelatedView;

    private View.OnClickListener mRightListener;
    private View.OnClickListener mLeftListener;
    private View.OnClickListener mSingleListener;
    private Context mAppcontext=null;

    private ProgressBar mProgressBar;
    private int mRemainTime;
    private int mTotalTime;

    public CustomDialog(Context context) {
        super(context,android.R.style.Theme_Translucent_NoTitleBar);

    }

    public CustomDialog(Context context, String title, String content, View.OnClickListener singleListener
            , int type , String ckey , String thumbNailUrl ) {
        super(context,android.R.style.Theme_Translucent_NoTitleBar);
        this.mTitle = title;
        this.mContent = content;
        this.mSingleListener = singleListener;
        this.mType = type;
        this.mCkey = ckey;
        this.mThumbNailUrl = thumbNailUrl;

        mAppcontext = context;
    }

    public CustomDialog(Context context, String title, String content, View.OnClickListener singleListener
            , int type , String ckey , String thumbNailUrl , int remainTime) {
        super(context,android.R.style.Theme_Translucent_NoTitleBar);
        this.mTitle = title;
        this.mContent = content;
        this.mSingleListener = singleListener;
        this.mType = type;
        this.mCkey = ckey;
        this.mThumbNailUrl = thumbNailUrl;
        this.mRemainTime = remainTime;

        mAppcontext = context;
    }

    public CustomDialog(Context context, String title, String content, String rightListenenrName, String leftListenerName,
                        View.OnClickListener rightListener, View.OnClickListener leftListener) {
        super(context,android.R.style.Theme_Translucent_NoTitleBar);
        this.mTitle = title;
        this.mContent = content;
        this.mRightButtonName = rightListenenrName;
        this.mLeftButtonName = leftListenerName;
        this.mRightListener = rightListener;
        this.mLeftListener = leftListener;

        mAppcontext = context;
    }

    public CustomDialog(Context context, String title, String content, String rightListenenrName, String leftListenerName,
                        View.OnClickListener rightListener, View.OnClickListener leftListener , String relatedView) {
        super(context,android.R.style.Theme_Translucent_NoTitleBar);
        this.mTitle = title;
        this.mContent = content;
        this.mRightButtonName = rightListenenrName;
        this.mLeftButtonName = leftListenerName;
        this.mRightListener = rightListener;
        this.mLeftListener = leftListener;
        this.mRelatedView = relatedView;

        mAppcontext = context;
    }

    public CustomDialog(Context context, String title, String content, String rightListenenrName, String leftListenerName,
                        View.OnClickListener rightListener, View.OnClickListener leftListener , String relatedView , int remainTime) {
        super(context,android.R.style.Theme_Translucent_NoTitleBar);
        this.mTitle = title;
        this.mContent = content;
        this.mRightButtonName = rightListenenrName;
        this.mLeftButtonName = leftListenerName;
        this.mRightListener = rightListener;
        this.mLeftListener = leftListener;
        this.mRelatedView = relatedView;
        this.mRemainTime = remainTime;

        mAppcontext = context;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if(mSingleListener!=null){
            WindowManager.LayoutParams lpWindow = new WindowManager.LayoutParams();
            lpWindow.flags = WindowManager.LayoutParams.FLAG_DIM_BEHIND;
            lpWindow.dimAmount = 0.3f;

            getWindow().setAttributes(lpWindow);
            // 커스트마이징 처리 2017.11.13
            // 백그라운드 dim 값을 조정 했습니다. 보이질 않아요 ;
            setContentView(R.layout.welean_myrepu_dialog);

            mProgressBar = findViewById(R.id.myrepu_progress_bar);
            mProgressBar.setVisibility(ProgressBar.VISIBLE);

            CheckBox myRepuCheck = findViewById (R.id.myrepu_check_box);

            if(Preferences.getMyreCheckBox(getContext())){
                myRepuCheck.setChecked(true);
            }

            myRepuCheck.setOnCheckedChangeListener(new CheckBox.OnCheckedChangeListener() {

                @Override
                public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                    if(isChecked){
                        Preferences.setMyreCheckBox(getContext() , true);

                        Logger.e(TAG + " 20170904 setOnCheckedChangeListener is " + Preferences.getMyreCheckBox(getContext()));
                    }else{
                        Preferences.setMyreCheckBox(getContext() , false);

                        Logger.e(TAG + " 20170904 setOnCheckedChangeListener is " + Preferences.getMyreCheckBox(getContext()));
                    }
                }
            });



            TextView title = findViewById(R.id.modal_title);
            TextView content = findViewById(R.id.modal_contnet);
            ImageView next_progress_rectangle = findViewById(R.id.next_progress_rectangle);

            // 텍스트는 거꾸로
            title.setText(mContent);
            content.setText(mTitle);

            if(mType==2){

                RelativeLayout progressNext = findViewById(R.id.welean_myrepu_dialog_right_progress);

//                if(!mThumbNailUrl.equals("")){
//
//                    progressNext.setVisibility(VISIBLE);
//
//                    new ProgressTask().execute();
//
//                    new DownloadImageTask(next_progress_rectangle).execute(mThumbNailUrl);
//                }else{
//                    progressNext.setVisibility(GONE);
//                }

                mProgressBar.setMax(mRemainTime);

                // Type 2 일때만 Handler 처리를 해줍시다

                mMyRepuTimeHandler.sendEmptyMessageDelayed(0, 500);

            }else{
                RelativeLayout progressNext = findViewById(R.id.welean_myrepu_dialog_right_progress);
                progressNext.setVisibility(View.INVISIBLE);

                mProgressBar.setVisibility(ProgressBar.INVISIBLE);
            }


        }else{
            WindowManager.LayoutParams lpWindow = new WindowManager.LayoutParams();
            lpWindow.flags = WindowManager.LayoutParams.FLAG_DIM_BEHIND;
            lpWindow.dimAmount = 0.8f;

            getWindow().setAttributes(lpWindow);
            // 초록색 OK , Cancel 두개
            setContentView(R.layout.welean_dialog);

            TextView title = findViewById(R.id.modal_title);
            TextView content = findViewById(R.id.modal_contnet);

            title.setText(mTitle);

            content.setText(mContent);
        }

        LinearLayout btn_wrap_multi = findViewById(R.id.modal_btn_wrap_multi);
        RelativeLayout btn_wrap_single = findViewById(R.id.modal_btn_wrap_single);
        if(mLeftListener !=null && mRightListener !=null) {
            Button rightbutton = findViewById(R.id.modal_right);
            Button leftbutton = findViewById(R.id.modal_left);
            rightbutton.setText(mRightButtonName);
            leftbutton.setText(mLeftButtonName);

            btn_wrap_multi.setVisibility(VISIBLE);
            btn_wrap_single.setVisibility(View.INVISIBLE);
            leftbutton.setOnClickListener(mLeftListener);
            rightbutton.setOnClickListener(mRightListener);
        }

        if(mSingleListener !=null){
            Button okbutton = findViewById(R.id.modal_ok);
//            okbutton.setText("확인");
            okbutton.setOnClickListener(mSingleListener);

            Button btn_myrepu_close = findViewById(R.id.modal_close);

            btn_wrap_single.setVisibility(VISIBLE);

            Button iconMyRepuStat1 = findViewById(R.id.icon_myrepu_star1);
            Button iconMyRepuStat2 = findViewById(R.id.icon_myrepu_star2);
            Button iconMyRepuStat3 = findViewById(R.id.icon_myrepu_star3);
            Button iconMyRepuStat4 = findViewById(R.id.icon_myrepu_star4);
            Button iconMyRepuStat5 = findViewById(R.id.icon_myrepu_star5);
            // 닫기 버튼을 추가하여 리스너를 받아주세요.

            if(Preferences.getWelaaaMyReputation(mAppcontext).equals("0")){
                iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
            }else if(Preferences.getWelaaaMyReputation(mAppcontext).equals("1")){
                iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
            }else if(Preferences.getWelaaaMyReputation(mAppcontext).equals("2")){
                iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
            }else if(Preferences.getWelaaaMyReputation(mAppcontext).equals("3")){
                iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
            }else if(Preferences.getWelaaaMyReputation(mAppcontext).equals("4")){
                iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
            }else if(Preferences.getWelaaaMyReputation(mAppcontext).equals("5")){
                iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));

            }

//            Button btn_myrepu_close = findViewById(R.id.btn_myrepu_close);

            iconMyRepuStat1.setOnClickListener(click_control);
            iconMyRepuStat2.setOnClickListener(click_control);
            iconMyRepuStat3.setOnClickListener(click_control);
            iconMyRepuStat4.setOnClickListener(click_control);
            iconMyRepuStat5.setOnClickListener(click_control);

            btn_myrepu_close.setOnClickListener(mSingleListener);
        }

        try{
            if(mRelatedView!=null){
                if(mRelatedView.equals("relatedView")){
                    TextView content = findViewById(R.id.modal_contnet);

                    content.setText("");
                    content.setPadding(40,10,40,0); // 영향도가 없습니까 ??

//                    content.setVisibility(GONE);
//                    content.setPadding(left,top,right,bottom)
                    // 연관 콘텐츠 뷰에서는 비활성화 한다

                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    public void onBackPressed() {

    }

    /*******************************************************************
     * 버튼들 listener
     *******************************************************************/
    View.OnClickListener click_control = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            switch(v.getId()) {

                case R.id.icon_myrepu_star1:
                {
                    Button iconMyRepuStat1 = findViewById(R.id.icon_myrepu_star1);
                    Button iconMyRepuStat2 = findViewById(R.id.icon_myrepu_star2);
                    Button iconMyRepuStat3 = findViewById(R.id.icon_myrepu_star3);
                    Button iconMyRepuStat4 = findViewById(R.id.icon_myrepu_star4);
                    Button iconMyRepuStat5 = findViewById(R.id.icon_myrepu_star5);

                    iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                    iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                    iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                    iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));

                    Preferences.setWelaaaMyReputation(mAppcontext , "1");

                }
                break;

                case R.id.icon_myrepu_star2:
                {
                    Button iconMyRepuStat1 = findViewById(R.id.icon_myrepu_star1);
                    Button iconMyRepuStat2 = findViewById(R.id.icon_myrepu_star2);
                    Button iconMyRepuStat3 = findViewById(R.id.icon_myrepu_star3);
                    Button iconMyRepuStat4 = findViewById(R.id.icon_myrepu_star4);
                    Button iconMyRepuStat5 = findViewById(R.id.icon_myrepu_star5);

                    iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                    iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                    iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));

                    Preferences.setWelaaaMyReputation(mAppcontext , "2");

                }
                break;

                case R.id.icon_myrepu_star3:
                {
                    Button iconMyRepuStat1 = findViewById(R.id.icon_myrepu_star1);
                    Button iconMyRepuStat2 = findViewById(R.id.icon_myrepu_star2);
                    Button iconMyRepuStat3 = findViewById(R.id.icon_myrepu_star3);
                    Button iconMyRepuStat4 = findViewById(R.id.icon_myrepu_star4);
                    Button iconMyRepuStat5 = findViewById(R.id.icon_myrepu_star5);

                    iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));
                    iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));

                    Preferences.setWelaaaMyReputation(mAppcontext , "3");

                }
                break;

                case R.id.icon_myrepu_star4:
                {
                    Button iconMyRepuStat1 = findViewById(R.id.icon_myrepu_star1);
                    Button iconMyRepuStat2 = findViewById(R.id.icon_myrepu_star2);
                    Button iconMyRepuStat3 = findViewById(R.id.icon_myrepu_star3);
                    Button iconMyRepuStat4 = findViewById(R.id.icon_myrepu_star4);
                    Button iconMyRepuStat5 = findViewById(R.id.icon_myrepu_star5);

                    iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_grey_big));

                    Preferences.setWelaaaMyReputation(mAppcontext , "4");

                }
                break;

                case R.id.icon_myrepu_star5:
                {
                    Button iconMyRepuStat1 = findViewById(R.id.icon_myrepu_star1);
                    Button iconMyRepuStat2 = findViewById(R.id.icon_myrepu_star2);
                    Button iconMyRepuStat3 = findViewById(R.id.icon_myrepu_star3);
                    Button iconMyRepuStat4 = findViewById(R.id.icon_myrepu_star4);
                    Button iconMyRepuStat5 = findViewById(R.id.icon_myrepu_star5);

                    iconMyRepuStat1.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat2.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat3.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat4.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));
                    iconMyRepuStat5.setBackground(Utils.getDrawable(mAppcontext, R.drawable.icon_star_green_big));

                    Preferences.setWelaaaMyReputation(mAppcontext , "5");

                }
                break;

                case R.id.modal_close:
                {
                    CheckBox myRepuCheck = findViewById (R.id.myrepu_check_box);
                    boolean isMyRepuCheck = myRepuCheck.isChecked();
                    Preferences.setMyreCheckBox(getContext(),isMyRepuCheck);
                }
                break;
            }
        }
    };

    private class ProgressTask extends AsyncTask<Void,Void,Void> {
        @Override
        protected void onPreExecute(){
//            bar.setVisibility(View.VISIBLE);
        }

        @Override
        protected Void doInBackground(Void... arg0) {
            //my stuff is here
            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
//            bar.setVisibility(View.GONE);
        }
    }

    public class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        private ImageView imageView;
        private Bitmap image;

        public DownloadImageTask(ImageView imageView) {
            this.imageView = imageView;
        }

        protected Bitmap doInBackground(String... urls) {
            String urldisplay = urls[0];
            try {
                InputStream in = new java.net.URL(urldisplay).openStream();
                image = BitmapFactory.decodeStream(in);
            } catch (Exception e) {
                image = null;
            }
            return image;
        }

        @SuppressLint("NewApi")
        protected void onPostExecute(Bitmap result) {
            if (result != null) {
                imageView.setImageBitmap(result);

//                Drawable alpha = ((ImageView)findViewById(R.id.next_progress_rectangle)).getBackground();
//                alpha.setAlpha(77);
            }
        }
    }

    Handler mMyRepuTimeHandler = new Handler()
    {
        @SuppressWarnings("unchecked")
        @Override
        public void handleMessage(Message msg)
        {
            try
            {
                Logger.e(TAG + " 20170904 mMyRepuTimeHandler mRemainTime is " + mRemainTime);
                Logger.e(TAG + " 20170904 mMyRepuTimeHandler mTotalTime is " + mTotalTime);

                mProgressBar.setProgress(mRemainTime-500);

                mTotalTime = mRemainTime - 500;

                // Type 2 일때만 Handler 처리를 해줍시다

                mMyRepuTimeRefeatHandler.sendEmptyMessageDelayed(0, 500);
            }
            catch (Exception e)
            {
                e.printStackTrace();

            }
        }
    };

    Handler mMyRepuTimeRefeatHandler = new Handler()
    {
        @SuppressWarnings("unchecked")
        @Override
        public void handleMessage(Message msg)
        {
            try
            {
                Logger.e(TAG + " 20170904 mMyRepuTimeRefeatHandler mRemainTime is " + mRemainTime);
                Logger.e(TAG + " 20170904 mMyRepuTimeRefeatHandler mTotalTime is " + mTotalTime);

                mProgressBar.setProgress(mTotalTime-500);

                mTotalTime = mTotalTime - 500;

                // Type 2 일때만 Handler 처리를 해줍시다

                if(mTotalTime<0){
                    mMyRepuTimeRefeatHandler.removeCallbacksAndMessages(null);
                }else{

                    CheckBox myRepuCheck = findViewById (R.id.myrepu_check_box);
                    boolean isMyRepuCheck = myRepuCheck.isChecked();
                    Preferences.setMyreCheckBox(getContext(),isMyRepuCheck);

                    mMyRepuTimeRefeatHandler.sendEmptyMessageDelayed(0, 500);
                }
            }
            catch (Exception e)
            {
                e.printStackTrace();

            }
        }
    };
}
