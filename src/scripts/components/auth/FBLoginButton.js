import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
} from "react-native";
import {AccessToken, LoginManager} from "react-native-fbsdk";
import icFb from '../../../images/ic-fb.png';
import icFbBox from '../../../images/ic-fb-box.png';

const styles = StyleSheet.create( {
	FbButtonWrap: {
		width: '100%',
	},
} );

const loginStyles = StyleSheet.create( {
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

const landingStyles = StyleSheet.create( {
	FbButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 40,
		marginTop: 10,
	},
	FbImage: {
		width: 22,
		height: 20,
		marginRight: 25,
	},
	FbText: {
		lineHeight: 40,
		fontSize: 15,
		fontWeight: 'bold',
		color: '#ffffff',
	}
} );
class FBLoginButton extends Component {

	state = {
		loginButtonDisabled: false,
	}

	handleFacebookLogin = ()=> {
		this.setState({ loginButtonDisabled: true })
		LoginManager.logOut()
		LoginManager.logInWithReadPermissions([])
			.then( result=>{
				if (result.isCancelled) {
					alert('Login cancelled')
				} else {
					AccessToken.getCurrentAccessToken().then(
						( data ) => {
							//alert( data.accessToken.toString() )
							this.props.onAccess( data.accessToken.toString(), () => {
								this.setState({ loginButtonDisabled: false })
							} );
						}
					)
				}
			})
			.catch( error =>{
				this.setState({ loginButtonDisabled: false })
				alert( error );
			});
	}

    render() {
        return <TouchableOpacity
			activeOpacity={0.9}
			onPress={ this.handleFacebookLogin }
			disabled={this.state.loginButtonDisabled}
			style={ styles.FbButtonWrap }
		>
			{this.props.type === 'login' &&
			<View style={ loginStyles.FbButton } borderRadius={4}>
				<Image source={ icFb } style={ loginStyles.FbImage }/>
				<Text style={ loginStyles.FbText }>
					{this.state.loginButtonDisabled
						? '로그인 중'
						: 'Facebook 계정으로' }
				</Text>
			</View>
			}
			{this.props.type === 'landing' &&
			<View style={ landingStyles.FbButton }
				  borderWidth={1}
				  borderStyle={'solid'}
				  borderColor={'#ffffff'}
				  borderRadius={4}
				  >
				<Image source={ icFbBox } style={ landingStyles.FbImage }/>
				<Text style={ landingStyles.FbText }>
					{this.state.loginButtonDisabled
						? '로그인 중'
						: '페이스북 계정으로' }
				</Text>
			</View>
			}
            </TouchableOpacity>;
    }
}


export default FBLoginButton;
