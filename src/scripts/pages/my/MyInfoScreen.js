import Styles from "../../../styles/common";
import {AsyncStorage, Button, Text, View} from "react-native";
import React from "react";

/*
* 로그인 후 보여지는 화면
* */
export default class MyInfoScreen extends React.Component {

	logout = async () => {
		await AsyncStorage.clear();
		this.props.navigation.navigate('Auth');
	}

	getToken = async () => {
		const userToken = await AsyncStorage.getItem('userToken');

		alert('userToken-:' + userToken);
	};

	render() {
		return <View style={Styles.container}>
			<Text>내정보</Text>
			<Button title="Logout" onPress={this.logout}/>
			<Button title="Token" onPress={this.getToken}/>
		</View>
	}
}