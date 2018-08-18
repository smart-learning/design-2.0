import Styles from "../../../styles/common";
import {AsyncStorage, Button, Text, View} from "react-native";
import React from "react";
import Store from '../../../scripts/commons/store';

/*
* 로그인 후 보여지는 화면
* */
export default class LectureBuyPage extends React.Component {


	render() {
		return <View style={Styles.container}>
			<Text>LectureBuyPage 서브페이지</Text>
			<Button
				onPress={()=>this.props.navigation.navigate('MyInfoHome')}
				title="뒤로"
			/>
		</View>
	}
}