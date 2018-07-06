import Styles from "../../../styles/common";
import {AsyncStorage, Button, Image, Text, View} from "react-native";
import React from "react";
import Store from '../../../scripts/commons/store';

/*
* 로그인 후 보여지는 화면
* */
export default class MyInfoHome extends React.Component {

	logout=()=>{
		Store.clearToken();
		this.props.navigation.navigate('Login');
	}

	render() {
		return <View style={Styles.container}>

			{/*<Image*/}
				{/*style={{ position:'absolute', top:0, width:'100%', height:'50%' }}*/}
				{/*source={ { uri:"https://t1.daumcdn.net/cfile/tistory/99361E475B24737B2D"}}/>*/}


			<Text>내정보</Text>
			<Button title="Logout이 원래 이 위치는 아니지만 그냥 테스트로..." onPress={this.logout}/>

			<Button title="서브페이지로..." onPress={ ()=> this.props.navigation.navigate('MyInfoSubExample')}/>
		</View>
	}
}