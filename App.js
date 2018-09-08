import React from 'react';
import { createDrawerNavigator, DrawerItems, SafeAreaView } from "react-navigation";
import HomeScreen from './src/scripts/pages/home/HomeScreen';
import VideoScreen from './src/scripts/pages/video/VideoScreen';
import AudioScreen from './src/scripts/pages/audio/AudioScreen';
import MyScreens from './src/scripts/pages/my/MyScreens';
import {AsyncStorage, DeviceEventEmitter, Platform, View} from "react-native";
import globalStore from "./src/scripts/commons/store";
import PlaygroundJune from "./src/scripts/pages/PlaygroundJune"

import SidebarUserInfo from "./src/scripts/components/SidebarUserInfo";
import net from "./src/scripts/commons/net";
import BottomController from "./src/scripts/components/BottomController";
import Native from "./src/scripts/commons/native";
import { observer } from "mobx-react";
import firebase, { RemoteMessage } from 'react-native-firebase';

@observer class App extends React.Component {

	getTokenFromAsyncStorage = async () => {
		let welaaaAuth = await AsyncStorage.getItem( 'welaaaAuth' );
		console.log( 'welaaaAuth:', welaaaAuth );
		if( welaaaAuth ) {
			welaaaAuth = JSON.parse( welaaaAuth );
			globalStore.welaaaAuth = welaaaAuth;

			globalStore.profile = await net.getProfile();
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
		try{
			await net.registeFcmToken( true );
		}catch( e ){
			console.log( 'FCM: ' + e );
		}

		// 권한 체크 후 없으면 요청
		const enabled = await firebase.messaging().hasPermission();
		if (enabled) {
			// user has permissions
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

		this.getTokenFromAsyncStorage();
		this.getAppSettings();
		this.initFCM();
	}

	componentDidMount() {
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



		this.messageListener = firebase.messaging().onMessage( message => {
			// Process your message as required
			console.log( 'FCM 메시지 처리:', message );
		});
    }

	componentWillUnmount() {
		this.subscription.forEach( listener => {
			listener.remove();
		} );
		this.subscription.length = 0;
		this.messageListener();
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