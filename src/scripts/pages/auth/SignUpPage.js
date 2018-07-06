import React from 'react';
import {
	Text,
	StyleSheet,
	View, KeyboardAvoidingView, AsyncStorage, Button
} from "react-native";
import KakaoLoginButton from "../../components/auth/KakaoLoginButton";
import FBLoginButton from "../../components/auth/FBLoginButton";
import Store from '../../../scripts/commons/store';

const styles = StyleSheet.create({
	loginContainer: {
		position: 'relative',
	},
	background: {
		width: '100%',
		height: '100%',
		paddingTop: 50,
	},
	logoWrap: {
		position: 'absolute',
		top: 20,
		zIndex: 9,
		alignItems: 'center',
		height: 50,
	},
	logo: {
		width: 110,
		height: 28,
		marginTop: 20,
	},
	contentWrap: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '80%',
		marginLeft: '10%',
	},
	headline: {
		paddingBottom: 60,
		textAlign: 'center',
		fontSize: 40,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	bulletText: {
		marginTop: 15,
		marginBottom: 15,
		fontSize: 14,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#ffffff'
	},
});


class SignUpPage extends React.Component {

	onAccessToken(type, token) {

		Store.setToken(type, token);
		this.props.navigator.navigate('HomeScreen');
	}

	render() {
		return <View>

			<Button title="홈으로"
					onPress={ ()=> this.props.navigation.navigate('HomeScreen') }
			/>

			<Text>뒤에 갤러리 있는 회원가입 페이지</Text>

			<View>
				<Text style={styles.headline}>SIGN UP</Text>

				<FBLoginButton
					onAccess={token => this.onAccessToken('facebook', token)}
				/>

				<KakaoLoginButton
					onAccess={token => this.onAccessToken('kakao', token)}
				/>

				<Button title="이메일 간편가입" onPress={() => this.props.navigation.navigate('EmailSignUpForm')}/>

				<Button title="개인보고정책" onPress={()=> this.props.navigation.navigate('SignUpPolicy')}/>
			</View>

		</View>
	}
}


SignUpPage.navigationOptions =()=>{
	return {
		header: null
	}
}


export default SignUpPage;
