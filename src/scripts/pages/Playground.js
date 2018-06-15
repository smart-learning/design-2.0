import React, {Component} from 'react';
import {Button, StatusBar, Text, View, FlatList} from "react-native";
import CommonStyles from "../../styles/common";
import {SafeAreaView} from "react-navigation";
import VideoItemCourse from "./video/VideoItemCourse";
import VideoItemClip from "./video/VideoItemClip";
import Net from "../commons/net";
// import VideoPack from "../commons/VideoPack";
// import Video from "react-native-video";
// import VideoItemCourse from "/video/VideoItemCourse"

class Playground extends Component {

	constructor(props) {
		super(props);

		this.state = {
			videoCourseData: null,
			videoClipData: null,
		};
	}


	componentDidMount() {
		Net.getVideoCourseList()
			.then(data => {
				this.setState({videoCourseData: data})
			});

		Net.getVideoClipList()
			.then(data => {
				this.setState({videoClipData: data})
			});
	}

	render() {
		return <SafeAreaView style={[CommonStyles.container, {backgroundColor: '#ecf0f1'}]}>

			<Text>PLAYGROUND</Text>
			<Button
				title="Home screen"
				onPress={() => this.props.navigation.navigate('HomeScreen')}
			/>

			{/*<VideoPack/>*/}

			<FlatList
				style={{width: '100%'}}
				data={this.state.videoCourseData}
				renderItem={
					({item}) => <VideoItemCourse title={item.title}
												 subTitle={item.subTitle}
												 thumbnail={item.thumbnail}
												 courseCount={item.courseCount}
												 viewCount={item.viewCount}
												 starCount={item.starCount}
												 reviewCount={item.reviewCount}/>
				}
			/>

			<FlatList
				style={{width: '100%'}}
				data={this.state.videoClipData}
				renderItem={
					({item}) => <VideoItemClip title={item.title}
												 subTitle={item.subTitle}
												 authorInfo={item.authorInfo}
												 paragraph={item.paragraph}
												 thumbnail={item.thumbnail}
												 viewCount={item.viewCount}
												 starCount={item.starCount}/>
				}
			/>
		</SafeAreaView>
	}
}


export default Playground;
