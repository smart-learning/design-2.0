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
import {AppEventsLogger} from 'react-native-fbsdk';

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

	state = {
		token: null,
		loginButtonDisabled: false,
	}

	signInOut = async () =>{
		const { RNKaKaoSignin } = NativeModules;
		this.setState({ loginButtonDisabled: true })

		try {
			const kakaoAccessToken = await RNKaKaoSignin.signIn();

			console.log( kakaoAccessToken );

			// 카카오톡 회원 가입이 완료된 상태 
			AppEventsLogger.logEvent('WELAAARN_KAKAO_SIGN_UP');  
			this.setState({ token: kakaoAccessToken });
			this.props.onAccess( kakaoAccessToken, () => {
				this.setState({ loginButtonDisabled: false })
			} );

		} catch(err) {
			console.log("Login Error!!", err );
			this.setState({ loginButtonDisabled: false })
		}
	}

    render() {
        return <TouchableOpacity
			activeOpacity={0.9}
			onPress={ this.signInOut }
			disabled={this.state.loginButtonDisabled}
			style={ styles.kakaoButtonWrap }
		>

			{this.props.type === 'login' &&
			<View style={ loginStyles.kakaoButton } borderRadius={4}>
				<Image source={ icKakao } style={ loginStyles.kakaoImage }/>
				<Text style={ loginStyles.kakaoText }>{ this.state.token?'카카오 로그아웃':
					this.state.loginButtonDisabled
						? '로그인중'
						:'Kakaotalk 계정으로'
				 }</Text>
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
				<Text style={ landingStyles.kakaoText }>{ this.state.token?'카카오 로그아웃':
					this.state.loginButtonDisabled
						? '로그인중'
						:'카카오톡 계정으로'
				 }</Text>
			</View>
			}
		</TouchableOpacity>;
    }
}

export default KakaoLoginButton;