import React from 'react';
import { createDrawerNavigator, DrawerItems, SafeAreaView } from "react-navigation";
import HomeScreen from './src/scripts/pages/home/HomeScreen';
import VideoScreen from './src/scripts/pages/video/VideoScreen';
import AudioScreen from './src/scripts/pages/audio/AudioScreen';
import MyScreens from './src/scripts/pages/my/MyScreens';
import MembershipScreens from './src/scripts/pages/membership/MembershipScreen';
import {AsyncStorage, DeviceEventEmitter, Platform, View} from "react-native";
import EventEmitter from 'events';
import globalStore from "./src/scripts/commons/store";
import PlaygroundJune from "./src/scripts/pages/PlaygroundJune"

import SidebarUserInfo from "./src/scripts/components/SidebarUserInfo";
import net from "./src/scripts/commons/net";
import BottomController from "./src/scripts/components/BottomController";
import Native from "./src/scripts/commons/native";
import { observer } from "mobx-react";
import firebase from 'react-native-firebase';

@observer class App extends React.Component {

	getTokenFromAsyncStorage = async () => {
		let welaaaAuth = await AsyncStorage.getItem( 'welaaaAuth' );
		if( welaaaAuth ) {
			welaaaAuth = JSON.parse( welaaaAuth );
			globalStore.welaaaAuth = welaaaAuth;

			globalStore.profile = await net.getProfile();
			// 멤버쉽 가져오기
			globalStore.currentMembership = await net.getMembershipCurrent();
		}
	};

	getAppSettings = async () => {
		const settings = await AsyncStorage.multiGet( [
			'config::isAutoLogin',
			'config::isWifiPlay',
			'config::isWifiDownload',
			'config::isAlert',
			'config::isEmail',
		] );

		settings.forEach( setting => {
			globalStore.appSettings[ setting[ 0 ].split( '::' ).pop() ] = Boolean( setting[ 1 ] );
		} );

		Native.updateSettings();
	};

	initFCM = async () => {
		const fcmToken = await firebase.messaging().getToken();
		if (fcmToken) {
			console.log( 'fcmToken', fcmToken );
			// 토큰 있음
		} else {
			console.log( '유저가 토큰을 가지고 있지 않음' );
			// 유저가 토큰을 가지고 있지 않음
		}
	};


	constructor(prop) {
		super(prop);
		this.subscription = [];

		this.getTokenFromAsyncStorage();
		this.getAppSettings();
		this.initFCM();

		// 로그인 이후 발생된 이벤트를 캐치하여 "프로필" 및 "현재멤버십" 가져오기
		globalStore.emitter = new EventEmitter();
		globalStore.emitter.addListener('loginCompleted', () => {
			this.getTokenFromAsyncStorage();
		});
	}

	componentDidMount() {
		this.subscription.push( DeviceEventEmitter.addListener('miniPlayer', (params) => {
			Native.toggleMiniPlayer( params.visible );
		}));
		this.subscription.push( DeviceEventEmitter.addListener('selectDatabase', (params) => {
			console.log( 'database receiveDownloadList:', params );
			globalStore.downloadItems = params.selectDownload || params.selectDatabase;
		}));
		this.subscription.push( DeviceEventEmitter.addListener('selectDownload', (params) => {
			console.log( 'download receiveDownloadList:', params );
			globalStore.downloadItems = params.selectDownload || params.selectDatabase;
		}));
    }

	componentWillUnmount() {
		this.subscription.forEach( listener => {
			listener.remove();
		} );
		this.subscription.length = 0;
		globalStore.emitter.removeAllListeners();
	}

 	render() {

		return <View style={{flex: 1}}>
			<AppDrawer
				ref={navigatorRef => {
					globalStore.drawer = navigatorRef
				}}
				style={{width: '80%'}}

				onNavigationStateChange={(prevState, currentState) => {
					const currentScreen = getActiveRouteName(currentState);
					const prevScreen = getActiveRouteName(prevState);

					if (prevScreen !== currentScreen) {
						if (currentScreen !== 'AuthCheck') globalStore.lastLocation = currentScreen;
					}
				}}
			/>

			{globalStore.miniPlayerVisible && Platform.select({
				android: <BottomController/>,
				ios: null,
			})}

		</View>
	}
}

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
	if (!navigationState) {
		return null;
	}
	const route = navigationState.routes[navigationState.index];
	// dive into nested navigators
	if (route.routes) {
		return getActiveRouteName(route);
	}
	return route.routeName;
}

const HOME_SCREEN = HomeScreen;
const DEFAULT_SCREEN = VideoScreen;

const AppDrawer = createDrawerNavigator(
	{
		// SampleScreen: {
		// 	screen: SampleScreen,
		// },

		HomeScreen: {
			screen: HOME_SCREEN,
		},

		VideoScreen: {
			screen: VideoScreen,
		},

		AudioScreen: {
			screen: AudioScreen,
		},

		MembershipScreen: {
			screen: MembershipScreens,
		},

		MyScreen: {
			screen: MyScreens,
		},

		// Playground: {
		// 	screen: Playground,
		// },
		// June: {
		// 	screen: PlaygroundJune,
		// },
		// BottomControllerTEST: {
		// 	screen: BottomControllerPage,
		// },
		AndroidNativeCall: {
			screen: PlaygroundJune,
		}
	},

	{
		contentComponent: (props) => (
			<SafeAreaView style={{flex: 1}} forceInset={{top: 'always', horizontal: 'never'}}>
				<SidebarUserInfo {...props} />
				<DrawerItems {...props}/>
			</SafeAreaView>
		)

	}
);

export default App;