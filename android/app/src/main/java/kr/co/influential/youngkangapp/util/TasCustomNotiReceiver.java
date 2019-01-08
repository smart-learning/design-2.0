package kr.co.influential.youngkangapp.util;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.apms.sdk.bean.PushMsg;
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import kr.co.influential.youngkangapp.player.utils.LogHelper;

public class TasCustomNotiReceiver extends BroadcastReceiver{

  static boolean isBackgroundNotficationIntent(Intent intent) {
    return intent.getExtras() != null && intent.hasExtra("action") && intent.hasExtra("notification");
  }

  @Override
  public void onReceive(Context context, Intent intent) {
    // notification 터치 시에 “push notiMsg:${notiMsg}” 라는 텍스트를 Toast로 출력합니다.
//    Toast.makeText(context, "push notiMsg:" + intent.getStringExtra(APMS.KEY_NOTI_MSG),
//        Toast.LENGTH_SHORT).show();

    PushMsg pushMsg = new PushMsg(intent.getExtras());

//    pushMsg.msgId // 메세지 ID
//    pushMsg.notiTitle // notification에 출력될 타이틀
//    pushMsg.notiMsg // notification에 출력될 메시지 내용
//    pushMsg.notiImg // notification에 출력될 이미지 URL
//    pushMsg.message // (리치) 푸시 내용
//    pushMsg.sound // 푸시 수신 시 출력될 사운드
//    pushMsg.msgType // 메시지 타입 : H – html, T – Text, L – Link
//    pushMsg.popupFlag // Popup 창을 뛰울지 말지 결정 Flag (Y & N)
//    pushMsg.data // 추가 데이터

//    {"l":"welaaa:\/\/membership"}

    if (Utils.isAppInForeground(context)) {

      WritableMap event = Arguments.createMap();
      event.putString("TAS_CUSTOM_DATA", pushMsg.data);

      ReactApplication reactApplication =  (ReactApplication)context.getApplicationContext();
      ReactContext reactContext = reactApplication.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();

      reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(
          "tasLandingUrlHandler",
          event);

    }else{
      Intent startIntent = context
          .getPackageManager()
          .getLaunchIntentForPackage(context.getPackageName());

      startIntent.setFlags(
          Intent.FLAG_ACTIVITY_REORDER_TO_FRONT |
              Intent.FLAG_ACTIVITY_NEW_TASK |
              Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
      );

      startIntent.putExtra("TAS_CUSTOM_DATA" , pushMsg.data);

      Preferences.setWelaaaTasLandingUrl(context , pushMsg.data);
      LogHelper.e("notificationOpen" , "notificationOpen tas url " + Preferences.getWelaaaTasLandingUrl(context) );

      context.startActivity(startIntent);
    }
  }
}
