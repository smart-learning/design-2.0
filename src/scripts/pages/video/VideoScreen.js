import React from "react";
import {NAV_OPTS_COMMON, NAV_OPTS_MAIN, NAV_OPTS_STACK_WITH_SEARCH, NAV_OPTS_DRAWER} from "../../commons/nav";
import {createStackNavigator} from "react-navigation";
import ClassListPage from "./ClassListPage";
import ClassDetailPage from "./ClassDetailPage";
import ClipPage from "./ClipPage";


const VideoScreen = createStackNavigator({

		ClassListPage: {
			screen: ClassListPage,
			navigationOptions: NAV_OPTS_MAIN,
		},
		ClassDetailPage: {
			screen: ClassDetailPage,
			navigationOptions: NAV_OPTS_STACK_WITH_SEARCH,
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