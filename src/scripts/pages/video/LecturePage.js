import React from "react";
import {
	Text,
	View,
	Button,
	FlatList,
	ScrollView,
	TouchableOpacity, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import CommonStyles from "../../../styles/common";
import VideoCategory from "./VideoCategory";
import Lecture from "../../components/video/Lecture";
import net from "../../commons/net";

const styles = StyleSheet.create( {
	toggleGroup: {
		width: '100%',
		height: 50,
		padding: 12,
		backgroundColor: '#FFFFFF',
	},
	alignJustify: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	sortWrap: {
		width: 100,
	},
	sortButton: {
		paddingLeft: 8,
		paddingRight: 8,
	},
	sortDot: {
		width: 6,
		height: 6,
		marginRight: 5,
		backgroundColor: '#d7d7d7',
	},
	sortText: {
		fontSize: 12,
		color: '#4A4A4A',
	},
	sortBar: {
		width: 1,
		height: 17,
		backgroundColor: '#CFCFCF',
	},
	clipButton: {
		paddingTop: 3,
		paddingBottom: 3,
		paddingLeft: 10,
		paddingRight: 10,
		borderWidth: 1,
		borderColor: '#CBCBCB',
		fontSize: 12,
		color: '#585858',
	}
} );

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
				<View style={styles.toggleGroup}>
					<View style={styles.alignJustify}>
						<View style={styles.sortWrap}>
							<View style={styles.alignJustify}>
								<TouchableOpacity activeOpacity={0.9}
												  style={[ styles.alignJustify, styles.sortButton ]}>
									<View style={styles.sortDot} borderRadius={3}/>
									<Text style={styles.sortText}>인기</Text>
								</TouchableOpacity>
								<View style={styles.sortBar}/>
								<TouchableOpacity activeOpacity={0.9}
												  style={[ styles.alignJustify, styles.sortButton ]}>
									<View style={styles.sortDot} borderRadius={3}/>
									<Text style={styles.sortText}>신규</Text>
								</TouchableOpacity>
							</View>
						</View>
						<TouchableOpacity activeOpacity={0.9} style={{ marginLeft: 'auto' }}>
							<View style={styles.clipButton} borderRadius={3}>
								<Text>강의클립 전체보기</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				<VideoCategory/>

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

