package kr.co.influential.youngkangapp.util;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationChannelGroup;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.annotation.StringDef;

import kr.co.influential.youngkangapp.R;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

public class ONotificationManager {

    private static final String GROUP_WELAAA = "welaaa";

    @RequiresApi(Build.VERSION_CODES.O)
    public static void createChannel(Context context) {

        NotificationChannelGroup group1 = new NotificationChannelGroup(GROUP_WELAAA, GROUP_WELAAA);
        getManager(context).createNotificationChannelGroup(group1);

        NotificationChannel channelDownload = new NotificationChannel(Channel.DOWNLOAD,
                context.getString(R.string.app_name), NotificationManager.IMPORTANCE_LOW);
        channelDownload.setDescription(context.getString(R.string.app_name));
        channelDownload.setGroup(GROUP_WELAAA);
        channelDownload.enableVibration(true);
        getManager(context).createNotificationChannel(channelDownload);

        NotificationChannel channelComment = new NotificationChannel(Channel.COMMENT,
                context.getString(R.string.app_name), android.app.NotificationManager.IMPORTANCE_DEFAULT);
        channelComment.setDescription(context.getString(R.string.app_name));
        channelComment.setGroup(GROUP_WELAAA);
        channelDownload.enableVibration(true);
        getManager(context).createNotificationChannel(channelComment);

        NotificationChannel channelNotice = new NotificationChannel(Channel.NOTICE,
                context.getString(R.string.app_name), android.app.NotificationManager.IMPORTANCE_HIGH);
        channelNotice.setDescription(context.getString(R.string.app_name));
        channelNotice.setGroup(GROUP_WELAAA);
        channelDownload.enableVibration(true);
        getManager(context).createNotificationChannel(channelNotice);

    }

    @RequiresApi(Build.VERSION_CODES.O)
    private static android.app.NotificationManager getManager(Context context) {
        return (android.app.NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    }

    @RequiresApi(Build.VERSION_CODES.O)
    public static void deleteChannel(Context context, @Channel String channel) {
        getManager(context).deleteNotificationChannel(channel);

    }

    @RequiresApi(Build.VERSION_CODES.O)
    public static void sendNotification(Context context, int id, @Channel String channel, String title, String body) {
        Notification.Builder builder = new Notification.Builder(context, channel)
                .setContentTitle(title)
                .setContentText(body)
                .setVibrate(new long[]{0L})
                .setSmallIcon(getSmallIcon());
        // Start a lengthy operation in a background thread
        new Thread(
                new Runnable() {
                    @Override
                    public void run() {
                        int incr;
                        // Do the "lengthy" operation 20 times
                        for (incr = 0; incr <= 100; incr+=5) {
                            // Sets the progress indicator to a max value, the
                            // current completion percentage, and "determinate"
                            // state
                            builder.setProgress(100, incr, false);
                            // Displays the progress bar for the first time.
                            getManager(context).notify(id, builder.build());
                            // Sleeps the thread, simulating an operation
                            // that takes time
                            try {
                                // Sleep for 5 seconds
                                Thread.sleep(5*1000);
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                        // When the loop is finished, updates the notification
//                        builder.setContentText("Download complete")
//                                // Removes the progress bar
//                                .setProgress(0,0,false);

                    }
                }
// Starts the thread by calling the run() method in its Runnable
        ).start();

//        getManager(context).notify(id, builder.build());
    }

    private static int getSmallIcon() {
        return android.R.drawable.stat_notify_chat;
    }

    @Retention(RetentionPolicy.SOURCE)
    @StringDef({
            Channel.DOWNLOAD,
            Channel.COMMENT,
            Channel.NOTICE
    })
    public @interface Channel {
        String DOWNLOAD = "download";
        String COMMENT = "comment";
        String NOTICE = "notice";
    }

}
