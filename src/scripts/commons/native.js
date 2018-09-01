import React from "react";
import {NativeModules} from "react-native";

const {RNNativePlayer} = NativeModules;
import store from '../commons/store';


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
		}, 100);
	}
};
