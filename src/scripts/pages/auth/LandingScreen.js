import React from "react";
import { createStackNavigator, createSwitchNavigator } from "react-navigation";
import {
	NAV_OPTS_STACK_WITH_SEARCH,
	NAV_OPTS_MAIN,
	NAV_OPTS_DRAWER,
	NAV_OPTS_COMMON,
	NAV_OPTS_STACK
} from "../../commons/nav";
import SignUpLandingPage from "./SignUpLandingPage";
import Policy from "./PolicyPage";
import Privacy from "./PrivacyPage";
import LoginPage from "./LoginPage";


const LandingScreen = createSwitchNavigator({

		Landing: {
			screen: createStackNavigator({
					LandingPage: {
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
				},

				{navigationOptions: NAV_OPTS_COMMON}
			),
		},

		Login: {
			screen: LoginPage,
		},
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

LandingScreen.navigationOptions = NAV_OPTS_DRAWER;

export default LandingScreen;