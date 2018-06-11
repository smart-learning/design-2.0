import React, { Component } from 'react';
import {Text, View} from "react-native";
import CommonStyles from "../../styles/common";
import {SafeAreaView} from "react-navigation";
import Video from "react-native-video";


/*
* Acount: test/test
* http://www.media-drm.com/Demo1.aspx
* */
class VideoTest extends Component {
    render() {
        return <SafeAreaView style={[ CommonStyles.container, {backgroundColor: '#ecf0f1'}]}>

            <Text>VIDEO TEST</Text>
            <Video
                source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
            />

        </SafeAreaView>
    }
}


export default VideoTest;
