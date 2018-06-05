import React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {createDrawerNavigator} from "react-navigation";
import { HomeScreen, VideoScreen, AudioScreen, MyScreen } from "./src/js/components/SideMenuItem";


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
    }
});