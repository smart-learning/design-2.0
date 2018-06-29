import React from "react";
import {createStackNavigator, createSwitchNavigator} from "react-navigation";
import AuthLoadingScreen from "../auth/AuthLoadingScreen";
import {NAV_OPTS_COMMON, NAV_OPTS_DRAWER, NAV_OPTS_EACH, NAV_OPTS_MAIN} from "../../commons/nav";
import MyInfoHome from "./MyInfoHome";
import LoginPage from "../auth/LoginPage";
import FindPasswordPage from "../auth/FindPasswordPage";
import SignUpPage from "../auth/SignUpPage";
import EmailSignUpForm from "../auth/EmailSignUpForm";
import MyInfoScreens from "./MyInfoScreens";
import SignUpPolicy from "../auth/SignUpPolicy";


const MyScreens = createSwitchNavigator(
	{
		Auth: {
			screen: AuthLoadingScreen
		},

		Login: {
			screen: LoginPage,
		},

		FindPassword: {
			screen: FindPasswordPage,
		},

		SignUp: {
			screen: createStackNavigator({
					SignUpPage: {
						screen: SignUpPage
					},

					SignUpPolicy: {
						screen: SignUpPolicy,
						navigationOptions: NAV_OPTS_EACH,
					}
				},

				{navigationOptions: NAV_OPTS_COMMON}
			),
		},

		EmailSignUpForm: {
			screen: EmailSignUpForm,
		},

		AuthorizedMyScreen: {
			screen: MyInfoScreens
		}
	},

	{
		initialRouteName: 'Auth'
	}
);

MyScreens.navigationOptions = NAV_OPTS_DRAWER;

export default MyScreens;