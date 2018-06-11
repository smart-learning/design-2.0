import React from 'react';
import { observable } from 'mobx';
import HeaderWithSearch from "./HeaderWithSearch";
import SearchButton from "./SearchButton";
import {Image} from "react-native";
import CommonStyle from "../../styles/common";



// 네비게이션 기본 속성 옵션
export const NAV_OPTS_COMMON = {
	headerStyle: {
		backgroundColor: '#00b870',
		paddingLeft: 15,
		paddingRight: 15,
	},
	headerTintColor: '#fff',
	headerTitleStyle: {
		fontWeight: 'bold',
	},
};

export const NAV_OPTS_MAIN = ({ navigation, navigationOptions })=>({
	headerTitle: <HeaderWithSearch/>
});

export const NAV_OPTS_EACH = ({ navigation, navigationOptions} )=>{
	return {
		headerTitle: navigation.state.routeName,
		headerRight: <SearchButton/>
	}
}


const DRAWER_LABEL = {
	HomeScreen:{
		label:'홈',
		icon: require('../../images/chats-icon.png')
	},

	VideoScreen:{
		label:'동영상 강의',
		icon: require('../../images/chats-icon.png')
	},

	AudioScreen:{
		label:'오디오북',
		icon: require('../../images/chats-icon.png')
	},

	MyScreen:{
		label:'마이윌라',
		icon: require('../../images/chats-icon.png')
	}
}

export const NAV_OPTS_DRAWER = ({navigation, navigationOptions})=>{

	let { label, icon } = DRAWER_LABEL[navigation.state.key] || { label: navigation.state.key, icon: require('../../images/chats-icon.png') };

	return {
		drawerLabel: label,
		drawerIcon: ({ tintColor }) => (
			<Image
				source={ icon }
				style={[ CommonStyle.size24, { tintColor: tintColor }]}/>
		)
	}
}








class Store{

    @observable drawer = null;

}


const store = new Store();
export default store;