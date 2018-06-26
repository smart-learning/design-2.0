import React from 'react';
import Styles from "../../../styles/common";
import {SafeAreaView} from "react-navigation";
import {AsyncStorage, Button, Text } from "react-native";
import {LoginButton, AccessToken} from "react-native-fbsdk";
import KakaoLoginButton from "../../components/auth/KakaoLoginButton";
import EmailAuthPack from "../../components/auth/EmailAuthPack";


class LoginPage extends React.Component {


    static navigationOptions = {
        drawerLabel: ()=>null
    };

    login = async ()=>{
        await AsyncStorage.setItem('userToken', 'temp-token');
        this.props.navigation.navigate('MyScreen');
    }

    render() {
        return <SafeAreaView style={[ Styles.container, {backgroundColor: '#ff0000'}]}>

            <Text>LOGIN</Text>
            <Button
                title="Login"
                onPress={ this.login }
            />


			<LoginButton
				onLoginFinished={
					(error, result) => {
						if (error) {
							alert("login has error: " + result.error);
						} else if (result.isCancelled) {
							alert("login is cancelled.");
						} else {
							AccessToken.getCurrentAccessToken().then(
								(data) => {
									alert(data.accessToken.toString())
								}
							)
						}
					}
				}
				onLogoutFinished={() => alert("logout.")}/>

			<KakaoLoginButton/>

			<EmailAuthPack/>

        </SafeAreaView>
    }
}


export default LoginPage;
