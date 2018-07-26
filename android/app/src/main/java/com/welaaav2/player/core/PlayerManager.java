package com.welaaav2.player.core;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.text.TextUtils;
import android.util.JsonReader;
import android.util.Pair;

import com.google.android.exoplayer2.C;
import com.google.android.exoplayer2.DefaultRenderersFactory;
import com.google.android.exoplayer2.ExoPlaybackException;
import com.google.android.exoplayer2.ExoPlayerFactory;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.SimpleExoPlayer;
import com.google.android.exoplayer2.drm.DrmSessionManager;
import com.google.android.exoplayer2.drm.FrameworkMediaCrypto;
import com.google.android.exoplayer2.mediacodec.MediaCodecRenderer;
import com.google.android.exoplayer2.mediacodec.MediaCodecUtil;
import com.google.android.exoplayer2.source.ExtractorMediaSource;
import com.google.android.exoplayer2.source.MediaSource;
import com.google.android.exoplayer2.source.dash.DashMediaSource;
import com.google.android.exoplayer2.source.dash.DefaultDashChunkSource;
import com.google.android.exoplayer2.source.hls.HlsMediaSource;
import com.google.android.exoplayer2.source.smoothstreaming.DefaultSsChunkSource;
import com.google.android.exoplayer2.source.smoothstreaming.SsMediaSource;
import com.google.android.exoplayer2.trackselection.AdaptiveTrackSelection;
import com.google.android.exoplayer2.trackselection.DefaultTrackSelector;
import com.google.android.exoplayer2.trackselection.TrackSelection;
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
import com.welaaav2.player.PlayerActivity;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.util.Map;
import java.util.UUID;

public class PlayerManager {
    private Context context;

    private SimpleExoPlayer player;
    private DataSource.Factory mediaDataSourceFactory;
    private MediaSource mediaSource;
    private DefaultTrackSelector trackSelector;
    private DefaultTrackSelector.Parameters trackSelectorParameters;

    private boolean startAutoPlay;
    private int startWindow;
    private long startPosition;

    private Content content;

    private PallyconWVMSDK WVMAgent;

    private Handler eventHandler = new Handler();

    private Player.EventListener playerEventListener;
    private PallyconEventListener pallyconEventListener;

    private final Player.EventListener DEFAULT_PLAYER_EVENT_LISTENER = new Player.DefaultEventListener() {};
    private final PallyconEventListener DEFAULT_PALLYCON_EVENT_LISTENER = new PallyconEventListener() {
        @Override
        public void onDrmKeysLoaded(Map<String, String> map) {

        }

        @Override
        public void onDrmSessionManagerError(Exception e) {

        }

        @Override
        public void onDrmKeysRestored() {

        }

        @Override
        public void onDrmKeysRemoved() {

        }
    };

    private static final DefaultBandwidthMeter BANDWIDTH_METER = new DefaultBandwidthMeter();
    private static final CookieManager DEFAULT_COOKIE_MANAGER;
    static {
        DEFAULT_COOKIE_MANAGER = new CookieManager();
        DEFAULT_COOKIE_MANAGER.setCookiePolicy(CookiePolicy.ACCEPT_ORIGINAL_SERVER);
    }

    public PlayerManager(@NonNull Context context) {
        this.context = context;
        mediaDataSourceFactory = new DefaultHttpDataSourceFactory(Util.getUserAgent(context, "influential"), BANDWIDTH_METER);
        if (CookieHandler.getDefault() != DEFAULT_COOKIE_MANAGER) {
            CookieHandler.setDefault(DEFAULT_COOKIE_MANAGER);
        }
        trackSelectorParameters = new DefaultTrackSelector.ParametersBuilder().build();
        clearStartPosition();

        content = new Content();

        try {
            Site site = createSite();
            WVMAgent = PallyconWVMSDKFactory.getInstance(context);
            WVMAgent.init(context, eventHandler, site.siteId, site.siteKey);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (PallyconDrmException e) {
            e.printStackTrace();
        }

        playerEventListener = DEFAULT_PLAYER_EVENT_LISTENER;

        pallyconEventListener = DEFAULT_PALLYCON_EVENT_LISTENER;
    }

    public void initializePlayer() throws Exception {
        if (player == null) {
            @DefaultRenderersFactory.ExtensionRendererMode int extensionRendererMode =
                    DefaultRenderersFactory.EXTENSION_RENDERER_MODE_ON;
            DefaultRenderersFactory renderersFactory =
                    new DefaultRenderersFactory(context, extensionRendererMode);

            TrackSelection.Factory trackSelectionFactory =
                    new AdaptiveTrackSelection.Factory(BANDWIDTH_METER);
            trackSelector = new DefaultTrackSelector(trackSelectionFactory);
            trackSelector.setParameters(trackSelectorParameters);

            DrmSessionManager<FrameworkMediaCrypto> drmSessionManager;
            try {
                drmSessionManager = createDrmSessionManager();
            } catch (PallyconDrmException e) {
                e.printStackTrace();
                throw e;
            }

            try {
                mediaSource = buildMediaSource(content.uri);
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
                throw e;
            } catch (IllegalStateException e) {
                e.printStackTrace();
                throw e;
            }

            player = ExoPlayerFactory.newSimpleInstance(renderersFactory, trackSelector, drmSessionManager);
            player.addListener(playerEventListener);
            player.setPlayWhenReady(startAutoPlay);

            boolean haveStartPosition = startWindow != C.INDEX_UNSET;
            if (haveStartPosition) {
                player.seekTo(startWindow, startPosition);
            }
            player.prepare(mediaSource, !haveStartPosition, false);
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
        }
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

    public void setSource(Content content) throws NullPointerException {
        if (!this.content.uri.equals(content.uri)) {
            this.content = content;
            clearStartPosition();
        }
    }

    private MediaSource buildMediaSource(Uri uri) {
        if (uri.getLastPathSegment() == null) {
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

    public Player getPlayer() {
        return player;
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

    public void setPlayWhenReady(boolean playWhenReady) {
        if (player != null) {
            player.setPlayWhenReady(playWhenReady);
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

    public void setPlayerView(PlayerView playerView) {
        playerView.setPlayer(player);
        playerView.setErrorMessageProvider(new PlayerErrorMessageProvider());
        playerView.requestFocus();
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
                        if (decoderInitializationException.getCause() instanceof MediaCodecUtil.DecoderQueryException) {
                            errorString = context.getString(R.string.error_querying_decoders);
                        } else if (decoderInitializationException.secureDecoderRequired) {
                            errorString =
                                    context.getString(
                                            R.string.error_no_secure_decoder, decoderInitializationException.mimeType);
                        } else {
                            errorString =
                                    context.getString(R.string.error_no_decoder, decoderInitializationException.mimeType);
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

    public void addPlayerEventListener(Player.EventListener listener) {
        playerEventListener = listener;
    }

    public void setPallyconEventListener(PallyconEventListener listener) {
        pallyconEventListener = listener;
    }

    private Site createSite() throws IOException {
        InputStream is = context.getAssets().open("site.json");
        InputStreamReader isr = new InputStreamReader(is, "UTF-8");
        JsonReader reader = new JsonReader(isr);

        Site site = new Site();

        reader.beginObject();
        while(reader.hasNext()) {
            String name = reader.nextName();
            switch(name) {
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
            uri = Uri.parse("");
            name = "";
            drmSchemeUuid = UUID.randomUUID();
            drmLicenseUrl = "";
            userId = "";
            cId = "";
            oId = "";
            token = "";
            thumbUrl = "";
            customData = "";
            multiSession = false;
        }

        public Content(Uri uri,
                       String name,
                       UUID drmSchemeUuid,
                       String drmLicenseUrl,
                       String userId,
                       String cId,
                       String oId,
                       String token,
                       String thumbUrl,
                       String customData,
                       boolean multiSession) {
            this.uri = uri;
            this.name = name;
            this.drmSchemeUuid = drmSchemeUuid;
            this.drmLicenseUrl = drmLicenseUrl;
            this.userId = userId;
            this.cId = cId;
            this.oId = oId;
            this.token = token;
            this.thumbUrl = thumbUrl;
            this.customData = customData;
            this.multiSession = multiSession;
        }

        public static Content fromIntent(Intent intent) {
            return new Content(
                    intent.getData(),
                    intent.getStringExtra(PlayerActivity.DRM_CONTENT_NAME_EXTRA),
                    UUID.fromString(intent.getStringExtra(PlayerActivity.DRM_SCHEME_UUID_EXTRA)),
                    intent.getStringExtra(PlayerActivity.DRM_LICENSE_URL),
                    intent.getStringExtra(PlayerActivity.DRM_USERID),
                    intent.getStringExtra(PlayerActivity.DRM_CID),
                    intent.getStringExtra(PlayerActivity.DRM_OID),
                    intent.getStringExtra(PlayerActivity.DRM_TOKEN),
                    intent.getStringExtra(PlayerActivity.THUMB_URL),
                    intent.getStringExtra(PlayerActivity.DRM_CUSTOME_DATA),
                    intent.getBooleanExtra(PlayerActivity.DRM_MULTI_SESSION, false));
        }
    }
}
