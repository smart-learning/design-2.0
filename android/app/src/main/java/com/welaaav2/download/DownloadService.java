package com.welaaav2.download;

import android.app.IntentService;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.pallycon.widevinelibrary.NetworkConnectedException;
import com.pallycon.widevinelibrary.PallyconDownloadException;
import com.pallycon.widevinelibrary.PallyconDownloadTask;
import com.welaaav2.MainApplication;
import com.welaaav2.util.Logger;
import com.welaaav2.util.ONotificationManager;
import com.welaaav2.util.Utils;
import com.welaaav2.util.WeContentManager;
import com.welaaav2.util.WelaaaBroadcastReceiver;

public class DownloadService extends IntentService implements PallyconDownloadTask.PallyconDownloadEventListener {

	public static final String TAG = "DownloadService";

	public WelaaaBroadcastReceiver playerBroadcastReceiver;

	final String ACTION_PLAY ="DownloadService.remoteViews.onClick_play";
	final String ACTION_PAUSE ="DownloadService.remoteViews.onClick_pause";
	final String ACTION_CLOSE ="DownloadService.remoteViews.onClick_close";
	final String ACTION_GOPLAYER ="DownloadService.remoteViews.onClick_goplayer";

	private Context mcontext;
	private final IBinder mBinder = new MainServiceBinder();

	public static boolean stopped = false;

	@Override
	public void onPreExecute() {
		// TODO: Configure the UI to be displayed on the screen before starting the download.
	}

	@Override
	public void onPostExecute() {
		// TODO: Release the UI after the download is complete.
	}

	@Override
	public void onProgressUpdate(String s, long l, long l1, int i, int i1, int i2) {
		// TODO: Use the download progress data to update the download UI in real time.
	}

	@Override
	public void onProgressUpdate(String s, int i, int i1, int i2) {
		// TODO: Use the download progress data to update the download UI in real time.
	}

	@Override
	public void onCancelled() {
		// TODO: Release the UI when the download is canceled.
	}

	@Override
	public void onNetworkError(NetworkConnectedException e) {
		// TODO: Check the network connection status.
	}

	@Override
	public void onPallyconDownloadError(PallyconDownloadException e) {
		// TODO: Check for download failures such as storage I / O, MPD file format, URL address, and so on.
	}

	public DownloadService() {
		super("DownloadService");
		mcontext = this;
	}

	public class MainServiceBinder extends Binder {
		public DownloadService getService() {
			return DownloadService.this;
		}
	}

	private PendingIntent pendingIntent (String clickinfo){
		Intent newIntent = new Intent();
		newIntent.setAction(clickinfo);
		PendingIntent pIntent = PendingIntent.getBroadcast(this, 0, newIntent, 0);

		return pIntent;
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		return super.onStartCommand(intent,flags,startId);
	}

	@Override
	public IBinder onBind(Intent intent) {
		// TODO: Return the communication channel to the service.
		return mBinder;
	}

	@Override
	protected void onHandleIntent(@Nullable Intent intent) {

		Logger.e(TAG + "onHandleIntent intent ");

		setDownloadServiceListener();
		doStuff(intent);
	}

	/****************************************************************************
	 * remotevview 에서 사용할 브로드캐스트리시브  생성
	 ****************************************************************************/
	public void setDownloadServiceListener(){
		playerBroadcastReceiver = new WelaaaBroadcastReceiver(this);
		IntentFilter filter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
//        filter.addAction(ACTION_PLAY);
		filter.addAction(ACTION_CLOSE);
		filter.addAction(ACTION_PAUSE);
//        filter.addAction(ACTION_GOPLAYER);
		this.registerReceiver(playerBroadcastReceiver, filter);
		playerBroadcastReceiver.setDownloadServiceListener(new WelaaaBroadcastReceiver.DownloadServiceListener() {

			@Override
			public void onCloseClick() {
				showMessage("stopDownload");
				stopped = true;
				stopSelf();

				// Activity CallBack
			}

			@Override
			public void onPauseClick() { }
		});
	}

	public void showMessage(String type){
		if(type.equals("stopDownload") && !stopped){
			Utils.logToast( getApplication() , " 다운로드가 중지 됩니다. " );

			// Activity Call Stop Download

		}else if(type.equals("endDateErr") && !stopped){
			Utils.logToast( getApplication() , " 컨텐츠 사용기간에 오류로 이용이 불가능합니다. 관리자에게 문의 바랍니다. " );
		}
	}

	//콜백 인터페이스 선언
	public interface ICallback {
		void recvData(String cid); //액티비티에서 선언한 콜백 함수.
	}

	private ICallback mCallback;

	/***********************************************
	 * Comment   : 등록된 컨텐츠 매니저
	 ***********************************************/
	public WeContentManager ContentManager()
	{
		MainApplication myApp = (MainApplication)getApplicationContext();
		return myApp.getContentMgr();
	}

	private void doStuff(Intent intent) {
		if(ContentManager().existCid(intent.getStringExtra("cid"))){
			// download content exist
		}else {

			if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

				ONotificationManager.sendNotification(this, 1, ONotificationManager.Channel.DOWNLOAD, "contents", "Download Progress");
			}else{
				// Notification 관련 내용 ..
			}
		}
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
	}


	@Override
	public void onTaskRemoved(Intent rootIntent) {
		if(playerBroadcastReceiver!=null) {
			this.unregisterReceiver(playerBroadcastReceiver);
			playerBroadcastReceiver=null;
		}

		stopForeground(true);
		stopSelf();
//		android.os.Process.killProcess(android.os.Process.myPid());
		super.onTaskRemoved(rootIntent);
	}

	@Override
	public boolean onUnbind(Intent intent) {
		Logger.i(TAG+":onUnbind");
		return super.onUnbind(intent);
	}
}
