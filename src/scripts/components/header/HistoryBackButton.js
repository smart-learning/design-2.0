import React, { Component } from 'react';
import {DrawerActions, withNavigation} from "react-navigation";
import globalStore from "../../commons/store";
import CommonStyles from "../../../styles/common";
import {Image, Text, TouchableOpacity} from "react-native";
import IcBack from "../../../images/ic-back.png"

class HistoryBackButton extends Component {



	historyBack = ( event ) => {
		if (globalStore.prevLocations.length === 0)
			this.props.location.goBack();
		else{
			const screen = globalStore.prevLocations.pop();
			if( globalStore.authRequiredPages.includes(screen))
				this.props.navigation.navigate('AuthCheck', { requestScreenName:screen } );
			else
				this.props.navigation.navigate( screen );
		}

		event.stopPropagation();
	}


    render() {
        return <TouchableOpacity
			onPress={ this.historyBack }>
			<Image source={IcBack} style={[CommonStyles.size24, {marginLeft: 15}]} />
		</TouchableOpacity>
    }
}


export default withNavigation(HistoryBackButton);
