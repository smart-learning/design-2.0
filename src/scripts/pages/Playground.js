import React, {Component} from 'react';
import {AppRegistry, Button, StatusBar, Text, View, FlatList, ScrollView} from "react-native";
import CommonStyles from "../../styles/common";
import {SafeAreaView} from "react-navigation";
import VideoItemClip from "./video/VideoItemClip";
import Net from "../commons/net";
// import VideoPack from "../commons/VideoPack";
// import Video from "react-native-video";

class Playground extends Component {

	constructor(props) {
		super(props);

		this.state = {
			videoCourseData: null,
			videoClipData: null,
		};
	}


	componentDidMount() {
		// return fetch('http://dev-1q-contents-api.welaa.co.kr/api/v1.0/video-courses')
		// 	.then((response) => response.json())
		// 	.then((responseJson) => {
        //
		// 		this.setState({
		// 			videoCourseData: responseJson.items,
		// 		}, function(){
        //
		// 		});
        //
		// 	})
		// 	.catch((error) =>{
		// 		console.error(error);
		// 	});
		// Net.getVideoCourseList()
		// 	.then(data => {
		// 		this.setState({videoCourseData: data})
		// 	});
		//
		// Net.getVideoClipList()
		// 	.then(data => {
		// 		this.setState({videoClipData: data})
		// 	});
        //
		// Net.getBookList()
		// 	.then(data => {
		// 		this.setState({audioBookData: data})
		// 	});
	}

	render() {
		return <SafeAreaView style={[CommonStyles.container, {backgroundColor: '#ecf0f1'}]}>

			<ScrollView style={{width: '100%'}}>

				<Text>PLAYGROUND</Text>
				<Button
					title="Home screen"
					onPress={() => this.props.navigation.navigate('HomeScreen')}
				/>

				{/*<VideoPack/>*/}
			</ScrollView>

		</SafeAreaView>
	}
}

export default Playground;
