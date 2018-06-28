import React from 'react';
import CommonStyles from "../../../styles/common";
import { SafeAreaView } from "react-navigation";
import {
	AsyncStorage,
	Button,
	Text,
	Image,
	ImageBackground,
	StyleSheet,
	View
} from "react-native";
import { LoginButton, AccessToken } from "react-native-fbsdk";
import KakaoLoginButton from "../../components/auth/KakaoLoginButton";
import EmailAuthPack from "../../components/auth/EmailAuthPack";
import logo from '../../../images/logo-en-primary.png';
import bgLogin from '../../../images/bg-signup.jpg';
import icFb from '../../../images/ic-fb.png';

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
	FbButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 48,
		marginTop: 10,
		backgroundColor: '#25479b',
	},
	FbImage: {
		width: 22,
		height: 20,
		marginRight: 5,
	},
	FbText: {
		lineHeight: 48,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#ffffff',
	}
} );


class LoginPage extends React.Component {


	static navigationOptions = {
		drawerLabel: () => null
	};

	// login = async () => {
	// 	await AsyncStorage.setItem( 'userToken', 'temp-token' );
	// 	this.props.navigation.navigate( 'MyScreen' );
	// };

	render() {
		return <SafeAreaView style={[ CommonStyles.container, styles.loginContainer ]}>
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


					<LoginButton
						onLoginFinished={
							( error, result ) => {
								if ( error ) {
									alert( "login has error: " + result.error );
								} else if ( result.isCancelled ) {
									alert( "login is cancelled." );
								} else {
									AccessToken.getCurrentAccessToken().then(
										( data ) => {
											alert( data.accessToken.toString() )
										}
									)
								}
							}
						}
						onLogoutFinished={() => alert( "logout." )}
						borderRadius={4}
						style={ styles.FbButton }
					/>


					<KakaoLoginButton/>

					<Text style={ styles.bulletText }>OR</Text>

					<EmailAuthPack/>
				</View>

			</ImageBackground>
		</SafeAreaView>
	}
}


export default LoginPage;
