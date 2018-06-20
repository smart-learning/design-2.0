import React from 'react';
import {createDrawerNavigator, DrawerActions} from "react-navigation";
import HomeScreen from './src/scripts/pages/home/HomeScreen';
import VideoScreen from './src/scripts/pages/video/VideoScreen';
import AudioScreen from './src/scripts/pages/audio/AudioScreen';
import MyScreen from './src/scripts/pages/my/MyScreen';
import Playground from "./src/scripts/pages/Playground";
import {Button, Modal, Text, View} from "react-native";
import Store from "./src/scripts/commons/store";
import PlaygroundJune from "./src/scripts/pages/PlaygroundJune";
import LoginPage from "./src/scripts/pages/auth/LoginPage";

class App extends React.Component {

    render() {
        return <View style={{flex: 1}}>
            <AppDrawer ref={navigatorRef => {
                Store.drawer = navigatorRef
            }}/>
            <View style={{position: 'absolute', bottom: 20, right: 100}}>
                <Button title="Open Side"
                        onPress={() => {
                            Store.drawer.dispatch(DrawerActions.toggleDrawer())
                        }}
                />
            </View>
        </View>
    }
}

const AppDrawer = createDrawerNavigator(
    {
        HomeScreen: {
            screen: HomeScreen,
        },

        VideoScreen: {
            screen: VideoScreen,
        },

        AudioScreen: {
            screen: AudioScreen,
        },

        MyScreen: {
            screen: MyScreen,
        },

        Playground: {
            screen: Playground,
        },

        June:{
        	screen: PlaygroundJune,
        },

        // invisible screens
        Login: {
            screen: LoginPage,
        }
    }
);

export default App;