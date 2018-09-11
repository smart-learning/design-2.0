// 네비게이션 기본 속성 옵션
import React from "react";
import {Button, Text, Linking, Alert} from "react-native";
import CommonStyle from "../../styles/common";
import SearchButton from "../components/header/SearchButton";
import {Image, View} from "react-native";
import HomeButton from "../components/header/HomeButton";
import logo from "../../images/logo-white.png"
import IcAngleRight from "../../images/ic-angle-right-primary.png";
import HistoryBackButton from "../components/header/HistoryBackButton";
import Native from "./native";

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


let navigation = null;
export default {

	setNav: ( nav )=>{
		navigation = nav._navigation;
		console.log( 'set global nav:', navigation );
	},
	// welaaa://video_list 동영상 리스트
	// welaaa://video_list/{category}/{index} 동영상 특정 카테고리 특정 순서로 이동
	// welaaa://video/{cid} 동영상 상세
	// welaaa://video_play/{cid} 동영상 재생
	// welaaa://audio_list 오디오북 리스트
	// welaaa://audio_list/{category}/{index} 동영상 특정 카테고리 특정 순서로 이동
	// welaaa://audio/{cid} 오디오북 상세
	// welaaa://audio_play/{cid} 오디오북 재생
	// welaaa://in_browser/{url} 인앱 브라우져로 url 이동(닫기버튼포함)
	// welaaa://out_browser/{url}` 외부 브라우져 실행
	// welaaa://sign_up 회원가입 이동
	// welaaa://sign_in 로그인 이동
	// welaaa://mywela 마이윌라로 이동

	// welaaa://app_setting 설정으로 이동
	// welaaa://membership 나의 멤버십으로 이동
	parseDeepLink: ( scheme )=>{

		// 필요한 내용만 '/' 로 나눠서
		const schemes = scheme.replace('welaaa://', '').split('/');

		// 맨 앞에 내용을 action 뒤에 내용을 params으로 분리
		const action = schemes[0];
		const paramsLen = schemes.length - 1; // action을 제외한 길이

		switch( action ){
			case 'video_list':
				if( paramsLen === 2 ) navigation.navigate('ClassListPage', { category:schemes[0], index:schemes[1] } );
				else navigation.navigate('ClassListPage');
				break;

			case 'video':
				navigation( 'ClassDetailPage', { id: schemes[0] } );
				break;

			case 'audio_list':
				if( paramsLen === 2 ) navigation.navigate('AudioBookPage', { category:schemes[0], index:schemes[1] } );
				else navigation.navigate('AudioBookPage');
				break;

			case 'audio':
				navigation.navigate('AudioBookDetailPage', { id: schemes[0] });
				break;

			case 'video_play':
			case 'audio_play':
				Native.play( schemes[0] );
				break;

			case 'in_browser':
				/* TODO: 웹뷰 붙이는 작업 필요 */
				Linking.openURL(schemes[0]);
				// const url = 'https://naver.com';// schemes[0];
				// Linking.openURL('https://google.com');
				// Linking.canOpenURL( schemes[0] ).then( supproted => {
				// 	if( supproted ) Linking.openURL( url );
				// 	else            Alert.alert('열 수 없는 URL입니다.', url );
				// });
				break;

			case 'out_browser':
				Linking.openURL(schemes[0]);
				break;

			case 'sign_up':
				navigation.navigate('SignUpPage');
				break;

			case 'sign_in':
				navigation.navigate('Login');
				break;

			case 'mywela':
				navigation.navigate('AuthCheck', { requestScreenName:'MyScreen', title:'마이윌라' } );
				break;

			case 'app_setting':
				navigation.navigate('AuthCheck', { requestScreenName:'SetAppPage', title:'설정' } );
				break;
		}
	}
}