import React from 'react';
import {createDrawerNavigator, DrawerActions } from "react-navigation";
import HomeScreen from './src/scripts/pages/home/HomeScreen';
import VideoScreen from './src/scripts/pages/video/VideoScreen';
import AudioScreen from './src/scripts/pages/audio/AudioScreen';
import MyScreen from './src/scripts/pages/my/MyScreen';
import Playground from "./src/scripts/pages/Playground";
import {Button, View} from "react-native";
import Store from "./src/js/store";

class App extends React.Component {


    render() {
        return <View style={{flex:1}}>
            <AppDrawer ref={ navigatorRef => { Store.drawer = navigatorRef  } }/>
            <View style={{ position:'absolute', bottom:0, right:0 }}>
                <Button title="Open Side"
                    onPress={()=>{
                        Store.drawer.dispatch( DrawerActions.toggleDrawer() )
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
        }
    },

    {
        headerMode:'float'
    }
);

export default App