import React from "react";
import {NAV_OPTS_COMMON, NAV_OPTS_MAIN, NAV_OPTS_EACH, NAV_OPTS_DRAWER} from "../../commons/store";
import {createStackNavigator} from "react-navigation";
import LecturePage from "./LecturePage";
import LectureDetailPage from "./LectureDetailPage";


const VideoScreen = createStackNavigator({

		LecturePage: {
			screen: LecturePage,
			navigationOptions: NAV_OPTS_MAIN,
		},
		LectureDetailPage: {
			screen: LectureDetailPage,
			navigationOptions: NAV_OPTS_EACH,
		},
	
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

VideoScreen.navigationOptions = NAV_OPTS_DRAWER;

export default VideoScreen;