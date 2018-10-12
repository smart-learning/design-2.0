import React, { Component } from 'react';
import { DrawerActions } from "react-navigation";
import Store from "../../commons/store";
import CommonStyles from "../../../styles/common";
import { View, Image, TouchableOpacity } from "react-native";
import IcBars from "../../../images/ic-bars.png"
import logo from '../../../images/welaaa_logo.png';
import nav from "../../commons/nav";
import globalStore from '../../commons/store';

class HomeWelaaaButton extends Component {

	onBackPress = () => {
		navigation = nav._navigation;
		globalStore.prevLocations.pop();
		nav.commonBack();
	}

	render() {
		return <View style={[CommonStyles.container]}>
			<TouchableOpacity activeOpacity={0.9}
				onPress={this.onBackPress}
			>
				<Image source={logo} style={[CommonStyles.headerLogo]} />
			</TouchableOpacity>
		</View>;
	}
}

export default HomeWelaaaButton;
