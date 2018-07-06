import React from 'react';
import { observable } from 'mobx';
import {AsyncStorage} from "react-native";

class Store{
    drawer = null;
    lastLocation = 'HomeScreen';

    token = null;
    tokenType = null;
	setToken = ( type, token )=>{

		this.token = token;
		this.tokenType = type;

		AsyncStorage.multiSet([['token', token], ['tokenType', type]]);
	}

	clearToken=()=>{
		AsyncStorage.multiRemove(['token', 'tokenType']);
	}

	@observable auth = undefined;

}

console.log( '<<<<<< new Store >>>>');

const store = new Store();
export default store;