import React from "react";
import {
	Text,
	View,
	FlatList,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import CommonStyles from "../../../styles/common";
import net from "../../commons/net";
import VideoItemCourse from "./VideoItemCourse";
import VideoCategory from "./VideoCategory";

export default class VideoList extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			videoCourseData: {},
			videoClipData: null,
		};
	}

	componentDidMount() {
		return fetch( 'http://ec2-contents-api.welaa.co.kr/api/v1.0/video-courses' )
			.then( ( response ) => response.json() )
			.then( ( responseJson ) => {
				responseJson.items.forEach( element => {
					element.key = element.id.toString();
				} );

				this.setState( {
					videoCourseData: responseJson
				} )
			} )
			.catch( ( error ) => {
				console.error( error );
			} );
	}

	render() {
		return <SafeAreaView style={[ CommonStyles.container, { backgroundColor: '#ecf0f1' } ]}>
			<ScrollView style={{ width: '100%' }}>
				<View>
					<Text>인기 | 신규 & Toggle 위치</Text>
				</View>

				<VideoCategory/>

				<FlatList
					style={{ width: '100%' }}
					data={this.state.videoCourseData.items}
					renderItem={
						( { item } ) => <VideoItemCourse key={item.id}
														 headline={item.headline}
														 teacherHeadline={item.teacher.headline}
														 teacherName={item.teacher.name}
														 title={item.title}
														 thumbnail={item.images.wide}
														 clipCount={item.clip_count}
														 hitCount={item.hit_count}
														 starAvg={item.star_avg}
														 reviewCount={item.review_count}/>
					}
				/>
			</ScrollView>
		</SafeAreaView>
	}
}