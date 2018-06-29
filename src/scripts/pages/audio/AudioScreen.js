import React from "react";
import {NAV_OPTS_COMMON, NAV_OPTS_MAIN, NAV_OPTS_DRAWER} from "../../commons/nav";
import {createStackNavigator} from "react-navigation";
import AudioBookPage from "./AudioBookPage";


const AudioScreen = createStackNavigator({

		AudioScreen1: {
			screen: AudioBookPage,
			navigationOptions: NAV_OPTS_MAIN,
		}
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

AudioScreen.navigationOptions = NAV_OPTS_DRAWER;

export default AudioScreen;