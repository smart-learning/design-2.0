package com.welaaav2.player;

import android.content.ComponentName;
import android.content.Context;
import android.os.RemoteException;
import android.support.v4.media.MediaBrowserCompat;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaControllerCompat;
import android.support.v4.media.session.PlaybackStateCompat;
import android.util.Log;

public class MediaSessionConnection {

  private static volatile MediaSessionConnection instance;

  private PlaybackStateCompat playbackState;
  private MediaMetadataCompat nowPlaying;

  private MediaBrowserConnectionCallback mediaBrowserConnectionCallback;
  private MediaBrowserCompat mediaBrowser;
  private MediaControllerCompat mediaController;

  // private constructor.
  private MediaSessionConnection(Context context, ComponentName serviceComponent) {

    // Prevent from the reflection api.
    if (instance != null) {
      throw new RuntimeException(
          "Use getInstance method to get the single instance of this class.");
    }

    playbackState = EMPTY_PLAYBACK_STATE();
    nowPlaying = NOTHING_PLAYING();

    mediaBrowserConnectionCallback = new MediaBrowserConnectionCallback(context);
    mediaBrowser = new MediaBrowserCompat(context, serviceComponent, mediaBrowserConnectionCallback,
        null);
    mediaBrowser.connect();
  }

  public static MediaSessionConnection getInstance(Context context,
      ComponentName serviceComponent) {
    if (instance == null) {
      synchronized (MediaSessionConnection.class) {
        if (instance == null) {
          instance = new MediaSessionConnection(context, serviceComponent);
        }
      }
    }
    return instance;
  }

  public String rootMediaId() {
    return mediaBrowser != null ? mediaBrowser.getRoot() : null;
  }

  private PlaybackStateCompat EMPTY_PLAYBACK_STATE() {
    return new PlaybackStateCompat.Builder()
        .setState(PlaybackStateCompat.STATE_NONE, 0, 0f)
        .build();
  }

  private MediaMetadataCompat NOTHING_PLAYING() {
    return new MediaMetadataCompat.Builder()
        .putString(MediaMetadataCompat.METADATA_KEY_MEDIA_ID, "")
        .putString(MediaMetadataCompat.METADATA_KEY_MEDIA_URI, "")
        .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, 0l)
        .build();
  }

  public MediaControllerCompat.TransportControls getTransportControls() {
    return mediaController.getTransportControls();
  }

  public void subscribe(String parentId, MediaBrowserCompat.SubscriptionCallback callback) {
    mediaBrowser.subscribe(parentId, callback);
  }

  public void unsubscribe(String parentId, MediaBrowserCompat.SubscriptionCallback callback) {
    mediaBrowser.unsubscribe(parentId, callback);
  }

  private class MediaBrowserConnectionCallback extends MediaBrowserCompat.ConnectionCallback {

    private Context context;

    public MediaBrowserConnectionCallback(Context context) {
      this.context = context;
    }

    /**
     * Invoked after [MediaBrowserCompat.connect] when the request has successfully completed.
     */
    @Override
    public void onConnected() {
      // Get a MediaController for the MediaSession.
      try {
        mediaController = new MediaControllerCompat(context, mediaBrowser.getSessionToken());
        mediaController.registerCallback(new MediaControllerCallback());
      } catch (RemoteException e) {
        e.printStackTrace();
      }
    }

    @Override
    public void onConnectionSuspended() {
    }

    @Override
    public void onConnectionFailed() {
    }
  }

  private class MediaControllerCallback extends MediaControllerCompat.Callback {

    @Override
    public void onSessionDestroyed() {
      mediaBrowserConnectionCallback.onConnectionSuspended();
    }

    @Override
    public void onPlaybackStateChanged(PlaybackStateCompat state) {
      if (state != null) {
        playbackState = state;
      } else {
        playbackState = EMPTY_PLAYBACK_STATE();
      }
    }

    @Override
    public void onMetadataChanged(MediaMetadataCompat metadata) {
      if (metadata != null) {
        nowPlaying = metadata;
      } else {
        nowPlaying = NOTHING_PLAYING();
      }
    }
  }
}
