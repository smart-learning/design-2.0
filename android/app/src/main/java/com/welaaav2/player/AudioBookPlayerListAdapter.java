package com.welaaav2.player;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.welaaav2.R;

import java.util.ArrayList;

public class AudioBookPlayerListAdapter extends BaseAdapter {
	private final String TAG = "PlayerListAdapter";
    private Context mContext;
	private PlayerActivity mController;
    private ArrayList<String>  m_TotalTimeList;
	private ArrayList<String>  m_PlayUrlList;
	private ArrayList<String>  m_TitleList;

	private ArrayList<String> m_GroupTitleList;
	private ArrayList<String> m_TeacherNameList;
	private ArrayList<String> m_End_Time;
	private ArrayList<String> m_Type;

	private TextView playertitle;
	private int pos;

	public AudioBookPlayerListAdapter(Context context, PlayerActivity controller){
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
	public Object getItem(int i) {
		return m_PlayUrlList.get(i);
	}

	@Override
	public long getItemId(int i) {
		return i;
	}

	// 인자로 넘어온 값에 해당하는 뷰의 타입을 반환하는 메서드
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
				if(viewType == 1){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type1, parent, false);
				}else if(viewType == 2){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type2, parent, false);
				}else if(viewType == 3){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type3, parent, false);
				}else if(viewType == 4){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type4, parent, false);
				}else if(viewType == 5){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type5, parent, false);
				}else if(viewType == 6){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type6, parent, false);
				}else if(viewType == 7){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type7, parent, false);
				}else if(viewType == 8){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type8, parent, false);
				}else if(viewType == 9){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type9, parent, false);
				}else if(viewType == 10){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type10, parent, false);
				}else if(viewType == 11){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type11, parent, false);
				}else if(viewType == 12){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type12, parent, false);
				}else if(viewType == 13){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type13, parent, false);
				}else if(viewType == 14){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type14, parent, false);
				}else if(viewType == 15){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type15, parent, false);
				}else if(viewType == 16){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type16, parent, false);
				}else if(viewType == 17){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type17, parent, false);
				}else if(viewType == 18){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type18, parent, false);
				}else if(viewType == 19){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type19, parent, false);
				}else if(viewType == 19){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type19, parent, false);
				}else if(viewType == 20){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type20, parent, false);
				}else if(viewType == 21){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type21, parent, false);
				}else if(viewType == 22){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type22, parent, false);
				}else if(viewType == 23){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type23, parent, false);
				}else if(viewType == 24){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type24, parent, false);
				}else if(viewType == 25){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type25, parent, false);
				}else if(viewType == 26){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type26, parent, false);
				}else if(viewType == 27){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type27, parent, false);
				}else if(viewType == 28){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type28, parent, false);
				}else if(viewType == 29){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type29, parent, false);
				}else if(viewType == 30){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type30, parent, false);
				}else if(viewType == 31){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type31, parent, false);
				}else if(viewType == 32){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type32, parent, false);
				}else if(viewType == 33) {
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type33, parent, false);
				}
			}else{
				if(viewType == 1){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type1, parent, false);
				}else if(viewType == 2){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type2, parent, false);
				}else if(viewType == 3){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type3, parent, false);
				}else if(viewType == 4){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type4, parent, false);
				}else if(viewType == 5){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type5, parent, false);
				}else if(viewType == 6){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type6, parent, false);
				}else if(viewType == 7){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type7, parent, false);
				}else if(viewType == 8){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type8, parent, false);
				}else if(viewType == 9){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type9, parent, false);
				}else if(viewType == 10){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type10, parent, false);
				}else if(viewType == 11){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type11, parent, false);
				}else if(viewType == 12){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type12, parent, false);
				}else if(viewType == 13){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type13, parent, false);
				}else if(viewType == 14){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type14, parent, false);
				}else if(viewType == 15){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type15, parent, false);
				}else if(viewType == 16){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type16, parent, false);
				}else if(viewType == 17){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type17, parent, false);
				}else if(viewType == 18){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type18, parent, false);
				}else if(viewType == 19){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type19, parent, false);
				}else if(viewType == 20){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type20, parent, false);
				}else if(viewType == 21){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type21, parent, false);
				}else if(viewType == 22){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type22, parent, false);
				}else if(viewType == 23){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type23, parent, false);
				}else if(viewType == 24){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type24, parent, false);
				}else if(viewType == 25){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type25, parent, false);
				}else if(viewType == 26){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type26, parent, false);
				}else if(viewType == 27){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type27, parent, false);
				}else if(viewType == 28){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type28, parent, false);
				}else if(viewType == 29){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type29, parent, false);
				}else if(viewType == 30){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type30, parent, false);
				}else if(viewType == 31){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type31, parent, false);
				}else if(viewType == 32){
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type32, parent, false);
				}else if(viewType == 33) {
					convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type33, parent, false);
				}
			}

			if(viewType == 1){
				playertitle = convertView.findViewById(R.id.titleTxt);
				playertitle.setText(m_TitleList.get(pos).replaceAll("<br>",""));
			}else if(viewType == 2 || viewType == 7 || viewType == 8 || viewType == 31 || viewType == 32|| viewType == 33){
				playertitle = convertView.findViewById(R.id.titleTxt);
				playertitle.setText(m_TitleList.get(pos).replaceAll("<br>",""));

//				convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type2, parent, false);
				TextView totalTime = convertView.findViewById(R.id.totalTime);
				totalTime.setText(m_TotalTimeList.get(pos));

				//버튼을 터치 했을 때 이벤트 발생
				convertView.setOnClickListener(new View.OnClickListener() {
					@Override
					public void onClick(View v) {
						if(m_PlayUrlList.get(pos).contains(".mp4")) {
//							if(pos==mController.getContentId()){
//								mController.btnPlaylistClose();
//								mController.btnPlaylistClose_start();
//							}else {
//								mController.playListOnclickAudio(pos , m_End_Time.get(pos) );
////								mController.setAudioBookScroll(pos);
//								mController.setLectureItem();
//							}
						}
					}
				});

			}else if(viewType == 3 ){
				playertitle = convertView.findViewById(R.id.titleTxt);
				playertitle.setText(m_TitleList.get(pos).replaceAll("<br>",""));

			}else if(viewType == 4|| viewType == 9 || viewType == 10 || viewType == 13|| viewType == 14 || viewType == 15
					|| viewType == 19 || viewType == 20 || viewType == 21 || viewType == 22 || viewType == 23 || viewType == 24   ) {
				playertitle = convertView.findViewById(R.id.titleTxt);
				playertitle.setText(m_TitleList.get(pos).replaceAll("<br>",""));
//				convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type4, parent, false);
				TextView totalTime = convertView.findViewById(R.id.totalTime);
				totalTime.setText(m_TotalTimeList.get(pos));

				//버튼을 터치 했을 때 이벤트 발생
				convertView.setOnClickListener(new View.OnClickListener() {
					@Override
					public void onClick(View v) {
						if(m_PlayUrlList.get(pos).contains(".mp4")) {
//							if(pos==mController.getContentId()){
//								mController.btnPlaylistClose();
//								mController.btnPlaylistClose_start();
//							}else {
//								mController.playListOnclickAudio(pos , m_End_Time.get(pos) );
////								mController.setAudioBookScroll(pos);
//								mController.setLectureItem();
//							}
						}
					}
				});

			}else if(viewType == 5 ){
				playertitle = convertView.findViewById(R.id.titleTxt);
				playertitle.setText(" "+m_TitleList.get(pos).replaceAll("<br>",""));
			}else if(viewType == 6|| viewType == 11 || viewType == 12|| viewType == 16|| viewType == 17|| viewType == 18
					|| viewType == 25 || viewType == 26 || viewType == 27 || viewType == 28 || viewType == 29 || viewType == 30    ){
				playertitle = convertView.findViewById(R.id.titleTxt);
				playertitle.setText(" "+m_TitleList.get(pos).replaceAll("<br>",""));
//				convertView = inflater.inflate(R.layout.welean_audio_playlist_item_type6, parent, false);
				TextView totalTime = convertView.findViewById(R.id.totalTime);
				totalTime.setText(m_TotalTimeList.get(pos));

				//버튼을 터치 했을 때 이벤트 발생
				convertView.setOnClickListener(new View.OnClickListener() {
					@Override
					public void onClick(View v) {
						if(m_PlayUrlList.get(pos).contains(".mp4")) {
//							if(pos==mController.getContentId()){
//								mController.btnPlaylistClose();
//								mController.btnPlaylistClose_start();
//							}else {
//								mController.playListOnclickAudio(pos , m_End_Time.get(pos) );
////								mController.setAudioBookScroll(pos);
//
//								mController.setLectureItem();
//							}
						}
					}
				});
			}

		return convertView;
	}

	public void add(String _msg1,String _msg2,String _msg3,String _msg4 , String _msg5 , String _msg6 , String _msg7) {
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
