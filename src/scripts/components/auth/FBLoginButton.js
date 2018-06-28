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

const styles = StyleSheet.create( {
	FbButtonWrap: {
		width: '100%',
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
class FBLoginButton extends Component {


	handleFacebookLogin = ()=> {

		LoginManager.logInWithReadPermissions([])
			.then( result=>{
				if (result.isCancelled) {
					alert('Login cancelled')
				} else {
					AccessToken.getCurrentAccessToken().then(
						( data ) => {
							alert( data.accessToken.toString() )
						}
					)
				}
			})
			.catch( error =>{
				alert( error );
			});
	}

    render() {
        return <TouchableOpacity
			activeOpacity={0.9}
			onPress={ this.handleFacebookLogin }
			style={ styles.FbButtonWrap }
		>
			<View style={ styles.FbButton } borderRadius={4}>
				<Image source={ icFb } style={ styles.FbImage }/>
				<Text style={ styles.FbText }>Facebook 계정으로</Text>
			</View>
            </TouchableOpacity>;
    }
}


export default FBLoginButton;
