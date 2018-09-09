// 네비게이션 기본 속성 옵션
import React from "react";
import {Button, Text} from "react-native";
import CommonStyle from "../../styles/common";
import SearchButton from "../components/header/SearchButton";
import {Image, View} from "react-native";
import HomeButton from "../components/header/HomeButton";
import logo from "../../images/logo-white.png"
import IcAngleRight from "../../images/ic-angle-right-primary.png";
import HistoryBackButton from "../components/header/HistoryBackButton";

export const NAV_OPTS_COMMON = {
	headerStyle: {
		backgroundColor: CommonStyle.COLOR_PRIMARY,
	},
	headerTintColor: '#fff',
	headerTitleStyle: {
		fontSize: 16,
		fontWeight: 'bold',
	}
};

export const NAV_OPTS_MAIN = ({navigation, navigationOptions}) => ({
	headerLeft: <HomeButton/>,
	headerTitle: <Image source={logo} style={CommonStyle.headerLogo}/>,
	headerRight: <SearchButton/>
});

export const NAV_OPTS_STACK = ({navigation, navigationOptions}) => {
	return {
		...NAV_OPTS_COMMON,
		title: (navigation.state.params && navigation.state.params.title) || navigation.state.routeName,
	}
};

export const NAV_OPTS_STACK_WITH_SEARCH = ({navigation, navigationOptions}) => {
	return {
		title: (navigation.state.params && navigation.state.params.title) || navigation.state.routeName,
		headerRight: <SearchButton/>,
		headerLeft: <HomeButton/>
	}
};

export const NAV_OPTS_STACK_HISTORY_BACK = ({navigation, navigationOptions}) => {
	return {
		...NAV_OPTS_COMMON,
		title: (navigation.state.params && navigation.state.params.title) || navigation.state.routeName,
		headerRight: <SearchButton/>,
		headerLeft: <HistoryBackButton/>
	}
};

export const NAV_OPTS_MY_HOME = ({navigation, navigationOptions}) => {

	return {
		headerStyle: {
			top: 0,
			left: 0,
			right: 0,
			backgroundColor: 'transparent',
			paddingLeft: 20,
			paddingRight: 20,
			borderBottomWidth: 0,
		},
		headerLeft: <HomeButton/>,
		headerTitle: <Image source={logo} style={CommonStyle.headerLogo}/>,
		headerRight: <Button title="설정버튼" onPress={() => alert('설쩡')}/>,
		gesturesEnabled: false,
	}

};


const DRAWER_LABEL = {
	HomeScreen: {
		label: '홈',
		icon: require('../../images/chats-icon.png')
	},

	VideoScreen: {
		label: '동영상 강의',
		icon: require('../../images/chats-icon.png')
	},

	AudioScreen: {
		label: '오디오북',
		icon: require('../../images/chats-icon.png')
	},

	MyScreen: {
		label: '마이윌라',
		icon: require('../../images/chats-icon.png')
	}
}

export const NAV_OPTS_DRAWER = ({navigation, navigationOptions}) => {

	let {label, icon} = DRAWER_LABEL[navigation.state.key] || {
		label: navigation.state.key,
		icon: require('../../images/chats-icon.png')
	};


	let option = {
		drawerLabel: label,
		drawerIcon: ({tintColor, focused}) => (<Image
				source={icon}
				style={[CommonStyle.size24, {tintColor: tintColor}]}/>
		)
	};


	// TODO: Custom Drawer 메뉴 구현( June으로 샘플구현해둠 ) drawLabel 에 react element 를 반환하는함수를 재정의
	// README: https://reactnavigation.org/docs/en/drawer-navigator.html
	// if (label === "June") {
	// 	console.log('커스텀 메뉴 생성');
	// 	option = {
	// 		drawerLabel: () => (<View style={{flex: 1, backgroundColor: '#FF0000'}}>
	// 				<Text>커스텀 드로어 메뉴 ~~~~ </Text>
	// 			</View>
	// 		)
	// 	}
	// }

	if (label === '홈') {
		option = {
			drawerLabel: () => (<View style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'relative',
					height: 65,
					backgroundColor: '#ffffff',
				}}>
					<Text style={{paddingLeft: 15, fontSize: 15, color: '#333333'}}>홈</Text>
					<Image source={IcAngleRight} style={{width: 9, height: 14, marginRight: 15,}}/>
					<View style={{position: 'absolute', left: 0, bottom: 0, width: '100%', height: 1, backgroundColor: '#dddddd' }}/>
				</View>
			)
		}
	}
	if (label === '동영상 강의') {
		option = {
			drawerLabel: () => (<View style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'relative',
					height: 65,
					backgroundColor: '#ffffff',
				}}>
					<Text style={{paddingLeft: 15, fontSize: 15, color: '#333333'}}>클래스</Text>
					<Image source={IcAngleRight} style={{width: 9, height: 14, marginRight: 15,}}/>
					<View style={{position: 'absolute', left: 0, bottom: 0, width: '100%', height: 1, backgroundColor: '#dddddd' }}/>
				</View>
			)
		}
	}
	if (label === '오디오북') {
		option = {
			drawerLabel: () => (<View style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'relative',
					height: 65,
					backgroundColor: '#ffffff',
				}}>
					<Text style={{paddingLeft: 15, fontSize: 15, color: '#333333'}}>오디오북</Text>
					<Image source={IcAngleRight} style={{width: 9, height: 14, marginRight: 15,}}/>
					<View style={{position: 'absolute', left: 0, bottom: 0, width: '100%', height: 1, backgroundColor: '#dddddd' }}/>
				</View>
			)
		}
	}
	if (label === '마이윌라') {
		option = {
			drawerLabel: () => (<View style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					position: 'relative',
					height: 65,
					backgroundColor: '#ffffff',
				}}>
					<Text style={{paddingLeft: 15, fontSize: 15, color: '#333333'}}>마이윌라</Text>
					<Image source={IcAngleRight} style={{width: 9, height: 14, marginRight: 15,}}/>
					<View style={{position: 'absolute', left: 0, bottom: 0, width: '100%', height: 1, backgroundColor: '#dddddd' }}/>
				</View>
			)
		}
	}


	return option;
}