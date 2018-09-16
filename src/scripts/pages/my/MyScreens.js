import React from "react";
import {createStackNavigator} from "react-navigation";
import AuthLoadingScreen from "../auth/AuthLoadingScreen";
import {NAV_OPTS_DRAWER, NAV_OPTS_STACK, NAV_OPTS_STACK_HISTORY_BACK} from "../../commons/nav";
import MyInfoHome from "./MyInfoHome";
import LoginPage from "../auth/LoginPage";
import FindPasswordPage from "../auth/FindPasswordPage";
import SignUpLandingPage from "../auth/SignUpLandingPage";
import EmailSignUpForm from "../auth/EmailSignUpForm";
import Policy from "../auth/PolicyPage";
import Privacy from "../auth/PrivacyPage";
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
import InquireViewPage from "./InquireViewPage";
import globalStore from "../../commons/store";

const MyScreens = createStackNavigator(
	{
		MyInfoHome: {
			screen: MyInfoHome,
			navigationOptions: { header: null },
		},

		Login: {
			screen: LoginPage,
			navigationOptions:{
				header: null,
				gesturesEnabled: false,
			}
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
		InquireViewPage: {
			screen: InquireViewPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		InquireFormPage: {
			screen: InquireFormPage,
			navigationOptions: NAV_OPTS_STACK,
		},
	},

	globalStore.initialRoute
);

MyScreens.navigationOptions = NAV_OPTS_DRAWER;

export default MyScreens;