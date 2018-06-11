import React, { Component } from 'react';
import {Text, View} from "react-native";
import CommonStyles from "../../styles/common";
import {SafeAreaView} from "react-navigation";
import Video from "react-native-video";
import VideoPack from "../commons/VideoPack";


/*
* Acount: test/test
* http://www.media-drm.com/Demo1.aspx
* */
class VideoTest extends Component {
    render() {
        return <SafeAreaView style={[ CommonStyles.container, {backgroundColor: '#ecf0f1'}]}>

            <Text>VIDEO TEST</Text>
            <VideoPack/>

        </SafeAreaView>
    }
}


export default VideoTest;
