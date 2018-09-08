import React, { Component } from 'react';
import {DrawerActions, withNavigation} from "react-navigation";
import Store from "../../commons/store";
import CommonStyles from "../../../styles/common";
import {Image, Text, TouchableOpacity} from "react-native";
import IcBack from "../../../images/ic-back.png"

class HistoryBackButton extends Component {



	historyBack = () => {
		const prevLocation = (Store.prevLocations.length === 0)?'HomeScreen':Store.prevLocations.pop();
		this.props.navigation.navigate( prevLocation );
	}


    render() {
        return <TouchableOpacity
			onPress={ this.historyBack }>
			<Image source={IcBack} style={[CommonStyles.size24, {marginLeft: 15}]} />
		</TouchableOpacity>
    }
}


export default withNavigation(HistoryBackButton);
