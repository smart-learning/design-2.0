import React from 'react';
import Styles from "../../../styles/common";
import {SafeAreaView} from "react-navigation";
import {AsyncStorage, Button, Text} from "react-native";

class LoginPage extends React.Component {



    login = async ()=>{
        await AsyncStorage.setItem('userToken', 'temp-token');
        this.props.navigation.navigate('My');
    }


    render() {
        return <SafeAreaView style={[ Styles.container, {backgroundColor: '#ecf0f1'}]}>

            <Text>LOGIN</Text>
            <Button
                title="Login"
                onPress={ this.login }
            />

        </SafeAreaView>
    }
}


export default LoginPage;
