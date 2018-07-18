/*
 * PallyCon Team ( http://www.pallycon.com )
 *
 * This is a simple example project to show how to build a APP using the PallyCon Widevine SDK
 * The SDK is based on Exo player library
 */

package com.welaaav2.player;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MotionEvent;
import android.view.SurfaceView;
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
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.DefaultRenderersFactory;
import com.google.android.exoplayer2.ExoPlaybackException;
import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.ExoPlayerFactory;
import com.google.android.exoplayer2.PlaybackParameters;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.Timeline;
import com.google.android.exoplayer2.drm.DrmSessionManager;
import com.google.android.exoplayer2.drm.FrameworkMediaCrypto;
import com.google.android.exoplayer2.drm.KeysExpiredException;
import com.google.android.exoplayer2.extractor.DefaultExtractorsFactory;
import com.google.android.exoplayer2.source.ExtractorMediaSource;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.TrackGroupArray;
import com.google.android.exoplayer2.source.dash.DashMediaSource;
import com.google.android.exoplayer2.source.dash.DefaultDashChunkSource;
import com.google.android.exoplayer2.trackselection.AdaptiveTrackSelection;
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector;
import com.google.android.exoplayer2.trackselection.MappingTrackSelector;
import com.google.android.exoplayer2.trackselection.TrackSelection;
import com.google.android.exoplayer2.trackselection.TrackSelectionArray;
import com.google.android.exoplayer2.ui.DefaultTimeBar;
import com.google.android.exoplayer2.ui.SimpleExoPlayerView;
import com.google.android.exoplayer2.upstream.DataSource;
import com.google.android.exoplayer2.upstream.DefaultBandwidthMeter;
import com.google.android.exoplayer2.upstream.DefaultDataSourceFactory;
import com.google.android.exoplayer2.upstream.DefaultHttpDataSourceFactory;
import com.google.android.exoplayer2.upstream.HttpDataSource;
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
import com.pallycon.widevinelibrary.DetectedDeviceTimeModifiedException;
import com.pallycon.widevinelibrary.NetworkConnectedException;
import com.pallycon.widevinelibrary.PallyconDrmException;
import com.pallycon.widevinelibrary.PallyconEncrypterException;
import com.pallycon.widevinelibrary.PallyconEventListener;
import com.pallycon.widevinelibrary.PallyconServerResponseException;
import com.pallycon.widevinelibrary.PallyconWVMSDK;
import com.pallycon.widevinelibrary.PallyconWVMSDKFactory;
import com.welaaav2.R;
import com.welaaav2.cast.CastControllerActivity;
import com.welaaav2.pallycon.PlayStatus;
import com.welaaav2.util.CustomDialog;
import com.welaaav2.util.HttpCon;
import com.welaaav2.util.Logger;
import com.welaaav2.util.Preferences;
import com.welaaav2.util.Utils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.lang.ref.WeakReference;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

/**
 * Created by PallyconTeam
 */

public class PlayerActivity extends AppCompatActivity implements View.OnClickListener {

	private final String WELEARN_WEB_URL = Utils.welaaaWebUrl();

	public static final String TAG = "pallycon_sampleapp";
	public static final String CONTENTS_TITLE = "contents_title";
	public static final String DRM_SCHEME_UUID_EXTRA = "drm_scheme_uuid";
	public static final String DRM_LICENSE_URL = "drm_license_url";
	public static final String DRM_USERID = "drm_userid";
	public static final String DRM_OID = "drm_oid";
	public static final String DRM_CID = "drm_cid";
	public static final String DRM_TOKEN = "drm_token";
	public static final String DRM_CUSTOME_DATA = "drm_custom_data";
	public static final String DRM_MULTI_SESSION = "drm_multi_session";
	public static final String THUMB_URL = "thumb_url";
	public static final String PREFER_EXTENSION_DECODERS = "prefer_extension_decoders";

	private DataSource.Factory mediaDataSourceFactory;
	private DefaultBandwidthMeter bandwidthMeter;
	private DefaultTrackSelector trackSelector;
	private SimpleExoPlayerView simpleExoPlayerView;
	private SimpleExoPlayer player;
	private boolean shouldAutoPlay;
	private Handler eventHandler;
	private PallyconWVMSDK WVMAgent;
	private LinearLayout debugRootView;
	private TrackSelectionHelper trackSelectionHelper;

	//
	private LayoutInflater mLayout=null;
	private FrameLayout mButtonGroupLayout=null;
	public FrameLayout mPlaylistGroupLayout=null;

	public FrameLayout mRelatedListGroupLayout=null;
	public TextView mRelatedListBlinkText=null;

	private GestureDetector mgestureScanner;

	private static final int SWIPE_MIN_DISTANCE = 250;
	private static final int SWIPE_MAX_OFF_PATH = 50;

	private ImageView mRelatedViewBtn=null;
	private LinearLayout mRelatedViewTopCloseBtn=null;

	private ScrollView mscrollRelatedView=null;

	public RelativeLayout audioModeBackgroundLayout = null;
	public RelativeLayout audioModeIconHeadset = null;
	public RelativeLayout audioModeIconHeadsetLand = null;

	private TextView mTextTotalTime=null;
	private TextView mTextCurTime=null;
	private DefaultTimeBar mSeekBar=null;
	public Button mButtonPlay=null;
	public Button mButtonPause=null;
	private Button mBtnForward=null;
	private Button mBtnBackward=null;
	public Button mButtonAudio=null;
	public Button mButtonVideo=null;
	private Button mBtnDownload=null;
	private Button mBtnSpeed=null;
	private Button mBtnSubtitlesOn=null;
	private Button mBtnSubtitlesOff=null;
	private Button mBtnClosed=null;
	private Button mBtnPlaylist=null;
	private Button mBtnPlaylistClose=null;

	private RelativeLayout msleep_view=null;

	private FrameLayout mblank_speed_view=null;
	public RelativeLayout msubtitls_view=null;
	public RelativeLayout msubtitls_view_long=null;
	private FrameLayout mblank_sleeper_view=null;

	Boolean visible = false;

	//자막
	private RelativeLayout mfullSmiLayout=null;
	private RelativeLayout mshortSmiLayout=null;
	private ScrollView mscrollview=null;
	private ScrollView mscrollTimeview=null;

	private ScrollView mlongScrollview=null;
	private ScrollView mlongScrollTimeview=null;


	private TextView mBtnSleep_title=null;
	private TextView mBtnSleep_15=null;
	private TextView mBtnSleep_30=null;
	private TextView mBtnSleep_45=null;
	private TextView mBtnSleep_60=null;
	private ImageView mBtnSleep_cancel=null;

	private TextView mBtnSleep_title_land=null;
	private TextView mBtnSleep_15_land=null;
	private TextView mBtnSleep_30_land=null;
	private TextView mBtnSleep_45_land=null;
	private TextView mBtnSleep_60_land=null;
	private ImageView mBtnSleep_cancel_land=null;


	private Button mBtnRock=null;
	private Button mBtnUnRock=null;
	private Button mBtnSleeper=null;
	private Button mBtnSleep_Active=null;
	private Button mBtnAutoplay=null;
	private Button mBtnAutoplayCancel=null;
	private TextView speedtxtvalue_btn=null;

	private Button mBtnIconBtnSpeed=null;
	private Button mBtnIconBtnList=null;

	private Button mBtnSubtitleTextSmall=null;
	private Button mBtnSubtitleTextNormal=null;
	private Button mBtnSubtitleTextBig=null;

	private ImageView mSpeedImage=null;

	private Animation mAniSlideShow=null;
	private Animation mAniSlideHide=null;

//	private PlayerListAdapter lectureListItemdapter;
//	private AudioBookPlayerListAdapter lectureAudioBookListItemdapter;
//
//	private PlayerListSameSeriesAdapter listSameSeriesAdapter;
//	private PlayerListSameCategoryAdapter listSameCategoryAdapter;
//	private PlayerListPopClipAdapter listPopClipAdapter;

	private RelativeLayout mMovingspace=null;

	//sleepmode timetext
	private static TextView sleeptimerText=null;

	private String[] mSubtitlsmemo=null;
	private int[] mSubtitlstime;
	private int mTxtViewNumber;
	private int[] subTitlsLineNum;

	private TextView[] shortSubTitlesTextView=null;
	private TextView[] shortSubTitlesTextTimeView=null;

	private TextView[] longSubTitlesTextView=null;
	private TextView[] longSubTitlesTextTimeView=null;

	private int[] textViewSumHeight;

	private boolean hasSubTitlsJesonUrl;
	private int autoTextScrollNum;

	private int contentId=0;
	private final int SMALL_SUBTITLS_SCROLL_VIEW_HEIGHT = 45;
	private final int SHORT_SUBTITLS_SCROLL_VIEW_HEIGHT = 60+20;
	private final int NORMAL_SUBTITLS_SCROLL_VIEW_HEIGHT = 95+20;

	private Handler mHandler=null;

	private Timer mTimer=null;

	private Timer showUiTimer=null;
	private TimerTask ShowControlerTimer=null;//showUiTimer TimerTask
	static private SleepTimeHandler mSleeperHandler=null;
	public double speedNum = 0; //동영상스피드
	public int sleeperNum = 0; //sleeper

	public int speedIndex=0;

	private Button mBtnlistClose=null;

	private LinearLayout mButton_playlist_close_linear;
	private LinearLayout mButton_player_close_linear;

	private int start_current_time;

	private Button mBtnArrowLeft =null;
	private Button mBtnArrowRight =null;

	private RelativeLayout mButton_Arrow_Layout;

	private Button mBtnVolume =null;
	private Button mBtnVolumeActive =null;

	private RelativeLayout mVolumeControlBar;

	private SeekBar volumeSeekbar = null;
	private AudioManager audioManager = null;

	private TextView mTextViewVolumeText = null;

	private LinearLayout mMyRepuBoxLinear = null;

	private Button mRelatedListClosed = null;
	private String fontSize = "";

	public String mUserStar = "";

	private String cId="";
	public int mLastViewTime = 0;
	private Boolean mIsDownloadBind = false;
	private Boolean mIsPlayerBind = false;
	public  Boolean mIsAudioBook = false;
	public  String PLAY_STATE= "STREAMMING" ; // STREAMMING,LOCAL
	public  String CON_CLASS="1"; //video:1, audiobook:2
	public  String PLAY_MODE="video"; //(CON_CLASS => video의 audioMode,videoMode
	private String startPosition="";

	private WebPlayerInfo mWebPlayerInfo = null;
	private NewWebPlayerInfo mNewWebPlayerInfo = null;

	private ProgressBar audioItemProgressBar;

	private PlayerListAdapter lectureListItemdapter;
	private AudioBookPlayerListAdapter lectureAudioBookListItemdapter;
	private ArrayList<JSONObject> lastViewListArray = new ArrayList<JSONObject>();

	private static final DefaultBandwidthMeter BANDWIDTH_METER = new DefaultBandwidthMeter();

	// TODO : must implement ExoPlayer.EventListener
	private Player.EventListener playerEventListener = new Player.EventListener() {

		@Override
		public void onTimelineChanged(Timeline timeline, Object manifest) {
			//TODO: Please refer to the ExoPlayer guide.
			Log.d(TAG, "onTimelineChanged()!!");
		}

		@Override
		public void onTracksChanged(TrackGroupArray trackGroups, TrackSelectionArray trackSelections) {
			//TODO: Please refer to the ExoPlayer guide.
			Log.d(TAG, "onTracksChanged()!!");
		}

		@Override
		public void onLoadingChanged(boolean isLoading) {
			//TODO: Please refer to the ExoPlayer guide.
			Log.d(TAG, "onLoadingChanged(" + isLoading + ")");
		}

		@Override
		public void onPlayerStateChanged(boolean playWhenReady, int playbackState) {
			//TODO: Please refer to the ExoPlayer guide.
//			updateButtonVisibilities();

			switch( playbackState ) {
				case ExoPlayer.STATE_IDLE:
					Log.d(TAG, "onPlayerStateChanged(" + playWhenReady + ", STATE_IDLE)");
					mPlayStatus.mCurrentState = PlayStatus.STATE_IDLE;
					break;
				case ExoPlayer.STATE_BUFFERING:
					Log.d(TAG, "onPlayerStateChanged(" + playWhenReady + ", STATE_BUFFERING)");
					mPlayStatus.mCurrentState = PlayStatus.STATE_BUFFERING;
					break;
				case ExoPlayer.STATE_READY:
					Log.d(TAG, "onPlayerStateChanged(" + playWhenReady + ", STATE_READY)");
					if( playWhenReady ) {
						Log.d(TAG, "State: Ready and Playing");
						mPlayStatus.mCurrentState = PlayStatus.STATE_PLAYING;
					}
					else {
						Log.d(TAG, "State: Ready and Pausing");
						mPlayStatus.mCurrentState = PlayStatus.STATE_PAUSED;
					}

					break;
				case ExoPlayer.STATE_ENDED:
					Log.d(TAG, "onPlayerStateChanged(" + playWhenReady + ", STATE_ENDED)");
					mPlayStatus.mCurrentState = PlayStatus.STATE_IDLE;
					break;
				default:
					Log.d(TAG, "onPlayerStateChanged(" + playWhenReady + ", UNKNOWN)");
					mPlayStatus.mCurrentState = PlayStatus.STATE_IDLE;
			}
		}

		@Override
		public void onRepeatModeChanged(int repeatMode) {

		}

		@Override
		public void onShuffleModeEnabledChanged(boolean shuffleModeEnabled) {

		}

		@Override
		public void onPlayerError(ExoPlaybackException e) {
			// TODO: Check the types of errors that occur inside the player.
			String errorString;
			if (e.type == ExoPlaybackException.TYPE_RENDERER) {
				Exception cause = e.getRendererException();
				errorString = cause.toString();

			} else if (e.type == ExoPlaybackException.TYPE_SOURCE) {
				Exception cause = e.getSourceException();
				errorString = cause.toString();

			} else if (e.type == ExoPlaybackException.TYPE_UNEXPECTED) {
				Exception cause = e.getUnexpectedException();
				errorString = cause.toString();
			} else {
				errorString = e.toString();
			}

			AlertDialog.Builder builder = new AlertDialog.Builder(PlayerActivity.this);
			builder.setTitle("Play Error");
			builder.setMessage(errorString);
			builder.setPositiveButton("OK", null);
			Dialog dialog = builder.create();
			dialog.show();
		}

		@Override
		public void onPositionDiscontinuity(int reason) {

		}

		@Override
		public void onPlaybackParametersChanged(PlaybackParameters playbackParameters) {

		}

		@Override
		public void onSeekProcessed() {

		}

//		@Override
//		public void onPositionDiscontinuity() {
//			Log.d(TAG, "onPositionDiscontinuity");
//		}
	};

	// TODO : must implement PallyconEventListener
	private PallyconEventListener pallyconEventListener = new PallyconEventListener() {
		@Override
		public void onDrmKeysLoaded(Map<String, String> licenseInfo) {
			// TODO: Use the loaded license information.
			StringBuilder stringBuilder = new StringBuilder();

			Iterator<String> keys = licenseInfo.keySet().iterator();
			while (keys.hasNext()) {
				String key = keys.next();
				String value = licenseInfo.get(key);
				try {
					if (Long.parseLong(value) == 0x7fffffffffffffffL) {
						value = "Unlimited";
					}
				} catch( Exception e ) {
					e.printStackTrace();
				}
				stringBuilder.append(key).append(" : ").append(value);
				if (keys.hasNext()) {
					stringBuilder.append("\n");
				}
			}

			AlertDialog.Builder alertBuilder = new AlertDialog.Builder(PlayerActivity.this);
			alertBuilder.setTitle("License Info");
			alertBuilder.setMessage(stringBuilder.toString());
			alertBuilder.setPositiveButton("OK", null);
			Dialog dialog = alertBuilder.create();
			dialog.show();
		}

		@Override
		public void onDrmSessionManagerError(Exception e) {
			// TODO: Handle exceptions in error situations. Please refer to the API guide document for details of exception.
			AlertDialog.Builder builder = new AlertDialog.Builder(PlayerActivity.this);
			builder.setTitle("DrmManager Error");

			if (e instanceof NetworkConnectedException) {
				builder.setMessage(e.getMessage());

			} else if (e instanceof PallyconServerResponseException) {
				PallyconServerResponseException e1 = (PallyconServerResponseException) e;
				builder.setMessage("errorCode : " + e1.getErrorCode() + "\n" + "message : " + e1.getMessage());

			} else if (e instanceof KeysExpiredException) {
				builder.setMessage("license has been expired. please remove the license first and try again.");
				builder.setPositiveButton("OK", null);
				Dialog dialog = builder.create();
				dialog.show();
				return;

			} else if(e instanceof DetectedDeviceTimeModifiedException) {
				// TODO: content playback should be prohibited to prevent illegal use of content.
				builder.setMessage("Device time has been changed. go to [Settings] > [Date & time] and use [Automatic date & time] and Connect Internet");
				builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
					@Override
					public void onClick(DialogInterface dialogInterface, int i) {
						finish();
					}
				});
				Dialog dialog = builder.create();
				dialog.setCancelable(false);
				dialog.setCanceledOnTouchOutside(false);
				dialog.show();
				return;

			} else {
				builder.setMessage(e.getMessage());
			}

			builder.setPositiveButton("OK", null);
			Dialog dialog = builder.create();
			dialog.show();
		}

		@Override
		public void onDrmKeysRestored() {
			AlertDialog.Builder alertBuilder = new AlertDialog.Builder(PlayerActivity.this);
			alertBuilder.setTitle("License Info");
			alertBuilder.setMessage("Drm key Restored !!!!!");
			alertBuilder.setPositiveButton("OK", null);
			Dialog dialog = alertBuilder.create();
			dialog.show();
		}

		@Override
		public void onDrmKeysRemoved() {
			AlertDialog.Builder alertBuilder = new AlertDialog.Builder(PlayerActivity.this);
			alertBuilder.setTitle("License Info");
			alertBuilder.setMessage("Drm key Removed !!!!!");
			alertBuilder.setPositiveButton("OK", null);
			Dialog dialog = alertBuilder.create();
			dialog.show();
		}
	};

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_player);

//		debugRootView = findViewById(R.id.controls_root);

		shouldAutoPlay = true;

//		com.google.android.exoplayer2.ui.SimpleExoPlayerView
		simpleExoPlayerView = findViewById(R.id.player_view);
		simpleExoPlayerView.requestFocus();

		//// Chromecast
		mCastContext = CastContext.getSharedInstance(this);
		// mCastContext is always not null. No need to check null
		createMessageReceivedCallback();
		createSessionManagerListener();
		createRemoteMediaClientListener();
		createRemoteMediaClientProgressListener();
		mSessionManager = mCastContext.getSessionManager();
		mCastSession = mSessionManager.getCurrentCastSession();
		if( mCastSession != null ) {
			Log.d(TAG, "[CAST] CastSession exists");
			try {
				mCastSession.setMessageReceivedCallbacks(CAST_MSG_NAMESPACE, mMessageReceivedCallback);
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			Log.d(TAG, "mCastSession is null");
		}

		bNowOnChromecast = false;
		bCreated = true;
		//// CC

		eventHandler = new Handler();
		bandwidthMeter = new DefaultBandwidthMeter();

		mediaDataSourceFactory = buildDataSourceFactory();

		Log.d(TAG, "onCreate(): mPlayStatus.mPosition: " + mPlayStatus.mPosition);
		audioItemProgressBar = findViewById(R.id.audioItemProgressBar);

		// 베이스 레이아웃
		setBaseUI();
		// 자막 레이아웃
		setSubtitlsUI();
		// 버튼 클릭 준비
		buttonInit();
		// Volume Controller Init
		initControls();
		// 별점 뷰 셋팅 하기
		setMyrepuSetUI();
		//오디오북 or 오디오모드에서 보이는 이미지
		setAudioModeImageUI();
		// 네트워크 상태 , 다운로드 상태 출력
		setDownloadHandlering();
		//플레이리스트UI
		setLectureItem();

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

					if (msubtitls_view.getVisibility() == View.VISIBLE || msubtitls_view_long.getVisibility() == View.VISIBLE) {

						if (!visible) {

							control_wrap_bg.setVisibility(View.INVISIBLE);
							general_button_group.setVisibility(View.INVISIBLE);
							myrepu_button_group.setVisibility(View.INVISIBLE);
							play_button_group.setVisibility(View.INVISIBLE);
							smart_button_wrap.setVisibility(View.INVISIBLE);
							welean_blank_line2.setVisibility(View.INVISIBLE);
							welean_blank_line.setVisibility(View.INVISIBLE);
							welean_wrap_bg.setVisibility(View.INVISIBLE);

							msleep_view.setVisibility(View.INVISIBLE);

							play_network_type_text.setVisibility(View.INVISIBLE);

							msubtitls_view.setY(msubtitls_view.getY() + control_wrap_bg.getHeight());
							msubtitls_view_long.setY(msubtitls_view_long.getY() + control_wrap_bg.getHeight() + smart_button_wrap.getHeight() + welean_blank_line2.getHeight());
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

							msubtitls_view.setY(msubtitls_view.getY() - control_wrap_bg.getHeight());
							msubtitls_view_long.setY(msubtitls_view_long.getY() - control_wrap_bg.getHeight() - smart_button_wrap.getHeight() - welean_blank_line2.getHeight());
							visible = false;
							return true;
						}
					}
				}
				return false;
			}
		});
	}

	@Override
	protected void onStart() {
		super.onStart();
//		if (Util.SDK_INT > 23) {
//			try {
//				try {
//					initializePlayer();
//				} catch (PallyconEncrypterException e) {
//					Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
//					finish();
//				} catch (JSONException e) {
//					Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
//					finish();
//				} catch (PallyconDrmException e) {
//					Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
//					finish();
//				}
//
//			} catch (RuntimeException e) {
//
//			}
//		}
	}

	@Override
	protected void onResume() {
		super.onResume();

		// Check chromecast first
		//// Chromecast
		mSessionManager.addSessionManagerListener(mSessionManagerListener, CastSession.class);
		if (mCastSession != null && (mCastSession.isConnected() || mCastSession.isConnecting())) {
			if( bCreated ) {
				// If PlayerActivity is created, it means that the user select a content at MainActivity.
				releaseCast();
				bCreated = false;
				bNowOnChromecast = false;
			}

			if( bNowOnChromecast ) {
				// If the content is playing at Chromecast already, do nothing.
				Log.d(TAG, "[CAST] continue playing on Chromecast");
				return;
			}

			// If the content is not playing at Chromecast, load the content.
			Uri contentUri = getIntent().getData();
			if( contentUri != null && contentUri.toString().startsWith("/") ) {
				// The contents is in internal storage. It is not supported by Cast.
				mPlayStatus.mScreen = PlayStatus.SCREEN_LOCAL;
				Log.d(TAG, "[CAST] Chromecast is connected but the content type is not streaming");
			} else {
				// The contents is in remote storage. Cast will be work.
				mPlayStatus.mScreen = PlayStatus.SCREEN_CAST;
				Log.d(TAG, "[CAST] Chromecast is connected");

				Log.d(TAG, "[CAST] start playing on Chromecast");
				if( !loadRemoteMedia(0, true) )
					Log.d(TAG, "[CAST] failure on loadRemoteMedia()");

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
		if( mPlayStatus.mCurrentState == PlayStatus.STATE_PLAYING )
			shouldAutoPlay = true;

		if (Util.SDK_INT <= 23 || player == null) {
			try {
				initializePlayer();
			} catch (PallyconDrmException e) {
				Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
				finish();
			} catch (PallyconEncrypterException e) {
				Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
				finish();
			} catch (JSONException e) {
				Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
				finish();
			}
		} else {
			simpleExoPlayerView.setUseController(true);
			player.setPlayWhenReady(shouldAutoPlay);
		}
	}

	@Override
	protected void onPause() {
		//// Chromecast
		if( mCastContext != null && mSessionManagerListener != null && mRemoteClient != null ) {
			mSessionManager.removeSessionManagerListener(mSessionManagerListener, CastSession.class);
		}
		//// CC

		if (Util.SDK_INT <= 23) {
			releasePlayer();
		}

		super.onPause();
	}

	@Override
	protected void onStop() {
		if (Util.SDK_INT > 23) {
			releasePlayer();
		}

		mPlayStatus.clear();

		super.onStop();
	}

	@Override
	public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
		if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
			try {
				initializePlayer();
			} catch (PallyconDrmException e) {
				Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
				finish();
			} catch (PallyconEncrypterException e) {
				Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
				finish();
			} catch (JSONException e) {
				Toast.makeText(this, e.getMessage(), Toast.LENGTH_LONG).show();
				finish();
			}
		} else {
			Toast.makeText(getApplicationContext(), R.string.storage_permission_denied, Toast.LENGTH_LONG).show();
			finish();
		}
	}

	private void initializePlayer() throws PallyconDrmException, PallyconEncrypterException, JSONException {
		UUID drmSchemeUuid = null;
		Intent intent = getIntent();
		Uri uri = intent.getData();

		if( uri == null || uri.toString().length() < 1 )
			throw new PallyconDrmException("The content url is missing");

		if (player == null) {
			TrackSelection.Factory adaptiveTrackSelectionFactory =
					new AdaptiveTrackSelection.Factory(BANDWIDTH_METER);
			trackSelector = new DefaultTrackSelector(adaptiveTrackSelectionFactory);
			trackSelectionHelper = new TrackSelectionHelper(trackSelector, adaptiveTrackSelectionFactory);

			if (intent.hasExtra(DRM_SCHEME_UUID_EXTRA)) {
				drmSchemeUuid = UUID.fromString(intent.getStringExtra(DRM_SCHEME_UUID_EXTRA));
			}

			DrmSessionManager<FrameworkMediaCrypto> drmSessionManager = null;
			if (drmSchemeUuid != null) {
				String drmLicenseUrl = intent.getStringExtra(DRM_LICENSE_URL);
				boolean multiSession = intent.getBooleanExtra(DRM_MULTI_SESSION, false);
				try {
					// TODO : Acquire Pallycon Widevine module.
					WVMAgent = PallyconWVMSDKFactory.getInstance(this);
					WVMAgent.setPallyconEventListener(pallyconEventListener);
				} catch (PallyconDrmException e) {
					e.printStackTrace();
				}

				try {
					String userId = intent.getStringExtra(DRM_USERID);
					String cid = intent.getStringExtra(DRM_CID);
					String oid = intent.getStringExtra(DRM_OID);
					String token = intent.getStringExtra(DRM_TOKEN);
					String customData = intent.getStringExtra(DRM_CUSTOME_DATA);
					// TODO : Create Pallycon drmSessionManager to get into ExoPlayerFactory

					if(token.equals("") == false) {
						drmSessionManager = WVMAgent.createDrmSessionManagerByToken(drmSchemeUuid, drmLicenseUrl, uri, userId, cid, token, multiSession);
					} else if(customData.equals("") == false) {
						drmSessionManager = WVMAgent.createDrmSessionManagerByCustomData(drmSchemeUuid, drmLicenseUrl, uri, customData, multiSession);
					} else if( userId == null || userId.length() < 1 ) {
						drmSessionManager = WVMAgent.createDrmSessionManagerByProxy(drmSchemeUuid, drmLicenseUrl, uri, cid, multiSession);
					} else {
						drmSessionManager = WVMAgent.createDrmSessionManager(drmSchemeUuid, drmLicenseUrl, uri, userId, cid, oid, multiSession);
					}

				} catch (PallyconDrmException e) {
					e.printStackTrace();
					throw e;
				}
			}

			boolean preferExtensionDecoders = intent.getBooleanExtra(PREFER_EXTENSION_DECODERS, false);
			@DefaultRenderersFactory.ExtensionRendererMode int extensionRendererMode = DefaultRenderersFactory.EXTENSION_RENDERER_MODE_ON;

			// TODO : Set Pallycon drmSessionManager for drm controller.
			DefaultRenderersFactory renderersFactory = new DefaultRenderersFactory(this,
					drmSessionManager, extensionRendererMode);

			player = ExoPlayerFactory.newSimpleInstance(renderersFactory, trackSelector);
			// TODO : Set Pallycon drmSessionManager for listener.
			player.addListener(playerEventListener);

			// TODO : Set Sercurity API to protect media recording by screen recorder
			SurfaceView view = (SurfaceView)simpleExoPlayerView.getVideoSurfaceView();
			if(Build.VERSION.SDK_INT >= 17) {
				view.setSecure(true);
			}

			simpleExoPlayerView.setPlayer(player);
			if( mPlayStatus.mPosition >  0 )
				player.seekTo(mPlayStatus.mPosition);
			player.setPlayWhenReady(shouldAutoPlay);

			if( mPlayStatus.mPosition >  0 )
				player.seekTo(mPlayStatus.mPosition);
			player.setPlayWhenReady(shouldAutoPlay);
		}

		if (Util.maybeRequestReadExternalStoragePermission(this, uri)) {
			return;
		}

		MediaSource mediaSource = buildMediaSource(uri);
		player.prepare(mediaSource);
//		updateButtonVisibilities();
	}

	private void releasePlayer() {
		if (player != null) {
			shouldAutoPlay = player.getPlayWhenReady();
			player.release();
			player = null;
			trackSelector = null;
		}
	}

	private void updateButtonVisibilities() {
		debugRootView.removeAllViews();

		if (player == null) {
			return;
		}

		MappingTrackSelector.MappedTrackInfo mappedTrackInfo = trackSelector.getCurrentMappedTrackInfo();
		if (mappedTrackInfo == null) {
			return;
		}

		if (mappedTrackInfo == null) {
			return;
		}

		for (int i = 0; i < mappedTrackInfo.length; i++) {
			TrackGroupArray trackGroups = mappedTrackInfo.getTrackGroups(i);
			if (trackGroups.length != 0) {
				Button button = new Button(this);
				String label;
				switch (player.getRendererType(i)) {
					case C.TRACK_TYPE_AUDIO:
						label = "Audio";
						break;
					case C.TRACK_TYPE_VIDEO:
						label = "Video";
						break;
					case C.TRACK_TYPE_TEXT:
						label = "Text";
						break;
					default:
						continue;
				}
				button.setText(label);
				button.setTag(i);
				button.setOnClickListener(this);
				debugRootView.addView(button, debugRootView.getChildCount() - 1);
			}
		}
	}

	private MediaSource buildMediaSource(Uri uri) {
		int type = Util.inferContentType(uri.getLastPathSegment());
		switch (type) {
			case C.TYPE_DASH:
				return new DashMediaSource(uri, buildDataSourceFactory(), new DefaultDashChunkSource.Factory(mediaDataSourceFactory), eventHandler, null);
			case C.TYPE_OTHER:
				return new ExtractorMediaSource(uri, mediaDataSourceFactory, new DefaultExtractorsFactory(), eventHandler, null);
			case C.TYPE_HLS:
			case C.TYPE_SS:
			default:
				throw new IllegalStateException("Unsupported type: " + type);
		}
	}

	private DataSource.Factory buildDataSourceFactory() {
		HttpDataSource.Factory httpDataSourceFactory = buildHttpDataSourceFactory();
		return new DefaultDataSourceFactory(this, null, httpDataSourceFactory);
	}

	private HttpDataSource.Factory buildHttpDataSourceFactory() {
		return new DefaultHttpDataSourceFactory(Util.getUserAgent(this, "ExoPlayerSample"), null);
	}

	//// Chromecast
	private CastContext mCastContext = null;
	private CastSession mCastSession = null;
	private SessionManager mSessionManager = null;
	private SessionManagerListener<CastSession> mSessionManagerListener = null;
	private RemoteMediaClient mRemoteClient = null;
	private RemoteMediaClient.Listener			mRemoteClientListener = null;
	private RemoteMediaClient.ProgressListener	mRemoteClientProgressListener = null;
	private Cast.MessageReceivedCallback		mMessageReceivedCallback = null;
	private PlayStatus mPlayStatus = PlayStatus.getObject();
	private boolean bNowOnChromecast = false;
	private boolean bCreated = false;
	private static boolean bCastReceiverRegistered = false;
	private final String CAST_MSG_NAMESPACE = "urn:x-cast:com.pallycon.cast";

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);
		getMenuInflater().inflate(R.menu.browse, menu);
		CastButtonFactory.setUpMediaRouteButton(getApplicationContext(), menu, R.id.media_route_menu_item);
		return true;
	}

	private void releaseCast() {
		Log.d(TAG, "[CAST] releaseCast()");

		bNowOnChromecast = false;
		mPlayStatus.clear();

		if( mRemoteClient != null ) {
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
		if( !bCastReceiverRegistered ) {
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
				if( player != null ) {
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

				if( player == null ) {
					Log.d(TAG, "[CAST] no local player. initializing...");
					try {
						initializePlayer();
					} catch (PallyconDrmException e) {
						e.printStackTrace();
					} catch (PallyconEncrypterException e) {
						e.printStackTrace();
					} catch (JSONException e) {
						e.printStackTrace();
					}
				}

				// seek position of local player to position of remote player
				if( player != null ) {
					player.seekTo(latestPosition);
					player.setPlayWhenReady(shouldAutoPlay);
				}
			}
		};
	}

	private String getIdleReasonString(int idleReason) {
		switch(idleReason) {
		case MediaStatus.IDLE_REASON_FINISHED:	// 1
			return "Finish";
		case MediaStatus.IDLE_REASON_CANCELED:	// 2
			return "Canceled";
		case MediaStatus.IDLE_REASON_INTERRUPTED:	// 3
			return "Interrupted";
		case MediaStatus.IDLE_REASON_ERROR:	// 4
			return "Error";
		case MediaStatus.IDLE_REASON_NONE:	// 0
		default:
			return "None";
		}
	}

	private void createRemoteMediaClientListener() {
		mRemoteClientListener = new RemoteMediaClient.Listener() {
			@Override
			public void onStatusUpdated() {
				Log.d(TAG, "[CAST] onStatusUpdated()");

				if( mRemoteClient == null )
					return;

				switch( mRemoteClient.getPlayerState() ) {
					case MediaStatus.PLAYER_STATE_IDLE:
						int idleReason = mRemoteClient.getIdleReason();
						Log.d(TAG, "[CAST] RemoteMediaClient.getPlayerState(): PLAYER_STATE_IDLE (" + getIdleReasonString(idleReason) +")");
						mPlayStatus.mCurrentState = PlayStatus.STATE_IDLE;

						if( idleReason == MediaStatus.IDLE_REASON_FINISHED ) {
							// starting cast after finish, idel reason is 'FINISH' yet.
							// app must handel 'FINISH' at start
							if( mPlayStatus.mPosition > 0 ) {
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
						Toast.makeText(getApplicationContext(), "The receiver can not play the contents. Is it supported contents format?", Toast.LENGTH_LONG).show();
						break;
					case "MEDIAKEYS":
						Toast.makeText(getApplicationContext(), "The receiver can not decrypt the contents. Please check license status", Toast.LENGTH_LONG).show();
						break;
					case "NETWORK":
						Toast.makeText(getApplicationContext(), "The receiver can not find the contents. Please check network status", Toast.LENGTH_LONG).show();
						break;
					case "MANIFEST":
						Toast.makeText(getApplicationContext(), "The receiver can not read the contents' manifest. Please contact contents provider", Toast.LENGTH_LONG).show();
						break;
					case "UNKNOWN":
					default:
						Toast.makeText(getApplicationContext(), "The receiver reports unknown error. Please try again", Toast.LENGTH_LONG).show();
						break;
				}

				releaseCast();
				finish();
			}
		};
	}
	private boolean getRemoteMediaClient(CastSession session) {
		if( session != null )
			mCastSession = session;
		return 	getRemoteMediaClient();
	}

	private boolean getRemoteMediaClient() {
		if( mRemoteClient != null ) {
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

	private MediaInfo buildMediaInfo(String source, String title, String subtitle, String thumbImageUrl) {
		MediaMetadata movieMetadata = new MediaMetadata(MediaMetadata.MEDIA_TYPE_MOVIE);

		if( title == null )
			title = "Content from sender app";
		if( thumbImageUrl == null )
			thumbImageUrl = "http://demo.netsync.co.kr/Mob/Cont/images/no_thumb.png";

		movieMetadata.putString(MediaMetadata.KEY_TITLE, title);
		movieMetadata.putString(MediaMetadata.KEY_SUBTITLE, subtitle);
		movieMetadata.addImage(new WebImage(Uri.parse(thumbImageUrl)));

		JSONObject castCustomData = new JSONObject();
		try {
			Intent intent = getIntent();
			if( intent.hasExtra(DRM_LICENSE_URL)) {
				// get license custom data
				String userid = intent.getStringExtra(DRM_USERID);
				String cid = intent.getStringExtra(DRM_CID);
				String oid = intent.getStringExtra(DRM_OID);

				String licenseUrl = intent.getStringExtra(DRM_LICENSE_URL);
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

		if( uri == null || uri.toString().length() < 1 ) {
			Log.d(TAG, "[CAST] uri to cast is invalid");
			return false;
		}

		try {
			MediaLoadOptions options = new MediaLoadOptions.Builder()
					.setAutoplay(autoPlay)
					.setPlayPosition(position)
					.build();
			if( !getRemoteMediaClient() )
				return false;

			bNowOnChromecast = true;
			mRemoteClient.load(buildMediaInfo(uri.toString(), intent.getStringExtra(CONTENTS_TITLE), null, intent.getStringExtra(THUMB_URL)), options);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}

		return false;
	}

	@Override
	public void onClick(View view) {
		if (view.getParent() == debugRootView) {
			MappingTrackSelector.MappedTrackInfo mappedTrackInfo = trackSelector.getCurrentMappedTrackInfo();
			if (mappedTrackInfo != null) {
				trackSelectionHelper.showSelectionDialog(
						this, ((Button) view).getText(), mappedTrackInfo, (int) view.getTag());
			}
		}
	}
	//// end of Chromecast

	public void setBaseUI(){
		mLayout = (LayoutInflater)getApplicationContext().getSystemService (Context.LAYOUT_INFLATER_SERVICE);

		//컨트롤버튼그룹
		mButtonGroupLayout = findViewById(R.id.LAYOUT_BUTTON_GROUP);
		mLayout.inflate (R.layout.welean_button_group, mButtonGroupLayout, true);

		mPlaylistGroupLayout = findViewById(R.id.LAYOUT_PLAYLIST_GROUP);
		mLayout.inflate (R.layout.welean_playlist, mPlaylistGroupLayout, true);
		//List 정보를 등록 하기 위한 ..
		LinearLayout mPlaylistwrap = findViewById((R.id.playlistparent));
		mLayout.inflate (R.layout.welean_playlist_listview, mPlaylistwrap, true);

		mButtonGroupLayout.setVisibility(View.VISIBLE);
		mPlaylistGroupLayout.setVisibility(View.INVISIBLE);

		mRelatedListGroupLayout = findViewById(R.id.LAYOUT_RELATEDLIST_GROUP);
		mLayout.inflate (R.layout.welean_related_list_main, mRelatedListGroupLayout, true);

		if (mgestureScanner == null){
			mgestureScanner = new GestureDetector(getApplicationContext(),mGestureListener);
		}

		mRelatedListGroupLayout.setOnTouchListener(new View.OnTouchListener(){
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

			try{
				if(Math.abs(e1.getY() - e2.getY()) > SWIPE_MAX_OFF_PATH) return false;

				Animation fadeout = null;

				if(e1.getX() - e2.getX() > SWIPE_MIN_DISTANCE){
					fadeout = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_out_left);
				}else if(e2.getX() - e1.getX() > SWIPE_MIN_DISTANCE){
					fadeout = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_out_right);
				}

				mRelatedListGroupLayout.startAnimation(fadeout);
				mRelatedListGroupLayout.setVisibility(View.GONE);

				setBackGroungLayout(false);

			}catch (Exception e){
				e.printStackTrace();
			}

			return true;
		}
	};

	/****************************************************************************
	 * 추천 뷰 상태에서 백그라운드 레이아웃 셋팅하기
	 ****************************************************************************/
	public void setBackGroungLayout(boolean type){

		RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
		RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
		RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
		RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
		RelativeLayout welean_blank_line2 = findViewById(R.id.welean_blank_line2);
		RelativeLayout welean_blank_line = findViewById(R.id.welean_blank_line);
		RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);
		RelativeLayout play_network_type_text = findViewById(R.id.wrap_welean_play_network_type);
		RelativeLayout myrepu_button_group = findViewById(R.id.MYREPU_BUTTON_GROUP);

		if(type){

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
		}else{
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

	public void setSubtitlsUI(){
		//자막UI set
		msubtitls_view = findViewById(R.id.SUB_TITLS_VIEW);

		mLayout.inflate (R.layout.welean_ui_subtitles, msubtitls_view, true);

		msubtitls_view_long = findViewById(R.id.SUB_TITLS_VIEW_LONG);

		mLayout.inflate (R.layout.welean_ui_subtitles_long, msubtitls_view_long, true);

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

			mscrollview.getViewTreeObserver().addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
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
//					Log.d("ScrollView","scrollX_"+i+"_scrollY_"+i1+"_oldScrollX_"+i2+"_oldScrollY_"+i3);

					mlongScrollview.setScrollY(i1);
				}

			});
		}

		if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.KITKAT) {

			mlongScrollTimeview.getViewTreeObserver().addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
				@Override
				public void onScrollChanged() {
					int scrollY = mlongScrollTimeview.getScrollY(); // For ScrollView
					int scrollX = mlongScrollTimeview.getScrollX(); // For HorizontalScrollView
					// DO SOMETHING WITH THE SCROLL COORDINATES

					mlongScrollview.setScrollY(scrollY);
				}
			});
		}

//		setSuTitleJson(contentId);
	}

	public void setSuTitleJson(int i){

		String subTitlsWebUrl="none";

	}


	/*******************************************************************
	 * 처음생성되는 버튼들
	 *******************************************************************/
	private void buttonInit(){

		mHandler = new Handler();

		mSleeperHandler = new SleepTimeHandler(PlayerActivity.this);
		sleeptimerText = findViewById(R.id.sleeptext);

		mAniSlideShow = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_up);
		mAniSlideHide = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_down);

		mButtonPlay = findViewById(R.id.WELEAN_BTN_PLAY);
		mButtonPause = findViewById(R.id.WELEAN_BTN_PAUSE);
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

		mBtnlistClose = findViewById(R.id.BUTTON_PLAYLIST_LIST);

		mButton_playlist_close_linear = findViewById(R.id.BUTTON_PLAYLIST_CLOSE_LINEAR);
		mButton_player_close_linear = findViewById(R.id.BTN_CLOSE_LINEAR);

		mBtnArrowLeft  = findViewById(R.id.leftArrowButton);
		mBtnArrowRight = findViewById(R.id.rightArrowButton);

		mButton_Arrow_Layout = findViewById(R.id.ARROW_LAYOUT);

		mBtnVolume = findViewById(R.id.welaaa_volume_btn);
		mBtnVolumeActive= findViewById(R.id.welaaa_volume_btn_active);

		mVolumeControlBar = findViewById(R.id.VOLUME_CONTROL_BAR);

		mTextViewVolumeText = findViewById(R.id.VOLUME_SEEK_TITLE);

		mMyRepuBoxLinear = findViewById(R.id.myrepu_box_linear);

		mRelatedListClosed = findViewById(R.id.BUTTON_RELATEDLIST_CLOSE);

		mRelatedViewBtn = findViewById(R.id.RELATED_BUTTON_GROUP);
		mRelatedViewTopCloseBtn = findViewById(R.id.BUTTON_RELATEDLIST_TOP_CLOSE);

		// 자동 재생 설정 여부에 따라 분기 처리 ..
		if(Preferences.getWelaaaPlayAutoPlay(getApplicationContext())){
			Logger.i(TAG+":AUTOPLAY");
			mBtnAutoplay.setVisibility(View.INVISIBLE);
			mBtnAutoplayCancel.setVisibility(View.VISIBLE);
		}else{
			Logger.i(TAG+":NOT AUTOPLAY");
			mBtnAutoplay.setVisibility(View.VISIBLE);
			mBtnAutoplayCancel.setVisibility(View.INVISIBLE);
		}

		if(Preferences.getWelaaaPlayerSleepMode(getApplicationContext())){
			Logger.i(TAG+":SLEEP MODE");
			mBtnSleeper.setVisibility(View.INVISIBLE);
			mBtnSleep_Active.setVisibility(View.VISIBLE);
			sleeptimerText.setVisibility(View.VISIBLE);
		}else{
			Logger.i(TAG+":NOT SLEEP MODE");
			mBtnSleeper.setVisibility(View.VISIBLE);
			mBtnSleep_Active.setVisibility(View.INVISIBLE);
			sleeptimerText.setVisibility(View.INVISIBLE);
		}

		String ckey = "";

		if(Utils.isAirModeOn(getApplicationContext())){
			ckey = "70";
		}else{
			try{
				if(Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
//					ckey = mWelaaaPlayer.getNewWebPlayerInfo().getCkey()[getContentId()];
				}else {
//					ckey = mWelaaaPlayer.getwebPlayerInfo().getCkey()[getContentId()];
				}
			}catch (Exception e){
				e.printStackTrace();
			}
		}

		try{
//			if(getApplicationContext().ContentManager().existCid(ckey)){
////            mBtnDownload.setEnabled(false);
//				mBtnDownload.setAlpha(0.5f);
//			}else{
//				mBtnDownload.setBackgroundDrawable(getResources().getDrawable(R.drawable.icon_download));
//			}
		}catch (Exception e){
			e.printStackTrace();
		}

//		mTextCurTime = findViewById(R.id.WELEAN_TEXT_CUR_TIME);
//		mTextTotalTime = findViewById(R.id.WELEAN_TOTAL_TIME);
		mSeekBar = findViewById(R.id.exo_progress);
		mRelatedViewBtn.setVisibility(View.GONE);

		// audioBook mode , video/audio mode

		try{
//			if(getApplicationContext().CON_CLASS.equals("2")){
//
////            mSeekBar = ((SeekBar)findViewById(R.id.WELEAN_AUDIO_SEEK_BAR));
//
//				mSeekBar.setProgressDrawable(getResources().getDrawable(R.drawable.progress_horizontal_custom_audio)  );
//
//				mButton_Arrow_Layout.setVisibility(View.GONE);
//
//				mRelatedViewBtn.setVisibility(View.GONE);
//
//			}else{
//				mRelatedViewBtn.setVisibility(View.VISIBLE);
//
//				if(Preferences.getWelaaaPreviewPlay(getApplicationContext())){
//					mButton_Arrow_Layout.setVisibility(View.GONE);
//				}else{
//					mButton_Arrow_Layout.setVisibility(View.VISIBLE);
//				}
//			}
		}catch (Exception e){
			e.printStackTrace();
		}

		//강의텍스트버튼
//        int colorGreen = ContextCompat.getColor(getApplicationContext(), R.color.playlist_text_color);
//        TextView lecture = (TextView)findViewById(R.id.BUTTON_LECTURE);
//        lecture.setTextColor(colorGreen);

		mButtonPlay.setOnClickListener(click_control);
		mButtonPause.setOnClickListener(click_control);
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

//		if (mSeekBar != null)
//		{
//			mSeekBar.setMax(1000);
//		}
	}

	static double timesleep = 0;
	public void sleepstart(){

//        timesleep = (double) (sleeperNum * (60 * 1000)) + 1000;
		timesleep = (double) (sleeperNum * (60 * 1000));
		startSleepTimeThread();
	}

	static final class SleepTimeHandler extends Handler {

		private final WeakReference<PlayerActivity> mController;
		public SleepTimeHandler(PlayerActivity controller){
			mController= new WeakReference<PlayerActivity>(controller);
		}
		public void handleMessage(Message msg) {
//			sleeptimerText.setText(mController.get().timeToString(mController.get().timesleep));

			if(mController.get().timesleep<=0)
			{
				mSleeperHandler.removeCallbacksAndMessages(null);

				try{
					
//					if(mController.get().mWelaaaPlayer!=null){
//						mController.get().mWelaaaPlayer.finishForSleeper();
//
//						// stopFlag set true
//						mController.get().stopSleepTimeThread();
//					}

				}catch (Exception e){
					e.printStackTrace();
				}
			}else{

				timesleep = timesleep -1000;

				if(mSleeperHandler!=null){
					mSleeperHandler.sendEmptyMessageDelayed(0, 1000);
				}
			}
		}
	}


	public void stopSleepTimeThread (){
		stopFlag = true;

		// 핸들러 초기화 처리 !
		if(mSleeperHandler!=null){
			mSleeperHandler.removeCallbacksAndMessages(null);
		}

	}
	static Boolean stopFlag = false;
	public void startSleepTimeThread (){
		stopFlag = false;

		try{
			if (sleeptimeThread.getState() == Thread.State.NEW)
			{
				Message msg = mSleeperHandler.obtainMessage();
				mSleeperHandler.sendMessageDelayed(msg, 1000);
			}
		}catch (Exception e){
			e.printStackTrace();
		}
	}

	private static class SleepTimeThreader extends Thread{
		public SleepTimeThreader(Runnable runnable){
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

						if(timesleep>0){
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

			try {

				switch (v.getId()) {
					case R.id.BTN_AUTOPLAY: {
						Utils.logToast(getApplicationContext(), R.string.auto_play_option_on);

						mBtnAutoplay.setVisibility(View.INVISIBLE);
						mBtnAutoplayCancel.setVisibility(View.VISIBLE);
						Preferences.setWelaaaPlayAutoPlay(getApplicationContext(), true);
					}
					break;

					case R.id.BTN_AUTOPLAY_CANCEL: {
						Utils.logToast(getApplicationContext(), R.string.auto_play_option);

						mBtnAutoplay.setVisibility(View.VISIBLE);
						mBtnAutoplayCancel.setVisibility(View.INVISIBLE);
						Preferences.setWelaaaPlayAutoPlay(getApplicationContext(), false);
					}
					break;

					case R.id.WELAAA_ICON_SPEED: {
						ArrayList<Integer> ids = new ArrayList<Integer>();

						ids.add(R.drawable.icon_speed_12);
						ids.add(R.drawable.icon_speed_15);
						ids.add(R.drawable.icon_speed_08);
						ids.add(R.drawable.icon_speed_10);

						if (speedIndex < ids.size()) {
							mBtnIconBtnSpeed.setBackgroundDrawable(getResources().getDrawable(ids.get(speedIndex)));
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

						float f = (float)speedNum;
						PlaybackParameters param = new PlaybackParameters(f, f);
						player.setPlaybackParameters(param);
					}
					break;

					case  R.id.CDN_TAG_BTN_BACKWARD:
					{
						player.seekTo(player.getCurrentPosition() - 10000);
					}
					break;

					case  R.id.CDN_TAG_BTN_FORWARD:
					{
						player.seekTo(player.getCurrentPosition() + 10000);
					}
					break;

					case R.id.WELEAN_BTN_PAUSE:
					{
						player.setPlayWhenReady(false);

						if(mButtonPause!=null)mButtonPause.setVisibility(View.GONE);
						if(mButtonPlay!=null)mButtonPlay.setVisibility(View.VISIBLE);
					}
					break;

					case R.id.WELEAN_BTN_PLAY:
					{
						player.setPlayWhenReady(true);

						if(mButtonPause!=null)mButtonPause.setVisibility(View.VISIBLE);
						if(mButtonPlay!=null)mButtonPlay.setVisibility(View.GONE);
					}
					break;

					case R.id.BTN_SMI_ON:
					{
						// 미리 보기 모드에서는 자막 모드를 지원 하지 않습니다.
//						if(!mWelaaaPlayer.mPreview){
							mBtnSubtitlesOff.setVisibility(View.VISIBLE);
							mBtnSubtitlesOn.setVisibility(View.INVISIBLE);

							msubtitls_view.setVisibility(View.VISIBLE);
							msubtitls_view_long.setVisibility(View.INVISIBLE);

							final int positoinY = getTextviewHeight() * getTextViewNumber();

							mscrollview.scrollTo(0,positoinY);
//						}else{
//							Utils.logToast(mAppcontext , mAppcontext.getString(R.string.info_perview_mode)) ;
//						}

					}
					break;

					case R.id.BTN_SMI_OFF:
					{
						mBtnSubtitlesOff.setVisibility(View.GONE);
						mBtnSubtitlesOn.setVisibility(View.VISIBLE);
						msubtitls_view.setVisibility(View.GONE);
						msubtitls_view_long.setVisibility(View.GONE);

						final int positoinY = getTextviewHeight() * getTextViewNumber();
						mscrollview.scrollTo(0,positoinY);

					}
					break;

					case R.id.BTN_ROCK:
					{
						Button unRock = findViewById(R.id.BTN_UNROCK_IN);
						Button lock = findViewById(R.id.BTN_ROCK);
						unRock.setVisibility(View.VISIBLE);
						mBtnRock.setVisibility(View.INVISIBLE);

						FrameLayout mframelayout = findViewById(R.id.blank_Rock_view);
						mframelayout.setVisibility(View.VISIBLE);


						int[] position = Utils.getViewPosition(mBtnRock);

						int positionX = position[0];
						int positionY = position[1] - mBtnUnRock.getHeight()/2;

						mBtnUnRock.setX(positionX);
						mBtnUnRock.setY(positionY);

						Preferences.setWelaaaPlayLockUsed(getApplicationContext(),true);

						mframelayout.setOnTouchListener(new View.OnTouchListener() {
							@Override
							public boolean onTouch(View v, MotionEvent event) {

								Logger.e(TAG + " 20170901 mframelayout 3442 ");
								return true;
							}
						});

					}
					break;

					case R.id.BTN_UNROCK:
					{
						Preferences.setWelaaaPlayLockUsed(getApplicationContext(),false);

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

						audioManager = (AudioManager) getApplicationContext().getSystemService(Context.AUDIO_SERVICE);

						int nMax = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
						int progress = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);

						int progressInt = Math.round(100 / nMax) * progress;

						if (progressInt > 89) {
							progressInt = 100;

						mTextViewVolumeText.setText(progressInt + "%");
					}
						break;

					case R.id.welaaa_volume_btn_active:

						mBtnVolume.setVisibility(View.VISIBLE);
						mBtnVolumeActive.setVisibility(View.INVISIBLE);

						mVolumeControlBar.setVisibility(View.INVISIBLE);

						welean_blank_line2 = findViewById(R.id.welean_blank_line2);
						welean_blank_line = findViewById(R.id.welean_blank_line);

						welean_blank_line2.setVisibility(View.VISIBLE);
						welean_blank_line.setVisibility(View.VISIBLE);

						audioManager = (AudioManager) getApplicationContext().getSystemService(Context.AUDIO_SERVICE);

						nMax = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
						progress = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);

						progressInt = Math.round(100/nMax)*progress;

						if(progressInt>89){
							progressInt = 100;
						}

						mTextViewVolumeText.setText(progressInt + "%");

						break;

					case R.id.myrepu_box_linear: {
							alertMyRepuWindow("강의클립이 흥미로우셨나요?", "회원님의 의견이 더 좋은 강의를 만드는 원동력이 됩니다! ", 1, 1, 0);
						}
						break;

					case R.id.BTN_AUDIO: {
						int indexOfVideoRenderer = -1;
						for (int i = 0; i < player.getRendererCount(); i++) {
							if (player.getRendererType(i) == C.TRACK_TYPE_VIDEO) {
								indexOfVideoRenderer = i;
								break;
							}
						}

						trackSelector.setRendererDisabled(indexOfVideoRenderer, true);

						audioModeBackgroundLayout.setVisibility(View.VISIBLE); //이미지보이고
						audioModeIconHeadset.setVisibility(View.VISIBLE); //아이콘보이고
						mButtonAudio.setVisibility(View.INVISIBLE); //오디오버튼아이콘 안보이고
						mButtonVideo.setVisibility(View.VISIBLE); //비디오버튼아이콘 보이고
					}
					break;

					case R.id.BTN_VIDEO: {

						int indexOfVideoRenderer = -1;
						for (int i = 0; i < player.getRendererCount(); i++) {
							if (player.getRendererType(i) == C.TRACK_TYPE_VIDEO) {
								indexOfVideoRenderer = i;
								break;
							}
						}

						trackSelector.setRendererDisabled(indexOfVideoRenderer, false);

						audioModeBackgroundLayout.setVisibility(View.GONE);
						audioModeIconHeadset.setVisibility(View.GONE);
						mButtonAudio.setVisibility(View.VISIBLE);
						mButtonVideo.setVisibility(View.INVISIBLE);
					}
					break;

					case  R.id.BTN_DOWNLOAD:
					{
//						if(Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
//						}else {
//							if(mWelaaaPlayer!=null){
//								if(mWelaaaPlayer.getwebPlayerInfo().getAudiobookbuy().equals("N")){
//									Utils.logToast(getApplicationContext() , getApplicationContext().getString(R.string.info_perview_audio_mode)) ;
//
//									return;
//								}
//							}
//						}

//						if(!mWelaaaPlayer.mPreview){
//							String ckey = "";
//
//							if(Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
//								ckey = mWelaaaPlayer.getNewWebPlayerInfo().getCkey()[getContentId()];
//							}else {
//								ckey = mWelaaaPlayer.getwebPlayerInfo().getCkey()[getContentId()];
//							}
//
//							try {
//								if(mWelaaaPlayer.ContentManager().existCid(ckey)){  // null return
//									Utils.logToast(getApplicationContext() , "이미 다운로드하셨습니다.");
//								}else{
//									alertDownloadWindow("알림" , "다운로드를 받으시겠습니까?" , "확인" , "취소" , 1);
//								}
//
//							} catch (Exception e) {
//								e.printStackTrace();
//							}
//						}else{
//							Utils.logToast(getApplicationContext() , getApplicationContext().getString(R.string.info_perview_mode)) ;
//						}

						Logger.e(TAG + " BTN_DOWNLOAD ");
						alertDownloadWindow("알림" , "다운로드를 받으시겠습니까?" , "확인" , "취소" , 1);

					}
					break;

					case  R.id.WELAAA_ICON_LIST:
					{
						boolean previewPlaymode =Preferences.getWelaaaPreviewPlay(getApplicationContext());

						if(previewPlaymode){
							// 구현 전입니다
							Utils.logToast(getApplicationContext() , getApplicationContext().getString(R.string.info_perview_mode)) ;
						}else{
							if(CON_CLASS.equals("1")) {
								// PlayerController 에서 호출되는 내용이 없었다 //

								String F_Token = Preferences.getWelaaaLoginToken(getApplicationContext());
								String weburl = WELEARN_WEB_URL + "/usingapp/play_list.php"	 + "?f_token=" + F_Token;

//								SendlastedViewListasyncTask sendlastedViewListasyncTask = new SendlastedViewListasyncTask();
//								if(Build.VERSION.SDK_INT >= 11){
//									sendlastedViewListasyncTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, weburl );
//								}
//								else{
//									sendlastedViewListasyncTask.execute(weburl);
//								}


								updateContentList();
							}

							if(CON_CLASS.equals("2") || PLAY_MODE.equals("audio")) {
								mButtonGroupLayout.setVisibility(View.VISIBLE);
							}

							mPlaylistGroupLayout.setVisibility(View.VISIBLE);
							mPlaylistGroupLayout.startAnimation(mAniSlideShow);

							// 일시정지
							player.setPlayWhenReady(false);
						}
					}
					break;

				}

			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	};


	public void initAutoTextScrollNum(){
		autoTextScrollNum = 0;
		mscrollview.setScrollY(0);
		mscrollTimeview.setScrollY(0);
		moveScrollCheck=true;
		setTextViewNumber(0);
	}

	Boolean moveScrollCheck = true;
	public void autoTxtScroll(int current){

		if(hasSubTitlsJesonUrl) {
			int emfontcolor = ContextCompat.getColor(getApplicationContext(), R.color.subtitls_emfont_color);

			if(current > mSubtitlstime[autoTextScrollNum]) {
				setTextViewNumber(autoTextScrollNum);

				int positionY = 0;

				positionY = getTextviewHeight() * getTextViewNumber();
				mscrollview.setScrollY(positionY);
				mscrollTimeview.setScrollY(positionY);

				shortSubTitlesTextView[autoTextScrollNum].setTextColor(emfontcolor);
				shortSubTitlesTextTimeView[autoTextScrollNum].setTextColor(emfontcolor);

				setFullText();
				moveScrollCheck=false;
			}
		}
	}

	public void setBlankSpaceParams(int width, int height){
		RelativeLayout movingspace = findViewById(R.id.blank_space);
		movingspace.setLayoutParams(new RelativeLayout.LayoutParams(width,height));
	}

	public void setTextViewNumber(int num){
		mTxtViewNumber = num;
	}

	public int getTextViewNumber(){
		return mTxtViewNumber;
	}

	public int getTextviewHeight(){
		int textViewHeight = Utils.dpToPx(getApplicationContext(),SHORT_SUBTITLS_SCROLL_VIEW_HEIGHT);
		return textViewHeight;
	}

	public int getTextviewHeightNew(){
		int textViewHeight = Utils.dpToPx(getApplicationContext(),NORMAL_SUBTITLS_SCROLL_VIEW_HEIGHT);
		return textViewHeight;
	}


	/*******************************************************************
	 *  자막설정
	 *******************************************************************/
	public void setSubtitls(String subTitls){

		SubtitlsInfo msubtitlsInfo = new SubtitlsInfo(subTitls);

		mSubtitlsmemo = msubtitlsInfo.getMemo();
		mSubtitlstime = msubtitlsInfo.getTime();


		try{
			if(mSubtitlstime!=null && mSubtitlsmemo!=null){
				setShortText();
				setFullText();
			}
		}catch (Exception e){
			e.printStackTrace();
		}

	}
	/*******************************************************************
	 *  자막이 없을 경우
	 *  http://crashes.to/s/019819c138e 2017.09.19
	 *******************************************************************/
	public void setNoneSubtilteText(){

		try{
			LinearLayout shortTextView = findViewById(R.id.shortTextView);
			if(shortTextView!=null) shortTextView.removeAllViews();
			TextView mblankTextView = new TextView(getApplicationContext());
			mblankTextView.setText(R.string.nosubTitledata);
			shortTextView.addView(mblankTextView);
		}catch (Exception e){
			e.printStackTrace();
		}

	}

	/*******************************************************************
	 *  짧은 자막 UI
	 *******************************************************************/
	public void setShortText(){

		LinearLayout shortTextView = findViewById(R.id.shortTextView);
		LinearLayout shortTextTimeView = findViewById(R.id.shortTextTimeView);

		if(shortTextView!=null) shortTextView.removeAllViews();
		if(shortTextTimeView!=null) shortTextTimeView.removeAllViews();

		int fontcolor = 0;
		try{
			fontcolor = ContextCompat.getColor(getApplicationContext(), R.color.subtitls_font_color);
		}catch (Exception e){
			e.printStackTrace();
		}

		try{
			subTitlsLineNum = new int[mSubtitlsmemo.length-1];

			//TODO 자막파일에 마지막 빈파일은 삭제하고 -2를 -1로 바꾸세요.
			if(shortSubTitlesTextView!=null) shortSubTitlesTextView = null;
			if(shortSubTitlesTextTimeView!=null) shortSubTitlesTextTimeView = null;

			shortSubTitlesTextView = new TextView[mSubtitlsmemo.length-2];
			shortSubTitlesTextTimeView = new TextView[mSubtitlsmemo.length-2];

			for( int j = 0; j < mSubtitlsmemo.length-2; j++ ) {

				if(shortSubTitlesTextView[j]!=null) shortSubTitlesTextView[j] = null;
				if(shortSubTitlesTextTimeView[j]!=null) shortSubTitlesTextTimeView[j] = null;

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

			shortTextView.setOnClickListener(new View.OnClickListener(){
				@Override
				public void onClick(View v){

					for( int j = 0; j < mSubtitlsmemo.length-2; j++ ) {
						subTitlsLineNum[j] =  (shortSubTitlesTextView[j].getLineCount() * shortSubTitlesTextView[0].getLineHeight()) + shortSubTitlesTextView[0].getLineHeight();
					}

					setBlankSpaceParams(msubtitls_view_long.getWidth(), msubtitls_view_long.getHeight() );
					Logger.i(TAG+":setShortText setOnClickListener msubtitls_view_long.getWidth() " + msubtitls_view_long.getWidth());
					Logger.i(TAG+":setShortText setOnClickListener msubtitls_view_long.getHeight() " + msubtitls_view_long.getHeight());
					msubtitls_view.setVisibility(View.GONE);
					msubtitls_view_long.setVisibility(View.VISIBLE);

					RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
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
//                    control_wrap_bg.setVisibility(VISIBLE);
					smart_button_wrap.setVisibility(View.GONE);  // Full Screen
					welean_blank_line2.setVisibility(View.GONE);
					welean_blank_line.setVisibility(View.INVISIBLE);
					welean_wrap_bg.setVisibility(View.INVISIBLE);
					//
					play_network_type_text.setVisibility(View.INVISIBLE);

					Animation an = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_up);
					mfullSmiLayout.startAnimation(an);
					Logger.i(TAG+":setShortText setOnClickListener onClick");
				}
			});
		}catch (Exception e){
			e.printStackTrace();
		}

	}

	/*******************************************************************
	 *  긴 자막 UI
	 *******************************************************************/
	public void setFullText(){
		final LinearLayout textFullView = findViewById(R.id.fullTextTimeView);
		LinearLayout textFullTimeView = findViewById(R.id.fullTextView);
		LinearLayout longScroll_font = findViewById(R.id.longScroll_font);
		mfullSmiLayout = findViewById(R.id.fullTxtWrap);

		if(textFullView!=null) textFullView.removeAllViews();
		if(textFullTimeView!=null) textFullTimeView.removeAllViews();

		if(longSubTitlesTextView!=null) longSubTitlesTextView = null;
		if(longSubTitlesTextTimeView!=null) longSubTitlesTextTimeView = null;

		ScrollView longView = findViewById(R.id.longScroll);
		ScrollView longScrollTime = findViewById(R.id.longScrollTime);

		int fontcolor = ContextCompat.getColor(getApplicationContext(), R.color.subtitls_font_color_long);
		int fontcolorWhite = ContextCompat.getColor(getApplicationContext(), R.color.subtitls_font_color_long_white);

		longSubTitlesTextView = new TextView[mSubtitlsmemo.length-2];
		longSubTitlesTextTimeView = new TextView[mSubtitlsmemo.length-2];

		textViewSumHeight = new int[mSubtitlsmemo.length-2];

		for(int j = 0; j < mSubtitlsmemo.length-2; j++ ) {

			if(longSubTitlesTextView[j]!=null) longSubTitlesTextView[j] = null;
			if(longSubTitlesTextTimeView[j]!=null) longSubTitlesTextTimeView[j] = null;

			// 현재 하일라이트 된 자막 영역
			if(j == getTextViewNumber()){
//                Log.e(TAG, " J is getTextViewNumber " + j + " getTextViewNumber " + getTextViewNumber());

				longSubTitlesTextView[j] = new TextView(getApplicationContext());
				longSubTitlesTextView[j].setText(mSubtitlsmemo[j]);
				longSubTitlesTextView[j].setHeight(getTextviewHeight());
				longSubTitlesTextView[j].setTextColor(fontcolor);
//                longSubTitlesTextView[j].setLineSpacing(0,1.7f);

				if(fontSize.equals("small")){
					longSubTitlesTextView[j].setTextSize(13);
				}else if (fontSize.equals("normal")){
					longSubTitlesTextView[j].setTextSize(15);
				}else if (fontSize.equals("big")) {
					longSubTitlesTextView[j].setTextSize(17);
					longSubTitlesTextView[j].setHeight(getTextviewHeightNew());
				}

				longSubTitlesTextTimeView[j] = new TextView(getApplicationContext());
				longSubTitlesTextTimeView[j].setText(Utils.timeToString(mSubtitlstime[j]));
				longSubTitlesTextTimeView[j].setHeight(getTextviewHeight());
				longSubTitlesTextTimeView[j].setTextColor(fontcolor);
//                longSubTitlesTextTimeView[j].setLineSpacing(0,1.7f);

				if(fontSize.equals("small")){
					longSubTitlesTextTimeView[j].setTextSize(13);
				}else if (fontSize.equals("normal")){
					longSubTitlesTextTimeView[j].setTextSize(15);
				}else if (fontSize.equals("big")) {
					longSubTitlesTextTimeView[j].setTextSize(17);
					longSubTitlesTextTimeView[j].setHeight(getTextviewHeightNew());
				}

				final TextView highlightView = longSubTitlesTextView[j];
				final TextView highlightTimeView = longSubTitlesTextTimeView[j];
//
//
//
//                Log.e(TAG , "textViewSumHightValue " + textViewSumHeight);
//
//                highlightView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
//                    @Override
//                    public void onGlobalLayout() {
//                        // pixel set //
//                        highlightView.setHeight( Utils.dpToPx(mAppcontext , (Utils.pxToDp( mAppcontext , highlightView.getHeight()+ Utils.dpToPx( mAppcontext , 20 ))) ) ) ;
//                        highlightTimeView.setHeight( Utils.dpToPx(mAppcontext , (Utils.pxToDp( mAppcontext , highlightView.getHeight()+ Utils.dpToPx( mAppcontext , 20 ))) ) ) ;
//
//                        highlightView.getViewTreeObserver().removeOnGlobalLayoutListener(this);
//                    }
//                });

				textFullView.addView(highlightView);
				textFullTimeView.addView(highlightTimeView);

				int position = 0;

				position =     getTextviewHeight() * getTextViewNumber();

//                Log.e(TAG, "position is  :: " + position + " position ");

				if(fontSize.equals("small")){

				}else if (fontSize.equals("normal")){

				}else if (fontSize.equals("big")) {
					position =     getTextviewHeightNew() * getTextViewNumber();
				}

				longView.setScrollY( position );
				longScrollTime.setScrollY( position );

			}else {

				longSubTitlesTextView[j] = new TextView(getApplicationContext());
				longSubTitlesTextView[j].setText(mSubtitlsmemo[j]);
				longSubTitlesTextView[j].setHeight(getTextviewHeight());
				longSubTitlesTextView[j].setTextColor(fontcolorWhite);
//                longSubTitlesTextView[j].setLineSpacing(0,1.7f);

				if(fontSize.equals("small")){
					longSubTitlesTextView[j].setTextSize(13);
				}else if (fontSize.equals("normal")){
					longSubTitlesTextView[j].setTextSize(15);
				}else if (fontSize.equals("big")) {
					longSubTitlesTextView[j].setTextSize(17);
					longSubTitlesTextView[j].setHeight(getTextviewHeightNew());
				}

				longSubTitlesTextTimeView[j] = new TextView(getApplicationContext());
				longSubTitlesTextTimeView[j].setText(Utils.timeToString(mSubtitlstime[j]));
				longSubTitlesTextTimeView[j].setHeight(getTextviewHeight());
				longSubTitlesTextTimeView[j].setTextColor(fontcolorWhite);
//                longSubTitlesTextTimeView[j].setLineSpacing(0,1.7f);


				if(fontSize.equals("small")){
					longSubTitlesTextTimeView[j].setTextSize(13);
				}else if (fontSize.equals("normal")){
					longSubTitlesTextTimeView[j].setTextSize(15);
				}else if (fontSize.equals("big")) {
					longSubTitlesTextTimeView[j].setTextSize(17);
					longSubTitlesTextTimeView[j].setHeight(getTextviewHeightNew());
				}

				final TextView highlightView = longSubTitlesTextView[j];
				final TextView highlightTimeView = longSubTitlesTextTimeView[j];
				// TextView getHeight
//                highlightView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
//                    @Override
//                    public void onGlobalLayout() {
//
//                        // pixel set //
//                        highlightView.setHeight( Utils.dpToPx(mAppcontext , (Utils.pxToDp( mAppcontext , highlightView.getHeight()+ Utils.dpToPx( mAppcontext , 20 ))) ) ) ;
//                        highlightTimeView.setHeight( Utils.dpToPx(mAppcontext , (Utils.pxToDp( mAppcontext , highlightView.getHeight()+ Utils.dpToPx( mAppcontext , 20 ))) ) ) ;
//
//
//                        Log.e(TAG , "highlightView " + highlightView.getText() + " :: " +highlightView.getHeight() );
//
//                        highlightView.getViewTreeObserver().removeOnGlobalLayoutListener(this);
//                    }
//                });

				textFullView.addView(highlightView);
				textFullTimeView.addView(highlightTimeView);

			}
		}

		mfullSmiLayout.setOnClickListener(new View.OnClickListener(){

			@Override
			public void onClick(View view) {

			}
		});

		longScroll_font.setOnClickListener(new View.OnClickListener(){

			@Override
			public void onClick(View view) {

			}
		});

		textFullView.setOnClickListener(new View.OnClickListener(){
			@Override
			public void onClick(View v){

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
						setBlankSpaceParams(msubtitls_view.getWidth(),0);

						RelativeLayout control_wrap_bg = findViewById(R.id.CONTROL_WRAP_BG);
						RelativeLayout general_button_group = findViewById(R.id.GENERAL_BUTTON_GROUP);
						RelativeLayout myrepu_button_group = findViewById(R.id.MYREPU_BUTTON_GROUP);
						RelativeLayout play_button_group = findViewById(R.id.PLAY_BUTTON_GROUP);
						RelativeLayout smart_button_wrap = findViewById(R.id.SMART_BUTTON_WRAP);
						RelativeLayout welean_blank_line2 = findViewById(R.id.welean_blank_line2);
						RelativeLayout welean_blank_line = findViewById(R.id.welean_blank_line);
						RelativeLayout welean_wrap_bg = findViewById(R.id.welean_wrap_bg);
						RelativeLayout play_network_type_text = findViewById(R.id.wrap_welean_play_network_type);

						play_button_group.setVisibility(View.VISIBLE);
						general_button_group.setVisibility(View.VISIBLE);
						myrepu_button_group.setVisibility(View.VISIBLE);
//                        control_wrap_bg.setVisibility(VISIBLE);
						smart_button_wrap.setVisibility(View.VISIBLE);
						welean_blank_line2.setVisibility(View.VISIBLE);
						welean_blank_line.setVisibility(View.VISIBLE);
						welean_wrap_bg.setVisibility(View.VISIBLE);

						// setVisibility 확인이 필요함 //
						// Full Size Mode Check //

						play_network_type_text.setVisibility(View.VISIBLE);

						Logger.i(TAG + "msubtitls_view.getWidth() " + msubtitls_view.getWidth() );
						Logger.i(TAG + "msubtitls_view_long.getWidth() " + msubtitls_view_long.getWidth() );
						Logger.i(TAG + "msubtitls_view_long.setVisibility() " + msubtitls_view_long.getVisibility() );
						Logger.i(TAG + "msubtitls_view.setVisibility() " + msubtitls_view.getVisibility() );

//                        if(msubtitls_view.getVisibility() == View.VISIBLE){
//                            play_button_group.setVisibility(INVISIBLE);
//                            general_button_group.setVisibility(INVISIBLE);
////                        control_wrap_bg.setVisibility(VISIBLE);
//                            smart_button_wrap.setVisibility(INVISIBLE);
//                            welean_blank_line2.setVisibility(INVISIBLE);
//                            welean_blank_line.setVisibility(INVISIBLE);
//                            welean_wrap_bg.setVisibility(INVISIBLE);
//                        }
					}
					@Override
					public void onAnimationRepeat(Animation animation) {

					}
				});
				Log.d("TAG", "OnClick : click");
			}
		});
	}

	private void initControls()
	{
		try
		{
			volumeSeekbar = findViewById(R.id.VOLUME_SEEK_BAR);
			audioManager = (AudioManager) getApplicationContext().getSystemService(Context.AUDIO_SERVICE);
			volumeSeekbar.setMax(audioManager
					.getStreamMaxVolume(AudioManager.STREAM_MUSIC));
			volumeSeekbar.setProgress(audioManager
					.getStreamVolume(AudioManager.STREAM_MUSIC));

			final int nMax = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
			final int progress = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);

			int progressInt = Math.round(100/nMax)*progress;

			if(progressInt>89){
				progressInt = 100;
			}

			mTextViewVolumeText.setText(progressInt + "%");

			volumeSeekbar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener()
			{
				@Override
				public void onStopTrackingTouch(SeekBar arg0)
				{
				}

				@Override
				public void onStartTrackingTouch(SeekBar arg0)
				{
				}

				@Override
				public void onProgressChanged(SeekBar arg0, int progress, boolean arg2)
				{
					audioManager.setStreamVolume(AudioManager.STREAM_MUSIC,
							progress, 0);

					int progressInt = Math.round(100/nMax)*progress;

					Logger.e(TAG + "onProgressChanged is " + progressInt + " nMax is " + nMax
							+ " :: Progress is " + progress );

					if(progressInt>89){
						progressInt = 100;
					}

					mTextViewVolumeText.setText(progressInt + "%");

					// Activity , setVolumeControlStream 를 활용해봅시다 2017.08.23
					// 여기서 스크롤바가 핸들링 되는거 같았는데 아닌가요 ???
					// 1회차 , 2회차 , 3회차 ( ) , 4회차 , 5회차 상자 구입

				}
			});
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	/****************************************************************************
	 * 2017.11.13 별점 평가 UI 버튼 셋팅 합니다 지식영상만
	 * 2017.11.21 별점 php 수신 이후 화면 랜더링 하기
	 ****************************************************************************/
	public void setMyrepuSetUI(){

		final Handler setMyrepuSetUIHandler = new Handler()
		{
			public void handleMessage(android.os.Message msg)

			{
				try{
//					if(mWelaaaPlayer.CON_CLASS.equals("1")){
						mMyRepuBoxLinear.setVisibility(View.VISIBLE);

						// 개발 예외 코드 인데요 .. 이렇게 값이 나올수가 없는데 ..
						if(mUserStar==null){
							if(!Preferences.getWelaaaMyReputation(getApplicationContext()).equals("0")){
								mUserStar = Preferences.getWelaaaMyReputation(getApplicationContext());
							}else{
								mUserStar = "";
							}
						}

						if(mUserStar.equals("")){
							// 등록된 별점 정보가 없는 경우
							TextView myrepu_text = findViewById(R.id.myrepu_text);
							myrepu_text.setVisibility(View.GONE);

							LinearLayout myrepu_linear = findViewById(R.id.myrepu_linear);
							myrepu_linear.setVisibility(View.GONE);

							LinearLayout myrepu_linear_update = findViewById(R.id.myrepu_linear_update);
							myrepu_linear_update.setVisibility(View.VISIBLE);
						}else{

							TextView myrepu_text = findViewById(R.id.myrepu_text);
							myrepu_text.setVisibility(View.VISIBLE);

							LinearLayout myrepu_linear = findViewById(R.id.myrepu_linear);
							myrepu_linear.setVisibility(View.VISIBLE);

							LinearLayout myrepu_linear_update = findViewById(R.id.myrepu_linear_update);
							myrepu_linear_update.setVisibility(View.GONE);

							TextView myrepu_star_text = findViewById(R.id.myrepu_star);
							myrepu_star_text.setText(Preferences.getWelaaaMyReputation(getApplicationContext()) + ".0");
						}
//					}else{
//						mMyRepuBoxLinear.setVisibility(View.GONE);
//					}
				}catch (Exception e){
					e.printStackTrace();
				}
			}

		};

		setMyrepuSetUIHandler.sendEmptyMessageDelayed(0,500);

		return;
	}

	/****************************************************************************
	 * 2017.11.13 연관콘텐츠 뷰 셋팅 지식영상만
	 ****************************************************************************/
	public void setRelatedUI(){

		final Handler setRelatedUIHandler = new Handler()
		{
			public void handleMessage(android.os.Message msg)

			{
				try{
//					if(mWelaaaPlayer.CON_CLASS.equals("1")) {
//						// 신규 서블릿 주소가 등록될 예정입니다
//						String weburl = "";
//
//						try{
//
//							String ckey = "";
//							if(Preferences.getWelaaaPlayListUsed(mAppcontext)){
//								ckey = mWelaaaPlayer.getNewWebPlayerInfo().getCkey()[getContentId()];
//							}else{
//								ckey = mWelaaaPlayer.getwebPlayerInfo().getCkey()[getContentId()];
//							}
//
//							String F_Token = Preferences.getWelaaaLoginToken(mAppcontext);
//
//							weburl = WELEARN_WEB_URL + "/usingapp/playlist_suggest.php?ckey="+ ckey	 + "&f_token=" + F_Token;
//
//							PlaylistSuggestListasyncTask playlistSuggestListasyncTask = new PlaylistSuggestListasyncTask();
//
//							if(Build.VERSION.SDK_INT >= 11){
//								playlistSuggestListasyncTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, weburl );
//							}else{
//								playlistSuggestListasyncTask.execute(weburl);
//							}
//
//						}catch (Exception e ){
//							e.printStackTrace();
//
//							// getContentId 이슈로 인해서 발생하는 경우가 확인 됩니다
//							// http://crashes.to/s/d9fb8aa7b19
//						}
//					}
				}catch ( Exception e ){
					e.printStackTrace();
				}
			}

		};

//		setRelatedUIHandler.sendEmptyMessageDelayed(0,500);

		return;
	}

	// 페이지 연속 눌림 방지용
	public static long m_lPageClickTime = 0;

	// 연속 눌림 방지 : 지정 시간 이내 클릭 여부, 싱크 작업 여부
	public boolean getCanGotoPage()
	{
		if ((System.currentTimeMillis() - m_lPageClickTime) > 1500)
		{
			Logger.i(TAG + " onClick: getCanGotoPage true");
			m_lPageClickTime = System.currentTimeMillis();
			return true;
		}
		else
		{
			Logger.i(TAG + " onClick: getCanGotoPage false");
			return false;
		}
	}

	public CustomDialog mCustomDialog;
	public void alertDownloadWindow(String title, String massage, String str2, String str1 , final int alertWindowId){

		Logger.e(TAG + " BTN_DOWNLOAD alertDownloadWindow");

		// 1 download
		// 2 download Pause , Stop ? Cancel ?

		View.OnClickListener leftListner= new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				mCustomDialog.dismiss();
			}
		};

		View.OnClickListener rightListner= new View.OnClickListener() {
			@Override
			public void onClick(View v) {

				switch(alertWindowId) {

					case 1:
						// 권한 정보를 확인하고 다운로드를 실행합니다.
						// 권한 정보 /usingapp/contents_each_author.php
//						mWelaaaPlayer.goDownloadCheckViewLimitdate();
						// 다운로드 startService 로 처리가 되는 구간
						mCustomDialog.dismiss();
						break;
					case 2:
						mCustomDialog.dismiss();
						mBtnDownload.setBackgroundDrawable(getResources().getDrawable(R.drawable.icon_download));
						mBtnDownload.setOnClickListener(click_control);


						break;
				}


			}
		};

		mCustomDialog = new CustomDialog(PlayerActivity.this , title,massage,str1,str2,leftListner,rightListner);
		mCustomDialog.show();
	}

	// 별점 주기
	// 커스텀 팝업
	public CustomDialog mMyReCustomDialog;
	public void alertMyRepuWindow(String title, String meassge, final int alertWindowId , final int type , final int remainTime){

		// 1 download
		// 2 download Pause , Stop ? Cancel ?

		if(mMyReCustomDialog!=null){
			mMyReCustomDialog.dismiss();
		}

		try{

			View.OnClickListener nextListner= new View.OnClickListener() {
				@Override
				public void onClick(View v) {

					mMyReCustomDialog.dismiss();

					if(mMyReCustomDialog!=null){

						mMyReCustomDialog.dismiss();

						if (!getCanGotoPage()) return;	//연속 눌림 방지

//						플레이 리스트 점프

//						mWelaaaPlayer.setLastTime(mWelaaaPlayer.getCurrentPosition() );
//
//						setPlayTimeSync(false);
//
//						mWelaaaPlayer.doRightPlay();

					}

				}
			};

			View.OnClickListener leftListner= new View.OnClickListener() {
				@Override
				public void onClick(View v) {

					// 별점 보기 뷰 닫기 //

					mMyReCustomDialog.dismiss();

					if(mMyReCustomDialog!=null){

						mMyReCustomDialog.dismiss();

						setBackGroungLayout(true);

						Animation fadeout = null;

						fadeout = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_in_right);

						mRelatedListGroupLayout.startAnimation(fadeout);

						Animation textBlink = null;
						textBlink = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.blink_animation);

						mRelatedListBlinkText.startAnimation(textBlink);

						mRelatedListGroupLayout.setVisibility(View.VISIBLE);
					}

				}
			};

			View.OnClickListener rightListner= new View.OnClickListener() {
				@Override
				public void onClick(View v) {

					TextView myrepu_star_text = null;
					ImageView next_progress_rectangle = null;

					switch(alertWindowId) {

						case 1:
							myrepu_star_text = findViewById(R.id.myrepu_star);
							String ckey = "";
							String weburl = "";
							TextView myrepu_text = findViewById(R.id.myrepu_text);
							LinearLayout myrepu_linear = findViewById(R.id.myrepu_linear);
							LinearLayout myrepu_linear_update = findViewById(R.id.myrepu_linear_update);

							UserStarAsyncTask userStarAsyncTask = new UserStarAsyncTask();

							try{
								if(!Preferences.getWelaaaMyReputation(getApplicationContext()).equals("0")){
									myrepu_star_text.setText(Preferences.getWelaaaMyReputation(getApplicationContext()) + ".0");
								}

								if(Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
//									ckey = mWelaaaPlayer.getNewWebPlayerInfo().getCkey()[getContentId()];
								}else {
//									ckey = mWelaaaPlayer.getwebPlayerInfo().getCkey()[getContentId()];
								}

								weburl = WELEARN_WEB_URL + "/usingapp/update_star.php?star="
										+ Preferences.getWelaaaMyReputation(getApplicationContext()) + "&ckey=" + ckey;

								if(!Preferences.getWelaaaMyReputation(getApplicationContext()).equals("")){

									if(Build.VERSION.SDK_INT >= 11){
										userStarAsyncTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, weburl );
									}
									else{
										userStarAsyncTask.execute(weburl);
									}

									myrepu_text.setVisibility(View.VISIBLE);
									myrepu_linear.setVisibility(View.VISIBLE);
									myrepu_linear_update.setVisibility(View.GONE);
								}
							}catch (Exception e){
								e.printStackTrace();
							}

							mMyReCustomDialog.dismiss();
							break;

						case 2:
							myrepu_star_text = findViewById(R.id.myrepu_star);

							if(!Preferences.getWelaaaMyReputation(getApplicationContext()).equals("0")){
								myrepu_star_text.setText(Preferences.getWelaaaMyReputation(getApplicationContext()) + ".0");
							}

							if(Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
//								ckey = mWelaaaPlayer.getNewWebPlayerInfo().getCkey()[getContentId()];
							}else {
//								ckey = mWelaaaPlayer.getwebPlayerInfo().getCkey()[getContentId()];
							}

								ckey = "";

							weburl = WELEARN_WEB_URL + "/usingapp/update_star.php?star="
									+ Preferences.getWelaaaMyReputation(getApplicationContext()) + "&ckey=" + ckey;

							Logger.e(TAG + " 20170902 case 2 : " + weburl);
							myrepu_text = findViewById(R.id.myrepu_text);
							myrepu_linear = findViewById(R.id.myrepu_linear);
							myrepu_linear_update = findViewById(R.id.myrepu_linear_update);

							if(!Preferences.getWelaaaMyReputation(getApplicationContext()).equals("")){

								userStarAsyncTask = new UserStarAsyncTask();
								if(Build.VERSION.SDK_INT >= 11){
									userStarAsyncTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, weburl );
								}
								else{
									userStarAsyncTask.execute(weburl);
								}

								myrepu_text.setVisibility(View.VISIBLE);

								myrepu_linear = findViewById(R.id.myrepu_linear);
								myrepu_linear.setVisibility(View.VISIBLE);

								myrepu_linear_update = findViewById(R.id.myrepu_linear_update);
								myrepu_linear_update.setVisibility(View.GONE);
							}

							mMyReCustomDialog.dismiss();

							if(mMyReCustomDialog!=null){

								mMyReCustomDialog.dismiss();
								setBackGroungLayout(true);

								Animation fadeout = null;

								fadeout = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.slide_in_right);

								mRelatedListGroupLayout.startAnimation(fadeout);

								Animation textBlink = null;
								textBlink = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.blink_animation);

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

			try{
//				thumNailUrl = mWelaaaPlayer.getNewWebPlayerInfo().getClist_img()[getContentId()+1];

				if(!thumNailUrl.contains("http://")){
					thumNailUrl = "http://" + thumNailUrl;
				}

			}catch (Exception contentIdException){
				contentIdException.printStackTrace();

			}

			mMyReCustomDialog = new CustomDialog(PlayerActivity.this , meassge,  title , rightListner , type , ckey , thumNailUrl , remainTime);
			mMyReCustomDialog.show();
		}catch (Exception e){
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

			if(result!=null){
				try {
					JSONObject jsonResult = new JSONObject(result);

					String code = jsonResult.getString("code");
					String msg = jsonResult.getString("msg");

				}catch (Exception e) {
					// TODO: handle exception
					e.printStackTrace();
				}
			}
		}
	}

	/*******************************************************************
	 * 오디오모드 or 오디오북일 경우 보여지는 백그라운드 이미지
	 *******************************************************************/
	public void setAudioModeImageUI(){

		try{
			audioModeBackgroundLayout = findViewById(R.id.welean_audio_mode_bg);
			ImageView audioModeBackgroundImg = findViewById(R.id.audio_mode_backgroundimg);
			String url = "";

			if(Utils.isAirModeOn(getApplicationContext())){


			}else{
				if(Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
					// 동영상 강의 별로 이미지가 있습니다.
//					if(mWelaaaPlayer.getNewWebPlayerInfo().getGroup_img()[getContentId()].contains("://")){
//						url = mWelaaaPlayer.getNewWebPlayerInfo().getGroup_img()[getContentId()];
//					}else{
//						url = "http://"+mWelaaaPlayer.getNewWebPlayerInfo().getGroup_img()[getContentId()];
//
				}else {
				    // 오디오북 은 클립립별 이미지가 없고
//					if(mWelaaaPlayer.getNewWebPlayerInfo().getGroup_img()[getContentId()].contains("://")){
//						url = mWelaaaPlayer.getwebPlayerInfo().getGroupImg();
//					}else{
//						url = "http://"+mWelaaaPlayer.getwebPlayerInfo().getGroupImg();
//					}
				}
			}

			url = "http://welaaa.co.kr/contentsUpImage/20170731000721_2.png";

			Glide
					.with(getApplicationContext())
					.load(url)
					.centerCrop()
					.placeholder(null)
					.crossFade()
					.into(audioModeBackgroundImg);

			// audioBook mode , video/audio mode
			if(CON_CLASS.equals("1")) {
				audioModeIconHeadset = findViewById(R.id.wrap_welean_icon_headphone);
			}else if(CON_CLASS.equals("2")){
				audioModeIconHeadset = findViewById(R.id.wrap_welean_icon_headphone_audiobook);
			}

			// 지식영상 오디오모드 의 경우 ?
			if(CON_CLASS.equals("1")) {
				if(Preferences.getWelaaaPlayAudioUsed(getApplicationContext())){

				}
			}else{
				// 오디오북 의 경우 아래 옵션으로 백그라운드 갱신되지 않는걸까 ????
				// 매번 갱신되지 않도록 ? 깜박 거림 방지 ??

				if(audioModeBackgroundLayout!=null){
					audioModeBackgroundLayout.setVisibility(View.INVISIBLE);
				}

				if(audioModeIconHeadset!=null){
					audioModeIconHeadset.setVisibility(View.INVISIBLE);
				}
			}
		}catch (Exception e ){
			e.printStackTrace();

			Logger.e(TAG + " 20170904 setAudioModeImageUI Exception " + e.toString());
		}
	}

	/*******************************************************************
	 * 다운로드 모드 , 네트워크 판단 , 출력
	 *******************************************************************/
	public void setDownloadHandlering(){

		// 2017.08.31 지식영상 재생이 완료 된 상태 ,
		// 백그라운드로 내려가고 , 포그라운드로 다시 올라올때
		// ArrayIndexOutOdBoundException 발생 됨
		// http://crashes.to/s/63b70e2087d
		try{
			ConnectivityManager cmgr = (ConnectivityManager)getApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo netInfo = cmgr.getActiveNetworkInfo();

			TextView play_network_type_text = findViewById(R.id.wrap_welean_play_network_type_text);

			String nTitle = "";
			String ckey = "";

			if(Utils.isAirModeOn(getApplicationContext())){
				nTitle = "다운로드 파일로 재생";
			}else{
				if(Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
//					ckey = mWelaaaPlayer.getNewWebPlayerInfo().getCkey()[getContentId()];
				}else {
//					ckey = mWelaaaPlayer.getwebPlayerInfo().getCkey()[getContentId()];
				}

				// 다운로드 프로세스 관련 확인 .
//				if(mWelaaaPlayer.ContentManager().existCid(ckey)){
//					nTitle = "다운로드 파일로 재생";
//					mBtnDownload.setBackgroundDrawable(getResources().getDrawable(R.drawable.icon_download_done));
//				}else{

					mBtnDownload.setBackgroundDrawable(getResources().getDrawable(R.drawable.icon_download));

					try{
						if(netInfo.isConnected() && netInfo.getTypeName().equals("WIFI")){
							nTitle = "Wi-Fi 재생";
						}else if(netInfo.isConnected() && netInfo.getTypeName().equals("MOBILE")){
							nTitle = "LTE/3G 재생";
						}
					}catch (Exception e){
						e.printStackTrace();
					}
//				}
			}

			play_network_type_text.setText(nTitle);
		}catch (Exception e){
			e.printStackTrace();
		}
	}

	public WebPlayerInfo getwebPlayerInfo(){
		return mWebPlayerInfo;
	}
	public NewWebPlayerInfo getNewWebPlayerInfo() { return mNewWebPlayerInfo; }

	public void setLectureItem() {

		if(lectureAudioBookListItemdapter!=null)lectureAudioBookListItemdapter=null;
		lectureAudioBookListItemdapter = new AudioBookPlayerListAdapter(getApplicationContext(),this);

		try{
			if(CON_CLASS!=null){
				// AudioBook 은 현재 상태 유지 합니다
				if (CON_CLASS.equals("2")){
					ListView lecturListView = findViewById(R.id.weleanplaylistview);

					String[] a = null;
					String[] b = null;
					String[] c = null;
					String[] d = null;
					String[] e = null;
					String[] f = null;
					String[] g = null;
					String[] audioPreview = null;
					String audioBookBuy = null;
					String audioBookBuy_limitdate = null;

					if(Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
						a = getNewWebPlayerInfo().getCplay_time();
						b = getNewWebPlayerInfo().getCname();
						c = getNewWebPlayerInfo().getCurl();
					}else {
						a = getwebPlayerInfo().getCplayTime();
						b = getwebPlayerInfo().getCname();
						c = getwebPlayerInfo().getCurl();

						d = getwebPlayerInfo().getA_depth();
						e = getwebPlayerInfo().getHistory_endtime();
						f = getwebPlayerInfo().getFirst_play();
						g = getwebPlayerInfo().getCkey();
						audioPreview = getwebPlayerInfo().getAudio_preview();
						audioBookBuy = getwebPlayerInfo().getAudiobookbuy();
						audioBookBuy_limitdate = getwebPlayerInfo().getAudiobookbuy();
					}

					for (int i = 0; i < a.length; i++) {

						try{
							a[i] = a[i].substring(3,8);
						}catch (Exception ex){
							ex.printStackTrace();
						}

						if(d[i].equals("1")){
							// 1depth index

							if(c[i].contains(".mp4")){
								if(audioBookBuy.equals("Y")){
									if(e[i].equals("9999999")){
										// 재생 완료 상태
										lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "7");
									}else  if(e[i].equals("")){
										// 재생 이력 없음
										lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "2");
									}else{
										// 재생 중
										lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "8");
									}
								}else{
									if(audioPreview[i].equals("Y")){
										if(e[i].equals("9999999")){
											// 재생 완료 상태
//                                    lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "7");
											lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "31");
										}else  if(e[i].equals("")){
											// 재생 이력 없음
//                                    lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "2");
											lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "32");
										}else{
											// 재생 중
//                                    lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "8");
											lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "33");
										}
									}else{
										lectureAudioBookListItemdapter.add("", "", b[i], "", "" , "" , "1");
									}
								}
							}else{
								lectureAudioBookListItemdapter.add("", "", b[i], "", "" , "" , "1");
							}

						}else if(d[i].equals("2")){
							// 2depth index
							if(c[i].contains(".mp4") ){

								if(audioBookBuy.equals("Y")){

									if(Preferences.getWelaaaPlayerOnClickPos(getApplicationContext())>0){
										if(i == Preferences.getWelaaaPlayerOnClickPos(getApplicationContext())){
											// Title 강조
											if(e[i].equals("9999999")){
												// 재생 완료 상태
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "13");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "14");
											}else{
												// 재생 중
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "15");
											}
										}else{
											if(e[i].equals("9999999")){
												// 재생 완료 상태
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "9");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "4");
											}else{
												// 재생 중
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "10");
											}
										}
									}else{
										if(g[i].equals( getwebPlayerInfo().getCkey()[getContentId()]) ){
											// Title 강조
											if(e[i].equals("9999999")){
												// 재생 완료 상태
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "13");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "14");
											}else{
												// 재생 중
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "15");
											}
										}else{
											if(e[i].equals("9999999")){
												// 재생 완료 상태
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "9");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "4");
											}else{
												// 재생 중
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "10");
											}
										}
									}

								}else{
									if(audioPreview[i].equals("Y")){

										if(g[i].equals( getwebPlayerInfo().getCkey()[getContentId()] )){
											// Title 강조
											if(e[i].equals("9999999")){
												// 재생 완료 상태
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "13");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "24");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "14");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "23");
											}else{
												// 재생 중
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "15");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "22");
											}
										}else{
											if(e[i].equals("9999999")){
												// 재생 완료 상태
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "9");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "21");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "4");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "20");
											}else{
												// 재생 중
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "10");
												//
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "19");
											}
										}
									}else{
										lectureAudioBookListItemdapter.add("", "", b[i], "", "" , "" , "3");
									}
								}
							}else{
								lectureAudioBookListItemdapter.add("", "", b[i], "", "" , "" , "3");
							}

						}else if(d[i].equals("3") || d[i].equals("4") || d[i].equals("5") ){
							// 3depth index

							if(c[i].contains(".mp4") ){

								if(audioBookBuy.equals("Y")){

									if(Preferences.getWelaaaPlayerOnClickPos(getApplicationContext())>0){
										if(i == Preferences.getWelaaaPlayerOnClickPos(getApplicationContext())){
											if(e[i].equals("9999999")){
												// 재생 완료 상태
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "16");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "17");
											}else{
												// 재생 중
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "18");
											}

										}else{
											if(e[i].equals("9999999")){
												// 재생 완료 상태
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "11");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "6");
											}else{
												// 재생 중
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "12");
											}
										}
									}else{
										//

										if(g[i].equals( getwebPlayerInfo().getCkey()[getContentId()])){
											// Title 강조
											if(e[i].equals("9999999")){
												// 재생 완료 상태
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "16");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "17");
											}else{
												// 재생 중
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "18");
											}
										}else{
											if(e[i].equals("9999999")){
												// 재생 완료 상태
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "11");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "6");
											}else{
												// 재생 중
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "12");
											}
										}

									}

								}else {

									if(audioPreview[i].equals("Y")){
										if(g[i].equals( getwebPlayerInfo().getCkey()[getContentId()] )){
											// Title 강조
											if(e[i].equals("9999999")){
												// 재생 완료 상태
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "16");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "25");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "17");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "26");
											}else{
												// 재생 중
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "18");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "27");
											}
										}else{
											if(e[i].equals("9999999")){
												// 재생 완료 상태
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "11");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "28");
											}else  if(e[i].equals("")){
												// 재생 이력 없음
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "6");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "29");
											}else{
												// 재생 중
//                                        lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "12");
												lectureAudioBookListItemdapter.add(a[i], c[i], b[i], "", "" , "" , "30");
											}
										}
									}else{
										lectureAudioBookListItemdapter.add("", "", b[i], "", "" , "" , "5");
									}
								}
							}else{
								lectureAudioBookListItemdapter.add("", "", b[i], "", "" , "" , "5");
							}
						}
					}

					lecturListView.setAdapter(lectureAudioBookListItemdapter);

					int position = 0 ;

					if(Preferences.getWelaaaPlayerOnClickPos(getApplicationContext())>0){
						position = Preferences.getWelaaaPlayerOnClickPos(getApplicationContext()) ;

						lecturListView.setSelection(position);
					}else{
						position = Integer.parseInt(getwebPlayerInfo().getCalign()[getContentId()]);

						lecturListView.setSelection(position-1);
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
							//
							// i : 현재 포지션
							// i1 : 뷰상에서 보여지는 포지션 전체 값
							// i2 : listView 전체 값

							audioItemProgressBar = findViewById(R.id.audioItemProgressBar);
							audioItemProgressBar.setVisibility(View.VISIBLE);

							if(i==0){
								audioItemProgressBar.setProgress( 1 );
							}

							if(i>0 && i<30){
//                                mlistViewProgress.sendEmptyMessageDelayed(0,200);

								audioItemProgressBar.setProgress( ((i)*100/i2)  );

							}

							if(i>30){
//                                mlistViewProgress.sendEmptyMessageDelayed(0,200);

								audioItemProgressBar.setProgress( ((i+i1)*100/i2)  );

							}

						}
					});
//            강좌타이틀
					TextView list_grop_title = findViewById(R.id.list_group_title);
					String gTitle = "";

					if(Preferences.getWelaaaPlayListUsed(getApplicationContext())) {

						gTitle = getNewWebPlayerInfo().getGroup_title()[getContentId()].replaceAll("<br>", "");

					}else {
						gTitle = getwebPlayerInfo().getGroupTitle().replaceAll("<br>", "");
					}

					list_grop_title.setText(gTitle);

				}

				boolean previewPlaymode =Preferences.getWelaaaPreviewPlay(getApplicationContext());

				// 초기화 ??
				Logger.i(TAG + "20160901 previewPlaymode :" + previewPlaymode );
				// 여기로 들어오면 안되는데요 ..
				// 로그인 상태라면 ?
				// 또는 viewContents?ckey=189 로 호출될 때 ..
				// 또는 previewPlaymode 는 동영상 지식영상 컨텐츠의 경우만

				if(previewPlaymode && CON_CLASS.equals("1")) {

					if (lectureListItemdapter != null) lectureListItemdapter = null;
					lectureListItemdapter = new PlayerListAdapter(getApplicationContext(), this);

					ListView lecturListView = findViewById(R.id.weleanplaylistview);

					String[] a = null;
					String[] b = null;
					String[] c = null;
					String[] d = null;
					String[] e = null;
					String[] f = null;

					try {
						if (Preferences.getWelaaaPlayListUsed(getApplicationContext())) {
							a = getNewWebPlayerInfo().getCplay_time();
							b = getNewWebPlayerInfo().getCname();
							c = getNewWebPlayerInfo().getCurl();
							d = getNewWebPlayerInfo().getGroup_title();
							e = getNewWebPlayerInfo().getGroup_teachername();
							f = getNewWebPlayerInfo().getEnd_time();
						}

						for (int i = 0; i < a.length; i++) {

							a[i] = a[i].substring(3, 8);

							lectureListItemdapter.add(a[i], c[i], b[i], d[i], e[i], f[i], "1");

						}

						lecturListView.setAdapter(lectureListItemdapter);

						lecturListView.setSelection(0);

					} catch (Exception ex) {
						ex.printStackTrace();
					}
				}
			}
		}catch (Exception e){
			e.printStackTrace();
		}
	}

	private static String readAll(Reader rd) throws IOException {
		StringBuilder sb = new StringBuilder();
		int cp;
		while ((cp = rd.read()) != -1) {
			sb.append((char) cp);
		}
		return sb.toString();
	}

	public void updateContentList() {

		StringBuffer sb = new StringBuffer();

		try {
			InputStream is = getAssets().open("contentsinfo28.json");
			BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
			String jsonText = readAll(rd);
			JSONObject json = new JSONObject(jsonText);

			String group_title = json.getString("group_title");
			String group_memo = json.getString("group_memo");
			String group_teachername = json.getString("group_teachername");
			String group_teachermemo = json.getString("group_teachermemo");
			String group_img = json.getString("group_img");
			String group_previewcontent = json.getString("group_previewcontent");
			String allplay_time = json.getString("allplay_time");
			String contentscnt = json.getString("contentscnt");
			String hitcnt = json.getString("hitcnt");
			String likecnt = json.getString("likecnt");
			String zzimcnt = json.getString("zzimcnt");
			String staravg = json.getString("staravg");
			String con_class = json.getString("con_class");
			String downloadcnt = json.getString("downloadcnt");
			String audiobookbuy = json.getString("audiobookbuy");
			String audiobookbuy_limitdate = json.getString("audiobookbuy_limitdate");


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

			//contentsinfo의 값은 배열로 구성 되어있으므로 JSON 배열생성
			JSONArray jArr = json.getJSONArray("contentsinfo");

			//배열의 크기만큼 반복하면서, ksNo과 korName의 값을 추출함
			for (int i = 0; i < jArr.length(); i++) {

				json = jArr.getJSONObject(i);
				//값을 추출함
				String ckey = json.getString("ckey");
				String cname = json.getString("cname");
				String cmemo = json.getString("cmemo");
				String curl = json.getString("curl");
				String cplay_time = json.getString("cplay_time");
				String cpay = json.getString("cpay");
				String cpay_money = json.getString("cpay_money");
				String clist_img = json.getString("clist_img");
				String chitcnt = json.getString("chitcnt");
				String csmi = json.getString("csmi");

				String a_depth = json.getString("a_depth");
				String history_endtime = json.getString("history_endtime");

				String first_play = json.getString("first_play");
				String calign = json.getString("calign");
				String audio_preview = json.getString("audio_preview");

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
			}

			if(mWebPlayerInfo!=null) {
				mWebPlayerInfo=null;
			}

			mWebPlayerInfo = new WebPlayerInfo(sb.toString());
			// 화면 그리기 ..
			callbackWebPlayerInfo("player_list_icon" , "");

		} catch (JSONException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void callbackWebPlayerInfo(String methodName , String params){
		try{
			//
			if(methodName.equals("player_list_icon")){

				ListView lecturListView = findViewById(R.id.weleanplaylistview);
				lecturListView.setOnScrollListener(new AbsListView.OnScrollListener() {
					@Override
					public void onScrollStateChanged(AbsListView absListView, int i) {}

					@Override
					public void onScroll(AbsListView absListView, int i, int i1, int i2) {

						audioItemProgressBar = findViewById(R.id.audioItemProgressBar);
						audioItemProgressBar.setProgressDrawable( Utils.getDrawable(getApplicationContext() , R.drawable.progress_horizontal_custom_movie_bar) );
						audioItemProgressBar.setVisibility(View.VISIBLE);

						if(i==0){
							audioItemProgressBar.setProgress( 1 );
						}

						if(i>0 && i<30){
							audioItemProgressBar.setProgress( ((i+i1)*100/i2)  );
						}

						if(i>30){
							audioItemProgressBar.setProgress( ((i+i1)*100/i2)  );
						}
					}
				});

				String currentPosition = "";
				String itemArrayTotalCnt = "";

				InputStream is = getAssets().open("contentsinfo28.json");
				BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
				String jsonText = readAll(rd);
				JSONObject json = new JSONObject(jsonText);

				JSONArray itemArray = json.getJSONArray("contentsinfo");

				int currentListKey = Integer.parseInt(Preferences.getWelaaaRecentPlayListUse(getApplicationContext()));

				if(currentListKey>0) {

				}else{
					String playListCount = Preferences.getWelaaaPlayListCount(getApplicationContext()) ;
					String[] currentPosition2 =  playListCount.split(":");
					currentListKey = itemArray.length() - Integer.parseInt(currentPosition2[0]);
				}

				currentPosition = String.valueOf( itemArray.length() - currentListKey );

				for (int i = 0; i < itemArray.length(); i++) {
					JSONObject objItem = itemArray.getJSONObject(i);

					lastViewListArray.add(i , objItem);

					String playListType = "";

					// 마이 윌라 // 최근 재생 리스트를 통해서 들어오는
					// 상태 값이 있어야 할 것 같습니다
					// Integer.parseInt(objItem.getString("listkey"))

					if(Integer.parseInt(currentPosition) ==  (itemArray.length() - Integer.parseInt(objItem.getString("listkey")))  ) {

						if(objItem.getString("end_time").equals("0") || objItem.getString("end_time").equals("")){
							playListType = "4";
						}else if(objItem.getString("end_time").equals("9999999")) {
							playListType = "5";
						}else{
							playListType = "6";
						}

					}else{

						if(objItem.getString("end_time").equals("0") || objItem.getString("end_time").equals("")){
							playListType = "1";
						}else if(objItem.getString("end_time").equals("9999999")) {
							playListType = "3";
						}else{
							playListType = "2";
						}
					}

					lectureListItemdapter.add(objItem.getString("cplay_time"),objItem.getString("curl"),objItem.getString("cname"),objItem.getString("grouptitle"),objItem.getString("teachername") ,  objItem.getString("end_time") , playListType ) ;


					lecturListView.setAdapter(lectureListItemdapter);
				}

				lecturListView.setSelection(Integer.parseInt(currentPosition));
				Preferences.setWelaaaRecentPlayListUse(getApplicationContext() , false , "0");

			}

		}catch (Exception e){
			e.printStackTrace();
		}
	}

	public int getContentId(){
		Logger.i(TAG + ":doAutoPlay getContentId " + Preferences.getWelaaaPlayListCId(getApplication()) );
		return Preferences.getWelaaaPlayListCId(getApplication());
	}
}
