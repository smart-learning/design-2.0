import React, { Component } from 'react';
import {Button, Modal, Text, TouchableHighlight, View} from "react-native";
import CommonStyles from "../../styles/common";
import {SafeAreaView} from "react-navigation";
import { ImageView, RNAudioPlayer} from 'rnn-module-ui-sample';
import {NAV_OPTS_DRAWER} from "../commons/nav";
import VideoScreen from "./video/VideoScreen";

import {NativeModules} from 'react-native';

/*
* Acount: test/test
* http://www.media-drm.com/Demo1.aspx
* */
class PlaygroundJune extends Component {

	onPlay = () =>{
		// alert('play');
		// RNAudioPlayer.play("http://vprbbc.streamguys.net/vprbbc24-mobile.mp3");
		var args = {
			uri: "uri"
		}
		NativeModules.RNNativePlayer.play(args);
	}
	onDownload = () =>{
		// alert('play');
		// RNAudioPlayer.play("http://vprbbc.streamguys.net/vprbbc24-mobile.mp3");
		var args = {
			uri: "uri"
		}
		NativeModules.RNNativePlayer.download(args);
	}

    render() {




        return <SafeAreaView style={[ CommonStyles.container, {backgroundColor: '#cccccc'}]}>

            <Text>VIDEO TEST</Text>

			<Button title="재생"
					onPress={ this.onPlay }
			/>
			
			<Button title="다운로드"
					onPress={ this.onDownload }
			/>

			{/* <ImageView
				style={{ width:100, height:100 }}
				src={[{ uri: "https://pbs.twimg.com/tweet_video_thumb/Dg3sOjuV4AEtzIR.jpg", width:100, height:100}]}
			/> */}

        </SafeAreaView>
    }
}

PlaygroundJune.navigationOptions = NAV_OPTS_DRAWER;

export default PlaygroundJune;
