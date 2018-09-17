import React, { Component } from 'react';
import {DrawerActions, withNavigation} from "react-navigation";
import globalStore from "../../commons/store";
import CommonStyles from "../../../styles/common";
import {Image, Text, TouchableOpacity} from "react-native";
import IcBack from "../../../images/ic-back.png"
import nav from "../../commons/nav";

class HistoryBackButton extends Component {



	historyBack = ( event ) => {
		// console.log( 'historyBack start:', globalStore.prevLocations );
		// if (globalStore.prevLocations.length === 0)
		// 	this.props.location.goBack();
		// else{
		// 	const screen = globalStore.prevLocations.pop();
		// 	this.props.navigation.navigate( screen );
		// 	console.log( 'historyBack end:', globalStore.prevLocations );
        //
		// 	//
		// 	setTimeout(()=>{
		// 		const locs = globalStore.prevLocations;
		// 		const locsLen = locs.length;
		// 		if( locsLen > 0 ) globalStore.prevLocations.pop();
		// 		console.log( '정리:', globalStore.prevLocations );
		// 	}, 0 );
		// }
		nav.commonBack();

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
