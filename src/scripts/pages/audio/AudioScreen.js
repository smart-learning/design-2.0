import React from "react";
import {NAV_OPTS_COMMON, NAV_OPTS_MAIN, NAV_OPTS_EACH, NAV_OPTS_DRAWER} from "../../commons/store";
import {createStackNavigator} from "react-navigation";
import SamplePage from "../SamplePage";


const AudioScreen = createStackNavigator({

		AudioScreen1: {
			screen: SamplePage,
			navigationOptions: NAV_OPTS_MAIN,
		}
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

AudioScreen.navigationOptions = NAV_OPTS_DRAWER;

export default AudioScreen;