import React from 'react';
import {createDrawerNavigator} from "react-navigation";
import HomeScreen from './src/scripts/pages/home/HomeScreen';
import VideoScreen from './src/scripts/pages/video/VideoScreen';
import AudioScreen from './src/scripts/pages/audio/AudioScreen';
import MyScreen from './src/scripts/pages/my/MyScreen';
import Playground from "./src/scripts/pages/Playground";

export default createDrawerNavigator({
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

    Playground:{
        screen: Playground,
    }
});