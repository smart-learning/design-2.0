/*
 * PallyCon Team ( http://www.pallycon.com )
 *
 * This is a simple example project to show how to build a APP using the PallyCon Widevine SDK
 * The SDK is based on Exo player library
 */

package kr.co.influential.youngkangapp.player;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.pm.PackageManager;
import android.database.ContentObserver;
import android.media.AudioManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.os.RemoteException;
import android.os.SystemClock;
import android.support.annotation.NonNull;
import android.support.v4.content.ContextCompat;
import android.support.v4.media.MediaBrowserCompat;
import android.support.v4.media.MediaDescriptionCompat;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaControllerCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.webkit.CookieManager;
import android.widget.AbsListView;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;
import com.bumptech.glide.Glide;
import com.facebook.react.bridge.UiThreadUtil;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.ParserException;
import com.google.android.exoplayer2.PlaybackParameters;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.ui.DefaultTimeBar;
import com.google.android.exoplayer2.ui.PlayerView;
import com.google.android.exoplayer2.util.Util;
import com.google.android.gms.cast.Cast;
import com.google.android.gms.cast.CastDevice;
import com.google.android.gms.cast.MediaInfo;
import com.google.android.gms.cast.MediaLoadOptions;
import com.google.android.gms.cast.MediaMetadata;
import com.google.android.gms.cast.MediaStatus;
import com.google.android.gms.cast.framework.CastButtonFactory;
import com.google.android.gms.cast.framework.CastContext;
import com.google.android.gms.cast.framework.CastSession;
import com.google.android.gms.cast.framework.SessionManager;
import com.google.android.gms.cast.framework.SessionManagerListener;
import com.google.android.gms.cast.framework.media.RemoteMediaClient;
import com.google.android.gms.common.images.WebImage;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.pallycon.widevinelibrary.PallyconWVMSDKFactory;
import java.io.IOException;
import java.io.Reader;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;
import kr.co.influential.youngkangapp.BasePlayerActivity;
import kr.co.influential.youngkangapp.BuildConfig;
import kr.co.influential.youngkangapp.MainApplication;
import kr.co.influential.youngkangapp.R;
import kr.co.influential.youngkangapp.cast.CastControllerActivity;
import kr.co.influential.youngkangapp.download.DownloadService;
import kr.co.influential.youngkangapp.pallycon.PlayStatus;
import kr.co.influential.youngkangapp.player.playback.LocalPlayback;
import kr.co.influential.youngkangapp.player.playback.PlaybackManager;
import kr.co.influential.youngkangapp.player.service.MediaService;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.util.CustomDialog;
import kr.co.influential.youngkangapp.util.HLVAdapter;
import kr.co.influential.youngkangapp.util.HttpCon;
import kr.co.influential.youngkangapp.util.HttpConnection;
import kr.co.influential.youngkangapp.util.Logger;
import kr.co.influential.youngkangapp.util.MyBroadcastReceiver;
import kr.co.influential.youngkangapp.util.Preferences;
import kr.co.influential.youngkangapp.util.Utils;
import kr.co.influential.youngkangapp.util.WeContentManager;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Created by PallyconTeam
 */

public class PlayerActivity extends BasePlayerActivity {

  public static final String TAG = "pallycon_sampleapp";
  public static final String CONTENTS_TITLE = "contents_title";
  public static final String PREFER_EXTENSION_DECODERS = "prefer_extension_decoders";
  public static final String DOWNLOAD_SERVICE_TYPE = "drm_delete";

  private PlayerView simpleExoPlayerView;
  private boolean shouldAutoPlay;

  private LayoutInflater mLayout = null;
  private FrameLayout mButtonGroupLayout = null;
  public FrameLayout mPlaylistGroupLayout = null;

  public FrameLayout mRelatedListGroupLayout = null;
  public TextView mRelatedListBlinkText = null;

  private GestureDetector mgestureScanner;

  private static final int SWIPE_MIN_DISTANCE = 250;
  private static final int SWIPE_MAX_OFF_PATH = 50;

  private ImageView mRelatedViewBtn = null;
  private LinearLayout mRelatedViewTopCloseBtn = null;

  private ScrollView mscrollRelatedView = null;

  public RelativeLayout audioModeBackgroundLayout = null;
  public RelativeLayout audioModeIconHeadset = null;
  public RelativeLayout audioModeIconHeadsetLand = null;

  private TextView mTextTotalTime = null;
  private TextView mTextCurTime = null;
  private DefaultTimeBar mSeekBar = null;

  private Button mBtnForward = null;
  private Button mBtnBackward = null;
  public Button mButtonAudio = null;
  public Button mButtonVideo = null;
  private Button mBtnDownload = null;
  private Button mBtnSpeed = null;
  private Button mBtnSubtitlesOn = null;
  private Button mBtnSubtitlesOff = null;
  private Button mBtnClosed = null;
  private Button mBtnPlaylist = null;
  private Button mBtnPlaylistClose = null;

  private RelativeLayout msleep_view = null;

  private FrameLayout mblank_speed_view = null;
  public RelativeLayout msubtitls_view = null;
  public RelativeLayout msubtitls_view_long = null;
  private FrameLayout mblank_sleeper_view = null;

  Boolean visible = false;

  //자막
  private RelativeLayout mfullSmiLayout = null;
  private RelativeLayout mshortSmiLayout = null;
  private ScrollView mscrollview = null;
  private ScrollView mscrollTimeview = null;

  private ScrollView mlongScrollview = null;
  private ScrollView mlongScrollTimeview = null;


  private TextView mBtnSleep_title = null;
  private TextView mBtnSleep_15 = null;
  private TextView mBtnSleep_30 = null;
  private TextView mBtnSleep_45 = null;
  private TextView mBtnSleep_60 = null;
  private ImageView mBtnSleep_cancel = null;

  private TextView mBtnSleep_title_land = null;
  private TextView mBtnSleep_15_land = null;
  private TextView mBtnSleep_30_land = null;
  private TextView mBtnSleep_45_land = null;
  private TextView mBtnSleep_60_land = null;
  private ImageView mBtnSleep_cancel_land = null;


  private Button mBtnRock = null;
  private Button mBtnUnRock = null;
  private Button mBtnSleeper = null;
  private Button mBtnSleep_Active = null;
  private Button mBtnAutoplay = null;
  private Button mBtnAutoplayCancel = null;
  private TextView speedtxtvalue_btn = null;

  private Button mBtnIconBtnSpeed = null;
  private Button mBtnIconBtnList = null;

  private Button mBtnSubtitleTextSmall = null;
  private Button mBtnSubtitleTextNormal = null;
  private Button mBtnSubtitleTextBig = null;

  private Button mBtnSubtitleTextSmallOff = null;
  private Button mBtnSubtitleTextNormalOff = null;
  private Button mBtnSubtitleTextBigOff = null;

  private Animation mAniSlideShow = null;
  private Animation mAniSlideHide = null;

  private PlayerListSameSeriesAdapter listSameSeriesAdapter;
  private PlayerListSameCategoryAdapter listSameCategoryAdapter;
  private PlayerListPopClipAdapter listPopClipAdapter;

  private RelativeLayout mMovingspace = null;

  //sleepmode timetext
  private static TextView sleeptimerText = null;

  private String[] mSubtitlsmemo = null;
  private int[] mSubtitlstime;
  private int mTxtViewNumber;
  private int[] subTitlsLineNum;

  private TextView[] shortSubTitlesTextView = null;
  private TextView[] shortSubTitlesTextTimeView = null;

  private TextView[] longSubTitlesTextView = null;
  private TextView[] longSubTitlesTextTimeView = null;

  private int[] textViewSumHeight;

  private boolean hasSubTitlsJesonUrl;
  private int autoTextScrollNum;

  private int contentId = 0;
  private final int SMALL_SUBTITLS_SCROLL_VIEW_HEIGHT = 45;
  private final int SHORT_SUBTITLS_SCROLL_VIEW_HEIGHT = 60 + 20;
  private final int NORMAL_SUBTITLS_SCROLL_VIEW_HEIGHT = 95 + 20;

  private Timer mTimer = null;

  private Timer showUiTimer = null;
  private TimerTask ShowControlerTimer = null;//showUiTimer TimerTask
  static private SleepTimeHandler mSleeperHandler = null;
  public double speedNum = 0; //동영상스피드
  public int sleeperNum = 0; //sleeper

  public int speedIndex = 0;

  private Button mBtnlistClose = null;

  private LinearLayout mButton_playlist_close_linear;
  private LinearLayout mButton_player_close_linear;

  private int start_current_time;

  private Button mBtnArrowLeft = null;
  private Button mBtnArrowRight = null;

  private RelativeLayout mButton_Arrow_Layout;

  private Button mBtnVolume = null;
  private Button mBtnVolumeActive = null;

  private RelativeLayout mVolumeControlBar;

  private SeekBar volumeSeekbar = null;
  private AudioManager audioManager = null;

  private SettingsContentObserver settingsContentObserver;

  private TextView mTextViewVolumeText = null;

  private LinearLayout mMyRepuBoxLinear = null;

  private Button mRelatedListClosed = null;
  private String fontSize = "";

  public String mUserStar = "";

  private String cId = "";
  public int mLastViewTime = 0;
  private Boolean mIsDownloadBind = false;
  private Boolean mIsPlayerBind = false;
  public Boolean mIsAudioBook = false;
  public String PLAY_STATE = "STREAMMING"; // STREAMMING,LOCAL
  public String CON_CLASS = "1"; //video:1, audiobook:2
  public String PLAY_MODE = "video"; //(CON_CLASS => video의 audioMode,videoMode
  private String startPosition = "";

  public String CONTENT_TYPE = "";  // course-
  public Boolean CAN_PLAY = false;
  public String EXPIRE_AT = "";
  public Boolean IS_FREE = false;
  public int CONTENT_HISTORY_SEC = 0;

  private WebPlayerInfo mWebPlayerInfo = null;
  private NewWebPlayerInfo mNewWebPlayerInfo = null;

  private ProgressBar audioItemProgressBar;

  private PlayerListAdapter lectureListItemdapter;
  private AudioBookPlayerListAdapter lectureAudioBookListItemdapter;
  private ArrayList<JSONObject> lastViewListArray = new ArrayList<JSONObject>();

  private final int FLAG_DAIALOG_VIDEO = 1;
  private final int FLAG_DAIALOG_AUDIO = 2;
  private final int FLAG_DIALOG_ONCOMPLETION = 3;
  private final int FINISHACTIVITY_REQUEST_CODE = 1002;
  private final int WELAAAPLAYER_AUDIOBOOK_CODE = 1006;
  private final int WELAAAPLAYER_WISEVIDEO_CODE = 1007;
  private final int FINISHACTIVITY_SUGGEST_REQUEST_CODE = 1008;
  private final int WELAAAPLAYER_SUGGEST_CODE = 1009;
  private final int WELAAAPLAYER_SUGGEST_CODE_PLAYERCONTROLLER = 1010;

  RecyclerView mRecyclerView;
  RecyclerView.LayoutManager mLayoutManager;
  RecyclerView.Adapter mAdapter;
  ArrayList<String> alName;
  ArrayList<String> alImage;

  RecyclerView mRecyclerView2;
  RecyclerView.LayoutManager mLayoutManager2;
  RecyclerView.Adapter mAdapter2;
  ArrayList<String> alName2;
  ArrayList<String> alImage2;

  RecyclerView mRecyclerView3;
  RecyclerView.LayoutManager mLayoutManager3;
  RecyclerView.Adapter mAdapter3;
  ArrayList<String> alName3;
  ArrayList<String> alImage3;

  ArrayList<String> alTeacherName;
  ArrayList<String> alTeacherName2;
  ArrayList<String> alTeacherName3;

  ArrayList<String> alTotalTime;
  ArrayList<String> alTotalTime2;
  ArrayList<String> alTotalTime3;

  ArrayList<String> alEndTime;
  ArrayList<String> alEndTime2;
  ArrayList<String> alEndTime3;

  ArrayList<String> alViewCnt;
  ArrayList<String> alViewCnt2;
  ArrayList<String> alViewCnt3;

  ArrayList<String> alStarCnt;
  ArrayList<String> alStarCnt2;
  ArrayList<String> alStarCnt3;

  ArrayList<String> alReplyCnt;
  ArrayList<String> alReplyCnt2;
  ArrayList<String> alReplyCnt3;

  ArrayList<String> alCkeyCnt;
  ArrayList<String> alCkeyCnt2;
  ArrayList<String> alCkeyCnt3;

  private ArrayList<JSONObject> suggestListArray1 = new ArrayList<>();
  public Boolean isDonwloadBindState = false;

  private MediaBrowserCompat mediaBrowser;

  private PlaybackStateCompat lastPlaybackState;
  private HttpConnection httpConn = HttpConnection.getInstance();

  private String callbackMethodName = "";
  private String callbackMethod = "";
  private final String API_BASE_URL = Utils.welaaaApiBaseUrl();

  private MyBroadcastReceiver myBroadcastReceiver = null;
  private String mIsNetworkType = "";

  private int contentHistory_seconds = 0;
  private String contentName = "";
  private String contentCid = "";

  ProgressDialog mProgressDialog;
  public static String mszMsgLoading = "로딩 중 입니다.\n잠시만 기다려주세요";

  private final int FLAG_DOWNLOAD_NETWORK_CHECK = 7;
  public Boolean playOnClickPlayTry = false;

  private long mLastClickTime = 0L;

  private final MediaControllerCompat.Callback callback = new MediaControllerCompat.Callback() {
    @Override
    public void onPlaybackStateChanged(@NonNull PlaybackStateCompat state) {
      updatePlaybackState(state);
    }

    @Override
    public void onMetadataChanged(MediaMetadataCompat metadata) {
      if (metadata != null) {
        updateMediaDescription(metadata.getDescription());
        updateDuration(metadata);

        setSubTitleJson();

        setVideoGroupTitle(getwebPlayerInfo().getGroupTitle(),
            getwebPlayerInfo().getCname()[getContentId()]);
      }
    }
  };

  private final MediaBrowserCompat.ConnectionCallback connectionCallback =
      new MediaBrowserCompat.ConnectionCallback() {
        @Override
        public void onConnected() {
          LogHelper.d(TAG, "onConnected");
          try {
            connectToSession(mediaBrowser.getSessionToken());
          } catch (RemoteException e) {
            LogHelper.e(TAG, e, "could not connect media controller");
          }
        }
      };

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    setContentView(R.layout.activity_player);

    // Volume UI
    audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);

    settingsContentObserver = new SettingsContentObserver(new Handler());

    getContentResolver().registerContentObserver(
        android.provider.Settings.System.CONTENT_URI, true, settingsContentObserver);

    shouldAutoPlay = true;

//		com.google.android.exoplayer2.ui.SimpleExoPlayerView
    simpleExoPlayerView = findViewById(R.id.player_view);
    simpleExoPlayerView.requestFocus();
    setPlayerView(simpleExoPlayerView);

    //// Chromecast
    mCastContext = CastContext.getSharedInstance(this);
    // mCastContext is always not null. No need to check null
    createMessageReceivedCallback();
    createSessionManagerListener();
    createRemoteMediaClientListener();
    createRemoteMediaClientProgressListener();
    mSessionManager = mCastContext.getSessionManager();
    mCastSession = mSessionManager.getCurrentCastSession();
    if (mCastSession != null) {
      try {
        mCastSession.setMessageReceivedCallbacks(CAST_MSG_NAMESPACE, mMessageReceivedCallback);
      } catch (IOException e) {
        e.printStackTrace();
      }
    }

    bNowOnChromecast = false;
    bCreated = true;
    //// CC

    if (lectureListItemdapter != null) {
      lectureListItemdapter = null;
    }
    lectureListItemdapter = new PlayerListAdapter(getApplicationContext(), this);

    if (lectureAudioBookListItemdapter != null) {
      lectureAudioBookListItemdapter = null;
    }
    lectureAudioBookListItemdapter = new AudioBookPlayerListAdapter(getApplicationContext(), this);

    // 추천 콘텐츠 뷰 그릴 때 사용 예정입니다.
    if (listSameSeriesAdapter != null) {
      listSameSeriesAdapter = null;
    }
    listSameSeriesAdapter = new PlayerListSameSeriesAdapter(getApplicationContext(), this);

    if (listSameCategoryAdapter != null) {
      listSameCategoryAdapter = null;
    }
    listSameCategoryAdapter = new PlayerListSameCategoryAdapter(getApplicationContext(), this);

    if (listPopClipAdapter != null) {
      listPopClipAdapter = null;
    }
    listPopClipAdapter = new PlayerListPopClipAdapter(getApplicationContext(), this);

    audioItemProgressBar = findViewById(R.id.audioItemProgressBar);

    // MediaBrowser.
    mediaBrowser = new MediaBrowserCompat(this, new ComponentName(this, MediaService.class),
        connectionCallback, null);

    setBroadCatReceiver();
  }

  @Override
  protected void onStart() {
    super.onStart();
    if (mediaBrowser != null) {
      mediaBrowser.connect();
    }
  }

  @Override
  protected void onResume() {
    super.onResume();

    // Check chromecast first
    //// Chromecast
    mSessionManager.addSessionManagerListener(mSessionManagerListener, CastSession.class);
    if (mCastSession != null && (mCastSession.isConnected() || mCastSession.isConnecting())) {
      if (bCreated) {
        // If PlayerActivity is created, it means that the user select a content at MainActivity.
        releaseCast();
        bCreated = false;
        bNowOnChromecast = false;
      }

      if (bNowOnChromecast) {
        // If the content is playing at Chromecast already, do nothing.
        Log.d(TAG, "[CAST] continue playing on Chromecast");
        return;
      }

      // If the content is not playing at Chromecast, load the content.
      Uri contentUri = getIntent().getData();
      if (contentUri != null && contentUri.toString().startsWith("/")) {
        // The contents is in internal storage. It is not supported by Cast.
        mPlayStatus.mScreen = PlayStatus.SCREEN_LOCAL;
        Log.d(TAG, "[CAST] Chromecast is connected but the content type is not streaming");
      } else {
        // The contents is in remote storage. Cast will be work.
        mPlayStatus.mScreen = PlayStatus.SCREEN_CAST;
        Log.d(TAG, "[CAST] Chromecast is connected");

        Log.d(TAG, "[CAST] start playing on Chromecast");
        if (!loadRemoteMedia(0, true)) {
          Log.d(TAG, "[CAST] failure on loadRemoteMedia()");
        }

        return;
      }
    } else {
      mPlayStatus.mScreen = PlayStatus.SCREEN_LOCAL;
      Log.d(TAG, "Chromecast is not connected");
    }

    long position = mPlayStatus.mPosition;
    releaseCast();
    mPlayStatus.mPosition = position;
    //// CC

    // If the CastControllerActivity is destroyed when it is full screen activity, onSessionEnded() of Chromecast will not be called.
    // PlayActivity will come to the foreground, and onResume() will be called.
    if (mPlayStatus.mCurrentState == PlayStatus.STATE_PLAYING) {
      shouldAutoPlay = true;
    }
  }

  @Override
  protected void onPause() {
    //// Chromecast
    if (mCastContext != null && mSessionManagerListener != null && mRemoteClient != null) {
      mSessionManager.removeSessionManagerListener(mSessionManagerListener, CastSession.class);
    }
    //// CC
    super.onPause();
  }

  @Override
  protected void onStop() {
    mPlayStatus.clear();

    // 다운로드 서비스 언바운딩
    if (isDonwloadBindState) {
      isDonwloadBindState = false;
      unbindService(downloadConnection);
    }

    super.onStop();
    if (mediaBrowser != null) {
      mediaBrowser.disconnect();
    }
    MediaControllerCompat controllerCompat = MediaControllerCompat
        .getMediaController(PlayerActivity.this);
    if (controllerCompat != null) {
      controllerCompat.unregisterCallback(callback);
    }
  }

  @Override
  protected void onDestroy() {

    super.onDestroy();

    if (myBroadcastReceiver != null) {
      unregisterReceiver(myBroadcastReceiver);
    }

    if (mCurrentTimeHandler != null) {
      mCurrentTimeHandler.removeCallbacksAndMessages(null);
    }

    if (lectureListItemdapter != null) {
      lectureListItemdapter = null;
    }

    if (lectureAudioBookListItemdapter != null) {
      lectureAudioBookListItemdapter = null;
    }

    if (listSameSeriesAdapter != null) {
      listSameSeriesAdapter = null;
    }

    if (listSameCategoryAdapter != null) {
      listSameCategoryAdapter = null;
    }

    if (listPopClipAdapter != null) {
      listPopClipAdapter = null;
    }

    audioModeBackgroundLayout = null;
    audioModeIconHeadset = null;
    mLayout = null;
    mButtonGroupLayout = null;
    mPlaylistGroupLayout = null;
    mAniSlideShow = null;
    mAniSlideHide = null;

    mblank_speed_view = null;
    msubtitls_view = null;
    msubtitls_view_long = null;
    mblank_sleeper_view = null;
    msleep_view = null;

    mMovingspace = null;
    mfullSmiLayout = null;
    mshortSmiLayout = null;
    mscrollview = null;

    mSubtitlsmemo = null;
    mSubtitlstime = null;
    subTitlsLineNum = null;

    mBtnIconBtnSpeed = null;
    mBtnIconBtnList = null;

    mBtnSubtitleTextSmall = null;
    mBtnSubtitleTextNormal = null;
    mBtnSubtitleTextBig = null;

    mBtnSubtitleTextSmallOff = null;
    mBtnSubtitleTextNormalOff = null;
    mBtnSubtitleTextBigOff = null;

    mBtnlistClose = null;
    mMyRepuBoxLinear = null;

    mSleeperHandler = null;

    longSubTitlesTextView = null;
    longSubTitlesTextTimeView = null;

    mgestureScanner = null;
    mGestureListener = null;

    mButtonGroupLayout = null;

    mRelatedListGroupLayout = null;

    mRelatedListGroupLayout = null;

    mscrollRelatedView = null;

    mscrollview = null;

    mfullSmiLayout = null;

    getContentResolver().unregisterContentObserver(settingsContentObserver);

  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
      @NonNull int[] grantResults) {
    if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
    } else {
      Toast.makeText(getApplicationContext(), R.string.storage_permission_denied, Toast.LENGTH_LONG)
          .show();
      finish();
    }
  }

  /**
   * initialize
   */
  private void setData(boolean fromMediaSession, Bundle extras, Uri uri) {
    if (uri == null || Uri.EMPTY.equals(uri) || extras == null) {
      finish();
      return;
    }

    if (!fromMediaSession) {
      mWebPlayerInfo = (WebPlayerInfo) extras.getSerializable("webPlayerInfo");
      Gson gson = new Gson();
      String json = gson.toJson(mWebPlayerInfo);
      Preferences.setWelaaaWebPlayInfo(getApplicationContext(), json);

      CONTENT_TYPE = extras.getString("type", "");
      CAN_PLAY = extras.getBoolean("can_play", false);
      IS_FREE = extras.getBoolean("is_free", false);
      EXPIRE_AT = extras.getString("expire_at", "");
      CONTENT_HISTORY_SEC = extras.getInt("history_start_seconds", 0);

      try {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("type", CONTENT_TYPE);
        jsonObject.addProperty("can_play", CAN_PLAY);
        jsonObject.addProperty("is_free", IS_FREE);
        jsonObject.addProperty("expire_at", EXPIRE_AT);
        jsonObject.addProperty("history_start_seconds", CONTENT_HISTORY_SEC);
        String playInfo = gson.toJson(jsonObject);
        extras.putString("play_info", playInfo);
      } catch (Exception e) {
        e.printStackTrace();
      }

      cId = extras.getString(PlaybackManager.DRM_CID, "");

      for (int i = 0; i < mWebPlayerInfo.getCkey().length; i++) {
        if (cId.equals(mWebPlayerInfo.getCkey()[i])) {
          setContentId(i);
        }
      }

      initialize();

    } else {
      String json = Preferences.getWelaaaWebPlayInfo(getApplicationContext());
      Gson gson = new Gson();
      WebPlayerInfo mWebPlayerInfoFromJson = gson.fromJson(json, WebPlayerInfo.class);
      mWebPlayerInfo = mWebPlayerInfoFromJson;

      Preferences.setWelaaaWebPlayInfo(getApplicationContext(), json);

      try {
        JsonElement jsonElement = new JsonParser().parse(extras.getString("play_info"));
        JsonObject jsonPlayInfo = jsonElement.getAsJsonObject();
        CONTENT_TYPE = jsonPlayInfo.get("type").getAsString();
        CAN_PLAY = jsonPlayInfo.get("can_play").getAsBoolean();
        IS_FREE = jsonPlayInfo.get("is_free").getAsBoolean();
        EXPIRE_AT = jsonPlayInfo.get("expire_at").getAsString();
        CONTENT_HISTORY_SEC = jsonPlayInfo.get("history_start_seconds").getAsInt();
      } catch (Exception e) {
        e.printStackTrace();
      }

      cId = extras.getString(PlaybackManager.DRM_CID, "");
      if (simpleExoPlayerView.getPlayer() != null) {
        setVideoGroupTitle(getwebPlayerInfo().getGroupTitle(),
            getwebPlayerInfo().getCname()[getContentId()]);

      } else {
        initialize();
      }
    }

    LogHelper.e(TAG, "sendData : fromMediaSession " + fromMediaSession);
    LogHelper.e(TAG, "sendData : cId " + cId);

    playFromUri(uri, extras);
  }

  private void initialize() {
    if (!CAN_PLAY) {
      Utils.logToast(getApplicationContext(), getString(R.string.info_nosession));
    }

    if (CONTENT_TYPE != null) {

      Preferences.setWelaaaPlayerOnClickPos(getApplicationContext(), 0);

      if (CONTENT_TYPE.equals("audiobook")) {
        RelativeLayout control_wrap = findViewById(R.id.CONTROL_WRAP_BG);
        control_wrap.setOnTouchListener(new View.OnTouchListener() {
          @Override
          public boolean onTouch(View v, MotionEvent event) {
            return true;
          }
        });

//      mSeekBar.setProgressDrawable(getResources().getDrawable(R.drawable.progress_horizontal_custom_audio));

        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            mButton_Arrow_Layout.setVisibility(GONE);
            mRelatedViewBtn.setVisibility(GONE);

            RelativeLayout subscription_wrap = findViewById(R.id.subtitles_btn_wrap);
            subscription_wrap.setVisibility(GONE);

            RelativeLayout audioVideobtn_wrap = findViewById(R.id.audiovideo_btn_wrap);
            audioVideobtn_wrap.setVisibility(GONE);

            audioModeBackgroundLayout.setVisibility(VISIBLE);
            audioModeIconHeadset.setVisibility(VISIBLE);

          }
        });
//      mSeekBar.setProgressDrawable(getResources().getDrawable(R.drawable.progress_horizontal_custom_audio));

        // 오디오북
        simpleExoPlayerView.showController();
        simpleExoPlayerView.setControllerHideOnTouch(false);
        simpleExoPlayerView.setControllerShowTimeoutMs(1000 * 60 * 60 * 60);

      } else {

        Intent intent = getIntent();

        if (cId != null) {
          if (cId.startsWith("z")) {

            UiThreadUtil.runOnUiThread(new Runnable() {
              @Override
              public void run() {
                mButton_Arrow_Layout.setVisibility(GONE);
                mRelatedViewBtn.setVisibility(GONE);

                RelativeLayout subscription_wrap = findViewById(R.id.subtitles_btn_wrap);
                subscription_wrap.setVisibility(GONE);

                RelativeLayout audioVideobtn_wrap = findViewById(R.id.audiovideo_btn_wrap);
                audioVideobtn_wrap.setVisibility(GONE);

                audioModeBackgroundLayout.setVisibility(VISIBLE);
                audioModeIconHeadset.setVisibility(VISIBLE);

              }
            });

            // 오디오북  매일책한권 시리즈 .
            simpleExoPlayerView.showController();
            simpleExoPlayerView.setControllerHideOnTouch(false);
            simpleExoPlayerView.setControllerShowTimeoutMs(1000 * 60 * 60 * 60);

            LocalPlayback.getInstance(PlayerActivity.this).setRendererDisabled(true);
          } else {
            // 클래스 동영상 강좌 / 강의 
//            simpleExoPlayerView.showController();
            simpleExoPlayerView.setUseController(true);
            simpleExoPlayerView.setControllerHideOnTouch(true);
            simpleExoPlayerView.setControllerShowTimeoutMs(1000 * 10);

            LocalPlayback.getInstance(PlayerActivity.this).setRendererDisabled(false);
          }
        }
      }
    }

    // 베이스 레이아웃
    setBaseUI();
    // 자막 레이아웃
    setSubtitlesUI();
    // 버튼 클릭 준비
    buttonInit();
    // 재생 속도 UI 설정
    initializePlaybackSpeed();
    // Volume Controller Init
    initControls();
    // 별점 뷰 셋팅 하기
    setMyrepuSetUI();
    //오디오북 or 오디오모드에서 보이는 이미지
    setAudioModeImageUI();
    // 네트워크 상태 , 다운로드 상태 출력
    setDownloadHandlering();
    //플레이리스트UI
//    setLectureItem();
    //sleep Timer
    setSleeperUI();
    //플레이어 타이틀
    setPlayerTitle();
    // 지식영상 전용 , 추천 뷰 ,연관 컨텐츠 UI 구성 하기
//    setRelatedUI();

    // video-course , audiobook //
//    callbackWebPlayerInfo(CONTENT_TYPE, "");

    mButtonGroupLayout.setOnTouchListener(new View.OnTouchListener() {

      @Override
      public boolean onTouch(View v, MotionEvent event) {

        RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
        RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
        RelativeLayout myrepu_button_group = findViewById(R.id.MYREPU_BUTTON_GROUP);
        RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
        RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
        RelativeLayout welean_blank_line2 = findViewById(R.id.welean_blank_line2);
        RelativeLayout welean_blank_line = findViewById(R.id.welean_blank_line);
        RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);
        RelativeLayout play_network_type_text = findViewById(R.id.wrap_welean_play_network_type);

        if (event.getAction() == MotionEvent.ACTION_DOWN) {

          if (msubtitls_view.getVisibility() == View.VISIBLE
              || msubtitls_view_long.getVisibility() == View.VISIBLE) {

            if (!visible) {

              control_wrap_bg.setVisibility(View.VISIBLE);

              control_wrap_bg.setOnTouchListener(new View.OnTouchListener() {
                @Override
                public boolean onTouch(View v, MotionEvent event) {
                  return true;
                }
              });

              general_button_group.setVisibility(View.INVISIBLE);
              myrepu_button_group.setVisibility(View.INVISIBLE);
              play_button_group.setVisibility(View.INVISIBLE);
              smart_button_wrap.setVisibility(View.INVISIBLE);
              welean_blank_line2.setVisibility(View.INVISIBLE);
              welean_blank_line.setVisibility(View.INVISIBLE);
              welean_wrap_bg.setVisibility(View.INVISIBLE);

              msleep_view.setVisibility(View.INVISIBLE);

              play_network_type_text.setVisibility(View.INVISIBLE);

//              msubtitls_view.setY(msubtitls_view.getY() + control_wrap_bg.getHeight());
//              msubtitls_view_long.setY(
//                  msubtitls_view_long.getY() + control_wrap_bg.getHeight() + smart_button_wrap
//                      .getHeight() + welean_blank_line2.getHeight());

              visible = true;

              return true;

            } else {

              control_wrap_bg.setVisibility(View.VISIBLE);
              general_button_group.setVisibility(View.VISIBLE);
              myrepu_button_group.setVisibility(View.VISIBLE);
              play_button_group.setVisibility(View.VISIBLE);
              smart_button_wrap.setVisibility(View.VISIBLE);
              welean_blank_line2.setVisibility(View.VISIBLE);
              welean_blank_line.setVisibility(View.VISIBLE);
              welean_wrap_bg.setVisibility(View.VISIBLE);

              msleep_view.setVisibility(View.INVISIBLE);

              play_network_type_text.setVisibility(View.VISIBLE);

//              msubtitls_view.setY(msubtitls_view.getY() - control_wrap_bg.getHeight());
//              msubtitls_view_long.setY(
//                  msubtitls_view_long.getY() - control_wrap_bg.getHeight() - smart_button_wrap
//                      .getHeight() - welean_blank_line2.getHeight());

              visible = false;
              return true;
            }
          }
        }
        return false;
      }
    });
  }

  private void initializePlaybackSpeed() {
    String speedRate = Preferences.getWelaaaPlaySpeedrate(PlayerActivity.this);
    switch (speedRate) {
      case "0.8":
        mBtnIconBtnSpeed.setBackgroundResource(R.drawable.icon_speed_08);
        speedIndex = 3;
        break;

      case "1.2":
        mBtnIconBtnSpeed.setBackgroundResource(R.drawable.icon_speed_12);
        speedIndex = 1;
        break;

      case "1.5":
        mBtnIconBtnSpeed.setBackgroundResource(R.drawable.icon_speed_15);
        speedIndex = 2;
        break;

      default:
        mBtnIconBtnSpeed.setBackgroundResource(R.drawable.icon_speed_10);
        speedIndex = 0;
        break;
    }
  }

  //// Chromecast
  private CastContext mCastContext = null;
  private CastSession mCastSession = null;
  private SessionManager mSessionManager = null;
  private SessionManagerListener<CastSession> mSessionManagerListener = null;
  private RemoteMediaClient mRemoteClient = null;
  private RemoteMediaClient.Listener mRemoteClientListener = null;
  private RemoteMediaClient.ProgressListener mRemoteClientProgressListener = null;
  private Cast.MessageReceivedCallback mMessageReceivedCallback = null;
  private PlayStatus mPlayStatus = PlayStatus.getObject();
  private boolean bNowOnChromecast = false;
  private boolean bCreated = false;
  private static boolean bCastReceiverRegistered = false;
  private final String CAST_MSG_NAMESPACE = "urn:x-cast:com.pallycon.cast";

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    super.onCreateOptionsMenu(menu);
    getMenuInflater().inflate(R.menu.browse, menu);
    CastButtonFactory
        .setUpMediaRouteButton(getApplicationContext(), menu, R.id.media_route_menu_item);
    return true;
  }

//  @Override
//  protected void onUserLeaveHint() {
//    if (Build.VERSION.SDK_INT >= VERSION_CODES.O) {
//      try {
//        PictureInPictureParams.Builder builder = new PictureInPictureParams.Builder();
//        builder.setAspectRatio(new Rational(16, 9));
//        enterPictureInPictureMode(builder.build());
//      } catch (Exception e) {
//        e.printStackTrace();
//      }
//    }
//  }

  @Override
  public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode) {
    super.onPictureInPictureModeChanged(isInPictureInPictureMode);
  }

  private void releaseCast() {
    Log.d(TAG, "[CAST] releaseCast()");

    bNowOnChromecast = false;
    mPlayStatus.clear();

    if (mRemoteClient != null) {
      Log.d(TAG, "[CAST] remote client is not null. releasing...");
      if (mRemoteClient.getCurrentItem() != null) {
        Log.d(TAG, "[CAST] there is a loaded content. stopping it...");
        mRemoteClient.stop();
      }

      removeCastReceivers();
      mRemoteClient = null;
    } else {
      bCastReceiverRegistered = false;
    }
  }

  private void addCastReceivers() {
    if (!bCastReceiverRegistered) {
      mRemoteClient.addListener(mRemoteClientListener);
      mRemoteClient.addProgressListener(mRemoteClientProgressListener, 0);
      bCastReceiverRegistered = true;
    }
  }

  private void removeCastReceivers() {
    //if( bCastReceiverRegistered ) {
    mRemoteClient.removeListener(mRemoteClientListener);
    mRemoteClient.removeProgressListener(mRemoteClientProgressListener);
    bCastReceiverRegistered = false;
    //}
  }

  private void createSessionManagerListener() {
    mSessionManagerListener = new SessionManagerListener<CastSession>() {
      @Override
      public void onSessionEnded(CastSession session, int error) {
        Log.d(TAG, "[CAST] onSessionEnded()");
        onApplicationDisconnected();
      }

      @Override
      public void onSessionResumed(CastSession session, boolean wasSuspended) {
        Log.d(TAG, "[CAST] onSessionResumed()");
        onApplicationConnected(session);
      }

      @Override
      public void onSessionResumeFailed(CastSession session, int error) {
        Log.d(TAG, "[CAST] onSessionResumeFailed()");
        onApplicationDisconnected();
      }

      @Override
      public void onSessionStarted(CastSession session, String sessionId) {
        Log.d(TAG, "[CAST] onSessionStarted()");
        onApplicationConnected(session);
      }

      @Override
      public void onSessionStartFailed(CastSession session, int error) {
        Log.d(TAG, "[CAST] onSessionStartFailed()");
        onApplicationDisconnected();
      }

      @Override
      public void onSessionStarting(CastSession session) {
        Log.d(TAG, "[CAST] onSessionStarting()");
      }

      @Override
      public void onSessionEnding(CastSession session) {
        Log.d(TAG, "[CAST] onSessionEnding()");
      }

      @Override
      public void onSessionResuming(CastSession session, String sessionId) {
        Log.d(TAG, "[CAST] onSessionResuming()");
      }

      @Override
      public void onSessionSuspended(CastSession session, int reason) {
        Log.d(TAG, "[CAST] onSessionSuspended()");
      }

      private void onApplicationConnected(CastSession castSession) {
        mCastSession = castSession;
        getRemoteMediaClient();

        try {
          mCastSession.setMessageReceivedCallbacks(CAST_MSG_NAMESPACE, mMessageReceivedCallback);
        } catch (IOException e) {
          e.printStackTrace();
        }

        mPlayStatus.mPosition = 0;
        boolean playWhenReady = true;

        mPlayStatus.mScreen = PlayStatus.SCREEN_CAST;

        Player player = LocalPlayback.getInstance(PlayerActivity.this).getPlayer();

        if (player != null) {
          mPlayStatus.mPosition = player.getCurrentPosition();
          playWhenReady = player.getPlayWhenReady();

          // pause local player
          player.setPlayWhenReady(false);

          // disable ui of local player
          simpleExoPlayerView.setUseController(false);
        }

        loadRemoteMedia(mPlayStatus.mPosition, playWhenReady);
      }

      private void onApplicationDisconnected() {
        // backup latest position before release
        long latestPosition = mPlayStatus.mPosition;
        releaseCast();

        mPlayStatus.mScreen = PlayStatus.SCREEN_LOCAL;

        // enable ui of local player
        simpleExoPlayerView.setUseController(true);

        Player player = LocalPlayback.getInstance(PlayerActivity.this).getPlayer();

        if (player == null) {
          Log.d(TAG, "[CAST] no local player. initializing...");
        }

        // seek position of local player to position of remote player
        if (player != null) {
          player.seekTo(latestPosition);
          player.setPlayWhenReady(shouldAutoPlay);
        }
      }
    };
  }

  private String getIdleReasonString(int idleReason) {
    switch (idleReason) {
      case MediaStatus.IDLE_REASON_FINISHED:    // 1
        return "Finish";
      case MediaStatus.IDLE_REASON_CANCELED:    // 2
        return "Canceled";
      case MediaStatus.IDLE_REASON_INTERRUPTED:    // 3
        return "Interrupted";
      case MediaStatus.IDLE_REASON_ERROR:    // 4
        return "Error";
      case MediaStatus.IDLE_REASON_NONE:    // 0
      default:
        return "None";
    }
  }

  private void createRemoteMediaClientListener() {
    mRemoteClientListener = new RemoteMediaClient.Listener() {
      @Override
      public void onStatusUpdated() {
        Log.d(TAG, "[CAST] onStatusUpdated()");

        if (mRemoteClient == null) {
          return;
        }

        switch (mRemoteClient.getPlayerState()) {
          case MediaStatus.PLAYER_STATE_IDLE:
            int idleReason = mRemoteClient.getIdleReason();
            Log.d(TAG, "[CAST] RemoteMediaClient.getPlayerState(): PLAYER_STATE_IDLE ("
                + getIdleReasonString(idleReason) + ")");
            mPlayStatus.mCurrentState = PlayStatus.STATE_IDLE;

            if (idleReason == MediaStatus.IDLE_REASON_FINISHED) {
              // starting cast after finish, idel reason is 'FINISH' yet.
              // app must handel 'FINISH' at start
              if (mPlayStatus.mPosition > 0) {
                releaseCast();
                finish();
              }
            }
            break;
          case MediaStatus.PLAYER_STATE_BUFFERING:
            Log.d(TAG, "[CAST] RemoteMediaClient.getPlayerState(): PLAYER_STATE_BUFFERING");
            mPlayStatus.mCurrentState = PlayStatus.STATE_BUFFERING;
            break;
          case MediaStatus.PLAYER_STATE_PLAYING:
            Log.d(TAG, "[CAST] RemoteMediaClient.getPlayerState(): PLAYER_STATE_PLAYING");
            mPlayStatus.mCurrentState = PlayStatus.STATE_PLAYING;
            shouldAutoPlay = true;
            break;
          case MediaStatus.PLAYER_STATE_PAUSED:
            Log.d(TAG, "[CAST] RemoteMediaClient.getPlayerState(): PLAYER_STATE_PAUSED");
            mPlayStatus.mCurrentState = PlayStatus.STATE_PAUSED;
            shouldAutoPlay = false;
            break;
          case MediaStatus.PLAYER_STATE_UNKNOWN:
          default:
            Log.d(TAG, "[CAST] RemoteMediaClient.getPlayerState(): PLAYER_STATE_UNKNOWN");
            break;
        }
      }

      @Override
      public void onMetadataUpdated() {
//				Log.d(TAG, "[CAST] onMetadataUpdated()");
      }

      @Override
      public void onQueueStatusUpdated() {
//				Log.d(TAG, "[CAST] onQueueStatusUpdated()");
      }

      @Override
      public void onPreloadStatusUpdated() {
//				Log.d(TAG, "[CAST] onPreloadStatusUpdated()");
      }

      @Override
      public void onSendingRemoteMediaRequest() {
        Log.d(TAG, "[CAST] onSendingRemoteMediaRequest()");
        Intent intent = new Intent(PlayerActivity.this, CastControllerActivity.class);
        startActivity(intent);
      }

      @Override
      public void onAdBreakStatusUpdated() {
        Log.d(TAG, "[CAST] onAdBreakStatusUpdated()");
      }
    };
  }

  private void createRemoteMediaClientProgressListener() {
    mRemoteClientProgressListener = new RemoteMediaClient.ProgressListener() {
      @Override
      public void onProgressUpdated(long l, long l1) {
        mPlayStatus.mPosition = l;
      }
    };
  }

  private void createMessageReceivedCallback() {
    mMessageReceivedCallback = new Cast.MessageReceivedCallback() {
      @Override
      public void onMessageReceived(CastDevice castDevice, String namespace, String message) {
        Log.d(TAG, "[CAST] message from receiver: " + message);
        switch (message) {
          case "PLAYBACK":
            Toast.makeText(getApplicationContext(),
                "The receiver can not play the contents. Is it supported contents format?",
                Toast.LENGTH_LONG).show();
            break;
          case "MEDIAKEYS":
            Toast.makeText(getApplicationContext(),
                "The receiver can not decrypt the contents. Please check license status",
                Toast.LENGTH_LONG).show();
            break;
          case "NETWORK":
            Toast.makeText(getApplicationContext(),
                "The receiver can not find the contents. Please check network status",
                Toast.LENGTH_LONG).show();
            break;
          case "MANIFEST":
            Toast.makeText(getApplicationContext(),
                "The receiver can not read the contents' manifest. Please contact contents provider",
                Toast.LENGTH_LONG).show();
            break;
          case "UNKNOWN":
          default:
            Toast.makeText(getApplicationContext(),
                "The receiver reports unknown error. Please try again", Toast.LENGTH_LONG).show();
            break;
        }

        releaseCast();
        finish();
      }
    };
  }

  private boolean getRemoteMediaClient(CastSession session) {
    if (session != null) {
      mCastSession = session;
    }
    return getRemoteMediaClient();
  }

  private boolean getRemoteMediaClient() {
    if (mRemoteClient != null) {
      removeCastReceivers();
      mRemoteClient = null;
    }

    mRemoteClient = mCastSession.getRemoteMediaClient();
    if (mRemoteClient == null) {
      Log.d(TAG, "[CAST] remote media client is null");
      return false;
    }

    addCastReceivers();

    return true;
  }

  private MediaInfo buildMediaInfo(String source, String title, String subtitle,
      String thumbImageUrl) {
    MediaMetadata movieMetadata = new MediaMetadata(MediaMetadata.MEDIA_TYPE_MOVIE);

    if (title == null) {
      title = "Content from sender app";
    }
    if (thumbImageUrl == null) {
      thumbImageUrl = "http://demo.netsync.co.kr/Mob/Cont/images/no_thumb.png";
    }

    movieMetadata.putString(MediaMetadata.KEY_TITLE, title);
    movieMetadata.putString(MediaMetadata.KEY_SUBTITLE, subtitle);
    movieMetadata.addImage(new WebImage(Uri.parse(thumbImageUrl)));

    JSONObject castCustomData = new JSONObject();
    try {
      Intent intent = getIntent();
      if (intent.hasExtra(PlaybackManager.DRM_LICENSE_URL)) {
        // get license custom data
        String userid = intent.getStringExtra(PlaybackManager.DRM_USERID);
        String cid = intent.getStringExtra(PlaybackManager.DRM_CID);
        String oid = intent.getStringExtra(PlaybackManager.DRM_OID);

        String licenseUrl = intent.getStringExtra(PlaybackManager.DRM_LICENSE_URL);
        String customData = PallyconWVMSDKFactory.getInstance(this).getCustomData(userid, cid, oid);

        // input license data for receiver
        castCustomData.put("ContentProtection", "widevine"); // 'widevine' must be lower case

        // IT DOES NOT WORK
//				castCustomData.put("licenseUrl", licenseUrl);
//				castCustomData.put("licenseCustomData", customData);

        // IT DOES NOT WORK TOO
        // create json object with 'pallycon-customdata-v2' and license custom data
//				JSONObject licenseCustomData = new JSONObject();
//				licenseCustomData.put("pallycon-customdata-v2", customData);
//				castCustomData.put("licenseUrl", licenseUrl);
//				castCustomData.put("licenseCustomData", licenseCustomData);

        // IT WORKS !!
        castCustomData.put("licenseUrl", licenseUrl + "?pallycon-customdata-v2=" + customData);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    return new MediaInfo.Builder(source)
        .setStreamType(MediaInfo.STREAM_TYPE_BUFFERED)
        .setContentType("application/dash+xml")
        .setMetadata(movieMetadata)
        .setCustomData(castCustomData)
        .setCustomData(castCustomData)
        .build();
  }

  private boolean loadRemoteMedia(long position, boolean autoPlay) {
    Log.d(TAG, "[CAST] loadRemoteMedia()");
    if (mCastSession == null) {
      Log.d(TAG, "[CAST] cast session is null");
      return false;
    }

    Intent intent = getIntent();
    Uri uri = intent.getData();

    if (uri == null || uri.toString().length() < 1) {
      Log.d(TAG, "[CAST] uri to cast is invalid");
      return false;
    }

    try {
      MediaLoadOptions options = new MediaLoadOptions.Builder()
          .setAutoplay(autoPlay)
          .setPlayPosition(position)
          .build();
      if (!getRemoteMediaClient()) {
        return false;
      }

      bNowOnChromecast = true;
      mRemoteClient.load(buildMediaInfo(uri.toString(), intent.getStringExtra(CONTENTS_TITLE), null,
          intent.getStringExtra(PlaybackManager.THUMB_URL)), options);
      return true;
    } catch (Exception e) {
      e.printStackTrace();
    }

    return false;
  }

  //// end of Chromecast

  public void setBaseUI() {
    mLayout = (LayoutInflater) getApplicationContext()
        .getSystemService(Context.LAYOUT_INFLATER_SERVICE);

    //컨트롤버튼그룹
    mButtonGroupLayout = findViewById(R.id.LAYOUT_BUTTON_GROUP);

    mPlaylistGroupLayout = findViewById(R.id.LAYOUT_PLAYLIST_GROUP);
    mLayout.inflate(R.layout.welean_playlist, mPlaylistGroupLayout, true);

    LinearLayout mPlaylistwrap = findViewById((R.id.playlistparent));
    mLayout.inflate(R.layout.welean_playlist_listview, mPlaylistwrap, true);

    mButtonGroupLayout.setVisibility(View.VISIBLE);
    mPlaylistGroupLayout.setVisibility(View.INVISIBLE);

    mRelatedListGroupLayout = findViewById(R.id.LAYOUT_RELATEDLIST_GROUP);
    mLayout.inflate(R.layout.welean_related_list_main, mRelatedListGroupLayout, true);

    if (mgestureScanner == null) {
      mgestureScanner = new GestureDetector(getApplicationContext(), mGestureListener);
    }

    mRelatedListGroupLayout.setOnTouchListener(new View.OnTouchListener() {
      @Override
      public boolean onTouch(View v, MotionEvent event) {
        return mgestureScanner.onTouchEvent(event);
      }
    });

    mRelatedListGroupLayout.setVisibility(View.INVISIBLE);

    mRelatedListBlinkText = findViewById(R.id.TEXT_RELATEDLIST_BLINK);

    mscrollRelatedView = findViewById(R.id.RELATED_LIST_ITEM_SCROLLVIEW);

    mscrollRelatedView.setOnTouchListener(new View.OnTouchListener() {
      @Override
      public boolean onTouch(View v, MotionEvent event) {
        return mgestureScanner.onTouchEvent(event);
      }
    });
  }

  GestureDetector.OnGestureListener mGestureListener = new GestureDetector.OnGestureListener() {

    @Override
    public boolean onDown(MotionEvent e) {
      return true;
    }

    @Override
    public void onShowPress(MotionEvent e) {
    }

    @Override
    public boolean onSingleTapUp(MotionEvent e) {
      return true;
    }

    @Override
    public boolean onScroll(MotionEvent e1, MotionEvent e2, float distanceX, float distanceY) {
      return false;
    }

    @Override
    public void onLongPress(MotionEvent e) {
    }

    @Override
    public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX, float velocityY) {

      try {
        if (Math.abs(e1.getY() - e2.getY()) > SWIPE_MAX_OFF_PATH) {
          return false;
        }

        Animation fadeout = null;

        if (e1.getX() - e2.getX() > SWIPE_MIN_DISTANCE) {
          fadeout = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_out_left);
        } else if (e2.getX() - e1.getX() > SWIPE_MIN_DISTANCE) {
          fadeout = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_out_right);
        }

        mRelatedListGroupLayout.startAnimation(fadeout);
        mRelatedListGroupLayout.setVisibility(View.GONE);

        setBackGroungLayout(false);

      } catch (Exception e) {
        e.printStackTrace();
      }

      return true;
    }
  };

  /****************************************************************************
   * 추천 뷰 상태에서 백그라운드 레이아웃 셋팅하기
   ****************************************************************************/
  public void setBackGroungLayout(boolean type) {

    RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
    RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
    RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
    RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
    RelativeLayout welean_blank_line2 = findViewById(R.id.welean_blank_line2);
    RelativeLayout welean_blank_line = findViewById(R.id.welean_blank_line);
    RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);
    RelativeLayout play_network_type_text = findViewById(R.id.wrap_welean_play_network_type);
    RelativeLayout myrepu_button_group = findViewById(R.id.MYREPU_BUTTON_GROUP);

    if (type) {

      control_wrap_bg.setVisibility(View.INVISIBLE);

// 추천 뷰 상태에서도 타이틀 영역은 나올 수 있도록 해주세요 . 2018.01.18
//            general_button_group.setVisibility(View.INVISIBLE);
      general_button_group.setVisibility(View.VISIBLE);

      myrepu_button_group.setVisibility(View.INVISIBLE);
      play_button_group.setVisibility(View.INVISIBLE);
      smart_button_wrap.setVisibility(View.GONE);
      welean_blank_line2.setVisibility(View.GONE);
      welean_blank_line.setVisibility(View.GONE);

//            welean_wrap_bg.setVisibility(View.INVISIBLE);
      welean_wrap_bg.setVisibility(View.VISIBLE);

      msleep_view.setVisibility(View.INVISIBLE);

      play_network_type_text.setVisibility(View.GONE);
    } else {
      control_wrap_bg.setVisibility(View.VISIBLE);
      general_button_group.setVisibility(View.VISIBLE);
      myrepu_button_group.setVisibility(View.VISIBLE);
      play_button_group.setVisibility(View.VISIBLE);
      smart_button_wrap.setVisibility(View.VISIBLE);
      welean_blank_line2.setVisibility(View.VISIBLE);
      welean_blank_line.setVisibility(View.VISIBLE);
      welean_wrap_bg.setVisibility(View.VISIBLE);

      msleep_view.setVisibility(View.INVISIBLE);

      play_network_type_text.setVisibility(View.VISIBLE);

      mRelatedViewBtn.setVisibility(View.VISIBLE);
    }
  }

  public void setSubtitlesUI() {

    if (msubtitls_view_long != null) {
      if (msubtitls_view_long.getVisibility() == View.VISIBLE) {

        msubtitls_view.setVisibility(View.VISIBLE);
        msubtitls_view_long.setVisibility(View.GONE);
        setBlankSpaceParams(msubtitls_view.getWidth(), 0);

        RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
        RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
        RelativeLayout myrepu_button_group = findViewById(R.id.MYREPU_BUTTON_GROUP);
        RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
        RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
        RelativeLayout welean_blank_line2 = findViewById(R.id.welean_blank_line2);
        RelativeLayout welean_blank_line = findViewById(R.id.welean_blank_line);
        RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);
        RelativeLayout play_network_type_text = findViewById(
            R.id.wrap_welean_play_network_type);

        play_button_group.setVisibility(View.VISIBLE);
        general_button_group.setVisibility(View.VISIBLE);
        myrepu_button_group.setVisibility(View.VISIBLE);
//                        control_wrap_bg.setVisibility(View.VISIBLE);
        smart_button_wrap.setVisibility(View.VISIBLE);
        welean_blank_line2.setVisibility(View.VISIBLE);
        welean_blank_line.setVisibility(View.VISIBLE);
        welean_wrap_bg.setVisibility(View.VISIBLE);

        play_network_type_text.setVisibility(View.VISIBLE);
      }
    }

    //자막UI set
    msubtitls_view = findViewById(R.id.SUB_TITLS_VIEW);

    mLayout.inflate(R.layout.welean_ui_subtitles, msubtitls_view, true);

    msubtitls_view_long = findViewById(R.id.SUB_TITLS_VIEW_LONG);

    mLayout.inflate(R.layout.welean_ui_subtitles_long, msubtitls_view_long, true);

    mfullSmiLayout = findViewById(R.id.fullTxtWrap);
    mscrollview = findViewById(R.id.shortScroll);
    mscrollTimeview = findViewById(R.id.shortTimeScroll);

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      mscrollview.setOnScrollChangeListener(new View.OnScrollChangeListener() {
        @Override
        public void onScrollChange(View view, int i, int i1, int i2, int i3) {
          mscrollTimeview.setScrollY(i1);
        }

      });
    }

    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.KITKAT) {

      mscrollview.getViewTreeObserver()
          .addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
            @Override
            public void onScrollChanged() {
              int scrollY = mscrollview.getScrollY(); // For ScrollView
              int scrollX = mscrollview.getScrollX(); // For HorizontalScrollView
              // DO SOMETHING WITH THE SCROLL COORDINATES

              mscrollTimeview.setScrollY(scrollY);
            }
          });
    }

    mlongScrollview = findViewById(R.id.longScrollTime);
    mlongScrollTimeview = findViewById(R.id.longScroll);

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      mlongScrollTimeview.setOnScrollChangeListener(new View.OnScrollChangeListener() {
        @Override
        public void onScrollChange(View view, int i, int i1, int i2, int i3) {
          mlongScrollview.setScrollY(i1);
        }

      });
    }

    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.KITKAT) {

      mlongScrollTimeview.getViewTreeObserver()
          .addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
            @Override
            public void onScrollChanged() {
              int scrollY = mlongScrollTimeview.getScrollY(); // For ScrollView
              int scrollX = mlongScrollTimeview.getScrollX(); // For HorizontalScrollView
              // DO SOMETHING WITH THE SCROLL COORDINATES

              mlongScrollview.setScrollY(scrollY);
            }
          });
    }

    setSubTitleJson();
  }

  public void setSubTitleJson() {

    try {
      if (Utils.isAirModeOn(getApplicationContext())) {
        setNoneSubtilteText();
        hasSubTitlsJesonUrl = false;
      } else {
        callbackMethodName = "play/contents-smi/";
        sendData(API_BASE_URL + callbackMethodName + getwebPlayerInfo().getCkey()[getContentId()],
            callbackMethodName);
      }
    } catch (Exception e) {
      e.printStackTrace();

      setNoneSubtilteText();
      hasSubTitlsJesonUrl = false;
    }
  }


  /*******************************************************************
   * 처음생성되는 버튼들
   *******************************************************************/
  private void buttonInit() {
    mSleeperHandler = new SleepTimeHandler(PlayerActivity.this);
    sleeptimerText = findViewById(R.id.sleeptext);

    mAniSlideShow = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_up);
    mAniSlideHide = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_down);

    mBtnForward = findViewById(R.id.CDN_TAG_BTN_FORWARD);
    mBtnBackward = findViewById(R.id.CDN_TAG_BTN_BACKWARD);
    mBtnClosed = findViewById(R.id.BTN_CLOSE);
    mButtonAudio = findViewById(R.id.BTN_AUDIO);
    mButtonVideo = findViewById(R.id.BTN_VIDEO);
//        mBtnPlaylist = (Button)findViewById(R.id.BTN_PLAY_LIST);
    mBtnSubtitlesOn = findViewById(R.id.BTN_SMI_ON);
    mBtnSubtitlesOff = findViewById(R.id.BTN_SMI_OFF);
    mBtnSubtitlesOff.setVisibility(View.INVISIBLE);
    mBtnPlaylistClose = findViewById(R.id.BUTTON_PLAYLIST_CLOSE);
    mBtnDownload = findViewById(R.id.BTN_DOWNLOAD);
    mBtnSleeper = findViewById(R.id.BTN_SLEEPINGMODE);
    mBtnSleep_Active = findViewById(R.id.BTN_SLEEPACTIVE);
    mBtnAutoplay = findViewById(R.id.BTN_AUTOPLAY);
    mBtnAutoplayCancel = findViewById(R.id.BTN_AUTOPLAY_CANCEL);
//        mBtnSpeed = ((Button)findViewById(R.id.BTN_SPEED));
    mBtnRock = findViewById(R.id.BTN_ROCK);
    mBtnUnRock = findViewById(R.id.BTN_UNROCK);

    mBtnIconBtnSpeed = findViewById(R.id.WELAAA_ICON_SPEED);
    mBtnIconBtnList = findViewById(R.id.WELAAA_ICON_LIST);

    mBtnSleep_title = findViewById(R.id.sleeptextTitle);
    mBtnSleep_15 = findViewById(R.id.sleeptext15);
    mBtnSleep_30 = findViewById(R.id.sleeptext30);
    mBtnSleep_45 = findViewById(R.id.sleeptext45);
    mBtnSleep_60 = findViewById(R.id.sleeptext60);

    mBtnSleep_cancel = findViewById(R.id.sleepCancelButton);

    // Landscape mode
    mBtnSleep_title_land = findViewById(R.id.sleeptextTitle_land);
    mBtnSleep_15_land = findViewById(R.id.sleeptext15_land);
    mBtnSleep_30_land = findViewById(R.id.sleeptext30_land);
    mBtnSleep_45_land = findViewById(R.id.sleeptext45_land);
    mBtnSleep_60_land = findViewById(R.id.sleeptext60_land);

    mBtnSleep_cancel_land = findViewById(R.id.sleepCancelButton_land);

    mBtnSubtitleTextSmall = findViewById(R.id.fontsize_small);
    mBtnSubtitleTextNormal = findViewById(R.id.fontsize_normal);
    mBtnSubtitleTextBig = findViewById(R.id.fontsize_big);

    mBtnSubtitleTextSmallOff = findViewById(R.id.fontsize_small_off);
    mBtnSubtitleTextNormalOff = findViewById(R.id.fontsize_normal_off);
    mBtnSubtitleTextBigOff = findViewById(R.id.fontsize_big_off);

    mBtnlistClose = findViewById(R.id.BUTTON_PLAYLIST_LIST);

    mButton_playlist_close_linear = findViewById(R.id.BUTTON_PLAYLIST_CLOSE_LINEAR);
    mButton_player_close_linear = findViewById(R.id.BTN_CLOSE_LINEAR);

    mBtnArrowLeft = findViewById(R.id.leftArrowButton);
    mBtnArrowRight = findViewById(R.id.rightArrowButton);

    mButton_Arrow_Layout = findViewById(R.id.ARROW_LAYOUT);

    mBtnVolume = findViewById(R.id.welaaa_volume_btn);
    mBtnVolumeActive = findViewById(R.id.welaaa_volume_btn_active);

    mVolumeControlBar = findViewById(R.id.VOLUME_CONTROL_BAR);

    mTextViewVolumeText = findViewById(R.id.VOLUME_SEEK_TITLE);

    mMyRepuBoxLinear = findViewById(R.id.myrepu_box_linear);

    mRelatedListClosed = findViewById(R.id.BUTTON_RELATEDLIST_CLOSE);

    mRelatedViewBtn = findViewById(R.id.RELATED_BUTTON_GROUP);
    mRelatedViewTopCloseBtn = findViewById(R.id.BUTTON_RELATEDLIST_TOP_CLOSE);

    mRelatedViewBtn.setVisibility(GONE);

    // 자동 재생 설정 여부에 따라 분기 처리 ..
//    if (Preferences.getWelaaaPlayAutoPlay(getApplicationContext())) {
    mBtnAutoplay.setVisibility(View.INVISIBLE);
    mBtnAutoplayCancel.setVisibility(View.VISIBLE);
//    } else {
//      mBtnAutoplay.setVisibility(View.VISIBLE);
//      mBtnAutoplayCancel.setVisibility(View.INVISIBLE);
//    }

    if (Preferences.getWelaaaPlayerSleepMode(getApplicationContext())) {
      mBtnSleeper.setVisibility(View.INVISIBLE);
      mBtnSleep_Active.setVisibility(View.VISIBLE);
      sleeptimerText.setVisibility(View.VISIBLE);
    } else {
      mBtnSleeper.setVisibility(View.VISIBLE);
      mBtnSleep_Active.setVisibility(View.INVISIBLE);
      sleeptimerText.setVisibility(View.INVISIBLE);
    }

    String ckey = "";

    if (Utils.isAirModeOn(getApplicationContext())) {
      ckey = "70";
    } else {
      try {
        ckey = getwebPlayerInfo().getCkey()[getContentId()];
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    try {
      if (ContentManager().existCid(ckey)) {
//            mBtnDownload.setEnabled(false);
        mBtnDownload.setAlpha(0.5f);
      } else {
        mBtnDownload.setBackgroundDrawable(getResources().getDrawable(R.drawable.icon_download));
      }
    } catch (
        Exception e)

    {
      e.printStackTrace();
    }

    mSeekBar =

        findViewById(R.id.exo_progress);
//    mRelatedViewBtn.setVisibility(View.VISIBLE);

    mBtnForward.setOnClickListener(click_control);
    mBtnBackward.setOnClickListener(click_control);
    mBtnClosed.setOnClickListener(click_control);
    mButtonAudio.setOnClickListener(click_control);
    mButtonVideo.setOnClickListener(click_control);
//        mBtnPlaylist.setOnClickListener((View.OnClickListener)click_control);
    mBtnPlaylistClose.setOnClickListener(click_control);
    mBtnDownload.setOnClickListener(click_control);
//        mBtnSpeed.setOnClickListener((View.OnClickListener)click_control);
    mBtnAutoplay.setOnClickListener(click_control);
    mBtnAutoplayCancel.setOnClickListener(click_control);
    mBtnSleeper.setOnClickListener(click_control);
    mBtnSleep_Active.setOnClickListener(click_control);
    mBtnRock.setOnClickListener(click_control);
    mBtnUnRock.setOnClickListener(click_control);
    mBtnSubtitlesOn.setOnClickListener(click_control);
    mBtnSubtitlesOff.setOnClickListener(click_control);

    mBtnIconBtnSpeed.setOnClickListener(click_control);
    mBtnIconBtnList.setOnClickListener(click_control);

    mBtnSubtitleTextSmall.setOnClickListener(click_control);
    mBtnSubtitleTextNormal.setOnClickListener(click_control);
    mBtnSubtitleTextBig.setOnClickListener(click_control);

    mBtnSubtitleTextSmallOff.setOnClickListener(click_control);
    mBtnSubtitleTextNormalOff.setOnClickListener(click_control);
    mBtnSubtitleTextBigOff.setOnClickListener(click_control);

    mBtnSleep_title.setOnClickListener(click_control);
    mBtnSleep_15.setOnClickListener(click_control);
    mBtnSleep_30.setOnClickListener(click_control);
    mBtnSleep_45.setOnClickListener(click_control);
    mBtnSleep_60.setOnClickListener(click_control);
    mBtnSleep_cancel.setOnClickListener(click_control);

    mBtnlistClose.setOnClickListener(click_control);

    mBtnSleep_title_land.setOnClickListener(click_control);
    mBtnSleep_15_land.setOnClickListener(click_control);
    mBtnSleep_30_land.setOnClickListener(click_control);
    mBtnSleep_45_land.setOnClickListener(click_control);
    mBtnSleep_60_land.setOnClickListener(click_control);
    mBtnSleep_cancel_land.setOnClickListener(click_control);

    mBtnlistClose.setOnClickListener(click_control);

    mButton_playlist_close_linear.setOnClickListener(click_control);
    mButton_player_close_linear.setOnClickListener(click_control);

    mBtnArrowLeft.setOnClickListener(click_control);
    mBtnArrowRight.setOnClickListener(click_control);

    mBtnVolume.setOnClickListener(click_control);
    mBtnVolumeActive.setOnClickListener(click_control);

    mVolumeControlBar.setOnClickListener(click_control);

    mMyRepuBoxLinear.setOnClickListener(click_control);

    mRelatedListClosed.setOnClickListener(click_control);
    mRelatedViewBtn.setOnClickListener(click_control);

    mRelatedViewTopCloseBtn.setOnClickListener(click_control);

  }

  static double timesleep = 0;

  public void sleepstart() {

//        timesleep = (double) (sleeperNum * (60 * 1000)) + 1000;
    timesleep = (double) (sleeperNum * (60 * 1000));
    startSleepTimeThread();
  }

  public String timeToString(double time) {
    int nTotal = (int) (time / 1000.0D);
    int nHour = nTotal / 3600;
    int nMin = (nTotal / 60) % 60;
    int nSec = nTotal % 60;

    if (nHour > 0) {
      return String.format("%02d:%02d:%02d", nHour, nMin, nSec);
    }
    return String.format("%02d:%02d", nMin, nSec);
  }

  class SleepTimeHandler extends Handler {

    private final WeakReference<PlayerActivity> mController;

    public SleepTimeHandler(PlayerActivity controller) {
      mController = new WeakReference<PlayerActivity>(controller);
    }

    public void handleMessage(Message msg) {
      sleeptimerText.setText(mController.get().timeToString(mController.get().timesleep));

      if (mController.get().timesleep <= 0) {
        mSleeperHandler.removeCallbacksAndMessages(null);

        finishForSleeper();

      } else {
        timesleep = timesleep - 1000;

        if (mSleeperHandler != null) {
          mSleeperHandler.sendEmptyMessageDelayed(0, 1000);
        }
      }
    }
  }


  public void stopSleepTimeThread() {
    stopFlag = true;

    // 핸들러 초기화 처리 !
    if (mSleeperHandler != null) {
      mSleeperHandler.removeCallbacksAndMessages(null);
    }

  }

  static Boolean stopFlag = false;

  public void startSleepTimeThread() {
    stopFlag = false;

    try {
      if (sleeptimeThread.getState() == Thread.State.NEW) {
        Message msg = mSleeperHandler.obtainMessage();
        mSleeperHandler.sendMessageDelayed(msg, 1000);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private static class SleepTimeThreader extends Thread {

    public SleepTimeThreader(Runnable runnable) {
      super(runnable);
    }
  }

  static SleepTimeThreader sleeptimeThread = new SleepTimeThreader(new Runnable() {
    boolean roop = true;

    @Override
    public void run() {
      while (roop) {
        try {
          if (!stopFlag) {
            Message msg = mSleeperHandler.obtainMessage();
            mSleeperHandler.sendMessageDelayed(msg, 1000);

            timesleep = timesleep - 1000;

            if (timesleep > 0) {
              Thread.sleep(1000);
              // Thread 를 사용안 하는 방법
            }
          }
        } catch (Exception ex) {
          ex.printStackTrace();
        }
      }
    }
  });

  /*******************************************************************
   * 버튼들 listener
   *******************************************************************/
  final View.OnClickListener click_control = new View.OnClickListener() {
    @Override
    public void onClick(View v) {
      // Preventing multiple clicks, using threshold of 1 second
      if (SystemClock.elapsedRealtime() - mLastClickTime < 1000) {
        return;
      }
      mLastClickTime = SystemClock.elapsedRealtime();

      try {
        Player player = LocalPlayback.getInstance(PlayerActivity.this).getPlayer();

        switch (v.getId()) {
          case R.id.BTN_AUTOPLAY: {
            Utils.logToast(getApplicationContext(), getString(R.string.auto_play_option_on));

            mBtnAutoplay.setVisibility(View.INVISIBLE);
            mBtnAutoplayCancel.setVisibility(View.VISIBLE);
            Preferences.setWelaaaPlayAutoPlay(getApplicationContext(), true);
          }
          break;

          case R.id.BTN_AUTOPLAY_CANCEL: {
//            Utils.logToast(getApplicationContext(), getString(R.string.auto_play_option));
//
//            mBtnAutoplay.setVisibility(View.VISIBLE);
//            mBtnAutoplayCancel.setVisibility(View.INVISIBLE);
//            Preferences.setWelaaaPlayAutoPlay(getApplicationContext(), false);
          }
          break;

          case R.id.WELAAA_ICON_SPEED: {
            ArrayList<Integer> ids = new ArrayList<Integer>();

            ids.add(R.drawable.icon_speed_12);
            ids.add(R.drawable.icon_speed_15);
            ids.add(R.drawable.icon_speed_08);
            ids.add(R.drawable.icon_speed_10);

            if (speedIndex < ids.size()) {
              mBtnIconBtnSpeed.setBackgroundResource(ids.get(speedIndex));
              speedIndex++;

              if (speedIndex == 1) {
                speedNum = 1.2;
              } else if (speedIndex == 2) {
                speedNum = 1.5;
              } else if (speedIndex == 3) {
                speedNum = 0.8;
              } else if (speedIndex == 4) {
                speedNum = 1.0;
                speedIndex = 0; // 초기화
              }
            }

            String snum = String.valueOf(speedNum);
            Preferences.setWelaaaPlaySpeedrate(getApplicationContext(), snum);

            float f = (float) speedNum;
            PlaybackParameters param = new PlaybackParameters(f);
            player.setPlaybackParameters(param);
          }
          break;

          case R.id.CDN_TAG_BTN_BACKWARD: {

            if (CONTENT_TYPE.equals("video-course")) {

              if (cId != null) {
                if (cId.startsWith("z")) {
                  if (player.getCurrentPosition() - 30000 < 0) {
                    //
                  } else {
                    player.seekTo(player.getCurrentPosition() - 30000);
                  }
                }else{
                  if (player.getCurrentPosition() - 10000 < 0) {
                    //
                  } else {
                    player.seekTo(player.getCurrentPosition() - 10000);
                  }
                }
              }

            }else{
              if (player.getCurrentPosition() - 30000 < 0) {
                //
              } else {
                player.seekTo(player.getCurrentPosition() - 30000);
              }
            }

          }
          break;

          case R.id.CDN_TAG_BTN_FORWARD: {

            if (CONTENT_TYPE.equals("video-course")) {

              if (cId != null) {
                if (cId.startsWith("z")) {
                  if (player.getCurrentPosition() + 30000 > player.getDuration()) {
                    //
                  } else {
                    player.seekTo(player.getCurrentPosition() + 30000);
                  }
                }else{
                  if (player.getCurrentPosition() + 10000 > player.getDuration()) {
                    //
                  } else {
                    player.seekTo(player.getCurrentPosition() + 10000);
                  }
                }
              }

            }else{
              if (player.getCurrentPosition() + 30000 > player.getDuration()) {
                //
              } else {
                player.seekTo(player.getCurrentPosition() + 30000);
              }
            }
          }
          break;

          case R.id.BTN_SMI_ON: {

            if (CAN_PLAY) {
              mBtnSubtitlesOff.setVisibility(View.VISIBLE);
              mBtnSubtitlesOn.setVisibility(View.INVISIBLE);

              msubtitls_view.setVisibility(View.VISIBLE);
              msubtitls_view_long.setVisibility(View.INVISIBLE);

              final int positoinY = getTextviewHeight() * getTextViewNumber();

              mscrollview.scrollTo(0, positoinY);

              simpleExoPlayerView.setControllerShowTimeoutMs(0);
              simpleExoPlayerView.setControllerHideOnTouch(false);
            } else {
              Utils.logToast(getApplicationContext(), getString(R.string.info_no_support));
            }

          }
          break;

          case R.id.BTN_SMI_OFF: {
            mBtnSubtitlesOff.setVisibility(View.GONE);
            mBtnSubtitlesOn.setVisibility(View.VISIBLE);
            msubtitls_view.setVisibility(View.GONE);
            msubtitls_view_long.setVisibility(View.GONE);

            final int positoinY = getTextviewHeight() * getTextViewNumber();
            mscrollview.scrollTo(0, positoinY);

            simpleExoPlayerView.setControllerShowTimeoutMs(10000);
            simpleExoPlayerView.setControllerHideOnTouch(true);

          }
          break;

          case R.id.BTN_ROCK: {
            Button unRock = findViewById(R.id.BTN_UNROCK_IN);
            Button lock = findViewById(R.id.BTN_ROCK);
            unRock.setVisibility(View.VISIBLE);
            mBtnRock.setVisibility(View.INVISIBLE);

            FrameLayout mframelayout = findViewById(R.id.blank_Rock_view);
            mframelayout.setVisibility(View.VISIBLE);

            int[] position = Utils.getViewPosition(mBtnRock);

            int positionX = position[0];
            int positionY = position[1] - mBtnUnRock.getHeight() / 2;

            mBtnUnRock.setX(positionX);
            mBtnUnRock.setY(positionY);

            Preferences.setWelaaaPlayLockUsed(getApplicationContext(), true);

            mframelayout.setOnTouchListener(new View.OnTouchListener() {
              @Override
              public boolean onTouch(View v, MotionEvent event) {
                return true;
              }
            });

          }
          break;

          case R.id.BTN_UNROCK: {
            Preferences.setWelaaaPlayLockUsed(getApplicationContext(), false);

            mBtnRock.setVisibility(View.VISIBLE);
            Button unRock = findViewById(R.id.BTN_UNROCK_IN);
            unRock.setVisibility(View.INVISIBLE);

            FrameLayout mframelayout = findViewById(R.id.blank_Rock_view);
            mframelayout.setVisibility(View.INVISIBLE);
          }

          break;

          case R.id.welaaa_volume_btn:
            mBtnVolume.setVisibility(View.INVISIBLE);
            mBtnVolumeActive.setVisibility(View.VISIBLE);

            mVolumeControlBar.setVisibility(View.VISIBLE);

            RelativeLayout welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            RelativeLayout welean_blank_line = findViewById(R.id.welean_blank_line);

            welean_blank_line2.setVisibility(View.INVISIBLE);
            welean_blank_line.setVisibility(View.INVISIBLE);

            updateVolumeUI();
            break;

          case R.id.welaaa_volume_btn_active:

            mBtnVolume.setVisibility(View.VISIBLE);
            mBtnVolumeActive.setVisibility(View.INVISIBLE);

            mVolumeControlBar.setVisibility(View.INVISIBLE);

            welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            welean_blank_line = findViewById(R.id.welean_blank_line);

            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);

            updateVolumeUI();
            break;

          case R.id.myrepu_box_linear: {
            alertMyRepuWindow("강의클립이 흥미로우셨나요?", "회원님의 의견이 더 좋은 강의를 만드는 원동력이 됩니다! ", 1, 1, 0);
          }
          break;

          case R.id.BTN_AUDIO: {
            LocalPlayback.getInstance(PlayerActivity.this).setRendererDisabled(true);

            ImageView audioModeBackgroundImg = findViewById(R.id.audio_mode_backgroundimg);

            Glide
                .with(getApplicationContext())
                .load(getwebPlayerInfo().getGroupImg())
                .centerCrop()
                .placeholder(null)
                .crossFade()
                .into(audioModeBackgroundImg);

            audioModeBackgroundLayout.setVisibility(View.VISIBLE); //이미지보이고
            audioModeIconHeadset.setVisibility(View.VISIBLE); //아이콘보이고
            mButtonAudio.setVisibility(View.INVISIBLE); //오디오버튼아이콘 안보이고
            mButtonVideo.setVisibility(View.VISIBLE); //비디오버튼아이콘 보이고
          }
          break;

          case R.id.BTN_VIDEO: {
            LocalPlayback.getInstance(PlayerActivity.this).setRendererDisabled(false);

            audioModeBackgroundLayout.setVisibility(View.GONE);
            audioModeIconHeadset.setVisibility(View.GONE);
            mButtonAudio.setVisibility(View.VISIBLE);
            mButtonVideo.setVisibility(View.INVISIBLE);
          }
          break;

          case R.id.BTN_DOWNLOAD: {

            String ckey = getwebPlayerInfo().getCkey()[getContentId()];
            if (ContentManager().existCid(ckey)) {
              Utils.logToast(getApplicationContext(),
                  getString(R.string.info_dial_already_download));
            } else {
              ConnectivityManager cmgr = (ConnectivityManager) getApplicationContext()
                  .getSystemService(Context.CONNECTIVITY_SERVICE);
              NetworkInfo netInfo = cmgr.getActiveNetworkInfo();

              boolean isOnlyWifiDownload = Preferences.getOnlyWifiDownload(getApplicationContext());

              if (isOnlyWifiDownload && netInfo.isConnected() && !netInfo.getTypeName()
                  .equals("WIFI")) {

                UiThreadUtil.runOnUiThread(new Runnable() {
                  @Override
                  public void run() {
                    alertDownloadWindow(getString(R.string.info_dial_notice),
                        "현재 네트워크 환경이  Wi-Fi 가 아닙니다.\n Wi-Fi 환경이 아닌 3G/LTE 상에 재생시 가입하신 요금제 따라 데이터 요금이 발생할 수 있습니다. \n 계속 진행 하시겠습니까 ?",
                        getString(R.string.info_dial_ok),
                        getString(R.string.info_dial_cancel),
                        FLAG_DOWNLOAD_NETWORK_CHECK);
                  }
                });

                return;
              } else {
                if (CAN_PLAY) {
                  alertDownloadWindow("알림", "다운로드를 받으시겠습니까?", "확인", "취소", 1);
                } else {
                  Utils.logToast(getApplicationContext(), getString(R.string.info_no_support));
                }
              }
            }
          }
          break;

          case R.id.WELAAA_ICON_LIST: {
            if (CAN_PLAY) {
              callbackWebPlayerInfo(CONTENT_TYPE, "");
            } else {
              Utils.logToast(getApplicationContext(), getString(R.string.info_no_support));
            }
          }
          break;

          case R.id.BTN_SLEEPINGMODE: {
            msleep_view.setVisibility(View.VISIBLE);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);

            play_button_group.setVisibility(View.INVISIBLE);
            smart_button_wrap.setVisibility(View.INVISIBLE);
            welean_blank_line2.setVisibility(View.INVISIBLE);
            welean_blank_line.setVisibility(View.INVISIBLE);

            setSleeper();
          }
          break;

          case R.id.BTN_SLEEPACTIVE: {
            Preferences.setWelaaaPlayerSleepMode(getApplicationContext(), false);
            mBtnSleeper.setVisibility(View.VISIBLE);
            mBtnSleep_Active.setVisibility(View.INVISIBLE);
            sleeptimerText.setVisibility(View.INVISIBLE);
            cancelSleeper();
          }
          break;

          case R.id.sleeptextTitle: {
            msleep_view.setVisibility(View.INVISIBLE);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);

            play_button_group.setVisibility(View.VISIBLE);
            smart_button_wrap.setVisibility(View.VISIBLE);
            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);

          }
          break;

          case R.id.sleeptextTitle_land: {
            msleep_view.setVisibility(View.INVISIBLE);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);

            play_button_group.setVisibility(View.VISIBLE);
            smart_button_wrap.setVisibility(View.VISIBLE);
            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);

          }

          break;

          case R.id.sleepCancelButton: {
            msleep_view.setVisibility(View.INVISIBLE);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);

            play_button_group.setVisibility(View.VISIBLE);
            smart_button_wrap.setVisibility(View.VISIBLE);
            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);

          }
          break;

          case R.id.sleepCancelButton_land: {
            msleep_view.setVisibility(View.INVISIBLE);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);

            play_button_group.setVisibility(View.VISIBLE);
            smart_button_wrap.setVisibility(View.VISIBLE);
            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);

          }
          break;

          case R.id.sleeptext15: {
            msleep_view.setVisibility(View.INVISIBLE);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);

            play_button_group.setVisibility(View.VISIBLE);
            smart_button_wrap.setVisibility(View.VISIBLE);
            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);

            if (BuildConfig.BUILD_TYPE.equals("debug")) {
              sleeperNum = 2;
            } else {
              sleeperNum = 15;
            }

            sleepstart();
            mBtnSleeper.setVisibility(View.INVISIBLE);
            mBtnSleep_Active.setVisibility(View.VISIBLE);
            sleeptimerText.setVisibility(View.VISIBLE);
            Preferences.setWelaaaPlayerSleepMode(getApplicationContext(), true);
          }
          break;

          case R.id.sleeptext30: {
            msleep_view.setVisibility(View.INVISIBLE);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);

            play_button_group.setVisibility(View.VISIBLE);
            smart_button_wrap.setVisibility(View.VISIBLE);
            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);
            //-- 2017.05.04

            sleeperNum = 30;

            sleepstart();
            mBtnSleeper.setVisibility(View.INVISIBLE);
            mBtnSleep_Active.setVisibility(View.VISIBLE);
            sleeptimerText.setVisibility(View.VISIBLE);
            Preferences.setWelaaaPlayerSleepMode(getApplicationContext(), true);

          }
          break;

          case R.id.sleeptext45: {
            msleep_view.setVisibility(View.INVISIBLE);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);

            play_button_group.setVisibility(View.VISIBLE);
            smart_button_wrap.setVisibility(View.VISIBLE);
            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);
            //-- 2017.05.04

            sleeperNum = 45;

            sleepstart();
            mBtnSleeper.setVisibility(View.INVISIBLE);
            mBtnSleep_Active.setVisibility(View.VISIBLE);
            sleeptimerText.setVisibility(View.VISIBLE);
            Preferences.setWelaaaPlayerSleepMode(getApplicationContext(), true);

          }
          break;

          case R.id.sleeptext60: {
            msleep_view.setVisibility(View.INVISIBLE);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);

            play_button_group.setVisibility(View.VISIBLE);
            smart_button_wrap.setVisibility(View.VISIBLE);
            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);
            //-- 2017.05.04

            sleeperNum = 60;

            sleepstart();
            mBtnSleeper.setVisibility(View.INVISIBLE);
            mBtnSleep_Active.setVisibility(View.VISIBLE);
            sleeptimerText.setVisibility(View.VISIBLE);
            Preferences.setWelaaaPlayerSleepMode(getApplicationContext(), true);

          }
          break;

          case R.id.BUTTON_PLAYLIST_CLOSE: {
            if (mPlaylistGroupLayout != null) {
              mPlaylistGroupLayout.startAnimation(mAniSlideHide);
            }
            if (mPlaylistGroupLayout != null) {
              mPlaylistGroupLayout.setVisibility(View.INVISIBLE);
            }
            if (mButtonGroupLayout != null) {
              mButtonGroupLayout.setVisibility(VISIBLE);
            }

            if (lectureListItemdapter != null) {
              lectureListItemdapter = null;
            }

            if (lectureAudioBookListItemdapter != null) {
              lectureAudioBookListItemdapter = null;
            }
          }

          break;

          case R.id.BUTTON_PLAYLIST_LIST: {
            if (mPlaylistGroupLayout != null) {
              mPlaylistGroupLayout.startAnimation(mAniSlideHide);
            }
            if (mPlaylistGroupLayout != null) {
              mPlaylistGroupLayout.setVisibility(View.INVISIBLE);
            }
            if (mButtonGroupLayout != null) {
              mButtonGroupLayout.setVisibility(VISIBLE);
            }

            if (lectureListItemdapter != null) {
              lectureListItemdapter = null;
            }
            if (lectureAudioBookListItemdapter != null) {
              lectureAudioBookListItemdapter = null;
            }
          }

          break;

          case R.id.BUTTON_PLAYLIST_CLOSE_LINEAR:
            if (mPlaylistGroupLayout != null) {
              mPlaylistGroupLayout.startAnimation(mAniSlideHide);
            }
            if (mPlaylistGroupLayout != null) {
              mPlaylistGroupLayout.setVisibility(View.INVISIBLE);
            }
            if (mButtonGroupLayout != null) {
              mButtonGroupLayout.setVisibility(VISIBLE);
            }

            if (lectureListItemdapter != null) {
              lectureListItemdapter = null;
            }
            if (lectureAudioBookListItemdapter != null) {
              lectureAudioBookListItemdapter = null;
            }
            break;

          case R.id.BTN_CLOSE:
            finish();
            break;

          case R.id.BTN_CLOSE_LINEAR:
            finish();
            break;

          case R.id.RELATED_BUTTON_GROUP:

            if (CON_CLASS != null) {
              Animation fadeout = null;
              fadeout = AnimationUtils
                  .loadAnimation(getApplicationContext(), R.anim.slide_in_right);

              mRelatedViewBtn.startAnimation(fadeout);

              fadeout.setAnimationListener(new Animation.AnimationListener() {
                @Override
                public void onAnimationStart(Animation animation) {
                  mRelatedViewBtn.setVisibility(GONE);
                }

                @Override
                public void onAnimationEnd(Animation animation) {

                  mRelatedViewBtn.setVisibility(GONE);
                  if (CON_CLASS.equals("1")) {

                    setBackGroungLayout(true);
                    Animation fadeout = null;
                    fadeout = null;
                    fadeout = AnimationUtils
                        .loadAnimation(getApplicationContext(), R.anim.slide_in_right);

                    mRelatedListGroupLayout.startAnimation(fadeout);

                    Animation textBlink = null;
                    textBlink = AnimationUtils
                        .loadAnimation(getApplicationContext(), R.anim.blink_animation);

                    mRelatedListBlinkText.startAnimation(textBlink);
                    mRelatedListGroupLayout.setVisibility(VISIBLE);

//										setRelatedEable(); // 추천 뷰 커스트마이징 제스쳐 넣기
                    if (getTransportControls() != null) {
                      getTransportControls().pause();
                    }
                  }
                }

                @Override
                public void onAnimationRepeat(Animation animation) {

                }
              });

            }
            break;

          case R.id.BUTTON_RELATEDLIST_TOP_CLOSE:
            creatDialog(WELAAAPLAYER_SUGGEST_CODE_PLAYERCONTROLLER);
            break;

          case R.id.leftArrowButton:
            doNextPlay(false);
            break;

          case R.id.rightArrowButton:
            doNextPlay(true);
            break;

          case R.id.fontsize_small: {
            fontSize = "small";

            Button fontsize_small = findViewById(R.id.fontsize_small);
            Button fontsize_small_off = findViewById(R.id.fontsize_small_off);

            Button fontsize_normal = findViewById(R.id.fontsize_normal);
            Button fontsize_normal_off = findViewById(R.id.fontsize_normal_off);

            Button fontsize_big = findViewById(R.id.fontsize_big);
            Button fontsize_big_off = findViewById(R.id.fontsize_big_off);

            fontsize_small.setVisibility(View.VISIBLE);
            fontsize_small_off.setVisibility(View.GONE);

            fontsize_normal.setVisibility(View.GONE);
            fontsize_normal_off.setVisibility(View.VISIBLE);

            fontsize_big.setVisibility(View.GONE);
            fontsize_big_off.setVisibility(View.VISIBLE);

            setFullText("small");

          }

          break;
          case R.id.fontsize_small_off: {
            fontSize = "small";

            Button fontsize_small = findViewById(R.id.fontsize_small);
            Button fontsize_small_off = findViewById(R.id.fontsize_small_off);

            Button fontsize_normal = findViewById(R.id.fontsize_normal);
            Button fontsize_normal_off = findViewById(R.id.fontsize_normal_off);

            Button fontsize_big = findViewById(R.id.fontsize_big);
            Button fontsize_big_off = findViewById(R.id.fontsize_big_off);

            fontsize_small.setVisibility(View.VISIBLE);
            fontsize_small_off.setVisibility(View.GONE);

            fontsize_normal.setVisibility(View.GONE);
            fontsize_normal_off.setVisibility(View.VISIBLE);

            fontsize_big.setVisibility(View.GONE);
            fontsize_big_off.setVisibility(View.VISIBLE);

            setFullText("small");

          }

          break;
          case R.id.fontsize_normal: {
            fontSize = "normal";

            Button fontsize_small = findViewById(R.id.fontsize_small);
            Button fontsize_small_off = findViewById(R.id.fontsize_small_off);

            Button fontsize_normal = findViewById(R.id.fontsize_normal);
            Button fontsize_normal_off = findViewById(R.id.fontsize_normal_off);

            Button fontsize_big = findViewById(R.id.fontsize_big);
            Button fontsize_big_off = findViewById(R.id.fontsize_big_off);

            fontsize_small.setVisibility(View.GONE);
            fontsize_small_off.setVisibility(View.VISIBLE);

            fontsize_normal.setVisibility(View.VISIBLE);
            fontsize_normal_off.setVisibility(View.GONE);

            fontsize_big.setVisibility(View.GONE);
            fontsize_big_off.setVisibility(View.VISIBLE);
            setFullText("normal");
          }
          break;
          case R.id.fontsize_normal_off: {
            fontSize = "normal";

            Button fontsize_small = findViewById(R.id.fontsize_small);
            Button fontsize_small_off = findViewById(R.id.fontsize_small_off);

            Button fontsize_normal = findViewById(R.id.fontsize_normal);
            Button fontsize_normal_off = findViewById(R.id.fontsize_normal_off);

            Button fontsize_big = findViewById(R.id.fontsize_big);
            Button fontsize_big_off = findViewById(R.id.fontsize_big_off);

            fontsize_small.setVisibility(View.GONE);
            fontsize_small_off.setVisibility(View.VISIBLE);

            fontsize_normal.setVisibility(View.VISIBLE);
            fontsize_normal_off.setVisibility(View.GONE);

            fontsize_big.setVisibility(View.GONE);
            fontsize_big_off.setVisibility(View.VISIBLE);
            setFullText("normal");
          }
          break;
          case R.id.fontsize_big: {
            fontSize = "big";

            Button fontsize_small = findViewById(R.id.fontsize_small);
            Button fontsize_small_off = findViewById(R.id.fontsize_small_off);

            Button fontsize_normal = findViewById(R.id.fontsize_normal);
            Button fontsize_normal_off = findViewById(R.id.fontsize_normal_off);

            Button fontsize_big = findViewById(R.id.fontsize_big);
            Button fontsize_big_off = findViewById(R.id.fontsize_big_off);

            fontsize_small.setVisibility(View.GONE);
            fontsize_small_off.setVisibility(View.VISIBLE);

            fontsize_normal.setVisibility(View.GONE);
            fontsize_normal_off.setVisibility(View.VISIBLE);

            fontsize_big.setVisibility(View.VISIBLE);
            fontsize_big_off.setVisibility(View.GONE);

            setFullText("big");
          }
          break;
          case R.id.fontsize_big_off: {
            fontSize = "big";

            Button fontsize_small = findViewById(R.id.fontsize_small);
            Button fontsize_small_off = findViewById(R.id.fontsize_small_off);

            Button fontsize_normal = findViewById(R.id.fontsize_normal);
            Button fontsize_normal_off = findViewById(R.id.fontsize_normal_off);

            Button fontsize_big = findViewById(R.id.fontsize_big);
            Button fontsize_big_off = findViewById(R.id.fontsize_big_off);

            fontsize_small.setVisibility(View.GONE);
            fontsize_small_off.setVisibility(View.VISIBLE);

            fontsize_normal.setVisibility(View.GONE);
            fontsize_normal_off.setVisibility(View.VISIBLE);

            fontsize_big.setVisibility(View.VISIBLE);
            fontsize_big_off.setVisibility(View.GONE);

            setFullText("big");
          }
          break;
        }

      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  };


  public void initAutoTextScrollNum() {
    autoTextScrollNum = 0;
    mscrollview.setScrollY(0);
    mscrollTimeview.setScrollY(0);
    moveScrollCheck = true;
    setTextViewNumber(0);
  }

  Boolean moveScrollCheck = true;

  public void autoTxtScroll(int current) {

    if (hasSubTitlsJesonUrl) {
      int emfontcolor = ContextCompat
          .getColor(getApplicationContext(), R.color.subtitls_emfont_color);

      if (current > mSubtitlstime[autoTextScrollNum]) {
        setTextViewNumber(autoTextScrollNum);

        int positionY = 0;

        positionY = getTextviewHeight() * getTextViewNumber();
        mscrollview.setScrollY(positionY);
        mscrollTimeview.setScrollY(positionY);

        shortSubTitlesTextView[autoTextScrollNum].setTextColor(emfontcolor);
        shortSubTitlesTextTimeView[autoTextScrollNum].setTextColor(emfontcolor);

        setFullText();
        moveScrollCheck = false;
      }
    }
  }

  public void setBlankSpaceParams(int width, int height) {
    RelativeLayout movingspace = findViewById(R.id.blank_space);
    movingspace.setLayoutParams(new RelativeLayout.LayoutParams(width, height));
  }

  public void setTextViewNumber(int num) {
    mTxtViewNumber = num;
  }

  public int getTextViewNumber() {
    return mTxtViewNumber;
  }

  public int getTextviewHeight() {
    int textViewHeight = Utils.dpToPx(getApplicationContext(), SHORT_SUBTITLS_SCROLL_VIEW_HEIGHT);
    return textViewHeight;
  }

  public int getTextviewHeightNew() {
    int textViewHeight = Utils.dpToPx(getApplicationContext(), NORMAL_SUBTITLS_SCROLL_VIEW_HEIGHT);
    return textViewHeight;
  }


  /*******************************************************************
   *  자막설정
   *******************************************************************/
  public void setSubtitle(String subTitle) {

    SubtitlsInfo msubtitlsInfo = new SubtitlsInfo(subTitle);

    if (mSubtitlsmemo != null) {
      mSubtitlsmemo = null;
    }

    if (mSubtitlstime != null) {
      mSubtitlstime = null;
    }

    mSubtitlsmemo = msubtitlsInfo.getMemo();
    mSubtitlstime = msubtitlsInfo.getTime();

    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        try {
          if (mSubtitlstime != null && mSubtitlsmemo != null) {
            setShortText();
            setFullText();
          }
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    });
  }

  /*******************************************************************
   *  자막이 없을 경우
   *  http://crashes.to/s/019819c138e 2017.09.19
   *******************************************************************/
  public void setNoneSubtilteText() {

    try {
      LinearLayout shortTextView = findViewById(R.id.shortTextView);
      if (shortTextView != null) {
        shortTextView.removeAllViews();
      }
      TextView mblankTextView = new TextView(getApplicationContext());
      mblankTextView.setText(R.string.nosubTitledata);

      int emfontcolor = ContextCompat
          .getColor(getApplicationContext(), R.color.colorPrimary);

      mblankTextView.setTextColor(emfontcolor);

      shortTextView.addView(mblankTextView);
    } catch (Exception e) {
      e.printStackTrace();
    }

  }

  /*******************************************************************
   *  짧은 자막 UI
   *******************************************************************/
  public void setShortText() {

    int fontcolor = 0;

    try {

      LinearLayout shortTextView = findViewById(R.id.shortTextView);
      LinearLayout shortTextTimeView = findViewById(R.id.shortTextTimeView);

      if (shortTextView != null) {
        shortTextView.removeAllViews();
      }
      if (shortTextTimeView != null) {
        shortTextTimeView.removeAllViews();
      }

      fontcolor = ContextCompat.getColor(getApplicationContext(), R.color.subtitls_font_color);

      subTitlsLineNum = new int[mSubtitlsmemo.length - 1];

      //TODO 자막파일에 마지막 빈파일은 삭제하고 -2를 -1로 바꾸세요.
      if (shortSubTitlesTextView != null) {
        shortSubTitlesTextView = null;
      }
      if (shortSubTitlesTextTimeView != null) {
        shortSubTitlesTextTimeView = null;
      }

      shortSubTitlesTextView = new TextView[mSubtitlsmemo.length - 2];
      shortSubTitlesTextTimeView = new TextView[mSubtitlsmemo.length - 2];

      for (int j = 0; j < mSubtitlsmemo.length - 2; j++) {

        if (shortSubTitlesTextView[j] != null) {
          shortSubTitlesTextView[j] = null;
        }
        if (shortSubTitlesTextTimeView[j] != null) {
          shortSubTitlesTextTimeView[j] = null;
        }

        shortSubTitlesTextView[j] = new TextView(getApplicationContext());
        shortSubTitlesTextView[j].setText(mSubtitlsmemo[j]);
        shortSubTitlesTextView[j].setHeight(getTextviewHeight());
        shortSubTitlesTextView[j].setTextColor(fontcolor);
        shortTextView.addView(shortSubTitlesTextView[j]);

        shortSubTitlesTextTimeView[j] = new TextView(getApplicationContext());
        shortSubTitlesTextTimeView[j].setText(Utils.timeToString(mSubtitlstime[j]));
        shortSubTitlesTextTimeView[j].setHeight(getTextviewHeight());
        shortSubTitlesTextTimeView[j].setTextColor(fontcolor);
        shortTextTimeView.addView(shortSubTitlesTextTimeView[j]);

      }

      shortTextView.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {

          for (int j = 0; j < mSubtitlsmemo.length - 2; j++) {
            subTitlsLineNum[j] =
                (shortSubTitlesTextView[j].getLineCount() * shortSubTitlesTextView[0]
                    .getLineHeight()) + shortSubTitlesTextView[0].getLineHeight();
          }

          setBlankSpaceParams(msubtitls_view_long.getWidth(), msubtitls_view_long.getHeight());
          Logger.i(TAG + ":setShortText setOnClickListener msubtitls_view_long.getWidth() "
              + msubtitls_view_long.getWidth());
          Logger.i(TAG + ":setShortText setOnClickListener msubtitls_view_long.getHeight() "
              + msubtitls_view_long.getHeight());
          msubtitls_view.setVisibility(View.GONE);
          msubtitls_view_long.setVisibility(View.VISIBLE);

          RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
          control_wrap_bg.setVisibility(View.VISIBLE);
          control_wrap_bg.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
              return true;
            }
          });

          RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
          RelativeLayout myrepu_button_group = findViewById(R.id.MYREPU_BUTTON_GROUP);
          RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
          RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
          RelativeLayout welean_blank_line2 = findViewById(R.id.welean_blank_line2);
          RelativeLayout welean_blank_line = findViewById(R.id.welean_blank_line);
          RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);
          RelativeLayout play_network_type_text = findViewById(R.id.wrap_welean_play_network_type);

          play_button_group.setVisibility(View.INVISIBLE);
          general_button_group.setVisibility(View.INVISIBLE);
          myrepu_button_group.setVisibility(View.INVISIBLE);
          smart_button_wrap.setVisibility(View.GONE);  // Full Screen
          welean_blank_line2.setVisibility(View.GONE);
          welean_blank_line.setVisibility(View.INVISIBLE);
          welean_wrap_bg.setVisibility(View.INVISIBLE);
          //
          play_network_type_text.setVisibility(View.INVISIBLE);

          Animation an = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_up);
          mfullSmiLayout.startAnimation(an);
          Logger.i(TAG + ":setShortText setOnClickListener onClick");
        }
      });
    } catch (Exception e) {
      e.printStackTrace();
    }

  }

  /*******************************************************************
   *  긴 자막 UI
   *******************************************************************/
  public void setFullText() {
    final LinearLayout textFullView = findViewById(R.id.fullTextTimeView);
    LinearLayout textFullTimeView = findViewById(R.id.fullTextView);
    LinearLayout longScroll_font = findViewById(R.id.longScroll_font);
    mfullSmiLayout = findViewById(R.id.fullTxtWrap);

    if (textFullView != null) {
      textFullView.removeAllViews();
    }
    if (textFullTimeView != null) {
      textFullTimeView.removeAllViews();
    }

    if (longSubTitlesTextView != null) {
      longSubTitlesTextView = null;
    }
    if (longSubTitlesTextTimeView != null) {
      longSubTitlesTextTimeView = null;
    }

    ScrollView longView = findViewById(R.id.longScroll);
    ScrollView longScrollTime = findViewById(R.id.longScrollTime);

    int fontcolor = ContextCompat
        .getColor(getApplicationContext(), R.color.subtitls_font_color_long);
    int fontcolorWhite = ContextCompat
        .getColor(getApplicationContext(), R.color.subtitls_font_color_long_white);

    longSubTitlesTextView = new TextView[mSubtitlsmemo.length - 2];
    longSubTitlesTextTimeView = new TextView[mSubtitlsmemo.length - 2];

    textViewSumHeight = new int[mSubtitlsmemo.length - 2];

    for (int j = 0; j < mSubtitlsmemo.length - 2; j++) {

      if (longSubTitlesTextView[j] != null) {
        longSubTitlesTextView[j] = null;
      }
      if (longSubTitlesTextTimeView[j] != null) {
        longSubTitlesTextTimeView[j] = null;
      }

      // 현재 하일라이트 된 자막 영역
      if (j == getTextViewNumber()) {

        longSubTitlesTextView[j] = new TextView(getApplicationContext());
        longSubTitlesTextView[j].setText(mSubtitlsmemo[j]);
        longSubTitlesTextView[j].setHeight(getTextviewHeight());
        longSubTitlesTextView[j].setTextColor(fontcolor);
//                longSubTitlesTextView[j].setLineSpacing(0,1.7f);

        if (fontSize.equals("small")) {
          longSubTitlesTextView[j].setTextSize(13);
        } else if (fontSize.equals("normal")) {
          longSubTitlesTextView[j].setTextSize(15);
        } else if (fontSize.equals("big")) {
          longSubTitlesTextView[j].setTextSize(17);
          longSubTitlesTextView[j].setHeight(getTextviewHeightNew());
        }

        longSubTitlesTextTimeView[j] = new TextView(getApplicationContext());
        longSubTitlesTextTimeView[j].setText(Utils.timeToString(mSubtitlstime[j]));
        longSubTitlesTextTimeView[j].setHeight(getTextviewHeight());
        longSubTitlesTextTimeView[j].setTextColor(fontcolor);
//                longSubTitlesTextTimeView[j].setLineSpacing(0,1.7f);

        if (fontSize.equals("small")) {
          longSubTitlesTextTimeView[j].setTextSize(13);
        } else if (fontSize.equals("normal")) {
          longSubTitlesTextTimeView[j].setTextSize(15);
        } else if (fontSize.equals("big")) {
          longSubTitlesTextTimeView[j].setTextSize(17);
          longSubTitlesTextTimeView[j].setHeight(getTextviewHeightNew());
        }

        final TextView highlightView = longSubTitlesTextView[j];
        final TextView highlightTimeView = longSubTitlesTextTimeView[j];

        try {
          textFullView.addView(highlightView);
          textFullTimeView.addView(highlightTimeView);
        } catch (Exception e) {
          e.printStackTrace();
        }

        int position = 0;

        position = getTextviewHeight() * getTextViewNumber();

        if (fontSize.equals("small")) {

        } else if (fontSize.equals("normal")) {

        } else if (fontSize.equals("big")) {
          position = getTextviewHeightNew() * getTextViewNumber();
        }

        longView.setScrollY(position);
        longScrollTime.setScrollY(position);

      } else {

        longSubTitlesTextView[j] = new TextView(getApplicationContext());
        longSubTitlesTextView[j].setText(mSubtitlsmemo[j]);
        longSubTitlesTextView[j].setHeight(getTextviewHeight());
        longSubTitlesTextView[j].setTextColor(fontcolorWhite);
//                longSubTitlesTextView[j].setLineSpacing(0,1.7f);

        if (fontSize.equals("small")) {
          longSubTitlesTextView[j].setTextSize(13);
        } else if (fontSize.equals("normal")) {
          longSubTitlesTextView[j].setTextSize(15);
        } else if (fontSize.equals("big")) {
          longSubTitlesTextView[j].setTextSize(17);
          longSubTitlesTextView[j].setHeight(getTextviewHeightNew());
        }

        longSubTitlesTextTimeView[j] = new TextView(getApplicationContext());
        longSubTitlesTextTimeView[j].setText(Utils.timeToString(mSubtitlstime[j]));
        longSubTitlesTextTimeView[j].setHeight(getTextviewHeight());
        longSubTitlesTextTimeView[j].setTextColor(fontcolorWhite);
//                longSubTitlesTextTimeView[j].setLineSpacing(0,1.7f);

        if (fontSize.equals("small")) {
          longSubTitlesTextTimeView[j].setTextSize(13);
        } else if (fontSize.equals("normal")) {
          longSubTitlesTextTimeView[j].setTextSize(15);
        } else if (fontSize.equals("big")) {
          longSubTitlesTextTimeView[j].setTextSize(17);
          longSubTitlesTextTimeView[j].setHeight(getTextviewHeightNew());
        }

        final TextView highlightView = longSubTitlesTextView[j];
        final TextView highlightTimeView = longSubTitlesTextTimeView[j];

        textFullView.addView(highlightView);
        textFullTimeView.addView(highlightTimeView);

      }
    }

    mfullSmiLayout.setOnClickListener(new View.OnClickListener() {

      @Override
      public void onClick(View view) {

      }
    });

    longScroll_font.setOnClickListener(new View.OnClickListener() {

      @Override
      public void onClick(View view) {

      }
    });

    textFullView.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {

        Animation an = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_down);
        mfullSmiLayout.startAnimation(an);

        an.setAnimationListener(new Animation.AnimationListener() {
          @Override
          public void onAnimationStart(Animation animation) {

          }

          @Override
          public void onAnimationEnd(Animation animation) {
            msubtitls_view.setVisibility(View.VISIBLE);
            msubtitls_view_long.setVisibility(View.GONE);
            setBlankSpaceParams(msubtitls_view.getWidth(), 0);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout myrepu_button_group = findViewById(R.id.MYREPU_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            RelativeLayout welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            RelativeLayout welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);
            RelativeLayout play_network_type_text = findViewById(
                R.id.wrap_welean_play_network_type);

            play_button_group.setVisibility(View.VISIBLE);
            general_button_group.setVisibility(View.VISIBLE);
            myrepu_button_group.setVisibility(View.VISIBLE);
            control_wrap_bg.setVisibility(View.VISIBLE);
            smart_button_wrap.setVisibility(View.VISIBLE);
            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);
            welean_wrap_bg.setVisibility(View.VISIBLE);
            play_network_type_text.setVisibility(View.VISIBLE);

          }

          @Override
          public void onAnimationRepeat(Animation animation) {

          }
        });
      }
    });
  }


  public void setFullText(String fontSize) {

    LinearLayout textFullView = findViewById(R.id.fullTextTimeView);
    LinearLayout textFullTimeView = findViewById(R.id.fullTextView);
    LinearLayout fontView = findViewById(R.id.longScroll_font);

    if (textFullView != null) textFullView.removeAllViews();
    if (textFullTimeView != null) textFullTimeView.removeAllViews();

    if (longSubTitlesTextView != null) longSubTitlesTextView = null;
    if (longSubTitlesTextTimeView != null) longSubTitlesTextTimeView = null;

    ScrollView longView = findViewById(R.id.longScroll);
    ScrollView longScrollTime = findViewById(R.id.longScrollTime);

    int fontcolor = ContextCompat.getColor(getApplicationContext(), R.color.subtitls_font_color_long);
    int fontcolorWhite = ContextCompat.getColor(getApplicationContext(), R.color.subtitls_font_color_long_white);

    longSubTitlesTextView = new TextView[mSubtitlsmemo.length - 2];
    longSubTitlesTextTimeView = new TextView[mSubtitlsmemo.length - 2];

    for (int j = 0; j < mSubtitlsmemo.length - 2; j++) {

      if (longSubTitlesTextView[j] != null) longSubTitlesTextView[j] = null;
      if (longSubTitlesTextTimeView[j] != null) longSubTitlesTextTimeView[j] = null;

      if (j == getTextViewNumber()) {

        longSubTitlesTextView[j] = new TextView(getApplicationContext());
        longSubTitlesTextView[j].setText(mSubtitlsmemo[j]);
        longSubTitlesTextView[j].setHeight(getTextviewHeight());
        longSubTitlesTextView[j].setTextColor(fontcolor);
        //longSubTitlesTextView[j].setLineSpacing(0,1.7f);

        if (fontSize.equals("small")) {
          longSubTitlesTextView[j].setTextSize(13);
        } else if (fontSize.equals("normal")) {
          longSubTitlesTextView[j].setTextSize(15);
        } else if (fontSize.equals("big")) {
          longSubTitlesTextView[j].setTextSize(17);
          longSubTitlesTextView[j].setHeight(getTextviewHeightNew());
        }

        textFullView.addView(longSubTitlesTextView[j]);

        longSubTitlesTextTimeView[j] = new TextView(getApplicationContext());
        longSubTitlesTextTimeView[j].setText(timeToString(mSubtitlstime[j]));
        longSubTitlesTextTimeView[j].setHeight(getTextviewHeight());
        longSubTitlesTextTimeView[j].setTextColor(fontcolor);
        //longSubTitlesTextTimeView[j].setLineSpacing(0,1.7f);

        if (fontSize.equals("small")) {
          longSubTitlesTextTimeView[j].setTextSize(13);
        } else if (fontSize.equals("normal")) {
          longSubTitlesTextTimeView[j].setTextSize(15);
        } else if (fontSize.equals("big")) {
          longSubTitlesTextTimeView[j].setTextSize(17);
          longSubTitlesTextTimeView[j].setHeight(getTextviewHeightNew());
        }

        textFullTimeView.addView(longSubTitlesTextTimeView[j]);

        int position = 0;

        position = getTextviewHeight() * getTextViewNumber();

        if (fontSize.equals("small")) {

        } else if (fontSize.equals("normal")) {

        } else if (fontSize.equals("big")) {
          position = getTextviewHeightNew() * getTextViewNumber();
        }

        longView.setScrollY(position);
        longScrollTime.setScrollY(position);

      } else {

        longSubTitlesTextView[j] = new TextView(getApplicationContext());
        longSubTitlesTextView[j].setText(mSubtitlsmemo[j]);
        longSubTitlesTextView[j].setHeight(getTextviewHeight());
        longSubTitlesTextView[j].setTextColor(fontcolorWhite);
//                longSubTitlesTextView[j].setLineSpacing(7,0);

        if (fontSize.equals("small")) {
          longSubTitlesTextView[j].setTextSize(13);
        } else if (fontSize.equals("normal")) {
          longSubTitlesTextView[j].setTextSize(15);
        } else if (fontSize.equals("big")) {
          longSubTitlesTextView[j].setTextSize(17);
          longSubTitlesTextView[j].setHeight(getTextviewHeightNew());
        }

        textFullView.addView(longSubTitlesTextView[j]);

        longSubTitlesTextTimeView[j] = new TextView(getApplicationContext());
        longSubTitlesTextTimeView[j].setText(timeToString(mSubtitlstime[j]));
        longSubTitlesTextTimeView[j].setHeight(getTextviewHeight());
        longSubTitlesTextTimeView[j].setTextColor(fontcolorWhite);
//                longSubTitlesTextTimeView[j].setLineSpacing(7,0);

        if (fontSize.equals("small")) {
          longSubTitlesTextTimeView[j].setTextSize(13);
        } else if (fontSize.equals("normal")) {
          longSubTitlesTextTimeView[j].setTextSize(15);
        } else if (fontSize.equals("big")) {
          longSubTitlesTextTimeView[j].setTextSize(17);
          longSubTitlesTextTimeView[j].setHeight(getTextviewHeightNew());
        }

        textFullTimeView.addView(longSubTitlesTextTimeView[j]);
      }
    }
    textFullView.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {

        Animation an = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_down);
        mfullSmiLayout.startAnimation(an);

        an.setAnimationListener(new Animation.AnimationListener() {
          @Override
          public void onAnimationStart(Animation animation) {

          }

          @Override
          public void onAnimationEnd(Animation animation) {
            msubtitls_view.setVisibility(View.VISIBLE);
            msubtitls_view_long.setVisibility(View.GONE);
            setBlankSpaceParams(msubtitls_view.getWidth(), 0);

            RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
            RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
            RelativeLayout myrepu_button_group = findViewById(R.id.MYREPU_BUTTON_GROUP);
            RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
            RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
            RelativeLayout welean_blank_line2 = findViewById(R.id.welean_blank_line2);
            RelativeLayout welean_blank_line = findViewById(R.id.welean_blank_line);
            RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);
            RelativeLayout play_network_type_text = findViewById(
                R.id.wrap_welean_play_network_type);

            play_button_group.setVisibility(View.VISIBLE);
            general_button_group.setVisibility(View.VISIBLE);
            myrepu_button_group.setVisibility(View.VISIBLE);
            control_wrap_bg.setVisibility(View.VISIBLE);
            smart_button_wrap.setVisibility(View.VISIBLE);
            welean_blank_line2.setVisibility(View.VISIBLE);
            welean_blank_line.setVisibility(View.VISIBLE);
            welean_wrap_bg.setVisibility(View.VISIBLE);
            play_network_type_text.setVisibility(View.VISIBLE);

          }

          @Override
          public void onAnimationRepeat(Animation animation) {

          }
        });
      }
    });
  }

  private void initControls() {
    try {
      volumeSeekbar = findViewById(R.id.VOLUME_SEEK_BAR);
      updateVolumeUI();
      volumeSeekbar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
        @Override
        public void onStopTrackingTouch(SeekBar arg0) {
        }

        @Override
        public void onStartTrackingTouch(SeekBar arg0) {
        }

        @Override
        public void onProgressChanged(SeekBar arg0, int progress, boolean arg2) {
          audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, progress, 0);

          updateVolumeUI();
        }
      });
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void updateVolumeUI() {
    final int max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
    final int progress = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);

    if (volumeSeekbar != null) {

      volumeSeekbar.setMax(audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC));
      volumeSeekbar.setProgress(audioManager.getStreamVolume(AudioManager.STREAM_MUSIC));
    }

    if (mTextViewVolumeText != null) {
      int progressInt = Math.round(100 / max) * progress;

      if (progressInt > 89) {
        progressInt = 100;
      }

      mTextViewVolumeText.setText(progressInt + "%");
    }
  }

  /****************************************************************************
   * 2017.11.13 별점 평가 UI 버튼 셋팅 합니다 지식영상만
   * 2017.11.21 별점 php 수신 이후 화면 랜더링 하기
   ****************************************************************************/
  public void setMyrepuSetUI() {

    final Handler setMyrepuSetUIHandler = new Handler() {
      public void handleMessage(android.os.Message msg)

      {
        try {

          if (CONTENT_TYPE.equals("video-course")) {
            mMyRepuBoxLinear.setVisibility(View.VISIBLE);

            if (mUserStar == null) {
              if (!Preferences.getWelaaaMyReputation(getApplicationContext()).equals("0")) {
                mUserStar = Preferences.getWelaaaMyReputation(getApplicationContext());
              } else {
                mUserStar = "";
              }
            }
            Preferences.setWelaaaMyReputation(PlayerActivity.this, "");
            if (mUserStar.equals("")) {
              // 등록된 별점 정보가 없는 경우
              TextView myrepu_text = findViewById(R.id.myrepu_text);
              myrepu_text.setVisibility(View.GONE);

              LinearLayout myrepu_linear = findViewById(R.id.myrepu_linear);
              myrepu_linear.setVisibility(View.GONE);

              LinearLayout myrepu_linear_update = findViewById(R.id.myrepu_linear_update);
              myrepu_linear_update.setVisibility(View.VISIBLE);
            } else {

              TextView myrepu_text = findViewById(R.id.myrepu_text);
              myrepu_text.setVisibility(View.VISIBLE);

              LinearLayout myrepu_linear = findViewById(R.id.myrepu_linear);
              myrepu_linear.setVisibility(View.VISIBLE);

              LinearLayout myrepu_linear_update = findViewById(R.id.myrepu_linear_update);
              myrepu_linear_update.setVisibility(View.GONE);

              TextView myrepu_star_text = findViewById(R.id.myrepu_star);
              myrepu_star_text
                  .setText(Preferences.getWelaaaMyReputation(getApplicationContext()) + ".0");
            }
          } else if (CONTENT_TYPE.equals("audiobook")) {
            mMyRepuBoxLinear.setVisibility(View.GONE);
          }
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    };

    setMyrepuSetUIHandler.sendEmptyMessageDelayed(0, 500);

    return;
  }

  /****************************************************************************
   * 2017.11.13 연관콘텐츠 뷰 셋팅 지식영상만
   ****************************************************************************/
  public void setRelatedUI() {

    final Handler setRelatedUIHandler = new Handler() {
      public void handleMessage(android.os.Message msg)

      {
        try {

          if (CONTENT_TYPE.equals("video-course")) {
//            loadRelatedData();

            callbackMethodName = "contents/playlist-suggest/";

            String callbackCid = "";

            if (getwebPlayerInfo().getCkey()[getContentId()].contains("_")) {
              String[] cid = getwebPlayerInfo().getCkey()[getContentId()].split("_");

              callbackCid = cid[0];
            }

            sendData(API_BASE_URL + callbackMethodName + callbackCid,
                callbackMethodName);

          }

        } catch (Exception e) {
          e.printStackTrace();
        }
      }

    };

    setRelatedUIHandler.sendEmptyMessageDelayed(0, 500);

    return;
  }

  // 페이지 연속 눌림 방지용
  public static long m_lPageClickTime = 0;

  // 연속 눌림 방지 : 지정 시간 이내 클릭 여부, 싱크 작업 여부
  public boolean getCanGotoPage() {
    if ((System.currentTimeMillis() - m_lPageClickTime) > 1500) {
      Logger.i(TAG + " onClick: getCanGotoPage true");
      m_lPageClickTime = System.currentTimeMillis();
      return true;
    } else {
      Logger.i(TAG + " onClick: getCanGotoPage false");
      return false;
    }
  }

  /******************************
   * CustomDialog
   ******************************/
  public CustomDialog mCustomDialog;

  public void creatDialog(final int windowId) {

    View.OnClickListener leftListner = new View.OnClickListener() {
      @Override
      public void onClick(View v) {

        mCustomDialog.dismiss();
        switch (windowId) {
          case FLAG_DAIALOG_VIDEO:
            break;
          case FLAG_DAIALOG_AUDIO:
            break;
          case FLAG_DIALOG_ONCOMPLETION:
            break;
          case WELAAAPLAYER_SUGGEST_CODE:

//            if (getTransportControls() != null) {
//              getTransportControls().stop();
//            }
            finish();
            break;
          case WELAAAPLAYER_SUGGEST_CODE_PLAYERCONTROLLER:
            break;
        }
      }
    };

    View.OnClickListener rightListner = new View.OnClickListener() {
      @Override
      public void onClick(View v) {

        mCustomDialog.dismiss();
        switch (windowId) {
          case FLAG_DAIALOG_VIDEO:
            break;
          case FLAG_DAIALOG_AUDIO:
            break;

          case FLAG_DIALOG_ONCOMPLETION:
            //자동재생일때 다음영상재생
            // doAutoPlay 류의 프로세스를 만들어주세요 .
            break;

          case WELAAAPLAYER_SUGGEST_CODE:

//            Animation fadeout = null;
//
//            fadeout = AnimationUtils.loadAnimation(getApplication(), R.anim.slide_out_left);
//
//            mRelatedListGroupLayout.startAnimation(fadeout);
//            mRelatedListGroupLayout.setVisibility(View.GONE);
//
//            if (PLAY_MODE != null) {
//              if (PLAY_MODE.equals("audio")) {
//                audioModeBackgroundLayout.setVisibility(VISIBLE); //이미지보이고
//                audioModeIconHeadset.setVisibility(VISIBLE); //아이콘보이고
//              }
//            }

            break;

          case WELAAAPLAYER_SUGGEST_CODE_PLAYERCONTROLLER:
            Animation fadeout = null;
            fadeout = AnimationUtils.loadAnimation(getApplication(), R.anim.slide_out_left);

            mRelatedListGroupLayout.startAnimation(fadeout);
            mRelatedListGroupLayout.setVisibility(GONE);

            if (PLAY_MODE != null) {
              if (PLAY_MODE.equals("audio")) {
                audioModeBackgroundLayout.setVisibility(VISIBLE); //이미지보이고
                audioModeIconHeadset.setVisibility(VISIBLE); //아이콘보이고
              }
            }

            setBackGroungLayout(false);

            if (getTransportControls() != null) {
              getTransportControls().play();
            }

            break;
        }
      }
    };
    if (mCustomDialog != null) {
      mCustomDialog = null;
    }

    if (windowId == WELAAAPLAYER_SUGGEST_CODE) {

//            mCustomDialog = new CustomDialog(this,getString(R.string.info_dial_submit_title),getString(R.string.info_dial_finish_title),getString(R.string.info_dial_finish_dialog_finish),getString(R.string.info_dial_finish_dialog_doAutoPlay),leftListner,rightListner);
//            mCustomDialog = new CustomDialog(this, getString(R.string.info_dial_submit_title), getString(R.string.info_dial_submit_title), getString(R.string.info_dial_finish_dialog_finish), getString(R.string.info_dial_finish_dialog_doAutoPlay), leftListner, rightListner, "relatedView");
      mCustomDialog = new CustomDialog(this, getString(R.string.info_dial_submit_back_title),
          getString(R.string.info_dial_submit_title),
          getString(R.string.info_dial_finish_dialog_finish),
          getString(R.string.info_dial_finish_dialog_finish_back), leftListner, rightListner,
          "relatedView");

    } else if (windowId == WELAAAPLAYER_SUGGEST_CODE_PLAYERCONTROLLER) {

//            mCustomDialog = new CustomDialog(this,getString(R.string.info_dial_submit_title),getString(R.string.info_dial_finish_title),getString(R.string.info_dial_finish_dialog_finish),getString(R.string.info_dial_finish_dialog_doAutoPlay),leftListner,rightListner);
      mCustomDialog = new CustomDialog(this, getString(R.string.info_dial_submit_back_title),
          getString(R.string.info_dial_submit_title),
          getString(R.string.info_dial_finish_dialog_finish),
          getString(R.string.info_dial_finish_dialog_finish_back), leftListner, rightListner,
          "relatedView");

    } else {
      if (windowId != FLAG_DIALOG_ONCOMPLETION) {

        if (CON_CLASS != null) {
          if (CON_CLASS.equals("1")) {
            mCustomDialog = new CustomDialog(this, getString(R.string.info_dial_notice),
                getString(R.string.info_dial_title1), getString(R.string.info_dial_continue1),
                getString(R.string.info_dial_first), leftListner, rightListner);
          } else {
            mCustomDialog = new CustomDialog(this, getString(R.string.info_dial_notice),
                getString(R.string.info_dial_title2), getString(R.string.info_dial_continue),
                getString(R.string.info_dial_first), leftListner, rightListner);
          }
        }

      } else {
        mCustomDialog = new CustomDialog(this, getString(R.string.info_dial_submit_title),
            getString(R.string.info_dial_submit_text), getString(R.string.info_dial_submit_button),
            getString(R.string.info_dial_submit_next), leftListner, rightListner);
      }
    }

    if (mCustomDialog != null) {
      mCustomDialog.show();
    }
  }

  //	public CustomDialog mCustomDialog;
  public void alertDownloadWindow(String title, String message, String str2, String str1,
      final int alertWindowId) {

    // 1 download
    // 2 download Pause , Stop ? Cancel ?

    View.OnClickListener leftListner = new View.OnClickListener() {
      @Override
      public void onClick(View v) {

        switch (alertWindowId) {

          case 1:
            if (Util.SDK_INT >= 19) {
              mCustomDialog.dismiss();
            }
            break;
          case FLAG_DOWNLOAD_NETWORK_CHECK:
            //
            mCustomDialog.dismiss();
            break;
        }

      }
    };

    View.OnClickListener rightListner = new View.OnClickListener() {
      @Override
      public void onClick(View v) {

        switch (alertWindowId) {

          case 1:
            if (Util.SDK_INT >= 19) {
              contentDownload();
              mCustomDialog.dismiss();
            }
            break;
          case 2:
            mCustomDialog.dismiss();
            mBtnDownload
                .setBackgroundDrawable(getResources().getDrawable(R.drawable.icon_download));
            mBtnDownload.setOnClickListener(click_control);
            break;
          case FLAG_DOWNLOAD_NETWORK_CHECK:
            mCustomDialog.dismiss();

            alertDownloadWindow("알림", "다운로드를 받으시겠습니까?", "확인", "취소", 1);
            break;
        }
      }
    };
    mCustomDialog = new CustomDialog(PlayerActivity.this, title, message, str1, str2, leftListner,
        rightListner);
    mCustomDialog.show();
  }

  // 별점 주기
  // 커스텀 팝업
  public CustomDialog mMyReCustomDialog;

  public void alertMyRepuWindow(String title, String meassge, final int alertWindowId,
      final int type, final int remainTime) {

    // 1 download
    // 2 download Pause , Stop ? Cancel ?

    if (mMyReCustomDialog != null) {
      mMyReCustomDialog.dismiss();
    }

    try {

      View.OnClickListener nextListner = new View.OnClickListener() {
        @Override
        public void onClick(View v) {

          mMyReCustomDialog.dismiss();

          if (mMyReCustomDialog != null) {

            mMyReCustomDialog.dismiss();

            if (!getCanGotoPage()) {
              return;    //연속 눌림 방지
            }

//						플레이 리스트 점프

//						mWelaaaPlayer.setLastTime(mWelaaaPlayer.getCurrentPosition() );
//
//						setPlayTimeSync(false);
//
//						mWelaaaPlayer.doRightPlay();

          }

        }
      };

      View.OnClickListener leftListner = new View.OnClickListener() {
        @Override
        public void onClick(View v) {

          // 별점 보기 뷰 닫기 //

          mMyReCustomDialog.dismiss();

          if (mMyReCustomDialog != null) {

            mMyReCustomDialog.dismiss();

            setBackGroungLayout(true);

            Animation fadeout = null;

            fadeout = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_in_right);

            mRelatedListGroupLayout.startAnimation(fadeout);

            Animation textBlink = null;
            textBlink = AnimationUtils
                .loadAnimation(getApplicationContext(), R.anim.blink_animation);

            mRelatedListBlinkText.startAnimation(textBlink);

            mRelatedListGroupLayout.setVisibility(View.VISIBLE);
          }

        }
      };

      View.OnClickListener rightListner = new View.OnClickListener() {
        @Override
        public void onClick(View v) {

          TextView myrepu_star_text = null;
          ImageView next_progress_rectangle = null;

          switch (alertWindowId) {

            case 1:
              myrepu_star_text = findViewById(R.id.myrepu_star);
              String ckey = "";
              String weburl = "";
              TextView myrepu_text = findViewById(R.id.myrepu_text);
              LinearLayout myrepu_linear = findViewById(R.id.myrepu_linear);
              LinearLayout myrepu_linear_update = findViewById(R.id.myrepu_linear_update);

              UserStarAsyncTask userStarAsyncTask = new UserStarAsyncTask();

              try {
                if (!Preferences.getWelaaaMyReputation(getApplicationContext()).equals("0")) {
                  myrepu_star_text
                      .setText(Preferences.getWelaaaMyReputation(getApplicationContext()) + ".0");
                }

                if (Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
//									ckey = mWelaaaPlayer.getNewWebPlayerInfo().getCkey()[getContentId()];
                } else {
//									ckey = mWelaaaPlayer.getwebPlayerInfo().getCkey()[getContentId()];
                }

                weburl = API_BASE_URL + "/usingapp/update_star.php?star="
                    + Preferences.getWelaaaMyReputation(getApplicationContext()) + "&ckey=" + ckey;

                if (!Preferences.getWelaaaMyReputation(getApplicationContext()).equals("")) {

                  if (Build.VERSION.SDK_INT >= 11) {
                    userStarAsyncTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, weburl);
                  } else {
                    userStarAsyncTask.execute(weburl);
                  }

                  myrepu_text.setVisibility(View.VISIBLE);
                  myrepu_linear.setVisibility(View.VISIBLE);
                  myrepu_linear_update.setVisibility(View.GONE);
                }
              } catch (Exception e) {
                e.printStackTrace();
              }

              mMyReCustomDialog.dismiss();
              break;

            case 2:
              myrepu_star_text = findViewById(R.id.myrepu_star);

              if (!Preferences.getWelaaaMyReputation(getApplicationContext()).equals("0")) {
                myrepu_star_text
                    .setText(Preferences.getWelaaaMyReputation(getApplicationContext()) + ".0");
              }

              if (Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
//								ckey = mWelaaaPlayer.getNewWebPlayerInfo().getCkey()[getContentId()];
              } else {
//								ckey = mWelaaaPlayer.getwebPlayerInfo().getCkey()[getContentId()];
              }

              ckey = "";

              weburl = API_BASE_URL + "/usingapp/update_star.php?star="
                  + Preferences.getWelaaaMyReputation(getApplicationContext()) + "&ckey=" + ckey;

              Logger.e(TAG + " 20170902 case 2 : " + weburl);
              myrepu_text = findViewById(R.id.myrepu_text);
              myrepu_linear = findViewById(R.id.myrepu_linear);
              myrepu_linear_update = findViewById(R.id.myrepu_linear_update);

              if (!Preferences.getWelaaaMyReputation(getApplicationContext()).equals("")) {

                userStarAsyncTask = new UserStarAsyncTask();
                if (Build.VERSION.SDK_INT >= 11) {
                  userStarAsyncTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, weburl);
                } else {
                  userStarAsyncTask.execute(weburl);
                }

                myrepu_text.setVisibility(View.VISIBLE);

                myrepu_linear = findViewById(R.id.myrepu_linear);
                myrepu_linear.setVisibility(View.VISIBLE);

                myrepu_linear_update = findViewById(R.id.myrepu_linear_update);
                myrepu_linear_update.setVisibility(View.GONE);
              }

              mMyReCustomDialog.dismiss();

              if (mMyReCustomDialog != null) {

                mMyReCustomDialog.dismiss();
                setBackGroungLayout(true);

                Animation fadeout = null;

                fadeout = AnimationUtils
                    .loadAnimation(getApplicationContext(), R.anim.slide_in_right);

                mRelatedListGroupLayout.startAnimation(fadeout);

                Animation textBlink = null;
                textBlink = AnimationUtils
                    .loadAnimation(getApplicationContext(), R.anim.blink_animation);

                mRelatedListBlinkText.startAnimation(textBlink);

                mRelatedListGroupLayout.setVisibility(View.VISIBLE);
              }

              break;
          }

        }
      };

      String ckey = "";

      ckey = Preferences.getWelaaaPlayListCkey(getApplicationContext());

      String thumNailUrl = "";

      try {
//				thumNailUrl = mWelaaaPlayer.getNewWebPlayerInfo().getClist_img()[getContentId()+1];

        if (!thumNailUrl.contains("http://")) {
          thumNailUrl = "http://" + thumNailUrl;
        }

      } catch (Exception contentIdException) {
        contentIdException.printStackTrace();

      }

      mMyReCustomDialog = new CustomDialog(PlayerActivity.this, meassge, title, rightListner, type,
          ckey, thumNailUrl, remainTime);
      mMyReCustomDialog.show();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }


  /****************************************************************************
   * 유저 별점 업데이트 처리
   ****************************************************************************/
  public class UserStarAsyncTask extends AsyncTask<String, Integer, String> {

    @Override
    protected String doInBackground(String... params) {

      CookieManager mCookieManager = CookieManager.getInstance();
      String m_cookies = mCookieManager.getCookie(Utils.welaaaWebUrl());

      HttpCon test = new HttpCon();
//			String result = test.connection(params[0]);
      String result = "";

      return result;
    }

    @Override
    protected void onPostExecute(String result) {

      if (result != null) {
        try {
          JSONObject jsonResult = new JSONObject(result);

          String code = jsonResult.getString("code");
          String msg = jsonResult.getString("msg");

        } catch (Exception e) {
          // TODO: handle exception
          e.printStackTrace();
        }
      }
    }
  }

  /*******************************************************************
   * 오디오모드 or 오디오북일 경우 보여지는 백그라운드 이미지
   *******************************************************************/
  public void setAudioModeImageUI() {

    try {
      audioModeBackgroundLayout = findViewById(R.id.welean_audio_mode_bg);
      ImageView audioModeBackgroundImg = findViewById(R.id.audio_mode_backgroundimg);
      String url = "";

      if (Utils.isAirModeOn(getApplicationContext())) {

      } else {
        if (Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
          // 동영상 강의 별로 이미지가 있습니다.
//					if(mWelaaaPlayer.getNewWebPlayerInfo().getGroup_img()[getContentId()].contains("://")){
//						url = mWelaaaPlayer.getNewWebPlayerInfo().getGroup_img()[getContentId()];
//					}else{
//						url = "http://"+mWelaaaPlayer.getNewWebPlayerInfo().getGroup_img()[getContentId()];
//
        } else {
          // 오디오북 은 클립립별 이미지가 없고
//					if(mWelaaaPlayer.getNewWebPlayerInfo().getGroup_img()[getContentId()].contains("://")){
//						url = mWelaaaPlayer.getwebPlayerInfo().getGroupImg();
//					}else{
//						url = "http://"+mWelaaaPlayer.getwebPlayerInfo().getGroupImg();
//					}
        }
      }

      Glide
          .with(getApplicationContext())
          .load(getwebPlayerInfo().getGroupImg())
          .centerCrop()
          .placeholder(null)
          .crossFade()
          .into(audioModeBackgroundImg);

      // audioBook mode , video/audio mode
      if (CON_CLASS.equals("1")) {
        audioModeIconHeadset = findViewById(R.id.wrap_welean_icon_headphone);
      } else if (CON_CLASS.equals("2")) {
        audioModeIconHeadset = findViewById(R.id.wrap_welean_icon_headphone_audiobook);
      }

      // 지식영상 오디오모드 의 경우 ?
      if (CON_CLASS.equals("1")) {
        if (Preferences.getWelaaaPlayAudioUsed(getApplicationContext())) {

        }
      } else {
        // 오디오북 의 경우 아래 옵션으로 백그라운드 갱신되지 않는걸까 ????
        // 매번 갱신되지 않도록 ? 깜박 거림 방지 ??

        if (audioModeBackgroundLayout != null) {
          audioModeBackgroundLayout.setVisibility(View.INVISIBLE);
        }

        if (audioModeIconHeadset != null) {
          audioModeIconHeadset.setVisibility(View.INVISIBLE);
        }
      }
    } catch (Exception e) {
      e.printStackTrace();

      Logger.e(TAG + " 20170904 setAudioModeImageUI Exception " + e.toString());
    }
  }

  /*******************************************************************
   * 다운로드 모드 , 네트워크 판단 , 출력
   *******************************************************************/
  public void setDownloadHandlering() {

    // 2017.08.31 지식영상 재생이 완료 된 상태 ,
    // 백그라운드로 내려가고 , 포그라운드로 다시 올라올때
    // ArrayIndexOutOdBoundException 발생 됨
    // http://crashes.to/s/63b70e2087d
    try {
      ConnectivityManager cmgr = (ConnectivityManager) getApplicationContext()
          .getSystemService(Context.CONNECTIVITY_SERVICE);
      NetworkInfo netInfo = cmgr.getActiveNetworkInfo();

      TextView play_network_type_text = findViewById(R.id.wrap_welean_play_network_type_text);

      String nTitle = "";
      String ckey = getwebPlayerInfo().getCkey()[getContentId()];

      if (Utils.isAirModeOn(getApplicationContext())) {
        nTitle = "다운로드 파일로 재생";
      } else {

        if (ContentManager().existCid(ckey)) {
          nTitle = "다운로드 파일로 재생";
          mBtnDownload.setBackground(
              Utils.getDrawable(getApplicationContext(), R.drawable.icon_download_done));
        } else {
          mBtnDownload
              .setBackground(Utils.getDrawable(getApplicationContext(), R.drawable.icon_download));
        }

        try {
          if (netInfo.isConnected() && netInfo.getTypeName().equals("WIFI")) {
            nTitle = "Wi-Fi 재생";
          } else if (netInfo.isConnected() && netInfo.getTypeName().equals("MOBILE")) {
            nTitle = "LTE/3G 재생";
          }
        } catch (Exception e) {
          e.printStackTrace();
        }
      }

      play_network_type_text.setText(nTitle);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public WebPlayerInfo getwebPlayerInfo() {
    return mWebPlayerInfo;
  }

  public NewWebPlayerInfo getNewWebPlayerInfo() {
    return mNewWebPlayerInfo;
  }

  public void setSleeperUI() {

    mblank_sleeper_view = findViewById(R.id.blank_sleeper_view);
    mblank_sleeper_view.setVisibility(View.INVISIBLE);

    msleep_view = findViewById(R.id.SLEEPWRAP_LAYOUT);
    msleep_view.setVisibility(View.INVISIBLE);
  }

  public void setSleeperUILand() {

    mblank_sleeper_view = findViewById(R.id.blank_sleeper_view);
    mblank_sleeper_view.setVisibility(View.INVISIBLE);

    msleep_view = findViewById(R.id.SLEEPWRAP_LAYOUT_LAND);
    msleep_view.setVisibility(View.INVISIBLE);
  }

  private static String readAll(Reader rd) throws IOException {
    StringBuilder sb = new StringBuilder();
    int cp;
    while ((cp = rd.read()) != -1) {
      sb.append((char) cp);
    }
    return sb.toString();
  }

  public void callbackWebPlayerInfo(String methodName, String params) {
    if (methodName == null) {
      return;
    }

    try {
      if (methodName.equals("video-course")) {

        if (lectureListItemdapter != null) {
          lectureListItemdapter = null;
        }

        lectureListItemdapter = new PlayerListAdapter(getApplicationContext(), this);

        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            mPlaylistGroupLayout.setVisibility(View.VISIBLE);
            mPlaylistGroupLayout.startAnimation(mAniSlideShow);

            mButtonGroupLayout.setVisibility(View.INVISIBLE);

            ListView lecturListView = findViewById(R.id.weleanplaylistview);

            for (int i = 0; i < getwebPlayerInfo().getCkey().length; i++) {

              String playListType = "1";

              MediaControllerCompat mediaController = MediaControllerCompat
                  .getMediaController(PlayerActivity.this);

              Bundle BeforeExtras;

              try {
                if (mediaController.getMetadata().getBundle() != null) {
                  BeforeExtras = mediaController.getMetadata().getBundle();

                  String beforeCid = BeforeExtras.getString("drm_cid");
                  if (getwebPlayerInfo().getCkey()[i].equals(beforeCid)) {
                    playListType = "6";
                  }
                }
              } catch (Exception e) {
                e.printStackTrace();
              }

              if (getwebPlayerInfo().getCplayTime()[i] != null) {
                if (!getwebPlayerInfo().getCplayTime()[i].equals("00:00:00")) {
                  lectureListItemdapter
                      .add(getwebPlayerInfo().getCplayTime()[i], getwebPlayerInfo().getCkey()[i],
                          getwebPlayerInfo().getCname()[i],
                          getwebPlayerInfo().getGroupTitle(),
                          getwebPlayerInfo().getGroupTeachername(),
                          getwebPlayerInfo().getHistory_endtime()[i],
                          playListType);
                }
              }
            }

            lecturListView.setAdapter(lectureListItemdapter);

            lecturListView.setOnScrollListener(new AbsListView.OnScrollListener() {
              @Override
              public void onScrollStateChanged(AbsListView absListView, int i) {
              }

              @Override
              public void onScroll(AbsListView absListView, int i, int i1, int i2) {

                audioItemProgressBar = findViewById(R.id.audioItemProgressBar);
                audioItemProgressBar.setProgressDrawable(Utils.getDrawable(getApplicationContext(),
                    R.drawable.progress_horizontal_custom_movie_bar));
                audioItemProgressBar.setVisibility(View.VISIBLE);

                if (i == 0) {
                  audioItemProgressBar.setProgress(1);
                }

                if (i > 0 && i < 30) {
                  audioItemProgressBar.setProgress(((i + i1) * 100 / i2));
                }

                if (i > 30) {
                  audioItemProgressBar.setProgress(((i + i1) * 100 / i2));
                }
              }
            });

//        lecturListView.setSelection(Integer.parseInt(currentPosition));

            TextView list_grop_title = findViewById(R.id.list_group_title);
            String gTitle = getwebPlayerInfo().getGroupTitle();
            list_grop_title.setText(gTitle);

            for (int i = 0; i < lectureListItemdapter.getCount(); i++) {
              LogHelper
                  .e(TAG, "send lectureListItemdapter getItem " + lectureListItemdapter.getItem(i));
              // 값은 보이는데 .. 보이지는 않구나 ..
            }

            LogHelper.e(TAG, "lecturListView.getVisibility() " + lecturListView.getVisibility());
            LogHelper.e(TAG, "VISIBLE " + View.VISIBLE);
            LogHelper.e(TAG, "INVISIBLE " + View.INVISIBLE);
            LogHelper.e(TAG, "GONE " + View.GONE);

            LogHelper
                .e(TAG, "send lectureListItemdapter getCount " + lectureListItemdapter.getCount());

            Preferences.setWelaaaRecentPlayListUse(getApplicationContext(), false, "0");
          }
        });


      } else if (methodName.equals("audiobook")) {

        mPlaylistGroupLayout.setVisibility(View.VISIBLE);
        mPlaylistGroupLayout.startAnimation(mAniSlideShow);

        mButtonGroupLayout.setVisibility(View.INVISIBLE);

        if (lectureAudioBookListItemdapter != null) {
          lectureAudioBookListItemdapter = null;
        }

        lectureAudioBookListItemdapter = new AudioBookPlayerListAdapter(getApplicationContext(),
            this);

        ListView lecturListView = findViewById(R.id.weleanplaylistview);

        for (int i = 0; i < getwebPlayerInfo().getCkey().length; i++) {
          if (getwebPlayerInfo().getA_depth()[i].equals("1")) {

            if (getwebPlayerInfo().getCurl()[i].equals("0") || getwebPlayerInfo().getCurl()[i]
                .equals("0.0")) {

              lectureAudioBookListItemdapter.add("",
                  "", getwebPlayerInfo().getCname()[i], "", "", "", "1");

            } else {
              MediaControllerCompat mediaController = MediaControllerCompat
                  .getMediaController(PlayerActivity.this);

              Bundle BeforeExtras;

              try {
                if (mediaController.getMetadata().getBundle() != null) {
                  BeforeExtras = mediaController.getMetadata().getBundle();

                  String beforeCid = BeforeExtras.getString("drm_cid");

                  // 오디오북을 구매 한 경우
                  if (getwebPlayerInfo().getAudiobookbuy().equals("true")) {
                    if (getwebPlayerInfo().getCkey()[i].equals(beforeCid)) {
                      lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                          getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "", "",
                          "",
                          "7");
                    } else {
                      lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                          getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "", "",
                          "",
                          "2");
                    }
                  } else {
                    // 오디오북을 구매 하지 않은 경우는 preview 확인
                    if (getwebPlayerInfo().getAudio_preview()[i].equals("true")) {
                      if (getwebPlayerInfo().getCkey()[i].equals(beforeCid)) {
                        lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                            getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "",
                            "",
                            "",
                            "31");
                      } else {
                        lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                            getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "",
                            "",
                            "",
                            "32");
                      }
                    } else {
                      lectureAudioBookListItemdapter.add("",
                          "", getwebPlayerInfo().getCname()[i], "", "", "", "1");
                    }
                  }
                }
              } catch (Exception e) {
                e.printStackTrace();
              }

            }
          } else if (getwebPlayerInfo().getA_depth()[i].equals("2")) {
            if (getwebPlayerInfo().getCurl()[i].equals("0") || getwebPlayerInfo().getCurl()[i]
                .equals("0.0")) {
              lectureAudioBookListItemdapter.add("",
                  "", getwebPlayerInfo().getCname()[i], "", "", "", "3");
            } else {
              MediaControllerCompat mediaController = MediaControllerCompat
                  .getMediaController(PlayerActivity.this);

              Bundle BeforeExtras;

              try {
                if (mediaController.getMetadata().getBundle() != null) {
                  BeforeExtras = mediaController.getMetadata().getBundle();

                  String beforeCid = BeforeExtras.getString("drm_cid");

                  if (getwebPlayerInfo().getAudiobookbuy().equals("true")) {
                    if (getwebPlayerInfo().getCkey()[i].equals(beforeCid)) {
                      lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                          getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "", "",
                          "",
                          "9");
                    } else {
                      lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                          getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "", "",
                          "",
                          "4");
                    }
                  } else {
                    if (getwebPlayerInfo().getAudio_preview()[i].equals("true")) {
                      if (getwebPlayerInfo().getCkey()[i].equals(beforeCid)) {
                        lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                            getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "",
                            "",
                            "",
                            "24");
                      } else {
                        lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                            getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "",
                            "",
                            "",
                            "23");
                      }
                    } else {
                      lectureAudioBookListItemdapter.add("",
                          "", getwebPlayerInfo().getCname()[i], "", "", "", "3");
                    }
                  }

                }
              } catch (Exception e) {
                e.printStackTrace();
              }

            }
          } else {
            if (getwebPlayerInfo().getCurl()[i].equals("0") || getwebPlayerInfo().getCurl()[i]
                .equals("0.0")) {
              lectureAudioBookListItemdapter.add("",
                  "", getwebPlayerInfo().getCname()[i], "", "", "", "5");
            } else {

              MediaControllerCompat mediaController = MediaControllerCompat
                  .getMediaController(PlayerActivity.this);

              Bundle BeforeExtras;

              try {
                if (mediaController.getMetadata().getBundle() != null) {
                  BeforeExtras = mediaController.getMetadata().getBundle();

                  String beforeCid = BeforeExtras.getString("drm_cid");

                  if (getwebPlayerInfo().getAudiobookbuy().equals("true")) {
                    if (getwebPlayerInfo().getCkey()[i].equals(beforeCid)) {
                      lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                          getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "", "",
                          "",
                          "11");
                    } else {
                      lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                          getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "", "",
                          "",
                          "6");
                    }
                  } else {
                    if (getwebPlayerInfo().getAudio_preview()[i].equals("true")) {
                      if (getwebPlayerInfo().getCkey()[i].equals(beforeCid)) {
                        lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                            getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "",
                            "",
                            "",
                            "28");
                      } else {
                        lectureAudioBookListItemdapter.add(getwebPlayerInfo().getCplayTime()[i],
                            getwebPlayerInfo().getCkey()[i], getwebPlayerInfo().getCname()[i], "",
                            "",
                            "",
                            "29");
                      }
                    } else {
                      lectureAudioBookListItemdapter.add("",
                          "", getwebPlayerInfo().getCname()[i], "", "", "", "5");
                    }
                  }
                }
              } catch (Exception e) {
                e.printStackTrace();
              }
            }
          }
        }

        lecturListView.setAdapter(lectureAudioBookListItemdapter);

        int position = 0;

        if (Preferences.getWelaaaPlayerOnClickPos(getApplicationContext()) > 0) {
          position = Preferences.getWelaaaPlayerOnClickPos(getApplicationContext());

          lecturListView.setSelection(position);
        } else {
          position = Integer.parseInt(getwebPlayerInfo().getCalign()[getContentId()]);

          lecturListView.setSelection(position - 1);
        }

        lecturListView.setOnScrollListener(new AbsListView.OnScrollListener() {
          @Override
          public void onScrollStateChanged(AbsListView absListView, int i) {
            // scroll Start 1
            // scroll Ing 2
            // scroll Stop 0
          }

          @Override
          public void onScroll(AbsListView absListView, int i, int i1, int i2) {

            audioItemProgressBar = findViewById(R.id.audioItemProgressBar);
            audioItemProgressBar.setVisibility(VISIBLE);

            if (i == 0) {
              audioItemProgressBar.setProgress(1);
            }

            if (i > 0 && i < 30) {
              audioItemProgressBar.setProgress(((i) * 100 / i2));
            }

            if (i > 30) {
              audioItemProgressBar.setProgress(((i + i1) * 100 / i2));
            }
          }
        });

        TextView list_grop_title = findViewById(R.id.list_group_title);
        String gTitle = getwebPlayerInfo().getGroupTitle();
        list_grop_title.setText(gTitle);

      }

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /**************************************************************************
   *  컨텐츠 id값을 preferences에 set
   **************************************************************************/
  public void setContentId(int id) {
    contentId = id;
    Preferences.setWelaaaPlayListCId(getApplication(), id);
  }

  /**************************************************************************
   *  preferences에 저장되어 있는 컨텐츠 id값을 get
   **************************************************************************/
  public int getContentId() {

    return Preferences.getWelaaaPlayListCId(getApplication());
  }


  /*******************************************************************
   * sleeper timer
   *******************************************************************/
  public void setSleeper() {

    mblank_sleeper_view.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        if (sleeperNum != 0) {
          sleepstart();
          mBtnSleeper.setVisibility(View.INVISIBLE);
          mBtnSleep_Active.setVisibility(View.VISIBLE);
          sleeptimerText.setVisibility(View.VISIBLE);
          Preferences.setWelaaaPlayerSleepMode(getApplicationContext(), true);
        }

        mblank_sleeper_view.setVisibility(View.INVISIBLE);
      }
    });
  }

  public void cancelSleeper() {
    Utils.logToast(getApplicationContext(), "취침모드해제");
    sleeperNum = 0;
    timesleep = 0;

    sleeptimerText.setText("");

    stopSleepTimeThread();
  }

  /********************************************************
   * sleeping mode 시간이 완료되면 부르는 함수
   ********************************************************/
  public void finishForSleeper() {
    if (Preferences.getWelaaaPlayerSleepMode(getApplication())) {
      Utils.logToast(getApplication(), getString(R.string.info_finish_resons_leepmode));

      try {
        stopSleepTimeThread();

        Preferences.setWelaaaPlayEnd(getApplication(), true);

        Preferences.setWelaaaPlayerSleepMode(getApplication(), false);
        Preferences.setWelaaaPlayAudioUsed(getApplication(), false);

        if (getTransportControls() != null) {
          getTransportControls().pause();
        }

      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }

  /****************************************************************************
   * 컨트롤러의 상단 타이틀부분 텍스트 set
   ****************************************************************************/
  public void setPlayerTitle() {
    if (mWebPlayerInfo != null) {

      LogHelper.e(TAG, " setPlayerTitle getContentID is " + getContentId());

      setVideoGroupTitle(mWebPlayerInfo.getGroupTitle(),
          mWebPlayerInfo.getCname()[getContentId()]);
    }
  }

  @Override
  public void onBackPressed() {
    Player player = LocalPlayback.getInstance(PlayerActivity.this).getPlayer();

    try {
// 최근 재생 리스트가 있는 경우
      if (mPlaylistGroupLayout.getVisibility() == VISIBLE) {
        if (mPlaylistGroupLayout != null) {
          mPlaylistGroupLayout.startAnimation(mAniSlideHide);
        }
        if (mPlaylistGroupLayout != null) {
          mPlaylistGroupLayout.setVisibility(View.INVISIBLE);
        }
        if (mButtonGroupLayout != null) {
          mButtonGroupLayout.setVisibility(View.VISIBLE);
        }

        if (player != null) {

          if(player.getPlayWhenReady()){
            player.setPlayWhenReady(true);
          }

        }

        // 추천 뷰 콘텐츠 뷰가 활성화 인 경우
      } else if (mRelatedListGroupLayout.getVisibility() == VISIBLE) {

        Animation fadeout = AnimationUtils
            .loadAnimation(getApplicationContext(), R.anim.slide_in_right);

        if (mRelatedListGroupLayout != null) {
          mRelatedListGroupLayout.startAnimation(fadeout);
        }
        if (mRelatedListGroupLayout != null) {
          mRelatedListGroupLayout.setVisibility(View.INVISIBLE);
        }
        if (mButtonGroupLayout != null) {
          mButtonGroupLayout.setVisibility(VISIBLE);
        }

        setBackGroungLayout(false);

        if (player != null) {
          player.setPlayWhenReady(true);
        }

      } else {

        finish();
      }
    } catch (Exception e) {
      e.printStackTrace();
      finish();
    }
  }

  /*******************************************************************
   * 컨트롤바 화면의 타이틀 텍스트 set
   *******************************************************************/
  public void setVideoGroupTitle(String str1, String str2) {
    try {
      TextView title1 = findViewById(R.id.welean_videogroptitle);
      title1.setText(str1.replaceAll("<br>", ""));

      TextView title2 = findViewById(R.id.welean_videotitle);
      title2.setText(str2);

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /*******************************************************************
   * Current Position Sync Subtitle Position
   *******************************************************************/
  private int oldMoveScrollCheckNum = 0;
  private int mCurrenttime = 0;

  // TODO: 2018. 7. 25. memory leak
  Handler mCurrentTimeHandler = new Handler() {
    @SuppressWarnings("unchecked")
    @Override
    public void handleMessage(Message msg) {
      try {
        Player player = LocalPlayback.getInstance(PlayerActivity.this).getPlayer();

        if (player != null) {

          mCurrenttime = (int) player.getCurrentPosition();

          if (hasSubTitlsJesonUrl) {
            if (mSubtitlstime != null) {
              for (int i = 0; i < mSubtitlstime.length - 2; i++) {
                if (mSubtitlstime[i] < mCurrenttime && mCurrenttime < mSubtitlstime[i + 1]) {
                  if (oldMoveScrollCheckNum != i) {
                    moveScrollCheck = true;
                    oldMoveScrollCheckNum = i;
                    autoTextScrollNum = i;
                  }

                  if (moveScrollCheck) {
                    autoTxtScroll(mCurrenttime);
                  }
                }
              }
            }

            try {
              if (LocalPlayback.getInstance(PlayerActivity.this).isPlaying()) {
                mCurrentTimeHandler.sendEmptyMessageDelayed(0, 100);
              } else {
                if (mCurrentTimeHandler != null) {
                  mCurrentTimeHandler.removeCallbacksAndMessages(null);
                }
              }
            } catch (Exception ex) {
              ex.printStackTrace();
            }
          }
        } else {
          if (mCurrentTimeHandler != null) {
            mCurrentTimeHandler.removeCallbacksAndMessages(null);
            mCurrentTimeHandler.sendEmptyMessageDelayed(0, 1000);
          }
        }


      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  };


  /******************************
   * Comment   : 등록된 컨텐츠 매니져
   ******************************/
  public WeContentManager ContentManager() {
    MainApplication myApp = (MainApplication) getApplicationContext();
    return myApp.getContentMgr();
  }

  public void contentDownload() {

    callbackMethodName = "play/play-data/";
    callbackMethod = "download";

    sendData(API_BASE_URL + callbackMethodName + getwebPlayerInfo().getCkey()[getContentId()],
        callbackMethodName);

    setContentId(getContentId());

  }

  protected class ContentGroup {

    public String title;
    public List<Content> arrContent;

    ContentGroup(String title) {
      this.title = title;
      this.arrContent = new ArrayList<>();
    }
  }

  protected class Content {

    public Uri uri;
    public String name = "";
    public UUID drmSchemeUuid;
    public String drmLicenseUrl = "";
    public String userId = "";
    public String cid = "";
    public String oid = "";
    public String token = "";
    public String thumbUrl = "";
    public String customData = "";
    public boolean multiSession;

    public Content() {
    }

    ;
  }

  /*******************************************************************
   * DownloadService / ServiceConnection /DownloadService.ICallback
   *******************************************************************/
  private DownloadService mdownloadService = null;
  private ServiceConnection downloadConnection = new ServiceConnection() {
    public void onServiceConnected(ComponentName className, IBinder service) {
      DownloadService.MainServiceBinder binder = (DownloadService.MainServiceBinder) service;
      mdownloadService = binder.getService();
//			mdownloadService.registerCallback(callback);
    }

    public void onServiceDisconnected(ComponentName className) {
      mdownloadService = null;
    }
  };

  private DownloadService.ICallback mCallback = new DownloadService.ICallback() {
    public void recvData(String cid) {
//			setWebDownloadedContent(Integer.parseInt(cid));
    }
  };


  /**
   * MediaBrowser
   */
  private void connectToSession(MediaSessionCompat.Token token) throws RemoteException {
    MediaControllerCompat mediaController = MediaControllerCompat
        .getMediaController(PlayerActivity.this);
    if (mediaController == null) {
      mediaController = new MediaControllerCompat(PlayerActivity.this, token);
    }
    MediaControllerCompat.setMediaController(PlayerActivity.this, mediaController);
    mediaController.registerCallback(callback);

    Intent intent = getIntent();
    if (intent != null) {
      Bundle extras;
      Bundle BeforeExtras;
      Uri uri;
      boolean fromMediaSession = intent.getBooleanExtra(PlaybackManager.FROM_MEDIA_SESSION, false);

      if (!fromMediaSession) {
        extras = intent.getExtras();
        uri = intent.getData();

        try {
          // player foreground 상태에서
          // 전화 통화 후 종료 , Power OFF 후 다시 Player 상태로 돌아오는 경우 .
          if (mediaController.getMetadata().getBundle() != null) {
            if (Preferences.getSQLiteDuration(getApplicationContext())) {
              // RN play 를 통해서 들어오는 경우는 그대로 재생 시도
              // 이 값은 LocalPlayBack 에서 다시 초기화 됩니다.
              // 이전에 재생 됐던 콘텐츠의 프로그래스 저장 합니다.
              Player player = LocalPlayback.getInstance(PlayerActivity.this).getPlayer();
              try {
//                if (LocalPlayback.getInstance(this).isPlaying()) {
                  BeforeExtras = mediaController.getMetadata().getBundle();
                  String beforeCid = BeforeExtras.getString("drm_cid");

                  //  update
                  if (ContentManager().isProgressExist(beforeCid) > 0) {
                    ContentManager()
                        .updateProgress(beforeCid, String.valueOf(player.getCurrentPosition()),
                            "UPDATE");
                    //insert
                  } else {
                    ContentManager().insertProgress(beforeCid,
                        String.valueOf(player.getCurrentPosition()));
                  }
//                }

              } catch (Exception e) {
                LogHelper.d(TAG, "4976 Exception " + e.toString());
                e.printStackTrace();
              }

            } else {

              if (LocalPlayback.getInstance(this).isPlaying()) {
                extras = mediaController.getMetadata().getBundle();
                uri = Uri.parse(extras.getString(MediaMetadataCompat.METADATA_KEY_MEDIA_URI));

                fromMediaSession = true;
              }
            }
          }

          setData(fromMediaSession, extras, uri);

        } catch (Exception e) {
          e.printStackTrace();

          // 앱 구동 후 처음 껍데기 미니 플레이어가 있는 상태에서
          // 미니 플레이어 말고 다른 콘텐츠를 재생하려고 할 때
          LogHelper.d(TAG, " Exception " + e.toString());
          // ContentId 다시 셋팅 ?

          setData(fromMediaSession, extras, uri);
//          finish();
        }


      } else {
        try {
          extras = mediaController.getMetadata().getBundle();
          uri = Uri.parse(extras.getString(MediaMetadataCompat.METADATA_KEY_MEDIA_URI));

          setData(fromMediaSession, extras, uri);
        } catch (Exception e) {
          e.printStackTrace();
          Utils.logToast(getApplicationContext(), getString(R.string.notice_dialog_finish_message));
          finish();
        }
      }
    }
  }

  private void playFromUri(Uri uri, Bundle extras) {

    Player player = LocalPlayback.getInstance(PlayerActivity.this).getPlayer();

    boolean playWhenReady = true;
    if (player != null) {
      mPlayStatus.mPosition = player.getCurrentPosition();
      playWhenReady = player.getPlayWhenReady();

      boolean fromMediaSession = false;
      Intent intent = getIntent();

      if (intent != null) {
        fromMediaSession = intent.getBooleanExtra(PlaybackManager.FROM_MEDIA_SESSION, false);
      }

      if(fromMediaSession){
        if (!playWhenReady) {
          attachPlayerView();
        } else {
          getTransportControls().playFromUri(uri, extras);
          attachPlayerView();
        }
      }else{
        getTransportControls().playFromUri(uri, extras);
        attachPlayerView();
      }

    }else{
      getTransportControls().playFromUri(uri, extras);
      attachPlayerView();
    }
  }

  private void setPlayerView(PlayerView playerView) {
    LocalPlayback.getInstance(this).setPlayerView(playerView);
  }

  private void attachPlayerView() {
    // Set player to playerview.
    LocalPlayback.getInstance(this).attachPlayerView();
  }

  private void updatePlaybackState(PlaybackStateCompat state) {
    if (state == null) {
      return;
    }
    lastPlaybackState = state;
    MediaControllerCompat controllerCompat = MediaControllerCompat
        .getMediaController(PlayerActivity.this);

    if (controllerCompat != null && controllerCompat.getExtras() != null) {
      String castName = controllerCompat.getExtras().getString(MediaService.EXTRA_CONNECTED_CAST);
    }

    switch (state.getState()) {
      case PlaybackStateCompat.STATE_PLAYING:
        try {
          setVideoGroupTitle(getwebPlayerInfo().getGroupTitle(),
              getwebPlayerInfo().getCname()[getContentId()]);

          if (mCurrentTimeHandler != null) {
            mCurrentTimeHandler.removeCallbacksAndMessages(null);

            Message msg = mCurrentTimeHandler.obtainMessage();
            mCurrentTimeHandler.sendMessageDelayed(msg, 100);
          }

        } catch (Exception e) {
          e.printStackTrace();
        }

        break;
      case PlaybackStateCompat.STATE_PAUSED:
        break;
      case PlaybackStateCompat.STATE_NONE:
      case PlaybackStateCompat.STATE_STOPPED:
        break;
      case PlaybackStateCompat.STATE_BUFFERING:
        break;
      default:
        LogHelper.d(TAG, "Unhandled state ", state.getState());
    }
  }

  private void updateMediaDescription(MediaDescriptionCompat description) {
    if (description == null) {
      return;
    }
    LogHelper.d(TAG, "updateMediaDescription called ");
  }

  private void updateDuration(MediaMetadataCompat metadata) {
    if (metadata == null) {
      return;
    }
    LogHelper.d(TAG, "updateDuration called ");
    int duration = (int) metadata.getLong(MediaMetadataCompat.METADATA_KEY_DURATION);
  }

  private void updateProgress() {
    if (lastPlaybackState == null) {
      return;
    }
    long currentPosition = lastPlaybackState.getPosition();
    if (lastPlaybackState.getState() == PlaybackStateCompat.STATE_PLAYING) {
      // Calculate the elapsed time between the last position update and now and unless
      // paused, we can assume (delta * speed) + current position is approximately the
      // latest position. This ensure that we do not repeatedly call the getPlaybackState()
      // on MediaControllerCompat.
      long timeDelta = SystemClock.elapsedRealtime() -
          lastPlaybackState.getLastPositionUpdateTime();
      currentPosition += (int) timeDelta * lastPlaybackState.getPlaybackSpeed();
    }
  }

  public void doNextPlay(Boolean type) {
    // Left -- , Right ++

    if (type) {
      int id = getContentId();

      setContentId(++id);

      // 자동 재생 여부와 관계 없이 재생할 수 있도록
      playOnClickPlayTry = true;

      if (CONTENT_TYPE.equals("video-course")) {
//        if (getTransportControls() != null) {
//          getTransportControls().pause();
//        }
        callbackMethodName = "play/play-data/";
        callbackMethod = "play";
        sendData(
            API_BASE_URL + callbackMethodName + getwebPlayerInfo().getCkey()[getContentId()],
            callbackMethod);

        setContentId(getContentId());

        // 타이틀 동기화는 meta 데이터를 활용할 것
        setVideoGroupTitle(getwebPlayerInfo().getGroupTitle(),
            getwebPlayerInfo().getCname()[getContentId()]);
      }

    } else {
      int id = getContentId();
      if (getContentId() == 0) {
        Utils.logToast(getApplicationContext(), getString(R.string.info_fristplay));
        return;
      } else {
        setContentId(--id);
        // 자동 재생 여부와 관계 없이 재생할 수 있도록
        playOnClickPlayTry = true;
      }

      if (CONTENT_TYPE.equals("video-course")) {
//        if (getTransportControls() != null) {
//          getTransportControls().pause();
//        }
        callbackMethodName = "play/play-data/";
        callbackMethod = "play";
        sendData(
            API_BASE_URL + callbackMethodName + getwebPlayerInfo().getCkey()[getContentId()],
            callbackMethod);

        setContentId(getContentId());

        // 타이틀 동기화는 meta 데이터를 활용할 것
        setVideoGroupTitle(getwebPlayerInfo().getGroupTitle(),
            getwebPlayerInfo().getCname()[getContentId()]);
      }
    }
  }

  private UUID getDrmUuid(String typeString) throws ParserException {
    switch (typeString.toLowerCase()) {
      case "widevine":
        return C.WIDEVINE_UUID;
      case "playready":
        return C.PLAYREADY_UUID;
      default:
        try {
          return UUID.fromString(typeString);
        } catch (RuntimeException e) {
          throw new ParserException("Unsupported drm type: " + typeString);
        }
    }
  }

  /**
   * 웹 서버로 데이터 전송 // content-info , play-data
   */
  private void sendData(String sendUrl, String type) {

    String requestWebUrl = sendUrl;

    LogHelper.e(TAG, " requestWebUrl is " + requestWebUrl);
    LogHelper
        .e(TAG, " requestWebUrl is " + Preferences.getWelaaaOauthToken(getApplicationContext()));

    new Thread() {
      public void run() {
        httpConn.requestWebServer(requestWebUrl, "CLIENT_ID", "CLIENT_SECRET",
            Preferences.getWelaaaOauthToken(getApplicationContext()),
            callbackRequest);
      }
    }.start();
  }

  private final Callback callbackRequest = new Callback() {
    @Override
    public void onFailure(Call call, IOException e) {

    }

    @Override
    public void onResponse(Call call, Response response) throws IOException {
      String body = response.body().string();

      if (response.code() == 200) {
        LogHelper.e(TAG, "서버에서 응답한 Body:" + callbackMethodName + " body : " + body);

        if (callbackMethodName.equals("play/play-data/")) {
          // doAudoPlay 전용
          try {
            JSONObject json = new JSONObject(body);
            JSONObject media_urlsObject = json.getJSONObject("media_urls");
            JSONObject permissionObject = json.getJSONObject("permission");
            JSONObject preview_urlsObject = null;

            String dashUrl = media_urlsObject.getString("DASH");
            Boolean can_play = permissionObject.getBoolean("can_play");
            String expire_at = permissionObject.getString("expire_at");
            Boolean is_free = permissionObject.getBoolean("is_free");

            String previewDashUrl = "";

            if (!json.isNull("preview_urls")) {
              LogHelper.e(TAG, " preview_urls is Not null " + json.getJSONObject("preview_urls"));
              preview_urlsObject = json.getJSONObject("preview_urls");

              previewDashUrl = preview_urlsObject.getString("DASH");

            } else {
              LogHelper.e(TAG, " preview_urls is null ");
            }

            Preferences.setWelaaaPlayListCId(getApplicationContext(), contentId);

            if (can_play) {
              Preferences.setWelaaaPreviewPlay(getApplicationContext(), false);
            } else {
              Preferences.setWelaaaPreviewPlay(getApplicationContext(), true);
            }

            Intent intent = getIntent();

            if (callbackMethod.equals("play")) {
              // # 268 목차에서 들어가는 케이스는 무조건 재생할 수 있는 시나리오로 갈까요 ?

              if (playOnClickPlayTry) {
                // 자동 재생 여부와 관계없이 재생합니다.
                playOnClickPlayTry = false;

                if (getTransportControls() != null) {
                  Uri uri = Uri.parse(dashUrl);

                  if (!can_play) {
                    uri = Uri.parse(previewDashUrl);
                    LogHelper.e(TAG, " can_play preview URI " + uri);
                  }

                  intent.setData(uri);
                  intent.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA,
                      getwebPlayerInfo().getCname()[getContentId()]);
                  intent.putExtra(PlaybackManager.THUMB_URL, "");
                  try {

                    if ((getDrmUuid("widevine").toString()) != null) {

                      intent
                          .putExtra(PlaybackManager.DRM_SCHEME_UUID_EXTRA,
                              getDrmUuid("widevine").toString());
                      intent.putExtra(PlaybackManager.DRM_LICENSE_URL,
                          "http://tokyo.pallycon.com/ri/licenseManager.do");
                      intent.putExtra(PlaybackManager.DRM_MULTI_SESSION, "");
                      intent.putExtra(PlaybackManager.DRM_USERID,
                          Preferences.getWelaaaUserId(getApplicationContext()));
                      intent.putExtra(PlaybackManager.DRM_CID,
                          getwebPlayerInfo().getCkey()[getContentId()]);
                      intent.putExtra(PlaybackManager.DRM_OID, "");
                      intent.putExtra(PlaybackManager.DRM_CUSTOME_DATA, "");
                      intent.putExtra(PlaybackManager.DRM_TOKEN, "");
                      intent.putExtra(PlaybackManager.DRM_CONTENT_TITLE,
                          getwebPlayerInfo().getGroupTitle());

                      // fromMediaSession 용도
                      Gson gson = new Gson();
                      JsonObject jsonObject = new JsonObject();
                      jsonObject.addProperty("type", mWebPlayerInfo.getCon_class());
                      jsonObject.addProperty("can_play", can_play);
                      jsonObject.addProperty("is_free", is_free);
                      jsonObject.addProperty("expire_at", expire_at);
                      jsonObject.addProperty("history_start_seconds", contentHistory_seconds);
                      String playInfo = gson.toJson(jsonObject);

                      intent.putExtra("play_info", playInfo);

                      if (!can_play) {
                        // 미리 듣기 90초
                        intent.putExtra("duration", "00:01:30");
                      } else {
                        intent.putExtra("duration", mWebPlayerInfo.getCplayTime()[contentId]);
                      }

                    }

                  } catch (ParserException e) {
                    e.printStackTrace();
                  }

                  // 플레이 버튼 , 자동 재생 할때 , 추천 콘텐츠 뷰 할 때 /play-data/ 들어갈때 .
                  // LocalPlayback 에서 참조 함 . MP4 이지만 , audio only 인 케이스
                  Preferences.setWelaaaPlayListCKey(getApplicationContext(),
                      getwebPlayerInfo().getCkey()[getContentId()]);

                  Bundle extras = intent.getExtras();

                  if (getTransportControls() != null) {
                    getTransportControls().play();
                  }

                  playFromUri(uri, extras);
                  // Meta data update 정상 .
                }

              } else {
                // 자동 재생 여부를 참조하여 재생합니다.
//                if (Preferences.getWelaaaPlayAutoPlay(getApplicationContext())) {
                if (getTransportControls() != null) {
                  Uri uri = Uri.parse(dashUrl);

                  if (!can_play) {
                    uri = Uri.parse(previewDashUrl);
                    LogHelper.e(TAG, " can_play preview URI " + uri);
                  }

                  intent.setData(uri);
                  intent.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA,
                      getwebPlayerInfo().getCname()[getContentId()]);
                  intent.putExtra(PlaybackManager.THUMB_URL, "");
                  try {

                    if ((getDrmUuid("widevine").toString()) != null) {

                      intent
                          .putExtra(PlaybackManager.DRM_SCHEME_UUID_EXTRA,
                              getDrmUuid("widevine").toString());
                      intent.putExtra(PlaybackManager.DRM_LICENSE_URL,
                          "http://tokyo.pallycon.com/ri/licenseManager.do");
                      intent.putExtra(PlaybackManager.DRM_MULTI_SESSION, "");
                      intent.putExtra(PlaybackManager.DRM_USERID,
                          Preferences.getWelaaaUserId(getApplicationContext()));
                      intent.putExtra(PlaybackManager.DRM_CID,
                          getwebPlayerInfo().getCkey()[getContentId()]);
                      intent.putExtra(PlaybackManager.DRM_OID, "");
                      intent.putExtra(PlaybackManager.DRM_CUSTOME_DATA, "");
                      intent.putExtra(PlaybackManager.DRM_TOKEN, "");
                      intent.putExtra(PlaybackManager.DRM_CONTENT_TITLE,
                          getwebPlayerInfo().getGroupTitle());

                      // fromMediaSession 용도
                      Gson gson = new Gson();
                      JsonObject jsonObject = new JsonObject();
                      jsonObject.addProperty("type", mWebPlayerInfo.getCon_class());
                      jsonObject.addProperty("can_play", can_play);
                      jsonObject.addProperty("is_free", is_free);
                      jsonObject.addProperty("expire_at", expire_at);
                      jsonObject.addProperty("history_start_seconds", contentHistory_seconds);
                      String playInfo = gson.toJson(jsonObject);

                      intent.putExtra("play_info", playInfo);

                      if (!can_play) {
                        // 미리 듣기 90초
                        intent.putExtra("duration", "00:01:30");
                      } else {
                        intent.putExtra("duration", mWebPlayerInfo.getCplayTime()[contentId]);
                      }

                    }

                  } catch (ParserException e) {
                    e.printStackTrace();
                  }

                  // 플레이 버튼 , 자동 재생 할때 , 추천 콘텐츠 뷰 할 때 /play-data/ 들어갈때 .
                  // LocalPlayback 에서 참조 함 . MP4 이지만 , audio only 인 케이스
                  Preferences.setWelaaaPlayListCKey(getApplicationContext(),
                      getwebPlayerInfo().getCkey()[getContentId()]);

                  Bundle extras = intent.getExtras();

                  playFromUri(uri, extras);
                  // Meta data update 정상 .
                }
//                }
              }

            } else if (callbackMethod.equals("download")) {
              DownloadService.stopped = false;

              Intent service = new Intent(PlayerActivity.this, DownloadService.class);

              service.putExtra(PlaybackManager.DRM_CONTENT_URI_EXTRA, dashUrl);
              service.putExtra(PlaybackManager.DRM_CONTENT_NAME_EXTRA,
                  getwebPlayerInfo().getCname()[getContentId()]);
              service.putExtra(PlayerActivity.DOWNLOAD_SERVICE_TYPE, false);
              service.putExtra("contentCid", getwebPlayerInfo().getCkey()[getContentId()]);
              service.putExtra("expire_at", expire_at);
              service.putExtra("webPlayerInfo", mWebPlayerInfo);

              startService(service);
              bindService(service, downloadConnection, getApplicationContext().BIND_AUTO_CREATE);
            }


          } catch (Exception e) {
            e.printStackTrace();
          }
        } else if (callbackMethodName.equals("play/contents-smi/")) {
          StringBuffer sb = new StringBuffer();
          try {
            JSONArray jArr = new JSONArray(body);

            for (int i = 0; i < jArr.length(); i++) {

              JSONObject jObject = jArr.getJSONObject(i);
              String time = jObject.getString("time");
              String memo = jObject.getString("memo");

              sb.append("&time=" + time);
              sb.append("&memo=" + memo);

            }

            setSubtitle(sb.toString());

            try {

              UiThreadUtil.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                  if (CAN_PLAY) {
                    try {
                      mBtnSubtitlesOff.setVisibility(View.VISIBLE);
                      mBtnSubtitlesOn.setVisibility(View.INVISIBLE);

                      msubtitls_view.setVisibility(View.VISIBLE);
                      msubtitls_view_long.setVisibility(View.INVISIBLE);

                      final int positoinY = getTextviewHeight() * getTextViewNumber();

                      mscrollview.scrollTo(0, positoinY);

                      simpleExoPlayerView.setControllerShowTimeoutMs(0);
                      simpleExoPlayerView.setControllerHideOnTouch(false);
                    } catch (NullPointerException e) {
                      e.printStackTrace();
                    }
                  }
                }
              });

              hasSubTitlsJesonUrl = true;

              if (mCurrentTimeHandler != null) {
                mCurrentTimeHandler.removeCallbacksAndMessages(null);

                Message msg = mCurrentTimeHandler.obtainMessage();
                mCurrentTimeHandler.sendMessageDelayed(msg, 100);

              } else {
                Message msg = mCurrentTimeHandler.obtainMessage();
                mCurrentTimeHandler.sendMessageDelayed(msg, 100);
              }

            } catch (Exception e) {
              e.printStackTrace();
            }

          } catch (Exception e) {
            // TODO: handle exception

            LogHelper.e(TAG, "20181125 Exception " + e.toString());

            UiThreadUtil.runOnUiThread(new Runnable() {
              @Override
              public void run() {
                setNoneSubtilteText();
              }
            });

            hasSubTitlsJesonUrl = false;
            e.printStackTrace();
          }
        } else if (callbackMethodName.equals("contents/playlist-suggest/")) {

          try {

            JSONArray itemArray = new JSONArray(body);

            for (int i = 0; i < itemArray.length(); i++) {
              JSONObject objItem = itemArray.getJSONObject(i);

              objItem.getString("title");

              LogHelper.e(TAG, " TITLE " + objItem.getString("title"));

              TextView same_series_title = findViewById(R.id.same_series_title);
              TextView same_category_title = findViewById(R.id.same_category_title);
              TextView pop_title = findViewById(R.id.pop_title);

              if (i == 0) {
                same_series_title.setText(objItem.getString("title"));
              } else if (i == 1) {
                same_category_title.setText(objItem.getString("title"));
              } else if (i == 2) {
                pop_title.setText(objItem.getString("title"));
              }

              JSONArray suggestObj = objItem.getJSONArray("items");

              for (int j = 0; j < suggestObj.length(); j++) {
                JSONObject suggestObjItem = suggestObj.getJSONObject(j);

                suggestObjItem.put("suggestTitle", objItem.getString("title"));
                suggestObjItem.put("listkey", i);

//                                Logger.e(TAG + " 20170902 :: suggest " + suggestObjItem.getString("suggestTitle") +
//                                suggestObjItem.getString("cname") + " " +i + " " + suggestObjItem.getString("ckey"));

                suggestListArray1.add(i, suggestObjItem);
              }
            }

            alName = new ArrayList<>();
            alImage = new ArrayList<>();
            alTeacherName = new ArrayList<>();
            alTotalTime = new ArrayList<>();
            alEndTime = new ArrayList<>();
            alViewCnt = new ArrayList<>();
            alStarCnt = new ArrayList<>();
            alReplyCnt = new ArrayList<>();
            alCkeyCnt = new ArrayList<>();

            alName2 = new ArrayList<>();
            alImage2 = new ArrayList<>();
            alTeacherName2 = new ArrayList<>();
            alTotalTime2 = new ArrayList<>();
            alEndTime2 = new ArrayList<>();
            alViewCnt2 = new ArrayList<>();
            alStarCnt2 = new ArrayList<>();
            alReplyCnt2 = new ArrayList<>();
            alCkeyCnt2 = new ArrayList<>();

            alName3 = new ArrayList<>();
            alImage3 = new ArrayList<>();
            alTeacherName3 = new ArrayList<>();
            alTotalTime3 = new ArrayList<>();
            alEndTime3 = new ArrayList<>();
            alViewCnt3 = new ArrayList<>();
            alStarCnt3 = new ArrayList<>();
            alReplyCnt3 = new ArrayList<>();
            alCkeyCnt3 = new ArrayList<>();

            int k = 0;
            int l = 0;
            int m = 0;

            try {
              for (int j = suggestListArray1.size() - 1; j >= 0; j--) {

                if (suggestListArray1.get(j).getString("listkey").equals("0")) {
                  alName.add(k, suggestListArray1.get(j).getString("title"));
                  alImage
                      .add(k, suggestListArray1.get(j).getJSONObject("images").getString("list"));
//                  alTeacherName.add(k, suggestListArray1.get(j).getString("teachername"));
                  alTeacherName.add(k, "");
                  alTotalTime.add(k, suggestListArray1.get(j).getString("play_time"));
                  alEndTime.add(k, suggestListArray1.get(j).getString("end_time"));
                  alViewCnt.add(k, suggestListArray1.get(j).getString("hit_count"));
                  alStarCnt.add(k, suggestListArray1.get(j).getString("star_count"));
                  alReplyCnt.add(k, suggestListArray1.get(j).getString("review_count"));
                  alCkeyCnt.add(k, suggestListArray1.get(j).getString("cid"));
                  k++;
                }

                if (suggestListArray1.get(j).getString("listkey").equals("1")) {
                  alName2.add(l, suggestListArray1.get(j).getString("title"));
                  alImage2
                      .add(l, suggestListArray1.get(j).getJSONObject("images").getString("list"));
//                  alTeacherName2.add(l, suggestListArray1.get(j).getString("teachername"));
                  alTeacherName2.add(l, "");
                  alTotalTime2.add(l, suggestListArray1.get(j).getString("play_time"));
                  alEndTime2.add(l, suggestListArray1.get(j).getString("end_time"));
                  alViewCnt2.add(l, suggestListArray1.get(j).getString("hit_count"));
                  alStarCnt2.add(l, suggestListArray1.get(j).getString("star_count"));
                  alReplyCnt2.add(l, suggestListArray1.get(j).getString("review_count"));
                  alCkeyCnt2.add(l, suggestListArray1.get(j).getString("cid"));
                  l++;
                }

                if (suggestListArray1.get(j).getString("listkey").equals("2")) {
                  alName3.add(m, suggestListArray1.get(j).getString("title"));
                  alImage3
                      .add(m, suggestListArray1.get(j).getJSONObject("images").getString("list"));
//                  alTeacherName3.add(m, suggestListArray1.get(j).getString("teachername"));
                  alTeacherName3.add(m, "");
                  alTotalTime3.add(m, suggestListArray1.get(j).getString("play_time"));
                  alEndTime3.add(m, suggestListArray1.get(j).getString("end_time"));
                  alViewCnt3.add(m, suggestListArray1.get(j).getString("hit_count"));
                  alStarCnt3.add(m, suggestListArray1.get(j).getString("star_count"));
                  alReplyCnt3.add(m, suggestListArray1.get(j).getString("review_count"));
                  alCkeyCnt3.add(m, suggestListArray1.get(j).getString("cid"));
                  m++;
                }

              }

              k = 0;
              l = 0;
              m = 0;

              String ckey = "";
              try {
                ckey = getwebPlayerInfo().getCkey()[getContentId()];
              } catch (Exception ECkey) {
                ECkey.printStackTrace();
              }

              mRecyclerView = findViewById(R.id.related_recyclerView1);
              mRecyclerView.setHasFixedSize(true);

              // The number of Columns
              mLayoutManager = new LinearLayoutManager(getApplicationContext(),
                  LinearLayoutManager.HORIZONTAL, false);
              mRecyclerView.setLayoutManager(mLayoutManager);

              mAdapter = new HLVAdapter(getApplicationContext(), PlayerActivity.this, alName,
                  alImage,
                  alTeacherName,
                  alTotalTime, alEndTime, alViewCnt, alStarCnt, alReplyCnt, alCkeyCnt, ckey);
              mRecyclerView.setAdapter(mAdapter);

              // Calling the RecyclerView 1
              mRecyclerView2 = findViewById(R.id.related_recyclerView2);
              mRecyclerView2.setHasFixedSize(true);

              // The number of Columns
              mLayoutManager2 = new LinearLayoutManager(getApplicationContext(),
                  LinearLayoutManager.HORIZONTAL, false);
              mRecyclerView2.setLayoutManager(mLayoutManager2);

              mAdapter2 = new HLVAdapter(getApplicationContext(), PlayerActivity.this, alName2,
                  alImage2,
                  alTeacherName2,
                  alTotalTime2, alEndTime2, alViewCnt2, alStarCnt2, alReplyCnt2, alCkeyCnt2, ckey);
              mRecyclerView2.setAdapter(mAdapter2);

              // Calling the RecyclerView 1
              mRecyclerView3 = findViewById(R.id.related_recyclerView3);
              mRecyclerView3.setHasFixedSize(true);

              // The number of Columns
              mLayoutManager3 = new LinearLayoutManager(getApplicationContext(),
                  LinearLayoutManager.HORIZONTAL, false);
              mRecyclerView3.setLayoutManager(mLayoutManager3);

              mAdapter3 = new HLVAdapter(getApplicationContext(), PlayerActivity.this, alName3,
                  alImage3,
                  alTeacherName3,
                  alTotalTime3, alEndTime3, alViewCnt3, alStarCnt3, alReplyCnt3, alCkeyCnt3, ckey);
              mRecyclerView3.setAdapter(mAdapter3);

            } catch (Exception e3) {
              e3.printStackTrace();
            }
          } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
          }

        } else if (callbackMethodName.equals("play/contents-info/")) {
          //
          StringBuffer sb = new StringBuffer();

          try {
            JSONObject json = new JSONObject(body);

            JSONObject dataObject = json.getJSONObject("data");
            String group_title = dataObject.getString("title");

            JSONObject historyObject = null;

            if (json.isNull("history")) {
              LogHelper.e(TAG, " history is null ");
            } else {
              historyObject = json.getJSONObject("history");

              historyObject.getString("id");
              historyObject.getString("played_at");

              LogHelper.e(TAG, "start_seconds " + historyObject.getInt("start_seconds"));

              contentHistory_seconds = historyObject.getInt("start_seconds");
            }

            JSONObject permissionObject = json.getJSONObject("permission");

//        String group_memo = json.getString("group_memo");
            String group_memo = "";

            String group_teachername = dataObject.getJSONObject("teacher").getString("name");
            String group_teachermemo = dataObject.getJSONObject("teacher").getString("memo");

            String group_img = "";
            String group_previewcontent = "";
            String allplay_time = dataObject.getString("play_time");

            String contentscnt = dataObject.getString("clip_count");
            String hitcnt = dataObject.getString("hit_count");
            String likecnt = dataObject.getString("like_count");
            String zzimcnt = "";
            String staravg = dataObject.getString("star_avg");

            String con_class = json.getString("type");

            String downloadcnt = "";
            String audiobookbuy = "";
            String audiobookbuy_limitdate = "";

            sb.append("group_title=" + group_title);
            sb.append("&group_memo=" + group_memo);
            sb.append("&group_teachername=" + group_teachername);
            sb.append("&group_teachermemo=" + group_teachermemo);
            sb.append("&group_img=" + group_img);
            sb.append("&group_previewcontent=" + group_previewcontent);
            sb.append("&allplay_time=" + allplay_time);
            sb.append("&contentscnt=" + contentscnt);
            sb.append("&hitcnt=" + hitcnt);
            sb.append("&likecnt=" + likecnt);
            sb.append("&zzimcnt=" + zzimcnt);
            sb.append("&staravg=" + staravg);
            sb.append("&con_class=" + con_class);
            sb.append("&downloadcnt=" + downloadcnt);
            sb.append("&audiobookbuy=" + audiobookbuy);
            sb.append("&audiobookbuy_limitdate=" + audiobookbuy_limitdate);

            JSONArray jArr = dataObject.getJSONArray("clips");

            for (int i = 0; i < jArr.length(); i++) {

              json = jArr.getJSONObject(i);
              //값을 추출함
              String ckey = json.getString("cid");
              String cname = json.getString("title");
              String cmemo = json.getString("memo");

              String curl = ""; // play_data 에서

              String cplay_time = json.getString("play_time");
              String cpay = json.getString("pay_type");
              String cpay_money = json.getString("price");

              String clist_img = json.getJSONObject("images").getString("list");

              String chitcnt = "";
              String csmi = "";

              String a_depth = "";
              String history_endtime = json.getString("end_seconds");

              String first_play = "";
              String calign = "";
              String audio_preview = "";

              sb.append("&ckey=" + ckey);
              sb.append("&cname=" + cname);
              sb.append("&cmemo=" + cmemo);
              sb.append("&curl=" + curl);
              sb.append("&cplay_time=" + cplay_time);
              sb.append("&cpay=" + cpay);
              sb.append("&cpay_money=" + cpay_money);
              sb.append("&clist_img=" + clist_img);
              sb.append("&chitcnt=" + chitcnt);
              sb.append("&history_endtime=" + history_endtime);
              sb.append("&a_depth=" + a_depth);
              sb.append("&first_play=" + first_play);
              sb.append("&calign=" + calign);
              sb.append("&audio_preview=" + audio_preview);

              if (csmi.equals("")) {
                sb.append("&csmi=" + "none");
              } else {
                sb.append("&csmi=" + csmi);
              }

              // 추천 콘텐츠 뷰에서는 히스토리를 참조할 필요가 없을까요 ?
              if (contentCid.equals(json.getString("cid"))) {
                contentId = i;
              }

              if (mWebPlayerInfo != null) {
                mWebPlayerInfo = null;
              }

              mWebPlayerInfo = new WebPlayerInfo(sb.toString());
            }

            callbackMethodName = "play/play-data/";

            sendData(API_BASE_URL + callbackMethodName + contentCid, callbackMethodName);

          } catch (Exception e) {

            e.printStackTrace();

            UiThreadUtil.runOnUiThread(new Runnable() {
              @Override
              public void run() {

                new AlertDialog.Builder(getApplicationContext())
                    .setTitle("알림")
                    .setMessage(
                        "서비스 이용에 장애가 발생하였습니다. \n Exception cause " + e.getCause()
                            + " \n Exception Msg " + e
                            .getMessage())
                    .setPositiveButton("확인", new DialogInterface.OnClickListener() {
                      @Override
                      public void onClick(DialogInterface arg0, int arg1) {
                      }
                    }).show();
              }
            });

          }

//          setContentId(contentId);

        }
      } else {
        // status code check

        if (callbackMethodName.equals("play/contents-smi/")) {
          setNoneSubtilteText();
          hasSubTitlsJesonUrl = false;
        }

      }
    }
  };

  /*******************************************************************
   * 플레이어 리스트 아답타의 onclick 액션을 받는다. 들어올때 권한을 다시 확인한다 ?
   *******************************************************************/
  public void playListOnClick(String pos) {

    int currentPosition = 0;
    for (int i = 0; i < getwebPlayerInfo().getCkey().length; i++) {
      if (getwebPlayerInfo().getCkey()[i].equals(pos)) {
        currentPosition = i;
        break;
      }
    }

    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        if (mPlaylistGroupLayout != null) {
          mPlaylistGroupLayout.startAnimation(mAniSlideHide);
        }
        if (mPlaylistGroupLayout != null) {
          mPlaylistGroupLayout.setVisibility(View.INVISIBLE);
        }
        if (mButtonGroupLayout != null) {
          mButtonGroupLayout.setVisibility(View.VISIBLE);
        }
      }
    });

    callbackMethodName = "play/play-data/";
    callbackMethod = "play";
    playOnClickPlayTry = true;

    setContentId(currentPosition);

    Preferences.setWelaaaPlayerOnClickPos(getApplicationContext(), currentPosition);

//    플레이어 화면에서 목차 변경 시 이어듣기 되지 않음 #469
    Preferences.setSQLiteDuration(getApplicationContext(), true);

    sendData(API_BASE_URL + callbackMethodName + getwebPlayerInfo().getCkey()[currentPosition],
        callbackMethodName);
  }

  public void setBroadCatReceiver() {

    myBroadcastReceiver = new MyBroadcastReceiver(this);
    IntentFilter filter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);

    registerReceiver(myBroadcastReceiver, filter);
    myBroadcastReceiver.setPlayerListener(new MyBroadcastReceiver.PlayerListener() {

      @Override
      public void isNetworkType(final String type) {
        mIsNetworkType = type;
        isNetworkTypeHandler.sendEmptyMessageDelayed(0, 500);
      }

      @Override
      public void isNotConnected() {

        UiThreadUtil.runOnUiThread(new Runnable() {
          @Override
          public void run() {
            Utils.logToast(getApplicationContext(), getString(R.string.info_networkfail));

            mIsNetworkType = "OFFLINE";
            isNetworkTypeHandler.sendEmptyMessageDelayed(0, 500);
          }
        });
      }
    });
  }

  final Handler isNetworkTypeHandler = new Handler() {
    public void handleMessage(android.os.Message msg) {

      try {
        TextView play_network_type_text = findViewById(R.id.wrap_welean_play_network_type_text);
        String ckey = getwebPlayerInfo().getCkey()[getContentId()];

        if (ContentManager().existCid(ckey)) {
          play_network_type_text.setText("다운로드 재생");
        } else {
          if (mIsNetworkType.equals("TYPE_WIFI")) {

            play_network_type_text.setText("Wi-Fi 재생");

          } else if (mIsNetworkType.equals("TYPE_MOBILE")) {

            Utils.logToast(getApplicationContext(),
                "현재 네트워크 환경이  Wi-Fi 가 아닙니다. \n Wi-Fi 환경이 아닌 3G/LTE 상에 재생시 가입하신 요금제 따라 데이터 요금이 발생할 수 있습니다.");

            boolean isonlywifiview = Preferences.getOnlyWifiView(getApplication());

            play_network_type_text.setText("LTE/3G 재생");

            if (isonlywifiview) {
              if (getTransportControls() != null) {
                getTransportControls().pause();
              }
            }
          } else {
            play_network_type_text.setText(mIsNetworkType);
            if (getTransportControls() != null) {
              getTransportControls().pause();
            }
          }
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  };


  public void hlvAdater(final String ckey) {

    callbackMethodName = "play/contents-info/";
    callbackMethod = "play";

    contentCid = ckey;

    sendData(API_BASE_URL + callbackMethodName + ckey, callbackMethodName);

    if (mRelatedListGroupLayout.getVisibility() == VISIBLE) {
      Animation fadeout = AnimationUtils
          .loadAnimation(getApplicationContext(), R.anim.slide_in_right);

      if (mRelatedListGroupLayout != null) {
        mRelatedListGroupLayout.startAnimation(fadeout);
      }
      if (mRelatedListGroupLayout != null) {
        mRelatedListGroupLayout.setVisibility(View.INVISIBLE);
      }
      if (mButtonGroupLayout != null) {
        mButtonGroupLayout.setVisibility(VISIBLE);
      }
      setBackGroungLayout(false);
    }
  }

  public class SettingsContentObserver extends ContentObserver {

    public SettingsContentObserver(Handler handler) {
      super(handler);
    }

    @Override
    public boolean deliverSelfNotifications() {
      return super.deliverSelfNotifications();
    }

    @Override
    public void onChange(boolean selfChange) {
      super.onChange(selfChange);
      updateVolumeUI();
    }

    @Override
    public void onChange(boolean selfChange, Uri uri) {
      super.onChange(selfChange, uri);
    }
  }
}