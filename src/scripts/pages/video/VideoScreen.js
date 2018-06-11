import React from "react";
import {NAV_OPTS_COMMON, NAV_OPTS_MAIN, NAV_OPTS_EACH, NAV_OPTS_DRAWER} from "../../commons/store";
import {createStackNavigator} from "react-navigation";
import SamplePage from "../SamplePage";


const VideoScreen = createStackNavigator({

		VideoScreen1: {
			screen: SamplePage,
			navigationOptions: NAV_OPTS_MAIN,
		}
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

VideoScreen.navigationOptions = NAV_OPTS_DRAWER;

export default VideoScreen;