import React from "react";
import store from "../../commons/store";
import CommonStyles from "../../../styles/common";
import { TEXT_PRIMARY } from "../../../styles/common";
import {
	Image,
	Text,
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
	ScrollView,
} from "react-native";
import Swiper from 'react-native-swiper';
import IcStar from "../../../images/icons/star.png";
import IcView from "../../../images/icons/eye.png";
import IcComment from "../../../images/icons/commenting.png"
import Dummy1 from '../../../images/dummy-swiper-1.png';
import Dummy2 from '../../../images/dummy-swiper-2.png';
import DummyTeacher from '../../../images/dummy-teacher.jpg';
import net from "../../commons/net";
import BtnMore from "../../components/BtnMore";

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
	btnGroup: {
		marginTop: 15,
		width: '100%',
		height: 40,
		paddingRight: 12,
		paddingLeft: 12,
	},
	alignJustify: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	btnSetSmall: {
		width: 12,
		height: 12,
	},
	btnSetLarge: {
		width: 24,
		height: 24,
	},
	countText: {
		paddingLeft: 3,
		paddingRight: 7,
		fontSize: 12,
		color: '#ffffff',
	},
	textNormal: {
		fontSize: 13,
		lineHeight: 20,
		color: '#EFEFEF',
		padding: 20,
	},
	textPrimaryColor: {
		color: TEXT_PRIMARY,
	},
	sectionLine: {
		marginTop: 50,
		marginRight: 20,
		marginBottom: 10,
		marginLeft: 20,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#222222',
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	teacherThumbnailWrapper: {
		flex: 1,
		alignItems: 'center',
	},
	teacherThumbnail: {
		width: 88,
		height: 88,
	},
	teacherTitle: {
		marginTop: 10,
		paddingLeft: 40,
		paddingRight: 40,
		textAlign: 'center',
		fontSize: 16,
		fontWeight: 'bold',
		color: '#FFF894',
	},
} );

const btnStyle = { margin: 15, color: '#ffffff' };

export default class LectureDetailPage extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			slideHeight: null,
			lectureView: false,
			teacherView: false,
		};

		this.lectureMore = this.lectureMore.bind( this );
		this.teacherMore = this.teacherMore.bind( this );
	}

	componentDidMount() {
		let windowWidth = Dimensions.get( 'window' ).width;

		this.setState( {
			slideHeight: windowWidth * 0.833
		} );
	}

	lectureMore() {
		if ( this.state.lectureView === false ) {
			this.setState( {
				lectureView: true,
			} );
		} else {
			this.setState( {
				lectureView: false,
			} );
		}
	}

	teacherMore() {
		if ( this.state.teacherView === false ) {
			this.setState( {
				teacherView: true,
			} );
		} else {
			this.setState( {
				teacherView: false,
			} );
		}
	}

	render() {
		return <View style={[ CommonStyles.container, { backgroundColor: '#000000' } ]}>
			<ScrollView style={{ width: '100%' }}>
				{/*<Text>{this.props.navigation.state.params.id}</Text>*/}

				{/* 조회수, 별점, 리뷰 */}
				<View style={styles.btnGroup}>
					<View style={styles.alignJustify}>
						<Image source={IcView} style={styles.btnSetSmall}/>
						<Text style={styles.countText}>조회수 {this.props.hitCount}</Text>
						<Image source={IcStar} style={styles.btnSetSmall}/>
						<Text style={styles.countText}>별점 {this.props.starAvg}</Text>
						<Image source={IcComment} style={styles.btnSetSmall}/>
						<Text style={styles.countText}>리뷰 {this.props.reviewCount}</Text>
					</View>
				</View>
				{/* /조회수, 별점, 리뷰 */}

				{/* 이미지 스와이퍼 */}
				<View style={{ height: this.state.slideHeight }}>
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

				{/* 강좌 소개글 */}
				<View style={{ marginTop: 35 }}>
					<Text style={[ styles.textNormal, styles.textPrimaryColor ]}>
						'평생 직장의 시대는 가고, 평생 이직의 시대가 왔다! 언젠가 한 번은 이직해야 한다면 경력 관리 및 이직 전략을 어떻게 세워야 할까? 모든 직장인에게 필요한 커리어 관리와
						성공적인 이직 노하우 대공개!
					</Text>
					{this.state.lectureView === true &&
					<Text style={styles.textNormal}>
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
				</View>
				<BtnMore onPress={this.lectureMore}/>
				{/* /강좌 소개글 */}

				{/* 강사 */}
				<View style={styles.sectionLine}>
					<Text style={styles.sectionTitle}>강사</Text>
				</View>
				<View style={styles.teacherThumbnailWrapper}>
					<Image source={DummyTeacher} borderRadius={44} style={styles.teacherThumbnail}></Image>
				</View>
				<Text style={styles.teacherTitle}>
					유튜브 취업 관련 강의 조회수 1위 신길자 취업 컨설턴트
				</Text>
				{this.state.teacherView === true &&
				<Text style={styles.textNormal}>
					10년 이상 경력의 취업 전문 컨설턴트!{"\n"}
					{"\n"}
					신길자 취업 전문 컨설턴트는 취업분야 베스트셀러 &lt;뽑히는 취업&gt;,    &lt;뽑히는 자기소개서&gt;,    &lt;뽑히는 면접&gt;의 저자이자 유튜브 자소서 강의
					조회수 1위, 취업 특강 만족도 1위를 달성한 취업 전문 멘토이다.{"\n"}
					{"\n"}
					진로설계 및 취업전략, 비전설정, 자기계발 분야의 강의와 상담 프로그램을 진행하고 있으며 취업 커뮤니티 '언니의 취업가게' 운영자이자 코리아써치 경력개발연구소 소장으로 수많은
					취준생들을 합격으로 이끌어주고 있다. KBS, MBC, 한국경제TV등 대한민국 다수의 매체에 출연, 취업 정보 제공 및 취업 강의를 진행하였다. 신길자 취업 컨설턴트가 전하는
					양질의 취업 노하우는 취업 준비로 힘들어하는 모든 취준생들의 길잡이가 되어줄 것이다.
				</Text>
				}
				<BtnMore onPress={this.teacherMore}/>
				{/* /강사 */}
				{/* 강의클립 목차 */}
				<View style={styles.sectionLine}>
					<Text style={styles.sectionTitle}>강의클립 목차</Text>
				</View>
				{/* /강의클립 목차 */}
				<Text>공유버튼</Text>
				{/*<Button*/}
				{/*onPress={()=>this.props.navigation.goBack()}*/}
				{/*title="뒤로"*/}
				{/*/>*/}

			</ScrollView>
		</View>
	}
}