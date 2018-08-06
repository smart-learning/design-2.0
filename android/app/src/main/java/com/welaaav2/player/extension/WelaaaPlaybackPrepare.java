package com.welaaav2.player.extension;

import android.net.Uri;
import android.os.Bundle;
import android.os.ResultReceiver;
import android.support.v4.media.session.PlaybackStateCompat;
import android.util.Log;
import com.google.android.exoplayer2.Player;
import com.google.android.exoplayer2.ext.mediasession.MediaSessionConnector;
import com.welaaav2.player.core.PlayerHolder.Content;
import com.welaaav2.player.decorator.AudioFocusExoPlayerDecorator;

public class WelaaaPlaybackPrepare implements MediaSessionConnector.PlaybackPreparer {

  private AudioFocusExoPlayerDecorator player;

  public WelaaaPlaybackPrepare(AudioFocusExoPlayerDecorator player) {
    this.player = player;
  }

  @Override
  public long getSupportedPrepareActions() {
    return PlaybackStateCompat.ACTION_PREPARE_FROM_URI |
        PlaybackStateCompat.ACTION_PLAY_FROM_URI;
  }

  @Override
  public void onPrepare() {

  }

  @Override
  public void onPrepareFromMediaId(String mediaId, Bundle extras) {

  }

  @Override
  public void onPrepareFromSearch(String query, Bundle extras) {

  }

  @Override
  public void onPrepareFromUri(Uri uri, Bundle extras) {
    Log.d("jungon", "onPrepareFromUri: ");
    Content content = Content.fromData(extras);
    content.uri = uri;
    player.getPlayerHolder().setSource(content);
  }

  @Override
  public String[] getCommands() {
    return new String[0];
  }

  @Override
  public void onCommand(Player player, String command, Bundle extras, ResultReceiver cb) {

  }
}
