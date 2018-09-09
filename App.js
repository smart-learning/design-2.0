import React from 'react';
import { createDrawerNavigator, DrawerItems, SafeAreaView } from "react-navigation";
import HomeScreen from './src/scripts/pages/home/HomeScreen';
import VideoScreen from './src/scripts/pages/video/VideoScreen';
import AudioScreen from './src/scripts/pages/audio/AudioScreen';
import MyScreens from './src/scripts/pages/my/MyScreens';
import MembershipScreens from './src/scripts/pages/membership/MembershipScreen';
import {AsyncStorage, DeviceEventEmitter, Platform, View, Linking} from "react-native";
import EventEmitter from 'events';
import globalStore from "./src/scripts/commons/store";

import SidebarUserInfo from "./src/scripts/components/SidebarUserInfo";
import net from "./src/scripts/commons/net";
import BottomController from "./src/scripts/components/BottomController";
import Native from "./src/scripts/commons/native";
import { observer } from "mobx-react";
import firebase, { RemoteMessage } from 'react-native-firebase';
import nav from "./src/scripts/commons/nav";

@observer class App extends React.Component {

	getTokenFromAsyncStorage = async () => {
		let welaaaAuth = await AsyncStorage.getItem( 'welaaaAuth' );
		console.log( 'welaaaAuth:', welaaaAuth );
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
			const bool = (setting[1] === 'true');
			globalStore.appSettings[ setting[ 0 ].split( '::' ).pop() ] = bool;
		} );

		console.log( 'setting:', globalStore.appSettings );

		Native.updateSettings();

		await this.getTokenFromAsyncStorage();
	};

	initFCM = async () => {

		// 권한 체크 후 없으면 요청
		const enabled = await firebase.messaging().hasPermission();
		console.log( 'FCM enabled:', enabled );
		if (enabled) {
			// user has permissions
			try{
				await net.registeFcmToken( true );
			}catch( e ){
				console.log( 'FCM: ' + e );
			}
		} else {
			// user doesn't have permission

			try {
				await firebase.messaging().requestPermission();
				// User has authorised
			} catch (error) {
				// User has rejected permissions
			}

		}
	};


	constructor(prop) {
		super(prop);
		this.subscription = [];
		this.initialize()
	} 

	async initialize() {
		await this.getAppSettings();
		this.initFCM();

		// 로그인 이후 발생된 이벤트를 캐치하여 "프로필" 및 "현재멤버십" 가져오기
		globalStore.emitter = new EventEmitter();
		globalStore.emitter.addListener('loginCompleted', () => {
			this.getTokenFromAsyncStorage();
		});
	}

	async componentDidMount() {
		this.subscription.push( DeviceEventEmitter.addListener('miniPlayer', (params) => {
			Native.toggleMiniPlayer( params.visible );
		}));
		this.subscription.push( DeviceEventEmitter.addListener('selectDatabase', (params) => {
			console.log( 'database receiveDownloadList:', params );
			globalStore.downloadItems = params.selectDownload || params.selectDatabase || 'null';
		}));
		this.subscription.push( DeviceEventEmitter.addListener('selectDownload', (params) => {
			console.log( 'download receiveDownloadList:', params );
			globalStore.downloadItems = params.selectDownload || params.selectDatabase || 'null';
		}));


		/* 앱 떠있는 상태에서 노티 들어올때 */
		this.notificationListener = firebase.notifications().onNotification((notification) => {
			console.log( 'FCM NOTI:', notification );

			if( Platform.OS !== 'ios'){
				notification.android.setChannelId( 'welaaa' );
			}
		});

		// https://rnfirebase.io/docs/v4.3.x/notifications/introduction
		// 백그라운드 상태에서 노티 클릭등을 햇을때
		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
			// Get the action triggered by the notification being opened
			const action = notificationOpen.action;
			// Get information about the notification that was opened
			const notification = notificationOpen.notification;

			console.log( 'OPEN BY NOTI:', action, notification );
		});


		// 앱 종료상태에서 노티등을 클릭했을때
		const notificationOpen = await firebase.notifications().getInitialNotification();
		if (notificationOpen) {
			// App was opened by a notification
			// Get the action triggered by the notification being opened
			const action = notificationOpen.action;
			// Get information about the notification that was opened
			const notification = notificationOpen.notification;

			console.log( 'OPEN BY NOTI-C:', action, notification );
		}



		Linking.getInitialURL().then((url) => {
			if (url) {
				nav.parseDeepLink( url );
			}
		}).catch(err => console.error('An error occurred', err));
	}

	componentWillUnmount() {
		this.subscription.forEach( listener => {
			listener.remove();
		} );
		this.subscription.length = 0;
		globalStore.emitter.removeAllListeners();
		// this.messageListener();
		// this.notificationDisplayedListener();
		// this.notificationListener();
	}

 	render() {

		return <View style={{flex: 1}}>
			<AppDrawer
				ref={navigatorRef => {
					globalStore.drawer = navigatorRef
					nav.setNav( navigatorRef );
				}}
				style={{width: '80%'}}

				onNavigationStateChange={(prevState, currentState) => {
					const currentScreen = getActiveRouteName(currentState);
					const prevScreen = getActiveRouteName(prevState);

					if (prevScreen !== currentScreen) {
						if (currentScreen !== 'AuthCheck'){
							globalStore.lastLocation = currentScreen;
							globalStore.prevLocations.push( prevScreen );
							globalStore.prevLocations.length = Math.min( globalStore.prevLocations.length, 10 );
						}
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
			path: 'video_list',
		},

		AudioScreen: {
			screen: AudioScreen,
		},

		// MembershipScreen: {
		// 	screen: MembershipScreens,
		// },

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
		// AndroidNativeCall: {
		// 	screen: PlaygroundJune,
		// }
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