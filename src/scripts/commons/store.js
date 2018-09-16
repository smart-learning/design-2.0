import React from 'react';
import {AsyncStorage} from "react-native";
import axios from 'axios';
import {observable} from "mobx";

let socialType;
let socialToken;
let welaaaAuth;
let currentMembership;

class Store {
	emitter = null;
	drawer = null;
	lastLocation = 'HomeScreen';
	prevLocations = [];

	@observable homeTabStatus = 'video';
	@observable initialRoute = {
		// initialRouteName: 'AuthCheck',
		gesturesEnabled: false
	}

	// 사용권한이 있는 페이지 정리
	authRequiredPages = ['AudioBookUsePage'];

	get socialType() {
		return socialType;
	}

	set socialType(type) {
		socialType = type;
		AsyncStorage.setItem('socialType', type);
	}

	get accessToken() {
		if (welaaaAuth === undefined) return '';
		return welaaaAuth.access_token;
	}

	get welaaaAuth() {
		return welaaaAuth;
	}

	set welaaaAuth(auth) {
		welaaaAuth = auth;
		AsyncStorage.setItem('welaaaAuth', JSON.stringify(auth));
		axios.defaults.headers.common['authorization'] = 'Bearer ' + auth.access_token;

		this.initialRoute = {
			gesturesEnabled: false
		}
	}

	get currentMembership() {
		return currentMembership;
	}

	set currentMembership(membership) {
		currentMembership = membership
	}

	/* 미니 플레이어 전환여부 결정 */
	@observable miniPlayerVisible = false;

	clearTokens = () => {
		socialType = null;
		socialToken = null;
		welaaaAuth = null;
		delete axios.defaults.headers.common['authorization']

		AsyncStorage.multiRemove(['socialType', 'socialToken', 'welaaaAuth']);
		this.initialRoute = {
			initialRouteName: 'AuthCheck',
			gesturesEnabled: false
		}
	}

	@observable currentMembership = {};
	@observable voucherStatus = {};
	@observable profile = {};

	/* 이벤트로 넘겨받은 다운로드받은 아이템 DB조회목록 */
	@observable downloadItems = {};

	/* 앱 설정 관련 정보 */
	@observable appSettings = {
		isAutoLogin: false,
		isWifiPlay: false,
		isWifiDownload: false,
		isAlert: false,
		isEmail: false,
	};

}

const store = new Store();
export default store;