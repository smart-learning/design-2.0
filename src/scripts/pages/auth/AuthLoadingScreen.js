import React from 'react';
import {AsyncStorage} from 'react-native';
import {ActivityIndicator, StatusBar, View} from "react-native";
import Styles from "../../../styles/common";


class AuthLoadingScreen extends React.Component {
    constructor() {
        super();
        this.bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');

        // alert('userToken:' + userToken );

        this.props.navigation.navigate(userToken ? 'AuthorizedMyScreen' : 'Login');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={Styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

export default AuthLoadingScreen;