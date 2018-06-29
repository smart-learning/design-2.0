import React, {Component} from 'react';
import {
	TouchableOpacity,
	NativeModules,
	Text,
	StyleSheet,
	View,
	Image,
} from "react-native";
import icKakao from '../../../images/ic-kakao.png';

const styles = StyleSheet.create( {
	kakaoButtonWrap: {
		width: '100%',
	},
	kakaoButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 48,
		marginTop: 10,
		backgroundColor: '#FFEB00',
	},
	kakaoImage: {
		width: 22,
		height: 20,
		marginRight: 5,
	},
	kakaoText: {
		lineHeight: 48,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#3C1E1E',
	}
} );

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

		// alert( kakaoAccessToken );

		this.setState({ token: kakaoAccessToken });


		this.props.onAccess( kakaoAccessToken );
	}

    render() {
        return <TouchableOpacity
			activeOpacity={0.9}
			onPress={ this.signInOut }
			style={ styles.kakaoButtonWrap }
		>
			<View style={ styles.kakaoButton } borderRadius={4}>
				<Image source={ icKakao } style={ styles.kakaoImage }/>
				<Text style={ styles.kakaoText }>{ this.state.token?'카카오 로그아웃':'Kakaotalk 계정으로' }</Text>
			</View>
		</TouchableOpacity>;
    }
}

export default KakaoLoginButton;