package com.welaaav2.player.notification;

import android.app.Notification;
import android.content.Context;
import android.support.v4.app.NotificationCompat;
import android.support.v4.media.session.MediaSessionCompat;

public class NotificationBuilder {

  public static final String NOW_PLAYING_CHANNEL = "com.welaaav2.player.notification.NOW_PLAYING";
  public static final int NOW_PLAYING_NOTIFICATION = 0x100;

  private Context context;

  public NotificationBuilder(Context context) {
    this.context = context;
  }

  public Notification buildNotification(MediaSessionCompat.Token sessionToken) {
    NotificationCompat.Builder builder = new NotificationCompat.Builder(context,
        NOW_PLAYING_CHANNEL);
    return builder.build();
  }
}
