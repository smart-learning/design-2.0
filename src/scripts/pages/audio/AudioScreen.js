import React from "react";
import {
	NAV_OPTS_COMMON,
	NAV_OPTS_MAIN,
	NAV_OPTS_DRAWER,
	NAV_OPTS_STACK_WITH_SEARCH,
	NAV_OPTS_STACK_HISTORY_BACK
} from "../../commons/nav";
import {createStackNavigator} from "react-navigation";
import AudioBookPage from "./AudioBookPage";
import AudioBookDetailPage from "./AudioBookDetailPage";
import BotmIntroPage from "./botm_intro/BotmIntroPage"


const AudioScreen = createStackNavigator({

		AudioBookPage: {
			screen: AudioBookPage,
			navigationOptions: NAV_OPTS_MAIN,
			path:'audio_list',
		},
		AudioBookDetailPage: {
			screen: AudioBookDetailPage,
			navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
			path:'audio',
		},
		BotmIntroPage:{
			screen: BotmIntroPage,
			title:'이달의 책'
		}
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

AudioScreen.navigationOptions = NAV_OPTS_DRAWER;

export default AudioScreen;