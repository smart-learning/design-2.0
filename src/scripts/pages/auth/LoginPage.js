import React from 'react';
import Styles from "../../../styles/common";
import {SafeAreaView} from "react-navigation";
import {AsyncStorage, Button, Text} from "react-native";

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

        </SafeAreaView>
    }
}


export default LoginPage;
