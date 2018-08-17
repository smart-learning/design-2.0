import React from "react";
import {NAV_OPTS_COMMON, NAV_OPTS_MAIN, NAV_OPTS_DRAWER, NAV_OPTS_STACK_WITH_SEARCH} from "../../commons/nav";
import {createStackNavigator} from "react-navigation";
import AudioBookPage from "./AudioBookPage";
import AudioBookDetailPage from "./AudioBookDetailPage";


const AudioScreen = createStackNavigator({

		AudioBookPage: {
			screen: AudioBookPage,
			navigationOptions: NAV_OPTS_MAIN,
		},
		AudioBookDetailPage: {
			screen: AudioBookDetailPage,
			navigationOptions: NAV_OPTS_STACK_WITH_SEARCH,
		}
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

AudioScreen.navigationOptions = NAV_OPTS_DRAWER;

export default AudioScreen;