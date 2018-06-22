import React from "react";
import store from "../../commons/store";
import CommonStyles from "../../../styles/common";
import {Button, Image, Text, View} from "react-native";

export default class LectureDetailPage extends React.Component {

	render() {
		return <View style={CommonStyles.container}>
			<Text>강좌 강의클립 목록</Text>
			<Text>{this.props.navigation.state.params.id}</Text>
			<Button
				onPress={()=>this.props.navigation.goBack()}
				title="뒤로"
			/>

		</View>
	}
}