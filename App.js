import React from 'react';
import {createDrawerNavigator} from "react-navigation";
import HomeScreen from './src/js/pages/home/HomeScreen';
import VideoScreen from './src/js/pages/video/VideoScreen';
import AudioScreen from './src/js/pages/audio/AudioScreen';
import MyScreen from './src/js/pages/my/MyScreen';
import Playground from "./src/js/pages/Playground";

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