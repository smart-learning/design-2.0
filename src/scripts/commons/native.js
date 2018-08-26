import React from 'react';
import {NativeModules} from 'react-native';


const { RNNativePlayer } = NativeModules;


export default {


	play( id ){
		/* TODO: id를 이용하여 api에서 필요 정보 받아오는 과정 필요 */

		let args = {
			type: "streaming",
			uri: "https://contents.welaaa.com/media/v100015/DASH_v100015_001/stream.mpd",
			name: "지기지피 백전백승! 나의 발표 목적을 제일 먼저 고려하라",
			drmSchemeUuid: "widevine",
			drmLicenseUrl: "http://tokyo.pallycon.com/ri/licenseManager.do",
			userId: "93", // 825  , 
			cid: "v100015_001",
			oid: "",
			token: "", 
			webToken: "" 
		};


		setTimeout( ()=>{
			RNNativePlayer.play( args );
		}, 100 );

	}

}