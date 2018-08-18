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
import LectureUsePage from "./LectureUsePage";
import LectureBuyPage from "./LectureBuyPage";
import AudioBookTicketPage from "./AudioBookTicketPage";
import AudioBookUsePage from "./AudioBookUsePage";
import AudioBookBuyPage from "./AudioBookBuyPage";
import DownloadContentPage from "./DownloadContentPage";
import MyLogPage from "./MyLogPage";
import SetTagPage from "./SetTagPage";
import ClipPlayListPage from "./ClipPlayListPage";
import FriendPage from "./FriendPage";
import GuideListPage from "./GuideListPage";
import InquireListPage from "./InquireListPage";
import SetAppPage from "./SetAppPage";
import GuideViewPage from "./GuideViewPage";
import InquireFormPage from "./InquireFormPage";


const MyScreens = createStackNavigator(
	{

		Login: {
			screen: LoginPage,
			navigationOptions:{ header: null }
		},

		FindPassword: {
			screen: FindPasswordPage,
		},

		SignUpPage: {
			screen: SignUpLandingPage,
		},

		PrivacyPage: {
			screen: Privacy,
			// navigationOptions: NAV_OPTS_STACK,
		},

		PolicyPage: {
			screen: Policy,
			// navigationOptions: NAV_OPTS_STACK,
		},

		EmailSignUpForm: {
			screen: EmailSignUpForm,
		},


		//------------------------ before Auth ----------------------------------
		AuthCheck: {
			screen: AuthLoadingScreen
		},
		//------------------------ after Auth -----------------------------------


		MyInfoHome: {
			screen: MyInfoHome,
			navigationOptions: { header: null },
		},


		SetAppPage: {
			screen: SetAppPage,
			navigationOptions: NAV_OPTS_STACK,
		},

		LectureUsePage: {
			screen: LectureUsePage,
			navigationOptions: NAV_OPTS_STACK,
		},
		LectureBuyPage: {
			screen: LectureBuyPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		AudioBookTicketPage: {
			screen: AudioBookTicketPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		AudioBookUsePage: {
			screen: AudioBookUsePage,
			navigationOptions: NAV_OPTS_STACK,
		},
		AudioBookBuyPage: {
			screen: AudioBookBuyPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		DownloadContentPage: {
			screen: DownloadContentPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		SetTagPage: {
			screen: SetTagPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		ClipPlayListPage: {
			screen: ClipPlayListPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		MyLogPage: {
			screen: MyLogPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		FriendPage: {
			screen: FriendPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		GuideListPage: {
			screen: GuideListPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		GuideViewPage: {
			screen: GuideViewPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		InquireListPage: {
			screen: InquireListPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		InquireFormPage: {
			screen: InquireFormPage,
			navigationOptions: NAV_OPTS_STACK,
		},
	},

	{
		initialRouteName: 'AuthCheck'
	}
);

MyScreens.navigationOptions = NAV_OPTS_DRAWER;

export default MyScreens;