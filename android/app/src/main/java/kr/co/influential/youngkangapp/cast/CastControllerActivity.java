package kr.co.influential.youngkangapp.cast;

import android.view.Menu;

import com.google.android.gms.cast.framework.CastButtonFactory;
import com.google.android.gms.cast.framework.media.widget.ExpandedControllerActivity;
import kr.co.influential.youngkangapp.R;

//// Chromecast
public class CastControllerActivity extends ExpandedControllerActivity {
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);
		getMenuInflater().inflate(R.menu.browse, menu);
		CastButtonFactory.setUpMediaRouteButton(getApplicationContext(), menu, R.id.media_route_menu_item);
		return true;
	}
}
//// CC
