import React from "react";
import Styles from "../../../styles/common";
import { AsyncStorage, Button, Image, Text, View} from "react-native";
import {createSwitchNavigator} from "react-navigation";
import AuthLoadingScreen from "../auth/AuthLoadingScreen";

class MyScreen extends React.Component {

    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }

    render() {
        return <View style={Styles.container}>
            <Text>마이</Text>
            <Button title="Logout" onPress={ this.logout }/>
        </View>
    }
}

const MyScreenSet = createSwitchNavigator({
    Auth:{
        screen: AuthLoadingScreen
    },

    MyScreen:{
        screen: MyScreen
    }
});

MyScreenSet.navigationOptions = {
    drawerLabel: '마이',
    drawerIcon: ({ tintColor }) => (
        <Image
            source={require('../../../images/chats-icon.png')}
            style={[Styles.size24, {tintColor: tintColor}]}
        />
    ),
};

export default MyScreenSet;