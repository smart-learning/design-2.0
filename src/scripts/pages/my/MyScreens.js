import React from "react";
import {createSwitchNavigator} from "react-navigation";
import AuthLoadingScreen from "../auth/AuthLoadingScreen";
import {NAV_OPTS_DRAWER} from "../../commons/nav";
import MyInfoScreen from "./MyInfoScreen";
import LoginPage from "../auth/LoginPage";
import FindPasswordPage from "../auth/FindPasswordPage";
import SignUpPage from "../auth/SignUpPage";
import EmailSignUpForm from "../auth/EmailSignUpForm";



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
			screen: SignUpPage,
		},

		EmailSignUpForm: {
			screen: EmailSignUpForm,
		},

		AuthorizedMyScreen: {
			screen: MyInfoScreen
		}
	},

	{
		initialRouteName: 'Auth'
	}
);

MyScreens.navigationOptions = NAV_OPTS_DRAWER;

export default MyScreens;