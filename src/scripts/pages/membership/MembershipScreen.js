import React from "react";
import {NAV_OPTS_COMMON, NAV_OPTS_STACK, NAV_OPTS_DRAWER} from "../../commons/nav";
import {createStackNavigator} from "react-navigation";
import MembershipPage from "./MembershipPage";
import MembershipDetailPage from "./MembershipDetailPage";
import MembershipFormPage from "./MembershipFormPage";


const MembershipScreen = createStackNavigator({

		MembershipPage: {
			screen: MembershipPage,
			navigationOptions: {
				...NAV_OPTS_STACK,
				title: '윌라 멤버쉽',
			}
		},
		MembershipFormPage: {
			screen: MembershipFormPage,
			navigationOptions: NAV_OPTS_STACK,
		},
		MembershipDetailPage: {
			screen: MembershipDetailPage,
			navigationOptions: NAV_OPTS_STACK,
		},
	},

	{ navigationOptions: NAV_OPTS_COMMON }
);

MembershipScreen.navigationOptions = NAV_OPTS_DRAWER;

export default MembershipScreen;