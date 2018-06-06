import React from "react";
import S from "../../../styles/common";
import {Image, Text, View} from "react-native";
import {createStackNavigator} from "react-navigation";
import HomeSubScreen1 from "./HomeSubScreen1";
import HomeSubScreen2 from "./HomeSubScreen2";

const HomeScreen = createStackNavigator({

    HomeScreen1:{
        screen: HomeSubScreen1,
        navigationOptions: ({ navigation }) => ({
            title: `서브페이지 스택 헤더1`,
        }),
    },

    HomeScreen2:{
        screen: HomeSubScreen2,
        navigationOptions: ({ navigation }) => ({
            title: `서브페이지 스택 헤더2`,
        }),
    }
});

HomeScreen.navigationOptions = {
    drawerLabel: '홈',
    drawerIcon: ({ tintColor }) => (
        <Image
            source={require('../../../images/chats-icon.png')}
            style={[S.sidebarIcon, {tintColor: tintColor}]}
        />
    ),
};

export default HomeScreen;