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
	Alert
} from "react-native";
import KakaoLoginButton from "../../components/auth/KakaoLoginButton";
import EmailAuthPack from "../../components/auth/EmailAuthPack";
import logo from '../../../images/logo-en-primary.png';
import bgLogin from '../../../images/bg-signup.jpg';
import FBLoginButton from "../../components/auth/FBLoginButton";
import store from '../../../scripts/commons/store';

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
} );


class LoginPage extends React.Component {

	componentDidMount() {
		this.keyboardWillShowSub = Keyboard.addListener( 'keyboardWillShow', this.keyboardWillShow );
		this.keyboardWillHideSub = Keyboard.addListener( 'keyboardWillHide', this.keyboardWillHide );

		console.log( this.props.navigation );
	}

	componentWillUnmount() {
		this.keyboardWillShowSub.remove();
		this.keyboardWillHideSub.remove();
	}

	keyboardWillShow = ( event ) => {
		console.log( '키보드 나옴' );
	}

	keyboardWillHide = ( event ) => {
		console.log( '키보드 들어감' );
	}

	setWelaaaAuthAndRedirect = ( auth ) => {
		store.welaaaAuth = auth;

		let requestScreenName = this.props.navigation.getParam( 'requestScreenName', 'MyInfoHome' );
		this.props.navigation.navigate( requestScreenName );
	}

	onSocialToken( type, token ) {
		store.socialType = type;
		store.socialToken = token;

		// TODO: 소셜토큰 받아오기 성공 이후 소셜 토큰을 이용한 welaaa auth 처리 필요합니다
		Alert.alert( '소셜토큰 받아오기 성공. 이후 소셜 토큰을 이용한 welaaa auth 처리 필요합니다' );
		// README: 임시로 페이지 넘어가게 구현해둠
		this.setWelaaaAuthAndRedirect( 'temp' );
	}

	render() {
		return <KeyboardAvoidingView style={[ CommonStyles.container, styles.loginContainer ]} behavior="padding">

			<View style={styles.logoWrap}>
				<Image source={logo} style={styles.logo}/>
			</View>
			<ImageBackground source={bgLogin}
							 style={styles.background}
			>
				<View style={styles.contentWrap}>
					<Text style={styles.headline}>LOGIN</Text>

					<FBLoginButton
						onAccess={token => this.onSocialToken( 'facebook', token )}
						type={'login'}
					/>

					<KakaoLoginButton
						onAccess={token => this.onSocialToken( 'kakao', token )}
						type={'login'}
					/>

					<Text style={styles.bulletText}>OR</Text>

					<EmailAuthPack
						onAccess={auth => this.setWelaaaAuthAndRedirect( auth )}
						onNavigate={routerName => this.props.navigation.navigate( routerName )}
					/>

				</View>

			</ImageBackground>

		</KeyboardAvoidingView>
	}
}


export default LoginPage;
