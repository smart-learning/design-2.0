import React from 'react';
import CommonStyles from "../../../styles/common";
import {
	Keyboard,
	Text,
	Image,
	ImageBackground,
	StyleSheet,
	View, KeyboardAvoidingView,
	AsyncStorage,
	BackHandler,
	Alert
} from "react-native";
import KakaoLoginButton from "../../components/auth/KakaoLoginButton";
import EmailAuthPack from "../../components/auth/EmailAuthPack";
import logo from '../../../images/logo-en-primary.png';
import bgLogin from '../../../images/bg-signup.jpg';
import FBLoginButton from "../../components/auth/FBLoginButton";
import store from '../../../scripts/commons/store';
import net from "../../commons/net";
import { observable } from "mobx";
import { observer } from "mobx-react";
import Store from "../../commons/store";

const styles = StyleSheet.create( {
	loginContainer: {
		position: 'relative',
	},
	background: {
		width: '100%',
		height: '100%',
		paddingTop: 50,
	},
	logoWrap: {
		zIndex: 9,
		alignItems: 'center',
		height: 50,
		marginTop: -70,
		marginBottom: 50,
	},
	logo: {
		width: 110,
		height: 28,
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
} );

class LoginPage extends React.Component {
	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		this.props.navigation.navigate( 'HomeScreen' );
		return true;
	};

	/*
	* @params email: 이메일이나 소셜 타입
	* @params password: 이메일비번이나 소셜 토큰
	* */
	login = ( email, password ) => {
		let { navigation } = this.props;
		const resultAuthToken = net.getAuthToken( email, password);

		resultAuthToken
			.then(data => {
				store.socialType = email;
				store.welaaaAuth = data;
				navigation.navigate( navigation.getParam( 'requestScreenName', 'MyInfoHome' ) );
			})
			.catch(error => {
				const code = error.response.code;
				let message = '로그인 실패';
				if( error.response.data && error.response.data.error ) {
					message += ` (server message: ${error.response.data.error})`;
				}
				Alert.alert( message );
			});
	}


	render() {
		return (
			<View style={[ CommonStyles.container, styles.loginContainer ]}>
				<ImageBackground source={bgLogin}
								 style={styles.background}
				>
					<View style={styles.contentWrap}>
						<View style={styles.logoWrap}>
							<Image source={logo} style={styles.logo}/>
						</View>

						<Text style={styles.headline}>LOGIN</Text>

						<FBLoginButton
							onAccess={token => this.login( 'facebook', token )}
							type={'login'}
						/>

						<KakaoLoginButton
							onAccess={token => this.login( 'kakaotalk', token )}
							type={'login'}
						/>

						<Text style={styles.bulletText}>OR</Text>

						<EmailAuthPack
							onAccess={ this.login }
							onNavigate={routerName => this.props.navigation.navigate( routerName )}
						/>

					</View>

				</ImageBackground>
			</View>
		);
	}
}


export default LoginPage;
