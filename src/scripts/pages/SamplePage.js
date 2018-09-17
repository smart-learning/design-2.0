import React from "react";
import Styles from "../../styles/common";
import {Text, View} from "react-native";

export default class SamplePage extends React.Component {

	render() {
		return <View style={Styles.container}>
			<Text>이곳은 라우터 연결용 샘플 페이지 입니다.</Text>
			<Text>HomeScreen.js를 참고하여 새로 클래스를 생성해서 연결해주세요.</Text>
		</View>
	}
}