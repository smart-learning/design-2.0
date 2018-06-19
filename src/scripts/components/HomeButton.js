import React, { Component } from 'react';
import {DrawerActions} from "react-navigation";
import Store from "../commons/store";
import CommonStyles from "../../styles/common";
import {Image, TouchableOpacity} from "react-native";
import IcBars from "../../images/ic-bars.png"

class HomeButton extends Component {
    render() {
        return <TouchableOpacity
			onPress={() => {
				Store.drawer.dispatch(DrawerActions.toggleDrawer())
			}}
		>
			<Image source={IcBars} style={ CommonStyles.size24 }/>
		</TouchableOpacity>
    }
}


export default HomeButton;
