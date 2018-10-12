package kr.co.influential.youngkangapp.download;

import android.app.Dialog;
import android.app.IntentService;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Binder;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.NetworkOnMainThreadException;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.support.v7.app.AlertDialog;
import android.widget.RemoteViews;
import android.widget.Toast;
import com.pallycon.widevinelibrary.NetworkConnectedException;
import com.pallycon.widevinelibrary.PallyconDownloadException;
import com.pallycon.widevinelibrary.PallyconDownloadTask;
import kr.co.influential.youngkangapp.MainApplication;
import kr.co.influential.youngkangapp.R;
import kr.co.influential.youngkangapp.pallycon.DownloadCallbackImpl;
import kr.co.influential.youngkangapp.player.NewWebPlayerInfo;
import kr.co.influential.youngkangapp.player.WebPlayerInfo;
import kr.co.influential.youngkangapp.player.utils.LogHelper;
import kr.co.influential.youngkangapp.util.Logger;
import kr.co.influential.youngkangapp.util.Preferences;
import kr.co.influential.youngkangapp.util.Utils;
import kr.co.influential.youngkangapp.util.WeContentManager;
import kr.co.influential.youngkangapp.util.WelaaaBroadcastReceiver;

@RequiresApi(Build.VERSION_CODES.O)
public class DownloadService extends IntentService implements
    PallyconDownloadTask.PallyconDownloadEventListener {

  public static final String TAG = "DownloadService";

  public WelaaaBroadcastReceiver playerBroadcastReceiver;

  final String ACTION_PLAY = "DownloadService.remoteViews.onClick_play";
  final String ACTION_PAUSE = "DownloadService.remoteViews.onClick_pause";
  final String ACTION_CLOSE = "DownloadService.remoteViews.onClick_close";
  final String ACTION_GOPLAYER = "DownloadService.remoteViews.onClick_goplayer";

  private Context mcontext;
  private final IBinder mBinder = new MainServiceBinder();

  public static boolean stopped = false;

  private PallyconDownloadTask downloadTask;
  private Handler eventHandler = new Handler();
  public RemoteViews remoteViews = null;
  private static int notifId = 2;
  private Handler mHandler = null;

  private WebPlayerInfo mWebPlayerInfo = null;
  private NewWebPlayerInfo mNewWebPlayerInfo = null;

  private String intent_drm_content_uri_extra = "";
  private String intent_drm_content_name_extra = "";
  private boolean intent_drm_delete = false;
  private String intent_downloadContentCid = "";

  @Override
  public void onPreExecute() {
    // TODO: Configure the UI to be displayed on the screen before starting the download.
  }

  @Override
  public void onPostExecute() {
    // TODO: Release the UI after the download is complete.
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      LogHelper.e(TAG, "Download Service onPostExecute ! ");
      try {
        // TODO: If you don't want to create downloadcallback implementation, input null into callback parameter
        DownloadCallbackImpl downloadCallback = new DownloadCallbackImpl(getApplicationContext());
        downloadTask = new PallyconDownloadTask(DownloadService.this,
            Uri.parse(intent_drm_content_uri_extra)
            , intent_downloadContentCid, DownloadService.this, eventHandler, downloadCallback);

        boolean result = downloadTask.isDownloadCompleted();

//        if(result){
//          mCallback.recvData(intent_downloadContentCid);
//        }
      } catch (PallyconDownloadException e) {
        Toast.makeText(DownloadService.this, e.getMessage(), Toast.LENGTH_LONG).show();
      } catch (NetworkConnectedException e) {
        e.printStackTrace();
      }
    }
  }

  @Override
  public void onProgressUpdate(String fileName, long downloadedSize, long totalSize, int percent,
      int totalCount, int currentCount) {
    // TODO: Use the download progress data to update the download UI in real time.
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

      Logger.e(TAG + " 1 onProgressUpdate fileName " + fileName + " percent " + percent);
      remoteViews.setProgressBar(R.id.DownloadServiceProgressBar, 100, percent, false);
      remoteViews.setTextViewText(R.id.Downloadservice_title_progress, percent + "%");

    }
  }

  @Override
  public void onProgressUpdate(String fileName, int totalCount, int currentCount, int percent) {
    // TODO: Use the download progress data to update the download UI in real time.
    Logger.e(TAG + " 2 onProgressUpdate fileName " + fileName + " percent " + percent);
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

  private PendingIntent pendingIntent(String clickinfo) {
    Intent newIntent = new Intent();
    newIntent.setAction(clickinfo);
    PendingIntent pIntent = PendingIntent.getBroadcast(this, 0, newIntent, 0);

    return pIntent;
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    return super.onStartCommand(intent, flags, startId);
  }

  @Override
  public IBinder onBind(Intent intent) {
    // TODO: Return the communication channel to the service.
    return mBinder;
  }

  @Override
  protected void onHandleIntent(@Nullable Intent intent) {

    String drm_content_uri_extra = intent.getStringExtra("drm_content_uri_extra");
    boolean drm_delete = intent.getBooleanExtra("drm_delete", false);
    String downloadContentCid = intent.getStringExtra("contentCid");

    intent_drm_content_uri_extra = drm_content_uri_extra;
    intent_downloadContentCid = downloadContentCid;
    intent_drm_delete = drm_delete;

    if (drm_delete) {
      // delete

      // TODO: Remove content file (mpd, video, audio).
      try {
        downloadTask = new PallyconDownloadTask(getApplicationContext(),
            Uri.parse(drm_content_uri_extra), downloadContentCid, DownloadService.this,
            eventHandler, null);
        downloadTask.removeDownloadContent();

        ContentManager().downloadDeleteFromcid(downloadContentCid);

        Handler mHandler = new Handler(getMainLooper());
        mHandler.post(new Runnable() {
          @Override
          public void run() {
            Toast.makeText(getApplicationContext(), R.string.info_dial_delete_download,
                Toast.LENGTH_LONG).show();
          }
        });

      } catch (PallyconDownloadException e) {
        Handler mHandler = new Handler(getMainLooper());
        mHandler.post(new Runnable() {
          @Override
          public void run() {
            Toast.makeText(getApplicationContext(), e.getMessage(), Toast.LENGTH_LONG).show();
          }
        });

        return;
      }

      return;

    } else {

      String expire_at = intent.getStringExtra("expire_at");
      String drm_content_name_extra = intent.getStringExtra("drm_content_name_extra");

      intent_drm_content_name_extra = drm_content_name_extra;
      mWebPlayerInfo = (WebPlayerInfo) intent.getSerializableExtra("webPlayerInfo");

      try {
        // TODO: If you don't want to create downloadcallback implementation, input null into callback parameter
        DownloadCallbackImpl downloadCallback = new DownloadCallbackImpl(getApplicationContext());
        downloadTask = new PallyconDownloadTask(DownloadService.this,
            Uri.parse(drm_content_uri_extra)
            , downloadContentCid, DownloadService.this, eventHandler, downloadCallback);

      } catch (PallyconDownloadException e) {

        Toast.makeText(DownloadService.this, e.getMessage(), Toast.LENGTH_LONG).show();
      }

      try {
        // TODO: Check that the content has already been downloaded.
        boolean result = downloadTask.isDownloadCompleted();
        if (result == true) {

          Handler mHandler = new Handler(getMainLooper());
          mHandler.post(new Runnable() {
            @Override
            public void run() {
              Toast.makeText(getApplicationContext(), R.string.info_dial_already_download,
                  Toast.LENGTH_SHORT).show();
            }
          });

        } else {

          // group key => cid v100015
          // ckey => cid v100015_001
          // userId => 94
          // drmSchemeUuid = > widevine , fairplay
          // drmLicenseUrl = >
          // cid
          // oid // no use
          // contentPath 저장소 경로 확인
          // totalSize 파일용량 정보
          // gTitle
          // cTitle
          // groupImg
          // thumbnailImg
          // audioVideoType => video-course , audiobook
          // groupTeacherName
          // cPlayTime
          // groupContentScnt
          // groupAllPlayTime
          // view_limitdate
          // modified  (datetime('now','localtime'))

          Uri LocalUri = downloadTask
              .getLocalUri(Uri.parse(drm_content_uri_extra), downloadContentCid);
          String localUrl = String.valueOf(LocalUri);

          String userId = Preferences.getWelaaaUserId(mcontext);

          for (int i = 0; i < mWebPlayerInfo.getCkey().length; i++) {
            if (mWebPlayerInfo.getCkey()[i].equals(downloadContentCid)) {

              try {
                if (ContentManager().existCid(mWebPlayerInfo.getCkey()[i])) {
                  // exist File !!
                } else {
                  ContentManager()
                      .downloadAdd(mWebPlayerInfo.getGroupId(), mWebPlayerInfo.getCkey()[i], userId,
                          "widevine", "drmUrl", mWebPlayerInfo.getCkey()[i], "", localUrl, "",
                          mWebPlayerInfo.getGroupTitle(), mWebPlayerInfo.getCname()[i],
                          mWebPlayerInfo.getGroupImg(), mWebPlayerInfo.getClist_img()[i],
                          mWebPlayerInfo.getCon_class(), mWebPlayerInfo.getGroupTeachername(),
                          mWebPlayerInfo.getCplayTime()[i], mWebPlayerInfo.getContentScnt(),
                          mWebPlayerInfo.getAllplayTime(), expire_at
                      );
                }
              } catch (Exception e) {
                e.printStackTrace();
              }
            }
          }

//          setDownloadServiceListener();
          doStuff(intent);
        }

      } catch (NetworkOnMainThreadException e) {
        e.printStackTrace();
        showSimpleDialog("Code Error", "you have got main thread network permission!");

      } catch (PallyconDownloadException e) {
        e.printStackTrace();
        showSimpleDialog("Download Error", e.getMessage());

      } catch (NetworkConnectedException e) {
        e.printStackTrace();
        showSimpleDialog("Network Error", e.getMessage());

      }
    }

//		setDownloadServiceListener();
//		doStuff(intent);
  }

  /****************************************************************************
   * remotevview 에서 사용할 브로드캐스트리시브  생성
   ****************************************************************************/
  public void setDownloadServiceListener() {
    playerBroadcastReceiver = new WelaaaBroadcastReceiver(this);
    IntentFilter filter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
//        filter.addAction(ACTION_PLAY);
    filter.addAction(ACTION_CLOSE);
    filter.addAction(ACTION_PAUSE);
//        filter.addAction(ACTION_GOPLAYER);
    this.registerReceiver(playerBroadcastReceiver, filter);
    playerBroadcastReceiver
        .setDownloadServiceListener(new WelaaaBroadcastReceiver.DownloadServiceListener() {

          @Override
          public void onCloseClick() {
            showMessage("stopDownload");
            stopped = true;
            stopSelf();

            downloadTask.terminate();
          }

          @Override
          public void onPauseClick() {
          }
        });
  }

  public void showMessage(String type) {
    if (type.equals("stopDownload") && !stopped) {
      Utils.logToast(getApplication(), " 다운로드가 중지 됩니다. ");

      // Activity Call Stop Download

    } else if (type.equals("endDateErr") && !stopped) {
      Utils.logToast(getApplication(), " 컨텐츠 사용기간에 오류로 이용이 불가능합니다. 관리자에게 문의 바랍니다. ");
    }
  }

  //콜백 인터페이스 선언
  public interface ICallback {

    void recvData(String cid); //액티비티에서 선언한 콜백 함수.
  }

  private ICallback mCallback;

  public void registerCallback(ICallback cb) {
    mCallback = cb;
  }

  /***********************************************
   * Comment   : 등록된 컨텐츠 매니저
   ***********************************************/
  public WeContentManager ContentManager() {
    MainApplication myApp = (MainApplication) getApplicationContext();
    return myApp.getContentMgr();
  }

  private void doStuff(Intent intent) {
    if (ContentManager().existCid(intent.getStringExtra("cid"))) {
      // download content exist
    } else {

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

        String drm_content_uri_extra = intent.getStringExtra("drm_content_uri_extra");
        String drm_content_name_extra = intent.getStringExtra("drm_content_name_extra");

        try {
          // TODO: If you don't want to create downloadcallback implementation, input null into callback parameter
          DownloadCallbackImpl downloadCallback = new DownloadCallbackImpl(getApplicationContext());
          downloadTask = new PallyconDownloadTask(DownloadService.this,
              Uri.parse(drm_content_uri_extra)
              , intent_downloadContentCid, DownloadService.this, eventHandler, downloadCallback);

        } catch (PallyconDownloadException e) {

          Toast.makeText(DownloadService.this, e.getMessage(), Toast.LENGTH_LONG).show();
        }

        try {
          // TODO: Check that the content has already been downloaded.
          boolean result = downloadTask.isDownloadCompleted();
          if (result == true) {
            // 다운로드 콘텐츠는 어떻게 할까 ? 가만히 ?
            Toast.makeText(DownloadService.this, "isExist File ", Toast.LENGTH_LONG).show();
          } else {
            // DownLoad !
            downloadTask.execute();

          }

        } catch (NetworkOnMainThreadException e) {
          e.printStackTrace();
          showSimpleDialog("Code Error", "you have got main thread network permission!");

        } catch (PallyconDownloadException e) {
          e.printStackTrace();
          showSimpleDialog("Download Error", e.getMessage());

        } catch (NetworkConnectedException e) {
          e.printStackTrace();
          showSimpleDialog("Network Error", e.getMessage());

        }

      } else {
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
    if (playerBroadcastReceiver != null) {
      this.unregisterReceiver(playerBroadcastReceiver);
      playerBroadcastReceiver = null;
    }

    stopForeground(true);
    stopSelf();
//		android.os.Process.killProcess(android.os.Process.myPid());
    super.onTaskRemoved(rootIntent);
  }

  @Override
  public boolean onUnbind(Intent intent) {
    Logger.i(TAG + ":onUnbind");
    return super.onUnbind(intent);
  }

  private void showSimpleDialog(String title, String message) {
    AlertDialog.Builder builder = new AlertDialog.Builder(this);
    builder.setTitle(title);
    builder.setMessage(message);
    builder.setPositiveButton("OK", null);
    Dialog dialog = builder.create();
    dialog.show();
  }
}
