import React from "react";
import { observer } from 'mobx-react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image, Dimensions, } from "react-native";
import Swiper from 'react-native-swiper';
import CommonStyles, { TEXT_PRIMARY } from "../../../styles/common";
import IcClip from "../../../images/ic-detail-label-clip.png";
import IcFile from "../../../images/ic-detail-label-file.png";
import IcPrize from "../../../images/ic-detail-label-prize.png";
import IcTime from "../../../images/ic-detail-label-time.png";
import DummyTeacher from '../../../images/dummy-teacher.jpg';
import Dummy1 from '../../../images/dummy-swiper-1.png';
import Dummy2 from '../../../images/dummy-swiper-2.png';
import Evaluation from "./Evaluation";
import ReviewItem from "./ReviewItem";

const styles = StyleSheet.create( {
	wrapper: {},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	thumbnail: {
		width: '100%',
		paddingTop: '42%',
		paddingBottom: '42%',
	},
	info: {
		paddingTop: 30,
		paddingBottom: 30,
	},
	sectionTitle: {
		marginBottom: 20,
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333333',
	},
	infoTextNormal: {
		fontSize: 13,
		lineHeight: 20,
		color: '#555555',
	},
	lectureMoreButton: {
		textAlign: 'right',
		fontSize: 13,
		color: CommonStyles.COLOR_PRIMARY,
	},
	contentHr: {
		width: '100%',
		height: 1,
		backgroundColor: '#dddddd',
	},
	labelInfo: {
		paddingTop: 30,
		paddingBottom: 20,
		paddingLeft: 30,
	},
	labelInfoItem: {
		alignItems: 'center',
		marginBottom: 12,
	},
	labelInfoImage: {
		width: 24,
		height: 25,
		marginRight: 10,
	},
	labelInfoText: {
		fontSize: 13,
		color: '#888888',
	},
	author: {
		paddingTop: 30,
		paddingBottom: 30,
		backgroundColor: '#f1f1f1',
	},
	authorName: {
		textAlign: 'center',
		marginBottom: 20,
		fontSize: 15,
		color: CommonStyles.COLOR_PRIMARY,
	},
	authorImage: {
		marginBottom: 20,
		width: 92,
		height: 92,
		marginRight: 'auto',
		marginLeft: 'auto',
	},
	authorText: {
		fontSize: 13,
		color: '#555555',
	},
	review: {
		paddingTop: 30,
		paddingRight: 15,
		paddingBottom: 30,
		paddingLeft: 15,
	}
} );

@observer
class TabContentInfo extends React.Component {
	constructor( props ) {
		super( props );

		this.toggleLectureView = this.toggleLectureView.bind( this );
		this.toggleTeacherView = this.toggleTeacherView.bind( this );
	}


	componentDidMount() {
		let windowWidth = Dimensions.get( 'window' ).width;

		this.props.store.slideHeight = windowWidth * 0.833;
	}

	toggleLectureView() {
		if ( this.props.store.lectureView === false ) {
			this.props.store.lectureView = true;
		} else {
			this.props.store.lectureView = false;
		}
	}

	toggleTeacherView() {
		if ( this.props.store.teacherView === false ) {
			this.props.store.teacherView = true;
		} else {
			this.props.store.teacherView = false;
		}
	}

	render() {
		return <View>
			{/* 이미지 스와이퍼 */}
			<View style={{ height: this.props.store.slideHeight }}>
				<Swiper style={styles.wrapper}
						showsButtons={false}
						height={window.width}
						dotColor={"#888888"}
						activeDotColor={"#ffffff"}
						paginationStyle={{ bottom: -15 }}>
					<View style={styles.slide}>
						{/*<Text style={styles.text}>Swiper1</Text>*/}
						<ImageBackground source={Dummy1} resizeMode="cover" style={styles.thumbnail}/>
					</View>
					<View style={styles.slide}>
						{/*<Text style={styles.text}>Swiper2</Text>*/}
						<ImageBackground source={Dummy2} resizeMode="cover" style={styles.thumbnail}/>
					</View>
				</Swiper>
			</View>
			{/* /이미지 스와이퍼 */}

			<View style={[ CommonStyles.contentContainer, styles.info ]}>
				<Text style={styles.sectionTitle}>기본정보</Text>

				<Text style={styles.infoTextNormal}>
					{this.props.store.itemData.title}
				</Text>
				{!!this.props.store.lectureView &&
				<Text style={styles.infoTextNormal}>
					{this.props.store.itemData.memo}
				</Text>
				}
				<TouchableOpacity onPress={this.toggleLectureView}>
					<Text style={styles.lectureMoreButton}>더보기</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.contentHr}/>

			<View style={styles.labelInfo}>
				<View style={[ CommonStyles.alignJustifyFlex, styles.labelInfoItem ]}>
					<Image style={styles.labelInfoImage} source={IcClip}/>
					<Text style={styles.labelInfoText}>{this.props.store.itemData.clip_count}개 강의 클립</Text>
				</View>
				<View style={[ CommonStyles.alignJustifyFlex, styles.labelInfoItem ]}>
					<Image style={styles.labelInfoImage} source={IcTime}/>
					<Text style={styles.labelInfoText}>총 러닝타임 1시간 45분</Text>
				</View>
				<View style={[ CommonStyles.alignJustifyFlex, styles.labelInfoItem ]}>
					<Image style={styles.labelInfoImage} source={IcFile}/>
					<Text style={styles.labelInfoText}>콘텐츠 용량 340 MB</Text>
				</View>
				<View style={[ CommonStyles.alignJustifyFlex, styles.labelInfoItem ]}>
					<Image style={styles.labelInfoImage} source={IcPrize}/>
					<Text style={styles.labelInfoText}>학습 완료 시 수료증 제공</Text>
				</View>
			</View>

			<View style={styles.author}>
				<View style={CommonStyles.contentContainer}>
					<Text style={styles.sectionTitle}>강사</Text>
					{/*<Image source={{ uri: this.props.itemData.teacher.images.profile }} borderRadius={44} style={styles.authorImage}/>*/}
					<Text style={styles.authorName}>
						{this.props.store.itemData.teacher.name}
					</Text>
					{!!this.props.store.teacherView &&
					<Text style={styles.authorText}>
						{this.props.itemData.teacher.memo}
					</Text>
					}
					<TouchableOpacity onPress={this.toggleTeacherView}>
						<Text style={styles.lectureMoreButton}>더보기</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.review}>
				<Text style={styles.sectionTitle}>학습자 평가</Text>

				<Evaluation/>

			</View>

			<View style={styles.contentHr}/>

			<View style={styles.review}>
				<ReviewItem/>
			</View>

		</View>
	}
}

export default TabContentInfo;