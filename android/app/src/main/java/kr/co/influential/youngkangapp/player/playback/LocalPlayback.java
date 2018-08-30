package kr.co.influential.youngkangapp.player.playback;

import static com.google.android.exoplayer2.C.CONTENT_TYPE_SPEECH;
import static com.google.android.exoplayer2.C.USAGE_MEDIA;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.net.Uri;
import android.net.wifi.WifiManager;
import android.os.Handler;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.text.TextUtils;
import android.util.JsonReader;
import android.util.Pair;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.DefaultRenderersFactory;
import com.google.android.exoplayer2.ExoPlaybackException;
import com.google.android.exoplayer2.ExoPlayerFactory;
import com.google.android.exoplayer2.PlaybackParameters;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.Timeline;
import com.google.android.exoplayer2.audio.AudioAttributes;
import com.google.android.exoplayer2.drm.DrmSessionManager;
import com.google.android.exoplayer2.drm.FrameworkMediaCrypto;
import com.google.android.exoplayer2.mediacodec.MediaCodecRenderer;
import com.google.android.exoplayer2.mediacodec.MediaCodecUtil;
import com.google.android.exoplayer2.source.ExtractorMediaSource;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.TrackGroupArray;
import com.google.android.exoplayer2.source.dash.DashMediaSource;
import com.google.android.exoplayer2.source.dash.DefaultDashChunkSource;
import com.google.android.exoplayer2.source.hls.HlsMediaSource;
import com.google.android.exoplayer2.source.smoothstreaming.DefaultSsChunkSource;
import com.google.android.exoplayer2.source.smoothstreaming.SsMediaSource;
import com.google.android.exoplayer2.trackselection.AdaptiveTrackSelection;
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector;
import com.google.android.exoplayer2.trackselection.TrackSelection;
import com.google.android.exoplayer2.trackselection.TrackSelectionArray;
import com.google.android.exoplayer2.ui.PlayerView;
import com.google.android.exoplayer2.upstream.DataSource;
import com.google.android.exoplayer2.upstream.DefaultBandwidthMeter;
import com.google.android.exoplayer2.upstream.DefaultHttpDataSourceFactory;
import com.google.android.exoplayer2.util.ErrorMessageProvider;
import com.google.android.exoplayer2.util.Util;
import com.pallycon.widevinelibrary.PallyconDrmException;
import com.pallycon.widevinelibrary.PallyconEventListener;
import com.pallycon.widevinelibrary.PallyconWVMSDK;
import com.pallycon.widevinelibrary.PallyconWVMSDKFactory;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.util.UUID;
import kr.co.influential.youngkangapp.R;
import kr.co.influential.youngkangapp.player.service.MediaService;
import kr.co.influential.youngkangapp.player.utils.LogHelper;

/**
 * A class that implements local media playback using {@link com.google.android.exoplayer2.ExoPlayer}
 */
public final class LocalPlayback implements Playback {

  private static final String TAG = LogHelper.makeLogTag(LocalPlayback.class);

  // The volume we set the media player to when we lose audio focus, but are
  // allowed to reduce the volume instead of stopping playback.
  public static final float VOLUME_DUCK = 0.2f;
  // The volume we set the media player when we have audio focus.
  public static final float VOLUME_NORMAL = 1.0f;

  // we don't have audio focus, and can't duck (play at a low volume)
  private static final int AUDIO_NO_FOCUS_NO_DUCK = 0;
  // we don't have focus, but can duck (play at a low volume)
  private static final int AUDIO_NO_FOCUS_CAN_DUCK = 1;
  // we have full audio focus
  private static final int AUDIO_FOCUSED = 2;

  private final Context mContext;
  private final WifiManager.WifiLock mWifiLock;
  private boolean mPlayOnFocusGain;
  private Callback mCallback;
  private boolean mAudioNoisyReceiverRegistered;
  private MediaMetadataCompat currentMedia;

  private int mCurrentAudioFocusState = AUDIO_NO_FOCUS_NO_DUCK;
  private final AudioManager mAudioManager;
  private SimpleExoPlayer mExoPlayer;
  private DataSource.Factory mediaDataSourceFactory;
  private DefaultTrackSelector trackSelector;
  private DefaultTrackSelector.Parameters trackSelectorParameters;
  private MediaSource mediaSource;

  private final ExoPlayerEventListener mEventListener = new ExoPlayerEventListener();

  // Whether to return STATE_NONE or STATE_STOPPED when mExoPlayer is null;
  private boolean mExoPlayerNullIsStopped = false;

  private boolean startAutoPlay;
  private int startWindow;
  private long startPosition;

  private PallyconWVMSDK pallyconWVMSDK;

  private PallyconEventListener pallyconEventListener;

  private Handler eventHandler = new Handler();

  private PlayerView playerView;

  private static volatile LocalPlayback instance;

  private static final DefaultBandwidthMeter BANDWIDTH_METER = new DefaultBandwidthMeter();
  private static final CookieManager DEFAULT_COOKIE_MANAGER;

  static {
    DEFAULT_COOKIE_MANAGER = new CookieManager();
    DEFAULT_COOKIE_MANAGER.setCookiePolicy(CookiePolicy.ACCEPT_ORIGINAL_SERVER);
  }

  private final IntentFilter mAudioNoisyIntentFilter =
      new IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY);

  private final BroadcastReceiver mAudioNoisyReceiver =
      new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
          if (AudioManager.ACTION_AUDIO_BECOMING_NOISY.equals(intent.getAction())) {
            LogHelper.d(TAG, "Headphones disconnected.");
            if (isPlaying()) {
              Intent i = new Intent(context, MediaService.class);
              i.setAction(MediaService.ACTION_CMD);
              i.putExtra(MediaService.CMD_NAME, MediaService.CMD_PAUSE);
              mContext.startService(i);
            }
          }
        }
      };

  public static LocalPlayback getInstance(Context context) {
    if (instance == null) {
      synchronized (LocalPlayback.class) {
        if (instance == null) {
          instance = new LocalPlayback(context);
        }
      }
    }
    return instance;
  }

  // private constructor.
  private LocalPlayback(Context context) {

    // Prevent from the reflection api.
    if (instance != null) {
      throw new RuntimeException(
          "Use getInstance method to get the single instance of this class.");
    }

    Context applicationContext = context.getApplicationContext();
    this.mContext = applicationContext;

    mediaDataSourceFactory = new DefaultHttpDataSourceFactory(
        Util.getUserAgent(mContext, "influential"), BANDWIDTH_METER);
    if (CookieHandler.getDefault() != DEFAULT_COOKIE_MANAGER) {
      CookieHandler.setDefault(DEFAULT_COOKIE_MANAGER);
    }
    trackSelectorParameters = new DefaultTrackSelector.ParametersBuilder().build();
    clearStartPosition();

    // Acquire Pallycon Widevine module.
    try {
      Site site = createSite();
      pallyconWVMSDK = PallyconWVMSDKFactory.getInstance(mContext);
      pallyconWVMSDK.init(mContext, eventHandler, site.siteId, site.siteKey);
    } catch (IOException e) {
      e.printStackTrace();
    } catch (PallyconDrmException e) {
      e.printStackTrace();
    }

    this.mAudioManager =
        (AudioManager) applicationContext.getSystemService(Context.AUDIO_SERVICE);
    // Create the Wifi lock (this does not acquire the lock, this just creates it)
    this.mWifiLock =
        ((WifiManager) applicationContext.getSystemService(Context.WIFI_SERVICE))
            .createWifiLock(WifiManager.WIFI_MODE_FULL, "welaaa_lock");
  }

  @Override
  public void start() {
    // Nothing to do
  }

  @Override
  public void stop(boolean notifyListeners) {
    giveUpAudioFocus();
    unregisterAudioNoisyReceiver();
    releaseResources(true);
  }

  @Override
  public void setState(int state) {
    // Nothing to do (mExoPlayer holds its own state).
  }

  @Override
  public int getState() {
    if (mExoPlayer == null) {
      return mExoPlayerNullIsStopped
          ? PlaybackStateCompat.STATE_STOPPED
          : PlaybackStateCompat.STATE_NONE;
    }
    switch (mExoPlayer.getPlaybackState()) {
      case Player.STATE_IDLE:
        return PlaybackStateCompat.STATE_PAUSED;
      case Player.STATE_BUFFERING:
        return PlaybackStateCompat.STATE_BUFFERING;
      case Player.STATE_READY:
        return mExoPlayer.getPlayWhenReady()
            ? PlaybackStateCompat.STATE_PLAYING
            : PlaybackStateCompat.STATE_PAUSED;
      case Player.STATE_ENDED:
        return PlaybackStateCompat.STATE_PAUSED;
      default:
        return PlaybackStateCompat.STATE_NONE;
    }
  }

  @Override
  public boolean isConnected() {
    return true;
  }

  @Override
  public boolean isPlaying() {
    return mPlayOnFocusGain || (mExoPlayer != null && mExoPlayer.getPlayWhenReady());
  }

  @Override
  public long getCurrentStreamPosition() {
    return mExoPlayer != null ? mExoPlayer.getCurrentPosition() : 0;
  }

  @Override
  public void updateLastKnownStreamPosition() {
    // Nothing to do. Position maintained by ExoPlayer.
  }

  @Override
  public void play(MediaMetadataCompat item) {
    mPlayOnFocusGain = true;
    tryToGetAudioFocus();
    registerAudioNoisyReceiver();
    Uri uri = item.getDescription().getMediaUri();
    boolean mediaHasChanged = currentMedia == null ||
        !uri.equals(currentMedia.getDescription().getMediaUri());
    if (mediaHasChanged) {
      currentMedia = item;
    }

    if (mediaHasChanged || mExoPlayer == null) {
      releaseResources(true);

      String source = currentMedia.getDescription().getMediaUri().toString();
      if (source != null) {
        source = source.replaceAll(" ", "%20"); // Escape spaces for URLs
      }

      @DefaultRenderersFactory.ExtensionRendererMode int extensionRendererMode =
          DefaultRenderersFactory.EXTENSION_RENDERER_MODE_ON;
      DefaultRenderersFactory renderersFactory =
          new DefaultRenderersFactory(mContext, extensionRendererMode);

      TrackSelection.Factory trackSelectionFactory =
          new AdaptiveTrackSelection.Factory(BANDWIDTH_METER);
      trackSelector = new DefaultTrackSelector(trackSelectionFactory);
      trackSelector.setParameters(trackSelectorParameters);

      DrmSessionManager<FrameworkMediaCrypto> drmSessionManager = null;
      try {
        drmSessionManager = createDrmSessionManager();
      } catch (PallyconDrmException e) {
        e.printStackTrace();
      }

      try {
        mediaSource = buildMediaSource(Uri.parse(source));
      } catch (IllegalArgumentException e) {
        e.printStackTrace();
      } catch (IllegalStateException e) {
        e.printStackTrace();
      }

      mExoPlayer = ExoPlayerFactory.newSimpleInstance(
          renderersFactory, trackSelector, drmSessionManager);
      mExoPlayer.addListener(mEventListener);
      mExoPlayer.setPlayWhenReady(startAutoPlay);

      // Prepares media to play (happens on background thread) and triggers
      // {@code onPlayerStateChanged} callback when the stream is ready to play.
      boolean haveStartPosition = !mediaHasChanged && startWindow != C.INDEX_UNSET;
      if (haveStartPosition) {
        mExoPlayer.seekTo(startWindow, startPosition);
      }
      mExoPlayer.prepare(mediaSource, !haveStartPosition, false);

      final AudioAttributes audioAttributes = new AudioAttributes.Builder()
          .setContentType(CONTENT_TYPE_SPEECH)
          .setUsage(USAGE_MEDIA)
          .build();
      mExoPlayer.setAudioAttributes(audioAttributes);

      // If we are streaming from the internet, we want to hold a
      // Wifi lock, which prevents the Wifi radio from going to
      // sleep while the song is playing.
      mWifiLock.acquire();
    } else {
      int state = mExoPlayer.getPlaybackState();
      if (Player.STATE_ENDED == state) {
        mExoPlayer.seekTo(startPosition);
      }
    }

    attachPlayerView();

    configurePlayerState();
  }

  @Override
  public void pause() {
    // Pause player and cancel the 'foreground service' state.
    if (mExoPlayer != null) {
      mExoPlayer.setPlayWhenReady(false);
    }
    // While paused, retain the player instance, but give up audio focus.
    releaseResources(false);
    unregisterAudioNoisyReceiver();
  }

  @Override
  public void completion() {
    giveUpAudioFocus();
    unregisterAudioNoisyReceiver();
    releaseResources(false);
    clearStartPosition();
  }

  @Override
  public void seekTo(long position) {
    LogHelper.d(TAG, "seekTo called with ", position);
    if (mExoPlayer != null) {
      registerAudioNoisyReceiver();
      mExoPlayer.seekTo(position);
    }
  }

  @Override
  public void setCallback(Callback callback) {
    this.mCallback = callback;
  }

  @Override
  public void setCurrentMedia(MediaMetadataCompat item) {
    currentMedia = item;
  }

  @Override
  public MediaMetadataCompat getCurrentMedia() {
    return currentMedia;
  }

  @Override
  public void setPallyconEventListener(PallyconEventListener listener) {
    pallyconEventListener = listener;
  }

  private void tryToGetAudioFocus() {
    LogHelper.d(TAG, "tryToGetAudioFocus");
    int result =
        mAudioManager.requestAudioFocus(
            mOnAudioFocusChangeListener,
            AudioManager.STREAM_MUSIC,
            AudioManager.AUDIOFOCUS_GAIN);
    if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
      mCurrentAudioFocusState = AUDIO_FOCUSED;
    } else {
      mCurrentAudioFocusState = AUDIO_NO_FOCUS_NO_DUCK;
    }
  }

  private void giveUpAudioFocus() {
    LogHelper.d(TAG, "giveUpAudioFocus");
    if (mAudioManager.abandonAudioFocus(mOnAudioFocusChangeListener)
        == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
      mCurrentAudioFocusState = AUDIO_NO_FOCUS_NO_DUCK;
    }
  }

  /**
   * Reconfigures the player according to audio focus settings and starts/restarts it. This method
   * starts/restarts the ExoPlayer instance respecting the current audio focus state. So if we have
   * focus, it will play normally; if we don't have focus, it will either leave the player paused or
   * set it to a low volume, depending on what is permitted by the current focus settings.
   */
  private void configurePlayerState() {
    LogHelper.d(TAG, "configurePlayerState. mCurrentAudioFocusState=", mCurrentAudioFocusState);
    if (mCurrentAudioFocusState == AUDIO_NO_FOCUS_NO_DUCK) {
      // We don't have audio focus and can't duck, so we have to pause
      pause();
    } else {
      registerAudioNoisyReceiver();

      if (mCurrentAudioFocusState == AUDIO_NO_FOCUS_CAN_DUCK) {
        // We're permitted to play, but only if we 'duck', ie: play softly
        mExoPlayer.setVolume(VOLUME_DUCK);
      } else {
        mExoPlayer.setVolume(VOLUME_NORMAL);
      }

      // If we were playing when we lost focus, we need to resume playing.
      if (mPlayOnFocusGain) {
        mExoPlayer.setPlayWhenReady(true);
        mPlayOnFocusGain = false;
      }
    }
  }

  private final AudioManager.OnAudioFocusChangeListener mOnAudioFocusChangeListener =
      new AudioManager.OnAudioFocusChangeListener() {
        @Override
        public void onAudioFocusChange(int focusChange) {
          LogHelper.d(TAG, "onAudioFocusChange. focusChange=", focusChange);
          switch (focusChange) {
            case AudioManager.AUDIOFOCUS_GAIN:
              mCurrentAudioFocusState = AUDIO_FOCUSED;
              break;
            case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK:
              // Audio focus was lost, but it's possible to duck (i.e.: play quietly)
              mCurrentAudioFocusState = AUDIO_NO_FOCUS_CAN_DUCK;
              break;
            case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
              // Lost audio focus, but will gain it back (shortly), so note whether
              // playback should resume
              mCurrentAudioFocusState = AUDIO_NO_FOCUS_NO_DUCK;
              mPlayOnFocusGain = mExoPlayer != null && mExoPlayer.getPlayWhenReady();
              break;
            case AudioManager.AUDIOFOCUS_LOSS:
              // Lost audio focus, probably "permanently"
              mCurrentAudioFocusState = AUDIO_NO_FOCUS_NO_DUCK;
              break;
          }

          if (mExoPlayer != null) {
            // Update the player state based on the change
            configurePlayerState();
          }
        }
      };

  /**
   * Releases resources used by the service for playback, which is mostly just the WiFi lock for
   * local playback. If requested, the ExoPlayer instance is also released.
   *
   * @param releasePlayer Indicates whether the player should also be released
   */
  private void releaseResources(boolean releasePlayer) {
    LogHelper.d(TAG, "releaseResources. releasePlayer=", releasePlayer);

    // Stops and releases player (if requested and available).
    if (releasePlayer && mExoPlayer != null) {
      updateTrackSelectorParameters();
      updateStartPosition();
      mExoPlayer.release();
      mExoPlayer.removeListener(mEventListener);
      mExoPlayer = null;
      mExoPlayerNullIsStopped = true;
      mPlayOnFocusGain = false;
    }

    if (mWifiLock.isHeld()) {
      mWifiLock.release();
    }
  }

  private void registerAudioNoisyReceiver() {
    if (!mAudioNoisyReceiverRegistered) {
      mContext.registerReceiver(mAudioNoisyReceiver, mAudioNoisyIntentFilter);
      mAudioNoisyReceiverRegistered = true;
    }
  }

  private void unregisterAudioNoisyReceiver() {
    if (mAudioNoisyReceiverRegistered) {
      mContext.unregisterReceiver(mAudioNoisyReceiver);
      mAudioNoisyReceiverRegistered = false;
    }
  }

  private final class ExoPlayerEventListener implements Player.EventListener {

    @Override
    public void onTimelineChanged(Timeline timeline, Object manifest, int reason) {
      // Nothing to do.
    }

    @Override
    public void onTracksChanged(
        TrackGroupArray trackGroups, TrackSelectionArray trackSelections) {
      // Nothing to do.
    }

    @Override
    public void onLoadingChanged(boolean isLoading) {
      // Nothing to do.
    }

    @Override
    public void onPlayerStateChanged(boolean playWhenReady, int playbackState) {
      switch (playbackState) {
        case Player.STATE_IDLE:
        case Player.STATE_BUFFERING:
        case Player.STATE_READY:
          if (mCallback != null) {
            mCallback.onPlaybackStatusChanged(getState());
          }
          break;
        case Player.STATE_ENDED:
          // The media player finished playing the current media.
          if (mCallback != null) {
            mCallback.onCompletion();
          }
          break;
      }
    }

    @Override
    public void onPlayerError(ExoPlaybackException error) {
      final String what;
      switch (error.type) {
        case ExoPlaybackException.TYPE_SOURCE:
          what = error.getSourceException().getMessage();
          break;
        case ExoPlaybackException.TYPE_RENDERER:
          what = error.getRendererException().getMessage();
          break;
        case ExoPlaybackException.TYPE_UNEXPECTED:
          what = error.getUnexpectedException().getMessage();
          break;
        default:
          what = "Unknown: " + error;
      }

      LogHelper.e(TAG, "ExoPlayer error: what=" + what);
      if (mCallback != null) {
        mCallback.onError("ExoPlayer error " + what);
      }
    }

    @Override
    public void onPositionDiscontinuity(int reason) {
      // Nothing to do.
    }

    @Override
    public void onPlaybackParametersChanged(PlaybackParameters playbackParameters) {
      // Nothing to do.
    }

    @Override
    public void onSeekProcessed() {
      // Nothing to do.
    }

    @Override
    public void onRepeatModeChanged(int repeatMode) {
      // Nothing to do.
    }

    @Override
    public void onShuffleModeEnabledChanged(boolean shuffleModeEnabled) {
      // Nothing to do.
    }
  }

  private DrmSessionManager<FrameworkMediaCrypto> createDrmSessionManager()
      throws PallyconDrmException {
    pallyconWVMSDK.setPallyconEventListener(pallyconEventListener);

    // Create Pallycon drmSessionManager to get into ExoPlayerFactory
    Uri uri = currentMedia.getDescription().getMediaUri();
    String name = currentMedia.getString(PlaybackManager.DRM_CONTENT_NAME_EXTRA);
    UUID drmSchemeUuid = UUID
        .fromString(currentMedia.getString(PlaybackManager.DRM_SCHEME_UUID_EXTRA));
    String drmLicenseUrl = currentMedia.getString(PlaybackManager.DRM_LICENSE_URL);
    String userId = currentMedia.getString(PlaybackManager.DRM_USERID);
    String cId = currentMedia.getString(PlaybackManager.DRM_CID);
    String oId = currentMedia.getString(PlaybackManager.DRM_OID);
    String token = currentMedia.getString(PlaybackManager.DRM_TOKEN);
    String thumbUrl = currentMedia.getString(PlaybackManager.THUMB_URL);
    String customData = currentMedia.getString(PlaybackManager.DRM_CUSTOME_DATA);
//    boolean multiSession = currentMedia.getBoolean(PlaybackManager.DRM_MULTI_SESSION, false);
    boolean multiSession = false;

    if (!TextUtils.isEmpty(token)) {
      return pallyconWVMSDK.createDrmSessionManagerByToken(
          drmSchemeUuid,
          drmLicenseUrl,
          uri,
          userId,
          cId,
          token,
          multiSession);
    } else if (!TextUtils.isEmpty(customData)) {
      return pallyconWVMSDK.createDrmSessionManagerByCustomData(
          drmSchemeUuid,
          drmLicenseUrl,
          uri,
          customData,
          multiSession);
    } else if (TextUtils.isEmpty(userId)) {
      return pallyconWVMSDK.createDrmSessionManagerByProxy(
          drmSchemeUuid,
          drmLicenseUrl,
          uri,
          cId,
          multiSession);
    } else {
      return pallyconWVMSDK.createDrmSessionManager(
          drmSchemeUuid,
          drmLicenseUrl,
          uri,
          userId,
          cId,
          oId,
          multiSession);
    }
  }

  private void updateTrackSelectorParameters() {
    if (trackSelector != null) {
      trackSelectorParameters = trackSelector.getParameters();
    }
  }

  private void updateStartPosition() {
    if (mExoPlayer != null) {
      startAutoPlay = mExoPlayer.getPlayWhenReady();
      startWindow = mExoPlayer.getCurrentWindowIndex();
      startPosition = Math.max(0, mExoPlayer.getContentPosition());
    }
  }

  private void clearStartPosition() {
    startAutoPlay = true;
    startWindow = C.INDEX_UNSET;
    startPosition = C.TIME_UNSET;
  }

  private MediaSource buildMediaSource(Uri uri) {
    if (uri == null || uri.getLastPathSegment() == null) {
      throw new IllegalArgumentException("Argument is invalid");
    }

    @C.ContentType int type = Util.inferContentType(uri.getLastPathSegment());
    switch (type) {
      case C.TYPE_DASH:
        return new DashMediaSource.Factory(
            new DefaultDashChunkSource.Factory(mediaDataSourceFactory), mediaDataSourceFactory)
            .createMediaSource(uri);
      case C.TYPE_SS:
        return new SsMediaSource.Factory(
            new DefaultSsChunkSource.Factory(mediaDataSourceFactory), mediaDataSourceFactory)
            .createMediaSource(uri);
      case C.TYPE_HLS:
        return new HlsMediaSource.Factory(mediaDataSourceFactory)
            .createMediaSource(uri);
      case C.TYPE_OTHER:
        return new ExtractorMediaSource.Factory(mediaDataSourceFactory).createMediaSource(uri);
      default: {
        throw new IllegalStateException("Unsupported type: " + type);
      }
    }
  }

  public SimpleExoPlayer getPlayer() {
    return mExoPlayer;
  }

  public boolean isCompleted() {
    if (mExoPlayer != null) {
      return Player.STATE_ENDED == mExoPlayer.getPlaybackState();
    }
    return false;
  }

  public void setPlayerView(PlayerView playerView) {
    this.playerView = playerView;
  }

  private void attachPlayerView() {
    if (playerView != null) {
      playerView.setPlayer(mExoPlayer);
      playerView.setErrorMessageProvider(new PlayerErrorMessageProvider());
      playerView.requestFocus();
    }
  }

  private class PlayerErrorMessageProvider implements ErrorMessageProvider<ExoPlaybackException> {

    @Override
    public Pair<Integer, String> getErrorMessage(ExoPlaybackException e) {
      String errorString = mContext.getString(R.string.error_generic);
      if (e.type == ExoPlaybackException.TYPE_RENDERER) {
        Exception cause = e.getRendererException();
        if (cause instanceof MediaCodecRenderer.DecoderInitializationException) {
          // Special case for decoder initialization failures.
          MediaCodecRenderer.DecoderInitializationException decoderInitializationException =
              (MediaCodecRenderer.DecoderInitializationException) cause;
          if (decoderInitializationException.decoderName == null) {
            if (decoderInitializationException
                .getCause() instanceof MediaCodecUtil.DecoderQueryException) {
              errorString = mContext.getString(R.string.error_querying_decoders);
            } else if (decoderInitializationException.secureDecoderRequired) {
              errorString =
                  mContext.getString(
                      R.string.error_no_secure_decoder, decoderInitializationException.mimeType);
            } else {
              errorString =
                  mContext.getString(R.string.error_no_decoder,
                      decoderInitializationException.mimeType);
            }
          } else {
            errorString =
                mContext.getString(
                    R.string.error_instantiating_decoder,
                    decoderInitializationException.decoderName);
          }
        }
      }
      return Pair.create(0, errorString);
    }
  }

  public void setRendererDisabled(boolean isDisabled) {
    if (mExoPlayer == null || trackSelector == null) {
      return;
    }

    int indexOfVideoRenderer = -1;
    for (int i = 0; i < mExoPlayer.getRendererCount(); i++) {
      if (mExoPlayer.getRendererType(i) == C.TRACK_TYPE_VIDEO) {
        indexOfVideoRenderer = i;
        break;
      }
    }

    DefaultTrackSelector.ParametersBuilder parametersBuilder = trackSelector.buildUponParameters();
    parametersBuilder.setRendererDisabled(indexOfVideoRenderer, isDisabled);
    trackSelector.setParameters(parametersBuilder);
  }

  private Site createSite() throws IOException {
    InputStream is = mContext.getAssets().open("site.json");
    InputStreamReader isr = new InputStreamReader(is, "UTF-8");
    JsonReader reader = new JsonReader(isr);

    Site site = new Site();

    reader.beginObject();
    while (reader.hasNext()) {
      String name = reader.nextName();
      switch (name) {
        case "siteId":
          site.siteId = reader.nextString();
          break;
        case "siteKey":
          site.siteKey = reader.nextString();
          break;
      }
    }
    return site;
  }

  private class Site {

    public String siteId;
    public String siteKey;
  }
}
