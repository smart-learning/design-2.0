import React from "react";
import { observable } from 'mobx';
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
	@observable lectureView = false;
	@observable teacherView = false;
	@observable slideHeight = null;

	constructor( props ) {
		super( props );

		this.toggleLectureView = this.toggleLectureView.bind( this );
		this.toggleTeacherView = this.toggleTeacherView.bind( this );
	}


	componentDidMount() {
		let windowWidth = Dimensions.get( 'window' ).width;

		this.slideHeight = windowWidth * 0.833;
	}

	toggleLectureView() {
		if ( this.lectureView === false ) {
			this.lectureView = true;
		} else {
			this.lectureView = false;
		}
	}

	toggleTeacherView() {
		if ( this.teacherView === false ) {
			this.teacherView = true;
		} else {
			this.teacherView = false;
		}
	}

	render() {
		return <View>
			<Text>Info Contents</Text>
			{/* 이미지 스와이퍼 */}
			<View style={{ height: this.slideHeight }}>
				<Swiper style={styles.wrapper}
						showsButtons={false}
						height={window.width}
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
					'평생 직장의 시대는 가고, 평생 이직의 시대가 왔다! 언젠가 한 번은 이직해야 한다면 경력 관리 및 이직 전략을 어떻게 세워야 할까? 모든 직장인에게 필요한 커리어 관리와
					성공적인 이직 노하우 대공개!
				</Text>
				{this.lectureView === true &&
				<Text style={styles.infoTextNormal}>
					기업이 경력자를 평가하고 채용하는 관점은 신입과는 전혀 다릅니다. 자신의 가치를 스스로 알고, 이것을 명확하게 표현할 수 있을 때, 현재 속해 있는 회사에서 인정 받고,
					성공적으로 이직할 수 있습니다. 경력직의 이력서, 자기소개서, 경력 기술서 및 면접 방법은 물론, 성장을 위한 진짜 커리어를 쌓는 지혜까지..!{"\n"}
					{"\n"}
					오랜 시간 취업 분야 전문 강사로 활약하며 10년차 경력직도 이직에 성공하도록 도와주는 취업 멘토 신길자 소장이 실전형 커리어 관리와 이직의 길라잡이가 되어드립니다.
					오프라인 특강 만족도 1위, 취업 교육 부문 최고 강사가 공개하는 100% 뽑히는 이직 전략! 지금, 공개합니다.{"\n"}
					{"\n"}
					[ 이런 분들께 추천합니다! ]{"\n"}
					- 지금 이직하는게 정말 맞을까? 경력관리 측면에서 이직이 고민되는 사람들{"\n"}
					- 경력 이직을 꿈꾸지만 무엇부터 시작해야 할 지 감이 잡히지 않는 이직 준비생들{"\n"}
					- 이직시에 필요한 자기소개서, 경력이력서, 경력 면접 등에 대한 정보가 턱없이 부족한 사람들{"\n"}
					- 성공적인 경력이직의 실제 사례를 알고 싶은 사람들{"\n"}
					- 언젠가 이직을 할 수도 있겠다는 생각에 한 번쯤 경력 이직 관련 강의를 들어보고 싶은 사람들{"\n"}
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
					<Text style={styles.labelInfoText}>7개 강의 클립</Text>
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
					<Image source={DummyTeacher} borderRadius={44} style={styles.authorImage}/>
					<Text style={styles.authorName}>동아시아문화도시조직위원회 이어령 교수</Text>
					{this.teacherView === true &&
					<Text style={styles.authorText}>
						10년 이상 경력의 취업 전문 컨설턴트!{"\n"}
						{"\n"}
						신길자 취업 전문 컨설턴트는 취업분야 베스트셀러 &lt;뽑히는 취업&gt;,    &lt;뽑히는 자기소개서&gt;,    &lt;뽑히는 면접&gt;의 저자이자 유튜브
						자소서 강의
						조회수 1위, 취업 특강 만족도 1위를 달성한 취업 전문 멘토이다.{"\n"}
						{"\n"}
						진로설계 및 취업전략, 비전설정, 자기계발 분야의 강의와 상담 프로그램을 진행하고 있으며 취업 커뮤니티 '언니의 취업가게' 운영자이자 코리아써치 경력개발연구소
						소장으로 수많은
						취준생들을 합격으로 이끌어주고 있다. KBS, MBC, 한국경제TV등 대한민국 다수의 매체에 출연, 취업 정보 제공 및 취업 강의를 진행하였다. 신길자 취업
						컨설턴트가 전하는
						양질의 취업 노하우는 취업 준비로 힘들어하는 모든 취준생들의 길잡이가 되어줄 것이다.
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

		</View>
	}
}

export default TabContentInfo;