import React from "react";
import {createSwitchNavigator} from "react-navigation";
import AuthLoadingScreen from "../auth/AuthLoadingScreen";
import {NAV_OPTS_DRAWER} from "../../commons/store";
import MyInfoScreen from "./MyInfoScreen";



const MyScreenSet = createSwitchNavigator(
	{
		Auth: {
			screen: AuthLoadingScreen
		},

		AuthorizedMyScreen: {
			screen: MyInfoScreen
		}
	},

	{
		initialRouteName: 'Auth'
	}
);

MyScreenSet.navigationOptions = NAV_OPTS_DRAWER;

export default MyScreenSet;