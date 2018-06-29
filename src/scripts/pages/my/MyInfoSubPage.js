import Styles from "../../../styles/common";
import {AsyncStorage, Button, Text, View} from "react-native";
import React from "react";
import Store from '../../../scripts/commons/store';

/*
* 로그인 후 보여지는 화면
* */
export default class MyInfoSubPage extends React.Component {


	render() {
		return <View style={Styles.container}>
			<Text>내정보 서브페이지</Text>
		</View>
	}
}