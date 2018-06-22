import React from "react";
import {
	Text,
	View,
	Button,
	FlatList,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import CommonStyles from "../../../styles/common";
import VideoCategory from "./VideoCategory";
import Lecture from "../../components/video/Lecture";
import net from "../../commons/net";

export default class CourseList extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			videoCourseData: {}
		};
	}

	async componentDidMount() {
		const result = await net.getLectureList();
		this.setState( {
			videoCourseData: result
		} );
	}

	render() {
		return <SafeAreaView style={[ CommonStyles.container, { backgroundColor: '#ecf0f1' } ]}>
			<ScrollView style={{ width: '100%' }}>
				<View>
					<Text>인기 | 신규 & Toggle 위치</Text>
					{/*<Button*/}
					{/*onPress={()=>this.props.navigation.navigate('ClipList')}*/}
					{/*title="강의클립 전체보기"*/}
					{/*/>*/}
				</View>

				<VideoCategory/>

				<View>
					<Button
						onPress={this.changePage}
						title="강좌 강의클립 목록"
					/>
				</View>

				<FlatList
					style={{ width: '100%' }}
					data={this.state.videoCourseData.items}
					renderItem={
						( { item } ) => <Lecture id={item.id}
												 navigation={this.props.navigation}
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

