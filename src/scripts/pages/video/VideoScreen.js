import React from "react";
import {NAV_OPTS_COMMON, NAV_OPTS_MAIN, NAV_OPTS_EACH, NAV_OPTS_DRAWER} from "../../commons/store";
import {createStackNavigator} from "react-navigation";
import CourseList from "./CourseList";
import CourseItemList from "./CourseItemList";


const VideoScreen = createStackNavigator({

		CourseList: {
			screen: CourseList,
			navigationOptions: NAV_OPTS_MAIN,
		},
		CourseItemList: {
			screen: CourseItemList,
			navigationOptions: NAV_OPTS_EACH,
		},
	
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

VideoScreen.navigationOptions = NAV_OPTS_DRAWER;

export default VideoScreen;