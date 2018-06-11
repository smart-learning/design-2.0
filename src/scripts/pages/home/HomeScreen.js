import React from "react";
import {Image, Text} from "react-native";
import {createStackNavigator} from "react-navigation";
import HomeSubScreen1 from "./HomeSubScreen1";
import HomeSubScreen2 from "./HomeSubScreen2";
import Styles from "../../../styles/common";
import HeaderWithSearch from "../../commons/HeaderWithSearch";

const HomeScreen = createStackNavigator({

        HomeScreen1: {
            screen: HomeSubScreen1,
            navigationOptions: ({ navigation, navigationOptions }) => ({
                headerTitle: <HeaderWithSearch/>
            }),
        },

        HomeScreen2: {
            screen: HomeSubScreen2,
            navigationOptions: ({ navigation }) => ({
                title: `서브페이지 스택 헤더2`,
            }),
        }
    },

    {
        /* The header config from HomeScreen is now here */
        // navigationOptions: {
        //     headerStyle: {
        //         backgroundColor: '#00b870',
        //         paddingLeft: 15,
        //         paddingRight: 15,
        //     },
        //     headerTintColor: '#fff',
        //     headerTitleStyle: {
        //         fontWeight: 'bold',
        //     },
        // },
    }
);

HomeScreen.navigationOptions = ({navigation})=>({

    drawerLabel: '홈',
    drawerIcon: ({tintColor}) => (
        <Image
            source={require('../../../images/chats-icon.png')}
            style={[Styles.size24, {tintColor: tintColor}]}
        />
    )
});

export default HomeScreen;