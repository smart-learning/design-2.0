import React, { Component } from 'react';
import { DrawerActions } from "react-navigation";
import Store from "../../commons/store";
import CommonStyles from "../../../styles/common";
import { Image, TouchableOpacity } from "react-native";
import IcBars from "../../../images/ic-bars.png"
import logo from '../../../images/welaaa_logo.png';
import nav from "../../commons/nav";
import globalStore from '../../commons/store';

class HomeButton extends Component {
	render() {
		return <TouchableOpacity activeOpacity={0.9}
			onPress={() => {
				navigation = nav._navigation;
				globalStore.prevLocations.pop();

				nav.commonBack();
			}}
		>
			<Image source={logo} style={[CommonStyles.headerLogo, {alignItems: 'center'} ]} />
		</TouchableOpacity>
	}
}


export default HomeButton;
