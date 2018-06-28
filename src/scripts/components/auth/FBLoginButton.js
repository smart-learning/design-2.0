import React, { Component } from 'react';
import {Text, TouchableOpacity} from "react-native";
import {AccessToken, LoginManager} from "react-native-fbsdk";

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
        return <TouchableOpacity onPress={ this.handleFacebookLogin }>
				<Text>페이스북 로그인 버튼</Text>
            </TouchableOpacity>;
    }
}


export default FBLoginButton;
