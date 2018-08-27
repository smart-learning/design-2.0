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
import icKakaoLight from '../../../images/ic-kakao-light.png';

const styles = StyleSheet.create( {
	kakaoButtonWrap: {
		width: '100%',
	},
} );

const loginStyles = StyleSheet.create( {
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

const landingStyles = StyleSheet.create( {
	kakaoButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 40,
		marginTop: 10,
	},
	kakaoImage: {
		width: 22,
		height: 20,
		marginRight: 25,
	},
	kakaoText: {
		lineHeight: 40,
		fontSize: 15,
		fontWeight: 'bold',
		color: '#ffffff',
	}
} );

class KakaoLoginButton extends React.Component {

	constructor(props){
		super();

		this.state = {
			token: null,
		};
	}

	signInOut = async () =>{
		const { RNKaKaoSignin } = NativeModules;

		try {
			const kakaoAccessToken = await RNKaKaoSignin.signIn();

			console.log( kakaoAccessToken );
			this.setState({ token: kakaoAccessToken });
			this.props.onAccess( kakaoAccessToken );

		} catch(err) {
			console.log("Login Error!!", err );
		}
	}

    render() {
        return <TouchableOpacity
			activeOpacity={0.9}
			onPress={ this.signInOut }
			style={ styles.kakaoButtonWrap }
		>

			{this.props.type === 'login' &&
			<View style={ loginStyles.kakaoButton } borderRadius={4}>
				<Image source={ icKakao } style={ loginStyles.kakaoImage }/>
				<Text style={ loginStyles.kakaoText }>{ this.state.token?'카카오 로그아웃':'Kakaotalk 계정으로' }</Text>
			</View>
			}
			{this.props.type === 'landing' &&
			<View style={ landingStyles.kakaoButton }
				  borderWidth={1}
				  borderStyle={'solid'}
				  borderColor={'#ffffff'}
				  borderRadius={4}
			>
				<Image source={ icKakaoLight } style={ landingStyles.kakaoImage }/>
				<Text style={ landingStyles.kakaoText }>{ this.state.token?'카카오 로그아웃':'카카오톡 계정으로' }</Text>
			</View>
			}
		</TouchableOpacity>;
    }
}

export default KakaoLoginButton;