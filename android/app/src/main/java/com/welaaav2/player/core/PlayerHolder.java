package com.welaaav2.player.core;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.text.TextUtils;
import android.util.JsonReader;
import android.util.Pair;
import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.DefaultLoadControl;
import com.google.android.exoplayer2.DefaultRenderersFactory;
import com.google.android.exoplayer2.ExoPlaybackException;
import com.google.android.exoplayer2.ExoPlayerFactory;
import com.google.android.exoplayer2.PlaybackParameters;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.Player.EventListener;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.Timeline;
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
import com.welaaav2.R;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class PlayerHolder {

  private static volatile PlayerHolder instance;

  private Context context;

  /**
   * A list of listeners to control how/when state changes pass from the wrapped player to the rest
   * of the app.
   */
  private List<EventListener> playerEventListeners = new ArrayList<>();

  private List<PallyconEventListener> pallyconEventListeners = new ArrayList<>();

  private SimpleExoPlayer player;
  private DataSource.Factory mediaDataSourceFactory;
  private MediaSource mediaSource;
  private DefaultTrackSelector trackSelector;
  private DefaultTrackSelector.Parameters trackSelectorParameters;

  /**
   * Implementation of [Player.EventListener] which passes events from [player] through, with the
   * exception of [Player.EventListener.onPlayerStateChanged].
   */
  private Player.EventListener playerEventListener = new Player.EventListener() {
    @Override
    public void onTimelineChanged(Timeline timeline, Object manifest, int reason) {
      performOnAllPlayerEvent(listener -> listener.onTimelineChanged(timeline, manifest, reason));
    }

    @Override
    public void onTracksChanged(TrackGroupArray trackGroups, TrackSelectionArray trackSelections) {
      performOnAllPlayerEvent(listener -> listener.onTracksChanged(trackGroups, trackSelections));
    }

    @Override
    public void onLoadingChanged(boolean isLoading) {
      performOnAllPlayerEvent(listener -> listener.onLoadingChanged(isLoading));
    }

    /**
     * Handles the case where the intention is to play (so [Player.getPlayWhenReady] should
     * return 'true'), but it's actually paused because the app had a temporary loss
     * of audio focus; i.e : [AudioManager.AUDIOFOCUS_LOSS_TRANSIENT].
     */
    @Override
    public void onPlayerStateChanged(boolean playWhenReady, int playbackState) {
      final boolean reportPlayWhenReady = player.getPlayWhenReady();
      performOnAllPlayerEvent(
          listener -> listener.onPlayerStateChanged(reportPlayWhenReady, playbackState));
    }

    @Override
    public void onRepeatModeChanged(int repeatMode) {
      performOnAllPlayerEvent(listener -> listener.onRepeatModeChanged(repeatMode));
    }

    @Override
    public void onShuffleModeEnabledChanged(boolean shuffleModeEnabled) {
      performOnAllPlayerEvent(listener -> listener.onShuffleModeEnabledChanged(shuffleModeEnabled));
    }

    @Override
    public void onPlayerError(ExoPlaybackException error) {
      performOnAllPlayerEvent(listener -> listener.onPlayerError(error));
    }

    @Override
    public void onPositionDiscontinuity(int reason) {
      performOnAllPlayerEvent(listener -> listener.onPositionDiscontinuity(reason));
    }

    @Override
    public void onPlaybackParametersChanged(PlaybackParameters playbackParameters) {
      performOnAllPlayerEvent(listener -> listener.onPlaybackParametersChanged(playbackParameters));
    }

    @Override
    public void onSeekProcessed() {
      performOnAllPlayerEvent(listener -> listener.onSeekProcessed());
    }
  };

  private boolean startAutoPlay;
  private int startWindow;
  private long startPosition;

  private Content content;

  private PallyconWVMSDK WVMAgent;

  private PallyconEventListener pallyconEventListener = new PallyconEventListener() {
    @Override
    public void onDrmKeysLoaded(Map<String, String> map) {
      performOnAllPallyconEvent(listener -> listener.onDrmKeysLoaded(map));
    }

    @Override
    public void onDrmSessionManagerError(Exception e) {
      performOnAllPallyconEvent(listener -> listener.onDrmSessionManagerError(e));
    }

    @Override
    public void onDrmKeysRestored() {
      performOnAllPallyconEvent(listener -> listener.onDrmKeysRestored());
    }

    @Override
    public void onDrmKeysRemoved() {
      performOnAllPallyconEvent(listener -> listener.onDrmKeysRemoved());
    }
  };

  private Handler eventHandler = new Handler();

  private static final DefaultBandwidthMeter BANDWIDTH_METER = new DefaultBandwidthMeter();
  private static final CookieManager DEFAULT_COOKIE_MANAGER;

  static {
    DEFAULT_COOKIE_MANAGER = new CookieManager();
    DEFAULT_COOKIE_MANAGER.setCookiePolicy(CookiePolicy.ACCEPT_ORIGINAL_SERVER);
  }

  private PlayerView playerView;

  // private constructor.
  private PlayerHolder(Context context) {

    // Prevent from the reflection api.
    if (instance != null) {
      throw new RuntimeException(
          "Use getInstance method to get the single instance of this class.");
    }

    this.context = context;

    mediaDataSourceFactory = new DefaultHttpDataSourceFactory(
        Util.getUserAgent(context, "influential"), BANDWIDTH_METER);
    if (CookieHandler.getDefault() != DEFAULT_COOKIE_MANAGER) {
      CookieHandler.setDefault(DEFAULT_COOKIE_MANAGER);
    }
    trackSelectorParameters = new DefaultTrackSelector.ParametersBuilder().build();
    clearStartPosition();

    try {
      Site site = createSite();
      WVMAgent = PallyconWVMSDKFactory.getInstance(context);
      WVMAgent.init(context, eventHandler, site.siteId, site.siteKey);
    } catch (IOException e) {
      e.printStackTrace();
    } catch (PallyconDrmException e) {
      e.printStackTrace();
    }
  }

  public static PlayerHolder getInstance(Context context) {
    if (instance == null) {
      synchronized (PlayerHolder.class) {
        if (instance == null) {
          instance = new PlayerHolder(context);
        }
      }
    }
    return instance;
  }

  public void initializePlayer() {
    if (player == null) {
      @DefaultRenderersFactory.ExtensionRendererMode int extensionRendererMode =
          DefaultRenderersFactory.EXTENSION_RENDERER_MODE_ON;
      DefaultRenderersFactory renderersFactory =
          new DefaultRenderersFactory(context, extensionRendererMode);

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
        mediaSource = buildMediaSource(content.uri);
      } catch (IllegalArgumentException e) {
        e.printStackTrace();
      } catch (IllegalStateException e) {
        e.printStackTrace();
      }

      player = ExoPlayerFactory
          .newSimpleInstance(renderersFactory, trackSelector, drmSessionManager);

      player.addListener(playerEventListener);
      player.setPlayWhenReady(startAutoPlay);

      boolean haveStartPosition = startWindow != C.INDEX_UNSET;
      if (haveStartPosition) {
        player.seekTo(startWindow, startPosition);
      }
      player.prepare(mediaSource, !haveStartPosition, false);

      attachPlayerView();
    }
  }

  public void releasePlayer() {
    if (player != null) {
      updateTrackSelectorParameters();
      updateStartPosition();
      player.release();
      player = null;
      mediaSource = null;
      trackSelector = null;
      content = null;
    }
  }

  public void onStart() {
    if (Util.SDK_INT > 23) {
      try {
        initializePlayer();
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }

  public void onResume() {
    if (Util.SDK_INT <= 23) {
      try {
        initializePlayer();
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }

  public void onPause() {
    if (Util.SDK_INT <= 23) {
      releasePlayer();
    }
  }

  public void onStop() {
    if (Util.SDK_INT > 23) {
      releasePlayer();
    }
  }

  public void setRendererDisabled(boolean isDisabled) {
    int indexOfVideoRenderer = -1;
    for (int i = 0; i < player.getRendererCount(); i++) {
      if (player.getRendererType(i) == C.TRACK_TYPE_VIDEO) {
        indexOfVideoRenderer = i;
        break;
      }
    }

    DefaultTrackSelector.ParametersBuilder parametersBuilder = trackSelector.buildUponParameters();
    parametersBuilder.setRendererDisabled(indexOfVideoRenderer, isDisabled);
    trackSelector.setParameters(parametersBuilder);
  }

  private void updateTrackSelectorParameters() {
    if (trackSelector != null) {
      trackSelectorParameters = trackSelector.getParameters();
    }
  }

  private void updateStartPosition() {
    if (player != null) {
      startAutoPlay = player.getPlayWhenReady();
      startWindow = player.getCurrentWindowIndex();
      startPosition = Math.max(0, player.getContentPosition());
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
    if (player == null) {
      // Create default player to prevent crash in exoplayer delegate.
      return ExoPlayerFactory.newSimpleInstance(new DefaultRenderersFactory(context),
          new DefaultTrackSelector(), new DefaultLoadControl());
    }
    return player;
  }

  public void setPlayerView(PlayerView playerView) {
    this.playerView = playerView;
  }

  private void attachPlayerView() {
    if (playerView != null) {
      playerView.setPlayer(player);
      playerView.setErrorMessageProvider(new PlayerErrorMessageProvider());
      playerView.requestFocus();
    }
  }

  public void setSource(Content content) {
    String nowContentUri = "";
    if (this.content != null && this.content.uri != null) {
      nowContentUri = this.content.uri.toString();
    }
    String contentUri = "";
    if (content != null && content.uri != null) {
      contentUri = content.uri.toString();
    }

    if (!contentUri.isEmpty() && !contentUri.equals(nowContentUri)) {
      this.content = content;
      releasePlayer();
      clearStartPosition();
      initializePlayer();
    }
  }

  private DrmSessionManager<FrameworkMediaCrypto> createDrmSessionManager()
      throws PallyconDrmException {
    // Acquire Pallycon Widevine module.
    WVMAgent.setPallyconEventListener(pallyconEventListener);

    // Create Pallycon drmSessionManager to get into ExoPlayerFactory
    if (!TextUtils.isEmpty(content.token)) {
      return WVMAgent.createDrmSessionManagerByToken(
          content.drmSchemeUuid,
          content.drmLicenseUrl,
          content.uri,
          content.userId,
          content.cId,
          content.token,
          content.multiSession);
    } else if (!TextUtils.isEmpty(content.customData)) {
      return WVMAgent.createDrmSessionManagerByCustomData(
          content.drmSchemeUuid,
          content.drmLicenseUrl,
          content.uri,
          content.customData,
          content.multiSession);
    } else if (TextUtils.isEmpty(content.userId)) {
      return WVMAgent.createDrmSessionManagerByProxy(
          content.drmSchemeUuid,
          content.drmLicenseUrl,
          content.uri,
          content.cId,
          content.multiSession);
    } else {
      return WVMAgent.createDrmSessionManager(
          content.drmSchemeUuid,
          content.drmLicenseUrl,
          content.uri,
          content.userId,
          content.cId,
          content.oId,
          content.multiSession);
    }
  }

  private Site createSite() throws IOException {
    InputStream is = context.getAssets().open("site.json");
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

  public static class Content {

    public Uri uri;
    public String name;
    public UUID drmSchemeUuid;
    public String drmLicenseUrl;
    public String userId;
    public String cId;
    public String oId;
    public String token;
    public String thumbUrl;
    public String customData;
    public boolean multiSession;

    public Content() {
    }

    public static Content fromData(Bundle data) {
      Content content = new Content();
//      content.name = data.getString(PlayerActivity.DRM_CONTENT_NAME_EXTRA);
//      content.drmSchemeUuid = UUID.fromString(data.getString(PlayerActivity.DRM_SCHEME_UUID_EXTRA));
//      content.drmLicenseUrl = data.getString(PlayerActivity.DRM_LICENSE_URL);
//      content.userId = data.getString(PlayerActivity.DRM_USERID);
//      content.cId = data.getString(PlayerActivity.DRM_CID);
//      content.oId = data.getString(PlayerActivity.DRM_OID);
//      content.token = data.getString(PlayerActivity.DRM_TOKEN);
//      content.thumbUrl = data.getString(PlayerActivity.THUMB_URL);
//      content.customData = data.getString(PlayerActivity.DRM_CUSTOME_DATA);
//      content.multiSession = data.getBoolean(PlayerActivity.DRM_MULTI_SESSION, false);
      return content;
    }
  }

  public Player.EventListener getPlayerEventListener() {
    return playerEventListener;
  }

  public void addPlayerEventListener(Player.EventListener listener) {
    if (!playerEventListeners.contains(listener)) {
      playerEventListeners.add(listener);
    }
  }

  public void removePlayerEventListener(Player.EventListener listener) {
    if (playerEventListeners.contains(listener)) {
      playerEventListeners.remove(listener);
    }
  }

  private void performOnAllPlayerEvent(@NonNull CommandPlayerEvent command) {
    for (Player.EventListener listener : playerEventListeners) {
      command.perform(listener);
    }
  }

  private interface CommandPlayerEvent {

    void perform(@NonNull Player.EventListener listener);
  }

  public void addPallyconEventListener(PallyconEventListener listener) {
    if (!pallyconEventListeners.contains(listener)) {
      pallyconEventListeners.add(listener);
    }
  }

  public void removePallyconEventListener(PallyconEventListener listener) {
    if (pallyconEventListeners.contains(listener)) {
      pallyconEventListeners.remove(listener);
    }
  }

  private void performOnAllPallyconEvent(@NonNull CommandPallyconEvent command) {
    for (PallyconEventListener listener : pallyconEventListeners) {
      command.perform(listener);
    }
  }

  private interface CommandPallyconEvent {

    void perform(@NonNull PallyconEventListener listener);
  }

  private class PlayerErrorMessageProvider implements ErrorMessageProvider<ExoPlaybackException> {

    @Override
    public Pair<Integer, String> getErrorMessage(ExoPlaybackException e) {
      String errorString = context.getString(R.string.error_generic);
      if (e.type == ExoPlaybackException.TYPE_RENDERER) {
        Exception cause = e.getRendererException();
        if (cause instanceof MediaCodecRenderer.DecoderInitializationException) {
          // Special case for decoder initialization failures.
          MediaCodecRenderer.DecoderInitializationException decoderInitializationException =
              (MediaCodecRenderer.DecoderInitializationException) cause;
          if (decoderInitializationException.decoderName == null) {
            if (decoderInitializationException
                .getCause() instanceof MediaCodecUtil.DecoderQueryException) {
              errorString = context.getString(R.string.error_querying_decoders);
            } else if (decoderInitializationException.secureDecoderRequired) {
              errorString =
                  context.getString(
                      R.string.error_no_secure_decoder, decoderInitializationException.mimeType);
            } else {
              errorString =
                  context.getString(R.string.error_no_decoder,
                      decoderInitializationException.mimeType);
            }
          } else {
            errorString =
                context.getString(
                    R.string.error_instantiating_decoder,
                    decoderInitializationException.decoderName);
          }
        }
      }
      return Pair.create(0, errorString);
    }
  }
}

