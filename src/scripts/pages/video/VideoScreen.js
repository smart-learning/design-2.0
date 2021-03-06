import React from "react";
import {
	NAV_OPTS_COMMON,
	NAV_OPTS_MAIN,
	NAV_OPTS_STACK_WITH_SEARCH,
	NAV_OPTS_DRAWER,
	NAV_OPTS_STACK_HISTORY_BACK
} from "../../commons/nav";
import {createStackNavigator} from "react-navigation";
import ClassListPage from "./ClassListPage";
import ClassDetailPage from "./ClassDetailPage";
import ClipPage from "./ClipPage";


const VideoScreen = createStackNavigator({

		ClassListPage: {
			screen: ClassListPage,
			navigationOptions: NAV_OPTS_MAIN,
			path: 'video_list',
		},
		ClassDetailPage: {
			screen: ClassDetailPage,
			navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
			path: 'video',
		},
		ClipPage: {
			screen: ClipPage,
			navigationOptions: NAV_OPTS_MAIN,
		},
		// ClipDetailPage: {
		// 	screen: ClipDetailPage,
		// 	navigationOptions: NAV_OPTS_STACK_WITH_SEARCH,
		// },
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

VideoScreen.navigationOptions = NAV_OPTS_DRAWER;

export default VideoScreen;