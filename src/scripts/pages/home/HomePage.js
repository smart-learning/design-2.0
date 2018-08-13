import React from "react";
import CommonStyles from "../../../styles/common";
import {Button, Text, View} from "react-native";

export default class HomePage extends React.Component {

	constructor(props){
		super(props);
	}

	render() {
		return <View style={CommonStyles.container}>
			<Text>메인</Text>
		</View>
	}
}