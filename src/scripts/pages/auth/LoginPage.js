import React from 'react';
import CommonStyles from "../../../styles/common";
import { SafeAreaView } from "react-navigation";
import {
	Keyboard,
	Text,
	Image,
	ImageBackground,
	StyleSheet,
	View, KeyboardAvoidingView
} from "react-native";
import { LoginManager, LoginButton, AccessToken } from "react-native-fbsdk";
import KakaoLoginButton from "../../components/auth/KakaoLoginButton";
import EmailAuthPack from "../../components/auth/EmailAuthPack";
import logo from '../../../images/logo-en-primary.png';
import bgLogin from '../../../images/bg-signup.jpg';
import FBLoginButton from "../../components/auth/FBLoginButton";

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


	static navigationOptions = {
		drawerLabel: () => null
	};

	// login = async () => {
	// 	await AsyncStorage.setItem( 'userToken', 'temp-token' );
	// 	this.props.navigation.navigate( 'MyScreen' );
	// };


	componentDidMount(){
		this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
		this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
	}

	componentWillUnmount() {
		this.keyboardWillShowSub.remove();
		this.keyboardWillHideSub.remove();
	}

	keyboardWillShow = (event) => {
		console.log('키보드 나옴');
	};

	keyboardWillHide = (event) => {
		console.log('키보드 들어감');
	};

	render() {
		return <KeyboardAvoidingView style={[ CommonStyles.container, styles.loginContainer ]} behavior="padding">
			<View style={styles.logoWrap}>
				<Image source={logo} style={styles.logo}></Image>
			</View>
			<ImageBackground source={bgLogin}
							 style={styles.background}
			>
				<View style={styles.contentWrap}>
					<Text style={styles.headline}>LOGIN</Text>
					{/*<Button*/}
						{/*title="Login"*/}
						{/*onPress={this.login}*/}
					{/*/>*/}

					<FBLoginButton/>

					<KakaoLoginButton/>

					<Text style={ styles.bulletText }>OR</Text>

					<EmailAuthPack/>
				</View>

			</ImageBackground>
		</KeyboardAvoidingView>
	}
}


export default LoginPage;
