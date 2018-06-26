import React, {Component} from 'react';
import {TouchableOpacity, NativeModules, Text} from "react-native";


class KakaoLoginButton extends React.Component {

	constructor(props){
		super();

		this.state = {
			token: null,
		};
	}

	signInOut = async ()=>{
		const { RNKaKaoSignin } = NativeModules;


		let kakaoAccessToken = await RNKaKaoSignin.signIn();

		alert( kakaoAccessToken );

		this.setState({ token: kakaoAccessToken });
	}

    render() {
        return <TouchableOpacity onPress={ this.signInOut }>
			<Text>{ this.state.token?'카카오 로그아웃':'카카오 로그인' }</Text>
		</TouchableOpacity>;
    }
}

export default KakaoLoginButton;