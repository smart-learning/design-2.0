import Styles from "../../../styles/common";
import {AsyncStorage, Button, Text, View} from "react-native";
import React from "react";
import Store from '../../../scripts/commons/store';

/*
* 로그인 후 보여지는 화면
* */
export default class MyInfoScreen extends React.Component {

	logout=()=>{
		Store.clearToken();
		this.props.navigation.navigate('Login');
	}

	getToken=()=>{
		alert('userToken-:' + Store.token );
	};

	render() {
		return <View style={Styles.container}>
			<Text>내정보</Text>
			<Button title="Logout" onPress={this.logout}/>
			<Button title="Token" onPress={this.getToken}/>
		</View>
	}
}