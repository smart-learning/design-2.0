import React from 'react';
import {NativeModules, Platform} from 'react-native';
import globalStore from '../commons/store';


const {RNNativePlayer} = NativeModules;

import {Alert} from 'react-native'

export default {
	play(cid, oid = '') {

		const {welaaaAuth} = globalStore;

		console.log('welaaaAuth:', welaaaAuth);

		/* TODO: id를 이용하여 api에서 필요 정보 받아오는 과정 필요 */
		if (welaaaAuth === undefined || welaaaAuth.profile === undefined || welaaaAuth.profile.id === undefined) {
			Alert.alert('비회원은 플레이할 수 없습니다.')

			return true
		}

		let userId = globalStore.welaaaAuth.profile.id;
		let accessToken = globalStore.welaaaAuth.access_token;

		let args = {
			uri: 'https://contents.welaaa.com/media/v200001/DASH_v200001_001/stream.mpd',
			name: '지기지피 백전백승! 나의 발표 목적을 제일 먼저 고려하라',
			drmSchemeUuid: 'widevine',
			drmLicenseUrl: 'http://tokyo.pallycon.com/ri/licenseManager.do',

			cid: cid,
			oid: oid,
			userId: "93",// + userId, // 825  ,
			token: accessToken // bearer token
		};

		if (Platform.OS === 'android') {
			;
		} else {
			args.cid = 'b100001_001';
			args.uri = 'https://contents.welaaa.com/media/b100001/HLS_b100001_001/master.m3u8';
		}

		console.log('native.play()', JSON.stringify(args));

		setTimeout(() => {

			try {
				RNNativePlayer.play(args);
			} catch (e) {
				alert(e);
			}
			// 2018.09.04 김중온
			// 미니 플레이어는 네이티브 상태 값으로 제어함.
			// this.toggleMiniPlayer(true);
		}, 100);

	},

	toggleMiniPlayer(bool) {
		console.log('toggleMiniPlayer:', bool);
		globalStore.miniPlayerVisible = bool;
	},


	download( args ) {
		// const params = {
		// 	type: 'download',
		// 	uri: 'https://contents.welaaa.com/media/v200001/DASH_v200001_001/stream.mpd',
		// 	name: '140년 지속 성장을 이끈 MLB 사무국의 전략',
		// 	drmSchemeUuid: 'widevine',
		// 	drmLicenseUrl: 'http://tokyo.pallycon.com/ri/licenseManager.do',
		// 	userId: globalStore.welaaaAuth.profile.id + '',
		// 	cid: 'v200064_001',
		// 	oid: 'order id',
		// 	token: globalStore.accessToken
		// }

		const params = {
			type: 'download',
			uri: args.contentPath || 'https://contents.welaaa.com/media/v200001/DASH_v200001_001/stream.mpd',
			name: args.gTitle,
			drmSchemeUuid: args.drmSchemeUuid,
			drmLicenseUrl: args.drmLicenseUrl,
			userId: globalStore.welaaaAuth.profile.id + '',
			cid: args.cid,
			oid: args.oid,
			token: globalStore.accessToken + ''
		}


		console.log( 'download:', params );
		RNNativePlayer.download( params );
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
	// isAutoLogin: false,
	// isWifiPlay: false,
	// isWifiDownload: false,
	// isAlert: false,
	// isEmail: false,
	updateSettings() {
		const {isWifiPlay, isWifiDownload} = globalStore.appSettings;
		let config = {
			token: globalStore.accessToken,
			cellularDataUsePlay: isWifiPlay,
			cellularDataUseDownload: isWifiDownload,
		}

		console.log('updateSetting:', config);

		return RNNativePlayer.setting(config);
	},

	updateSetting(key, bool) {

		switch (key) {
			case 'alert':
				Alert.alert('준비중입니다.');
				break;

			case 'email':
				Alert.alert('준비중입니다.');
				break;
		}
	},


	/* 앱 버전 정보 가져오기 */
	getVersionName() {
		try {
			return RNNativePlayer.versionInfo({
				webtokem: ''
			});
		} catch (e) {
			return '알 수 없음';
		}

		return 'salkdjfklsdjf;';

	}


}