package com.welaaav2.pallycon;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.widget.RemoteViews;
import android.widget.Toast;

import com.pallycon.widevinelibrary.NetworkConnectedException;
import com.pallycon.widevinelibrary.PallyconDownloadException;
import com.pallycon.widevinelibrary.PallyconDownloadTask;
import com.welaaav2.R;
import com.welaaav2.util.ONotificationManager;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by pallycon on 2018-04-12.
 */

public class DownloadCallbackImpl implements PallyconDownloadTask.PallyconDownloadCallback {
	private String TAG = "pallycon_callback";
	private Context context;

	public RemoteViews remoteViews = null;
	private static int notifId = 2;

	final String ACTION_PAUSE ="DownloadService.remoteViews.onClick_pause";
	final String ACTION_CLOSE ="DownloadService.remoteViews.onClick_close";

	public DownloadCallbackImpl(Context context) {
		this.context = context;
	}

	@Override
	public boolean downloadFile(String currentUrl, int totalCount, int currentCount, String localPath) throws NetworkConnectedException {
		InputStream is = null;
		BufferedInputStream bis = null;
		FileOutputStream fos = null;
		BufferedOutputStream bos = null;

		int tmpTotalContentBytes = 0;
		long totalContentBytes = 0;
		long downloadedBytes = 0;

		NotificationManager notificationManager = (NotificationManager) context.getSystemService(context.NOTIFICATION_SERVICE);
		NotificationCompat.Builder mbuilder = null;
		if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
			mbuilder = new NotificationCompat.Builder(context , ONotificationManager.Channel.DOWNLOAD);
		}else{
			mbuilder = new NotificationCompat.Builder(context);
		}

		try {
			remoteViews = new RemoteViews(context.getPackageName(), R.layout.welean_download_notify);
			remoteViews.setTextViewText(R.id.Downloadservice_title , "Welaaa Download ");
			remoteViews.setProgressBar(R.id.DownloadServiceProgressBar , 100 , 0 , false);
			remoteViews.setImageViewResource(R.id.imageView_icon,R.drawable.notify_logo_download);
			remoteViews.setOnClickPendingIntent(R.id.btn_remote_close,pendingIntent(ACTION_CLOSE));

			mbuilder.setCustomContentView(remoteViews);
			mbuilder.setSmallIcon(R.drawable.notify_logo_download);

			notificationManager.notify(notifId , mbuilder.build());

			URL url = new URL(currentUrl);
			HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

			File localFile = new File(localPath);
			if(!localFile.getParentFile().exists()) {
				if(localFile.getParentFile().mkdirs() == false) {
					throw new PallyconDownloadException("can't make dirs");
				}
			}

			downloadedBytes = (int) localFile.length();

			urlConnection.setRequestMethod("GET");
			urlConnection.setRequestProperty("Range", "bytes=" + downloadedBytes + "-");
			urlConnection.connect();

			int responseCode = urlConnection.getResponseCode();
			Log.e(TAG, "responseCode : " + responseCode + " : " + url.getFile());
			if (responseCode == 416) {
				Log.e(TAG, url.getFile() + " is already downloaded");
				if(currentCount != -1) {
					Log.e(TAG, "update your progressbar to 100%");
					notificationManager.cancel(notifId);
				}
				return true;
			}
//			} else if (responseCode != HttpURLConnection.HTTP_OK && responseCode != HttpURLConnection.HTTP_PARTIAL) {
//				return false;
//			}

			tmpTotalContentBytes = urlConnection.getContentLength();
			if (tmpTotalContentBytes <= 0) {
				Log.e(TAG, url.getFile() + " is already downloaded");
				if(currentCount != -1) {
					Log.e(TAG, "update your progressbar to 100%");

					notificationManager.cancel(notifId);

				}
				return true;
			} else {
				totalContentBytes = downloadedBytes + tmpTotalContentBytes;
			}

			urlConnection.setReadTimeout(3000);
			urlConnection.setConnectTimeout(3000);

			is = urlConnection.getInputStream();
			bis = new BufferedInputStream(is);

			fos = new FileOutputStream(localFile, downloadedBytes != 0);
			bos = new BufferedOutputStream(fos);

			byte[] buffer = new byte[102400];

			int readSize = 0;
			int oldPercent = 0;

			while ((readSize = bis.read(buffer)) != -1) {
				bos.write(buffer, 0, readSize);
				downloadedBytes += readSize;

				int percent = (int) (((double) downloadedBytes / (double) totalContentBytes) * 100.0);

				if (oldPercent != percent) {
					oldPercent = percent;

					if(currentCount != -1) {

						if(percent<100){
							remoteViews.setProgressBar(R.id.DownloadServiceProgressBar,100, percent, false);
							remoteViews.setTextViewText(R.id.Downloadservice_title_progress ,  percent + "%" );

							notificationManager.notify(notifId , mbuilder.build());
						}else{
							notificationManager.cancel(notifId);

							Handler handler = new Handler(context.getMainLooper());

							handler.post(new Runnable() {
								@Override
								public void run() {
//									showSimpleToast(context, "다운로드가 완료되었습니다.");
								}
							});
						}


						Handler handler = new Handler(context.getMainLooper());
						final int updatePercent = oldPercent;
						handler.post(new Runnable() {
							@Override
							public void run() {
								showSimpleToast(context, updatePercent + " : % downloaded");
							}
						});
					}
				}
			}

			if(Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT) {
				urlConnection.disconnect();
			}

			return true;

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		} finally {
			try {
				if(bos != null) {
					bos.flush();
					bos.close();
				}

				if(fos != null) {
					fos.close();
				}

				if(is != null) {
					is.close();
				}

				if(bis != null) {
					bis.close();
				}

			} catch (IOException e) {
				e.printStackTrace();
				return false;
			}
		}
	}

	public static Toast mToast = null;
	public static void showSimpleToast(Context context, String msg) {
		if( mToast == null ) {
			mToast = Toast.makeText(context, msg, Toast.LENGTH_SHORT);
		} else {
			mToast.setText( msg );
		}
		mToast.show();
	}

	private PendingIntent pendingIntent (String clickinfo){
		Intent newIntent = new Intent();
		newIntent.setAction(clickinfo);
		PendingIntent pIntent = PendingIntent.getBroadcast(context, 0, newIntent, 0);

		return pIntent;
	}
}
