import React, { Component } from 'react';
import { View, Image } from "react-native";
import CommonStyles from "../../../styles/common";
import logo from "../../../images/welaaa_logo.png"
import HomeButton from "./HomeButton";

class HeaderForWebView extends Component {
	render() {
		return <View>
			<View style={{ backgroundColor:'#00c73c', alignItems:'center', flexDirection: 'row',
				justifyContent: 'space-between', height:60 }}>
				<HomeButton/>
				<Image source={logo} style={CommonStyles.headerLogo}/>
			</View>
		</View>
	}
}

export default HeaderForWebView;
