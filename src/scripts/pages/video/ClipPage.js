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
import VideoCategory from "../../components/video/VideoCategory";
import Clip from "../../components/video/Clip";
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
	},
	clipButtonText: {
		fontSize: 12,
		color: '#585858',
	},
	linkViewAll: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: 36,
		marginLeft: 'auto',
		marginRight: 'auto',
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	classLinkViewAll: {
		marginTop: 15,
		marginBottom: 30,
	},
	linkViewAllText: {
		fontSize: 14,
		color: '#ffffff',
	},
	linkViewAllIcon: {
		paddingLeft: 7,
		height: 13,
	},
} );

export default class ClipPage extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			videoClipData: [],
			videoCategoryData: {}
		};
	}

	async componentDidMount() {
		const resultvideoClipData = await net.getClassList();
		const resultVideoCategoryData = await net.getLectureCategory();
		this.setState( {
			videoClipData: resultvideoClipData,
			videoCategoryData: resultVideoCategoryData,
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
						<TouchableOpacity activeOpacity={0.9}
										  style={{ marginLeft: 'auto' }}
										  onPress={() => {
											  this.props.navigation.navigate( 'ClassListPage' )
										  }}
						>
							<View style={styles.clipButton} borderRadius={3}>
								<Text style={styles.clipButtonText}>강좌로 모아보기</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				<VideoCategory data={this.state.videoCategoryData.items}/>

				<FlatList
					style={{ width: '100%' }}
					data={this.state.videoClipData.items}
					renderItem={
						( { item } ) => <Clip id={item.id}
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

				<View style={CommonStyles.contentContainer}>
					<TouchableOpacity activeOpacity={0.9}>
						<View style={[ styles.linkViewAll, styles.classLinkViewAll ]} borderRadius={5}>
							<Text style={styles.linkViewAllText}>더보기</Text>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	}
}

