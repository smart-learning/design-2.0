import React from "react";
import {observer} from 'mobx-react';
import {Alert, Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import Swiper from 'react-native-swiper';
import CommonStyles from "../../../styles/common";
import IcClip from "../../../images/ic-detail-label-clip.png";
import IcFile from "../../../images/ic-detail-label-file.png";
import IcPrize from "../../../images/ic-detail-label-prize.png";
import IcTime from "../../../images/ic-detail-label-time.png";
import Evaluation from "./Evaluation";
import moment from "moment";
import _ from 'underscore';
import DummyTeacher from "../../../images/dummy-my-profile-2.png";

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

	state = {
		teacherView: false
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
		// if ( this.props.store.teacherView === false ) {
		// 	this.props.store.teacherView = true;
		// } else {
		// 	this.props.store.teacherView = false;
		// }
		this.setState({
			teacherView: !this.state.teacherView
		})
	}

	render() {
		const playTime = moment.duration( this.props.store.itemData.play_time );
		let infoImageSet = [];
		let teacherMemo = '';
		try {
			if( _.isArray( this.props.store.itemData.info_img_set ) ) {
				infoImageSet = this.props.store.itemData.info_img_set;
			}
		}
		catch( error ) { console.log( error ) }

		try {
			if( !_.isNull( this.props.store.itemData.teacher.memo ) ) {
				teacherMemo = this.props.store.itemData.teacher.memo;
				teacherMemo = teacherMemo.split( '<br>' ).join( '\n' );
			}
		}
		catch( error ) { console.log( error ) }

		console.log( 'itemData', this.props.store.itemData );
		return <View>
			{/* 이미지 스와이퍼 */}
			{ this.props.store.itemData.info_img_set.length > 0 && (
                <View style={{ height: this.props.store.slideHeight }}>
                    {this.props.store.itemData.info_img_set.length > 0 &&
                    <Swiper style={styles.wrapper}
                            showsButtons={false}
                            height={window.width}
                            dotColor={"#888888"}
                            activeDotColor={"#ffffff"}
                            paginationStyle={{bottom: 10}}>
                        {infoImageSet.map((item, key) => {
                            return (
                                <TouchableOpacity activeOpacity={0.9} key={key}>
                                    <ImageBackground source={{uri: item}} resizeMode="cover"
                                                     style={styles.thumbnail}/>
                                </TouchableOpacity>
                            );
                        })}
                    </Swiper>
                    }
                </View>
			)}
			{/* /이미지 스와이퍼 */}

			<View style={[ CommonStyles.contentContainer, styles.info ]}>
				<Text style={styles.sectionTitle}>기본정보</Text>

				<Text style={styles.infoTextNormal}>
					{this.props.store.itemData.title}
				</Text>
				{!!this.props.store.lectureView &&
				<Text style={styles.infoTextNormal}>
					{`${ this.props.store.itemData.memo.split( '<br>' ).join( '\n' ) }`}
				</Text>
				}
				<TouchableOpacity onPress={this.toggleLectureView}>
					<Text style={styles.lectureMoreButton}>더보기</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.contentHr}/>

			<View style={styles.labelInfo}>

				{this.props.learnType === 'class' &&
				<View style={[CommonStyles.alignJustifyFlex, styles.labelInfoItem]}>
					<Image style={styles.labelInfoImage} source={IcClip}/>
					<Text style={styles.labelInfoText}>{this.props.store.itemData.clip_count}개 강의 클립</Text>
				</View>
				}
				<View style={[ CommonStyles.alignJustifyFlex, styles.labelInfoItem ]}>
					<Image style={styles.labelInfoImage} source={IcTime}/>
					<Text style={styles.labelInfoText}>총 러닝타임 {`${playTime.hours()}시간 ${playTime.minutes()}분`}</Text>
				</View>
				<View style={[ CommonStyles.alignJustifyFlex, styles.labelInfoItem ]}>
					<Image style={styles.labelInfoImage} source={IcFile}/>
					<Text style={styles.labelInfoText}>콘텐츠 용량 {this.props.store.itemData.file_size} MB</Text>
				</View>
				{/*
				<View style={[ CommonStyles.alignJustifyFlex, styles.labelInfoItem ]}>
					<Image style={styles.labelInfoImage} source={IcPrize}/>
					<Text style={styles.labelInfoText}>학습 완료 시 수료증 제공</Text>
				</View>
				*/}
			</View>

			<View style={styles.author}>
				<View style={CommonStyles.contentContainer}>
					{this.props.learnType === 'audioBook' &&
					<Text style={styles.sectionTitle}>저자</Text>
					}
					{this.props.learnType === 'class' &&
					<Text style={styles.sectionTitle}>강사</Text>
					}
					<Image source={{ uri: this.props.store.itemData.teacher ? this.props.store.itemData.teacher.images.default : DummyTeacher }} borderRadius={44} style={styles.authorImage}/>
					<Text style={styles.authorName}>
						{this.props.store.itemData.teacher.name}
					</Text>
					{!!this.state.teacherView &&
					<Text style={styles.authorText}>
						{ teacherMemo }
					</Text>
					}
					{/*<TouchableOpacity onPress={() => {Alert.alert('준비중입니다.')}}>*/}
					{ this.props.store.itemData.teacher.memo !== null &&
                    <TouchableOpacity onPress={this.toggleTeacherView}>
						<Text style={styles.lectureMoreButton}>더보기</Text>
					</TouchableOpacity>
					}
				</View>
			</View>

			{1 === 2 &&
			<View style={styles.review}>
				<Text style={styles.sectionTitle}>학습자 평가</Text>

				<Evaluation itemData={this.props.store.itemData}/>

			</View>
			}

		</View>
	}
}

export default TabContentInfo;