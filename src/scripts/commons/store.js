import React from 'react';
import { AsyncStorage } from "react-native";
import axios from 'axios';
import { observable } from "mobx";

let socialType;
let socialToken;
let welaaaAuth;

class Store {
    drawer = null;
    lastLocation = 'HomeScreen';

    get socialType() {
		return socialType;
	}

	set socialType( type ) {
		socialType = type;
		AsyncStorage.setItem('socialType', type );
	}

	get accessToken() {
    	if( welaaaAuth === undefined ) return '';
		return welaaaAuth.access_token;
	}

	get welaaaAuth() {
    	return welaaaAuth;
	}

	set welaaaAuth( auth ) {
		welaaaAuth = auth;
		AsyncStorage.setItem('welaaaAuth', JSON.stringify(auth) );
		axios.defaults.headers.common[ 'authorization' ] = 'Bearer ' + auth.access_token;
	}

	/* 미니 플레이어 전환여부 결정 */
	@observable miniPlayerVisible = false;

	clearTokens=()=>{
		socialType = null;
		socialToken = null;
		welaaaAuth = null;

		AsyncStorage.multiRemove(['socialType', 'socialToken', 'welaaaAuth']);
	}

	@observable profile = {};
}

const store = new Store();
export default store;