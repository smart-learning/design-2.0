package kr.co.influential.youngkangapp.cast;

import android.content.Context;
import com.google.android.gms.cast.framework.CastOptions;
import com.google.android.gms.cast.framework.OptionsProvider;
import com.google.android.gms.cast.framework.SessionProvider;
import com.google.android.gms.cast.framework.media.CastMediaOptions;
import com.google.android.gms.cast.framework.media.NotificationOptions;
import java.util.List;
import kr.co.influential.youngkangapp.R;

//// Chromecast
public class CastOptionsProvider implements OptionsProvider {

  @Override
  public CastOptions getCastOptions(Context context) {
    NotificationOptions notificationOptions = new NotificationOptions.Builder()
        .setTargetActivityClassName(CastControllerActivity.class.getName())
        .build();
    CastMediaOptions mediaOptions = new CastMediaOptions.Builder()
        .setNotificationOptions(notificationOptions)
        .setExpandedControllerActivityClassName(CastControllerActivity.class.getName())
        .build();

    return new CastOptions.Builder()
        .setReceiverApplicationId(context.getString(R.string.app_id))
        .setStopReceiverApplicationWhenEndingSession(true)
        .setCastMediaOptions(mediaOptions)
        .build();
  }

  @Override
  public List<SessionProvider> getAdditionalSessionProviders(Context context) {
    return null;
  }
}
//// CC
