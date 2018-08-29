import React, { Component } from 'react';
import { Button, Modal, Text, TouchableHighlight, View, NativeModules } from "react-native";
import CommonStyles from "../../styles/common";
import { SafeAreaView } from "react-navigation";
import { NAV_OPTS_DRAWER } from "../commons/nav";
import Localizable from 'react-native-localizable';
import Device from "../commons/device";

/*
* Acount: test/test
* http://www.media-drm.com/Demo1.aspx
* */
class PlaygroundJune extends Component {

	onPlay = () =>{
		// alert('play');
		//RNAudioPlayer.play("http://vprbbc.streamguys.net/vprbbc24-mobile.mp3");
		/*
		DRM-free mp4
		'http://welaaa.co.kr/splashmovie/welaaasplash_IOS.mp4'
		
		DRM-free HLS
		'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8'
		
		DRM HLS
		v100001_001 / https://contents.welaaa.com/media/v100001/HLS_v100001_001/master.m3u8

		v200001_001 / https://contents.welaaa.com/media/v200001/HLS_v200001_001/master.m3u8

		v200002_001 / https://contents.welaaa.com/media/v200002/HLS_v200002_001/master.m3u8
		 ~
		v200002_006 / https://contents.welaaa.com/media/v200002/HLS_v200002_006/master.m3u8
		
		v200003_001 / https://contents.welaaa.com/media/v200003/HLS_v200003_001/master.m3u8
		 ~
		v200003_006 / https://contents.welaaa.com/media/v200003/HLS_v200003_006/master.m3u8
		
		b300200_001 / https://contents.welaaa.com/media/b300200/HLS_b300200_001/master.m3u8
		 ~
		b300200_033 / https://contents.welaaa.com/media/b300200/HLS_b300200_033/master.m3u8
		
		b300201_001 / https://contents.welaaa.com/media/b300201/HLS_b300201_001/master.m3u8
		 ~
		b300201_009 / https://contents.welaaa.com/media/b300201/HLS_b300201_009/master.m3u8
		
		'sintel-trailer-480p' / 'https://contents.welaaa.com/public/contents/HLS_sintel-trailer-480p_mp4/master.m3u8'
		*/
		var args = {
			type : "streaming",
			uri: "https://contents.welaaa.com/media/b300200/HLS_b300200_001/master.m3u8",
			name: "140년 지속 성장을 이끈 MLB 사무국의 전략",
			drmSchemeUuid: "widevine",
			drmLicenseUrl: "http://tokyo.pallycon.com/ri/licenseManager.do",
			//userId: "valid-user",
			userId: "825",
			cid: "b300200_001",
			oid: "order id",
			token: "", // pallyCon token 
			webToken: "" // RN 에서 가져올 토큰 정보 , 서버 호출간 이용 
		}
		NativeModules.RNNativePlayer.play(args);
		//NativeModules.CreateContact.presentContact;
	}
	onDownload = () => {
		// alert('play');
		// RNAudioPlayer.play("http://vprbbc.streamguys.net/vprbbc24-mobile.mp3");
		var args = {
			uri: "uri",
			DOWNLOAD_SERVICE_TYPE: "false"

		}

		try {
			NativeModules.RNNativePlayer.download(args);
		}catch (e) {
			alert('실패');
		}

	}


	onDownloadDelete = () => {
		// alert('play');
		// RNAudioPlayer.play("http://vprbbc.streamguys.net/vprbbc24-mobile.mp3");
		var args = {
			uri: "uri",
			DOWNLOAD_SERVICE_TYPE: "true"
		}

		try {
			NativeModules.RNNativePlayer.downloadDelete(args);
		}catch (e) {
			alert('실패');
		}


	}

	getNativeVariable = () =>{
		alert( `host_debug: ${Localizable.host_debug} \n\n host_release: ${Localizable.host_release}` );
	}

	onPurchase = () =>{
		// args는 appstoreconnect.apple.com에서 앱내구입 product_id를 참고바랍니다.
		/*
		 * audiobook_b300048 / 0~5세 말걸기 육아의 힘 / sandbox 테스트 잘 안됨..
		 * audiobook_100 / 톰 소여의 모험 / 
		 */
		var args = {
			product_id : "audiobook_101",	//0~5세 말걸기 육아의 힘
			webToken : "" // RN 에서 가져올 토큰 정보 , 서버 호출간 이용 
		}
		NativeModules.RNProductPayment.buy(args);
	}

	render() {

		return <SafeAreaView style={[CommonStyles.container, { backgroundColor: '#cccccc' }]}>

			<Text>VIDEO TEST</Text>

			<Button title="재생"
				onPress={this.onPlay}
			/>

			<Button title="RN => DownloadService Call"
				onPress={this.onDownload}
			/>

			<Button title="RN => Delete DownloadService Call"
				onPress={this.onDownloadDelete}
			/>

			<Button title="디바이스 언어 가져오기"
				onPress={ ()=>{ alert( Device.getLocale() ) } }
			/>

			<Button title="BuildMode가 DEBUG인지 아닌지 확인"
				onPress={()=>{ alert( __DEV__ ) }}
			/>

			<Button title="저장된 host 변수 가져오기"
				onPress={ this.getNativeVariable }
			/>

			<Button title="인앱결제"
					onPress={ this.onPurchase }
			/>
			
			{/* <ImageView
				style={{ width:100, height:100 }}
				src={[{ uri: "https://pbs.twimg.com/tweet_video_thumb/Dg3sOjuV4AEtzIR.jpg", width:100, height:100}]}
			/> */}

		</SafeAreaView >
	}
}

PlaygroundJune.navigationOptions = NAV_OPTS_DRAWER;

export default PlaygroundJune;