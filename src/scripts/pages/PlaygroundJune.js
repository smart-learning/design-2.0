import React, { Component } from 'react';
import {Button, Modal, Text, TouchableHighlight, View, NativeModules} from "react-native";
import CommonStyles from "../../styles/common";
import {SafeAreaView} from "react-navigation";
//mport { ImageView, RNAudioPlayer} from 'rnn-module-ui-sample';
import {NAV_OPTS_DRAWER} from "../commons/nav";
import VideoScreen from "./video/VideoScreen";

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
		'0028_001' / 'https://contents.welaaa.com/public/contents/HLS_0028_001_mp4/master.m3u8'
		'0028_002' / 'https://contents.welaaa.com/public/contents/HLS_0028_002_mp4/master.m3u8'
		'0028_003' / 'https://contents.welaaa.com/public/contents/HLS_0028_003_mp4/master.m3u8'
		'0028_004' / 'https://contents.welaaa.com/public/contents/HLS_0028_004_mp4/master.m3u8'
		'0028_005' / 'https://contents.welaaa.com/public/contents/HLS_0028_005_mp4/master.m3u8'
		'0028_006' / 'https://contents.welaaa.com/public/contents/HLS_0028_006_mp4/master.m3u8'
		'0028_007' / 'https://contents.welaaa.com/public/contents/HLS_0028_007_mp4/master.m3u8'
		'sintel-trailer-480p' / 'https://contents.welaaa.com/public/contents/HLS_sintel-trailer-480p_mp4/master.m3u8'
		*/
		var args = {
			type : "streaming",
			uri: "https://contents.welaaa.com/public/contents/HLS_0028_007_mp4/master.m3u8",
			name: "140년 지속 성장을 이끈 MLB 사무국의 전략",
			drmSchemeUuid: "widevine",
			drmLicenseUrl: "http://tokyo.pallycon.com/ri/licenseManager.do",
			userId: "valid-user",
			cid: "0028_007",
			oid: "order id",
			token: "", // pallyCon token 
			webToken: "" // RN 에서 가져올 토큰 정보 , 서버 호출간 이용 
		}
		NativeModules.RNNativePlayer.play(args);
		//NativeModules.CreateContact.presentContact;
	}

	onDownload = () =>{
		// alert('play');
		//RNAudioPlayer.play("http://vprbbc.streamguys.net/vprbbc24-mobile.mp3");
		/*
		DRM-free mp4
		'http://welaaa.co.kr/splashmovie/welaaasplash_IOS.mp4'
		
		DRM-free HLS
		'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8'
		
		DRM HLS
		'0028_001' / 'https://contents.welaaa.com/public/contents/HLS_0028_001_mp4/master.m3u8'
		'0028_002' / 'https://contents.welaaa.com/public/contents/HLS_0028_002_mp4/master.m3u8'
		'0028_003' / 'https://contents.welaaa.com/public/contents/HLS_0028_003_mp4/master.m3u8'
		'0028_004' / 'https://contents.welaaa.com/public/contents/HLS_0028_004_mp4/master.m3u8'
		'0028_005' / 'https://contents.welaaa.com/public/contents/HLS_0028_005_mp4/master.m3u8'
		'0028_006' / 'https://contents.welaaa.com/public/contents/HLS_0028_006_mp4/master.m3u8'
		'0028_007' / 'https://contents.welaaa.com/public/contents/HLS_0028_007_mp4/master.m3u8'
		'sintel-trailer-480p' / 'https://contents.welaaa.com/public/contents/HLS_sintel-trailer-480p_mp4/master.m3u8'
		*/
		var args = {
			type : "streaming",
			uri: "https://contents.welaaa.com/public/contents/HLS_0028_007_mp4/master.m3u8",
			name: "140년 지속 성장을 이끈 MLB 사무국의 전략",
			drmSchemeUuid: "FairPlay",
			drmLicenseUrl: "http://tokyo.pallycon.com/ri/licenseManager.do",
			userId: "valid-user",
			cid: "0028_007",
			oid: "order id",
			token: "", // pallyCon token 
			webToken: "" // RN 에서 가져올 토큰 정보 , 서버 호출간 이용 
		}
		NativeModules.RNNativePlayer.download(args);
	}

	onPurchase = () =>{
		// args는 appstoreconnect.apple.com에서 앱내구입 product_id를 참고바랍니다.
		var args = {
			product_id : "audiobook_b300048"
		}
		NativeModules.RNProductPayment.buy(args);
	}




    render() {




        return <SafeAreaView style={[ CommonStyles.container, {backgroundColor: '#cccccc'}]}>

            <Text>VIDEO TEST</Text>

			<Button title="재생"
					onPress={ this.onPlay }
			/>

			<Button title="다운로드"
					onPress={ this.onDownload }
			/>

			<Button title="인앱결제"
					onPress={ this.onPurchase }
			/>
{/*
			<ImageView
				style={{ width:100, height:100 }}
				src={[{ uri: "https://pbs.twimg.com/tweet_video_thumb/Dg3sOjuV4AEtzIR.jpg", width:100, height:100}]}
			/>
*/}
        </SafeAreaView>
    }
}

PlaygroundJune.navigationOptions = NAV_OPTS_DRAWER;

export default PlaygroundJune;
