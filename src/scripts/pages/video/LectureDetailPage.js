import React from "react";
import CommonStyles from "../../../styles/common";
import {Button, Image, Text, View} from "react-native";

export default class LectureDetailPage extends React.Component {

	render() {
		return <View style={CommonStyles.container}>
			<Text>강좌 강의클립 목록</Text>
			<Button
				onPress={()=>this.props.navigation.goBack()}
				title="뒤로"
			/>

		</View>
	}
}