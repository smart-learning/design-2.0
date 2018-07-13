import React from 'react';
import { observable } from 'mobx';
import {AsyncStorage} from "react-native";
import axios from 'axios';

let socialType;
let socialToken;
let welaaaAuth;

class Store{
    drawer = null;
    lastLocation = 'HomeScreen';

    get socialType() {
		return socialType;
	}

	set socialType( type ) {
		socialType = type;
		AsyncStorage.setItem('socialType', type );
	}

	get socialToken() {
		return socialToken;
	}

	set socialToken( token ) {
		socialToken = token;
		AsyncStorage.setItem('socialToken', token );
	}

	get welaaaAuth() {
    	return welaaaAuth;
	}

	set welaaaAuth( auth ) {
		welaaaAuth = auth;
		AsyncStorage.setItem('welaaaAuth', auth );
		axios.defaults.headers.common[ 'Authorization' ] = 'Bearer ' + auth.access_token;
	}

	clearTokens=()=>{
		socialType = null;
		socialToken = null;
		welaaaAuth = null;

		AsyncStorage.multiRemove(['socialType', 'socialToken', 'welaaaAuth']);
	}

	@observable auth = undefined;

	@observable authToken = undefined;
}

console.log( '<<<<<< new Store >>>>');

const store = new Store();
export default store;