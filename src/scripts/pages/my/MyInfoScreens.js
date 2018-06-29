import React from "react";
import {createStackNavigator} from "react-navigation";
import {NAV_OPTS_COMMON, NAV_OPTS_STACK_WITH_SEARCH, NAV_OPTS_MY_HOME} from "../../commons/nav";
import MyInfoHome from "./MyInfoHome";
import MyInfoSubPage from "./MyInfoSubPage";



const MyInfoScreens = createStackNavigator({

		MyInfoHome: {
			screen: MyInfoHome,
			navigationOptions: NAV_OPTS_MY_HOME,
		},

		MyInfoSubExample: {
			screen: MyInfoSubPage,
			navigationOptions: NAV_OPTS_STACK_WITH_SEARCH,
		}
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

export default MyInfoScreens;