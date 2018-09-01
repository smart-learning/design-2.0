import React from 'react';
import {NativeModules} from 'react-native';
import store from '../commons/store';
import globalStore from "./store";


const {RNNativePlayer} = NativeModules;

import {Alert} from 'react-native'

export default {
	play(cid, oid = '') {

		let userId = store.welaaaAuth.profile.id;
		let accessToken = store.welaaaAuth.access_token;

		/* TODO: id를 이용하여 api에서 필요 정보 받아오는 과정 필요 */

		if (!userId) {
			Alert.alert('비회원은 플레이할 수 없습니다.')

			return true
		}

		let args = {
			uri: '',
			name: '',
			drmSchemeUuid: 'widevine',
			drmLicenseUrl: 'http://tokyo.pallycon.com/ri/licenseManager.do',

			cid: cid,
			oid: oid,
			userId: "" + userId, // 825  ,
			token: accessToken // bearer token
		};

		console.log('native.play()', args)

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