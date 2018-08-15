import React from 'react';
import {NativeModules} from 'react-native';


const { RNNativePlayer } = NativeModules;


export default {


	play( id ){
		/* TODO: id를 이용하여 api에서 필요 정보 받아오는 과정 필요 */

		let args = {
			type: "streaming",
			uri: "https://contents.welaaa.com/public/contents/HLS_0028_007_mp4/master.m3u8",
			name: "140년 지속 성장을 이끈 MLB 사무국의 전략",
			drmSchemeUuid: "widevine",
			drmLicenseUrl: "http://tokyo.pallycon.com/ri/licenseManager.do",
			userId: "valid-user",
			cid: "0028_007",
			oid: "order id",
			token: "", // pallyCon token
			webToken: "" // RN 에서 가져올 토큰 정보 , 서버 호출간 이용
		};


		setTimeout( ()=>{
			RNNativePlayer.play( args );
		}, 100 );

	}

}