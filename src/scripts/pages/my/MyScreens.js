import React from "react";
import {createStackNavigator, createSwitchNavigator} from "react-navigation";
import AuthLoadingScreen from "../auth/AuthLoadingScreen";
import {
	NAV_OPTS_COMMON,
	NAV_OPTS_DRAWER,
	NAV_OPTS_STACK_WITH_SEARCH,
	NAV_OPTS_MAIN,
	NAV_OPTS_STACK, NAV_OPTS_MY_HOME
} from "../../commons/nav";
import MyInfoHome from "./MyInfoHome";
import LoginPage from "../auth/LoginPage";
import FindPasswordPage from "../auth/FindPasswordPage";
import SignUpLandingPage from "../auth/SignUpLandingPage";
import EmailSignUpForm from "../auth/EmailSignUpForm";
import MyInfoScreens from "./MyInfoScreens";
import Policy from "../auth/PolicyPage";
import Privacy from "../auth/PrivacyPage";
import MyInfoSubPage from "./MyInfoSubPage";


const MyScreens = createSwitchNavigator(
	{
		AuthCheck: {
			screen: AuthLoadingScreen
		},

		Login: {
			screen: LoginPage,
		},

		FindPassword: {
			screen: FindPasswordPage,
		},

		// SignUp: {
		// 	screen: createStackNavigator({
		// 			SignUpPage: {
		// 				screen: SignUpLandingPage
		// 			},
        //
		// 			PolicyPage: {
		// 				screen: Policy,
		// 				navigationOptions: NAV_OPTS_STACK,
		// 			},
        //
		// 			PrivacyPage: {
		// 				screen: Privacy,
		// 				navigationOptions: NAV_OPTS_STACK,
		// 			}
		// 		},
        //
		// 		{
		// 			navigationOptions: NAV_OPTS_COMMON,
		// 		}
		// 	),
		// },

		SignUpPage: {
			screen: SignUpLandingPage,
		},

		PolicyPage: {
			screen: Policy,
			navigationOptions: NAV_OPTS_STACK,
		},

		PrivacyPage: {
			screen: Privacy,
			navigationOptions: NAV_OPTS_STACK,
		},

		EmailSignUpForm: {
			screen: EmailSignUpForm,
		},

		MyInfoHome: {
			screen: MyInfoHome,
			navigationOptions: NAV_OPTS_MY_HOME,
		},

		MyInfoSubExample: {
			screen: MyInfoSubPage,
			navigationOptions: NAV_OPTS_STACK_WITH_SEARCH,
		}

		// AuthorizedMyScreen: {
		// 	screen: MyInfoScreens
		// }
	},

	{
		initialRouteName: 'AuthCheck'
	}
);

MyScreens.navigationOptions = NAV_OPTS_DRAWER;

export default MyScreens;