import React from "react";
import {AsyncStorage, Button, Text, View} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';

/*
* 로그인 후 보여지는 화면
* */
export default class MyInfoSubPage extends React.Component {


	render() {
		return <View style={CommonStyles.container}>
			<Text>내정보 서브페이지</Text>
			<Button
				onPress={()=>this.props.navigation.navigate('MyInfoHome')}
				title="뒤로"
			/>
		</View>
	}
}