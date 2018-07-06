import React from 'react';
import CommonStyles from "../../../styles/common";
import {
	Keyboard,
	Text,
	Image,
	ImageBackground,
	StyleSheet,
	View, KeyboardAvoidingView, AsyncStorage
} from "react-native";
import KakaoLoginButton from "../../components/auth/KakaoLoginButton";
import EmailAuthPack from "../../components/auth/EmailAuthPack";
import logo from '../../../images/logo-en-primary.png';
import bgLogin from '../../../images/bg-signup.jpg';
import FBLoginButton from "../../components/auth/FBLoginButton";
import Store from '../../../scripts/commons/store';

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
	
	componentDidMount(){
		this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
		this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);

		console.log( this.props.navigation );
	}

	componentWillUnmount() {
		this.keyboardWillShowSub.remove();
		this.keyboardWillHideSub.remove();
	}

	keyboardWillShow = (event) => {
		console.log('키보드 나옴');
	}

	keyboardWillHide = (event) => {
		console.log('키보드 들어감');
	}

	onAccessToken( type, token ){

		Store.setToken( type, token );

		let requestScreenName = this.props.navigation.getParam('requestScreenName', 'HomeScreen');
		this.props.navigation.navigate( requestScreenName );
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
						onAccess={ token => this.onAccessToken( 'facebook', token ) }
					/>

					<KakaoLoginButton
						onAccess={ token => this.onAccessToken( 'kakao', token ) }
					/>

					<Text style={ styles.bulletText }>OR</Text>

					<EmailAuthPack
						onAccess={ token => this.onAccessToken( 'email', token ) }
						onNavigate={ routerName => this.props.navigation.navigate( routerName ) }
					/>

				</View>

			</ImageBackground>

		</KeyboardAvoidingView>
	}
}


export default LoginPage;
