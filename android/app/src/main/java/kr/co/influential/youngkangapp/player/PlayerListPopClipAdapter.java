package kr.co.influential.youngkangapp.player;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import kr.co.influential.youngkangapp.R;

import java.util.ArrayList;

public class PlayerListPopClipAdapter extends BaseAdapter {
	private final String TAG = "PlayerPopClipAdapter";
    private Context mContext;
	private PlayerActivity mController;
    private ArrayList<String> m_TotalTimeList;
	private ArrayList<String> m_PlayUrlList;
	private ArrayList<String> m_TitleList;

	private ArrayList<String> m_GroupTitleList;
	private ArrayList<String> m_TeacherNameList;
	private ArrayList<String> m_End_Time;
	private ArrayList<String> m_Type;

	private TextView playertitle;
	private int pos;

	public PlayerListPopClipAdapter(Context context, PlayerActivity controller){
		this.mContext = context.getApplicationContext();
		this.mController = controller;
		this.m_TotalTimeList = new ArrayList<String>();
		this.m_PlayUrlList = new ArrayList<String>();
		this.m_TitleList = new ArrayList<String>();
		this.m_GroupTitleList = new ArrayList<String>();
		this.m_TeacherNameList = new ArrayList<String>();
		this.m_End_Time = new ArrayList<String>();
		this.m_Type = new ArrayList<String>();
	}

	@Override
	public int getCount() {
		return this.m_PlayUrlList.size();
	}

	@Override
	public Object getItem(int position) {
		return m_PlayUrlList.get(position) ;
	}

	@Override
	public long getItemId(int position) {
		return position ;
	}

	@Override
	public int getItemViewType(int position)
	{
		return Integer.parseInt(m_Type.get(position));
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		    final int pos = position;

			int viewType = getItemViewType(position);

			LayoutInflater inflater = (LayoutInflater) mContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
			if(convertView==null) {
				convertView = inflater.inflate(R.layout.welean_related_item, parent, false);
			}


//			playertitle = (TextView) convertView.findViewById(R.id.titleTxt);
//			playertitle.setText(m_TitleList.get(pos).replaceAll("<br>",""));

			TextView groupTitleTxt = convertView.findViewById(R.id.related_Title);
			TextView teacherName = convertView.findViewById(R.id.related_teacherName);

			groupTitleTxt.setText(m_GroupTitleList.get(pos));
			teacherName.setText(m_TeacherNameList.get(pos));

//			if(m_End_Time.get(pos).equals("9999999")){
//
//				Log.e(TAG , "getCount " + getCount() );
//				Log.e(TAG ,Integer.toString(mController.getContentId()));
//				Log.e(TAG ,Integer.toString(pos));
//
//				// 재생 완료된 히스토리 !
////				ImageView btnimg = (ImageView) convertView.findViewById(R.id.playbtnimageview);
////				btnimg.setImageDrawable(Utils.getDrawable(mContext , R.drawable.icon_video_list_play_filled));
////				Glide.with(mContext).load(R.drawable.icon_video_list_play_filled).into(btnimg);
//			}

			//버튼을 터치 했을 때 이벤트 발생
			convertView.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {
					if(m_PlayUrlList.get(pos).contains(".mp4")) {

//						if(pos==mController.getContentId()){
//							mController.btnPlaylistClose();
//							mController.btnPlaylistClose_start();
//
//							mController.resetPlayList();
//
//						}else {
//							mController.playListOnclick(pos , m_End_Time.get(pos) );
//						}
					}

//					Utils.logToast(mContext , "m_PlayUrlList.get(pos) " + m_PlayUrlList.get(pos) + "," + m_TotalTimeList.get(pos) + " , " + m_End_Time.get(pos)) ;
				}
			});

		return convertView;
	}

	public void add(String _msg1, String _msg2, String _msg3, String _msg4 , String _msg5 , String _msg6 , String _msg7 ) {
		m_TotalTimeList.add(_msg1);
		m_PlayUrlList.add(_msg2);
		m_TitleList.add(_msg3);
		m_GroupTitleList.add(_msg4);
		m_TeacherNameList.add(_msg5);
		m_End_Time.add(_msg6);
		m_Type.add(_msg7);
	}

	public void remove(int _position1,int _position2,int _position3, int _position4 , int _position5 , int _position6 , int _position7) {
		m_TotalTimeList.remove(_position1);
		m_PlayUrlList.remove(_position2);
		m_TitleList.remove(_position3);
		m_GroupTitleList.remove(_position4);
		m_TeacherNameList.remove(_position5);
		m_End_Time.remove(_position6);
		m_Type.remove(_position7);
	}

}
