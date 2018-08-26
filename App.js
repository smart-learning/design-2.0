import React from 'react';
import {createDrawerNavigator, DrawerActions, DrawerItems, SafeAreaView} from "react-navigation";
import SampleScreen from './src/scripts/pages/sample/SampleScreen';
import HomeScreen from './src/scripts/pages/home/HomeScreen';
import VideoScreen from './src/scripts/pages/video/VideoScreen';
import AudioScreen from './src/scripts/pages/audio/AudioScreen';
import MyScreens from './src/scripts/pages/my/MyScreens';
import Playground from "./src/scripts/pages/Playground";
import {Button, Modal, Text, View, Image, ImageBackground, TouchableOpacity} from "react-native";
import Store from "./src/scripts/commons/store";
import PlaygroundJune from "./src/scripts/pages/PlaygroundJune";
import BottomControllerPage from './src/scripts/pages/BottomControllerPage';

import SidebarUserInfo from "./src/scripts/components/SidebarUserInfo";
import { DeviceEventEmitter, NativeModules } from 'react-native'

class App extends React.Component {

	constructor(prop) {
		super(prop);
		this.subscription = null;
	}

	componentWillMount() {
        subscription = DeviceEventEmitter.addListener('miniPlayer', (params) => {
            NativeModules.RNNativePlayer.toast('playbackState: ' + params['visible']);
        });
    }

	componentWillUnmount() {
		subscription.remove();
	}

 	render() {

		return <View style={{flex: 1}}>
			<AppDrawer
				ref={navigatorRef => {
					Store.drawer = navigatorRef
				}}
				style={{width: '80%'}}

				onNavigationStateChange={(prevState, currentState) => {
					const currentScreen = getActiveRouteName(currentState);
					const prevScreen = getActiveRouteName(prevState);

					if (prevScreen !== currentScreen) {
						if (currentScreen !== 'AuthCheck') Store.lastLocation = currentScreen;
					}
				}}
			/>
			<View style={{position: 'absolute', bottom: 20, right: 100}}>
				<Button title="Open Side"
						onPress={() => {
							Store.drawer.dispatch(DrawerActions.toggleDrawer())
						}}
				/>
			</View>
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
				<SidebarUserInfo/>
				<DrawerItems {...props}/>
			</SafeAreaView>
		)

	}
);

export default App;