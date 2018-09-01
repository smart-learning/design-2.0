import React from 'react';
import {NativeModules} from 'react-native';
import globalStore from "./store";


const {RNNativePlayer} = NativeModules;


export default {


	play(id) {
		/* TODO: id를 이용하여 api에서 필요 정보 받아오는 과정 필요 */

		let args = {
			type: "streaming",
			uri: "https://contents.welaaa.com/media/v100015/DASH_v100015_001/stream.mpd",
			name: "지기지피 백전백승! 나의 발표 목적을 제일 먼저 고려하라",
			drmSchemeUuid: "widevine",
			drmLicenseUrl: "http://tokyo.pallycon.com/ri/licenseManager.do",
			userId: "93", // 825  , 
			cid: "v100015_001",
			oid: '',
			token: globalStore.accessToken,
			webToken: ''
		};


		setTimeout(() => {
			RNNativePlayer.play(args);


			this.toggleMiniPlayer(true);
		}, 100);

	},

	toggleMiniPlayer(bool) {
		// globalStore.miniPlayerVisible = bool;
		// RNNativePlayer.toast('playbackState: ' + bool);
	},


	download() {
		const args = {
			type: 'download',
			uri: 'https://contents.welaaa.com/media/v100015/DASH_v100015_001/stream.mpd',
			name: '140년 지속 성장을 이끈 MLB 사무국의 전략',
			drmSchemeUuid: 'widevine',
			drmLicenseUrl: 'http://tokyo.pallycon.com/ri/licenseManager.do',
			userId: '93',  // 
			cid: 'v100015_001',
			oid: 'order id',
			token: globalStore.accessToken
		}

		RNNativePlayer.download(args);
	},

	deleteDownloadItem() {
		const args = {
			uri: "uri",
			DOWNLOAD_SERVICE_TYPE: "true"
		}

		try {
			RNNativePlayer.downloadDelete(args);
		} catch (e) {
			alert('실패');
		}
	},


	/* 내정보 > 설정 메뉴에서 호출 */
	/* Native 담당: cellularDataUsePlay: bool, cellularDataUseDownload: bool
	*  ReactN 담당: autologin: bool, notification: bool
	* */
	updateSetting(key, bool) {
		switch (key) {
			case 'cellularDataUsePlay':
			case 'cellularDataUseDownload':
				return RNNativePlayer.setting({
					key: bool,
					token: globalStore.accessToken
				});
				break;

			case 'autologin':
				alert('준비중입니다.');
				break;
			case 'notification':
				alert('준비중입니다.');
				break;
		}

	},

	/* 앱 버전 정보 가져오기 */
	getVersionName() {
		return RNNativePlayer.versionInfo({
			webtokem: ''
		});
	}


}