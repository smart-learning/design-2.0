import React, {Component} from 'react';
import {Button, Modal, Text, Share} from "react-native";
import CommonStyles from "../../styles/common";
import {SafeAreaView} from "react-navigation";
import {ImageView, RNAudioPlayer} from 'rnn-module-ui-sample';
import {NAV_OPTS_DRAWER} from "../commons/nav";
import VideoScreen from "./video/VideoScreen";
import Device from '../../scripts/commons/device';

/*
* Acount: test/test
* http://www.media-drm.com/Demo1.aspx
* */
class PlaygroundJune extends Component {

	onPlay = () => {
		// alert('play');
		RNAudioPlayer.play("http://vprbbc.streamguys.net/vprbbc24-mobile.mp3");
	}


	render() {


		return <SafeAreaView style={[CommonStyles.container, {backgroundColor: '#cccccc'}]}>

			<Text>VIDEO TEST</Text>

			<Button title="재생"
					onPress={this.onPlay}
			/>

			<Button title="디바이스언어"
					onPress={() => {
						alert(Device.getLocale())
					}}
			/>

			<Button title="디바이스변수가져오기"
					onPress={() => {
						alert(Device.getPlatformValue('test_var'))
					}}
			/>

			<Button title="공유"
					onPress={() => {
						Device.share( 'ㅈ목ㄲ', 'ㄴㄴㄴㄴㄴㄴㄴㄴ', 'http://welaaa.com');
					}}
			/>

			<ImageView
				style={{width: 100, height: 100}}
				src={[{uri: "https://pbs.twimg.com/tweet_video_thumb/Dg3sOjuV4AEtzIR.jpg", width: 100, height: 100}]}
			/>

		</SafeAreaView>
	}
}

PlaygroundJune.navigationOptions = NAV_OPTS_DRAWER;

export default PlaygroundJune;
