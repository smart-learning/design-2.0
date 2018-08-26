import React from "react";
import CommonStyles from "../../../styles/common";
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, ScrollView} from "react-native";
import {observer} from "mobx-react";
import Dummy1 from '../../../images/dummy-swiper-1.png';
import Dummy2 from '../../../images/dummy-swiper-2.png';
import IcAngleRightGrey from '../../../images/ic-angle-right-grey.png';
import Series from "../../components/home/Series";
import PageCategory from "../../components/PageCategory";
import ClassList from "../../components/home/ClassList";
import ClipRank from "../../components/home/ClipRank";
import ClassContinueList from "../../components/home/ClassContinueList";
import Swiper from "react-native-swiper";

const styles = StyleSheet.create( {
	wrapper: {},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	thumbnail: {
		width: '100%',
		paddingTop: '21%',
		paddingBottom: '21%',
	},
	mainTitleCenter: {
		textAlign: 'center',
	},
	titleH2: {
		fontSize: 26,
		fontWeight: 'bold',
		color: '#333333',
	},
	titleH4: {
		paddingTop: 10,
		fontSize: 13,
		color: '#888888',
	},
	titleH3: {
		fontSize: 13,
		fontWeight: 'bold',
		color: '#333333',
	},
	titleParagraph: {
		paddingLeft: 15,
		fontSize: 11,
		color: '#b7b7b7',
	},
	titleLink: {
		fontSize: 13,
		color: CommonStyles.COLOR_PRIMARY,
	},
	titleHr: {
		height: 1,
		marginTop: 7,
		backgroundColor: '#cecece',
	},
	linkViewAll: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: 36,
		marginLeft: 'auto',
		marginRight: 'auto',
		backgroundColor: '#dddddd',
	},
	classLinkViewAll: {
		marginTop: 15,
		marginBottom: 30,
	},
	linkViewAllText: {
		fontSize: 14,
		color: '#888888',
	},
	linkViewAllIcon: {
		paddingLeft: 7,
		height: 13,
	},
	seriesContainer: {
		paddingTop: 50,
		paddingBottom: 50,
	},
	classContainer: {
		paddingTop: 50,
		paddingBottom: 50,
	},
	classCategory: {
		marginTop: 20,
		marginBottom: 20,
	},
	classCategoryHr: {
		height: 1,
		backgroundColor: '#cecece',
	},
	seriesComponent: {
		paddingTop: 30,
	}
} );

@observer
export default class HomeVideoPage extends React.Component {

	render() {
		return <ScrollView style={{flex: 1}}>
			{/* 이미지 스와이퍼 */}
			<View style={{ height: this.props.store.slideHeight }}>
				<Swiper style={styles.wrapper}
						showsButtons={false}
						height={window.width}
						dotColor={"#888888"}
						activeDotColor={"#ffffff"}
						paginationStyle={{ bottom: 10 }}>

					{this.props.store.homeBannerData.map( ( item, key )=> {
						return (
							<TouchableOpacity activeOpacity={0.9}>
								<View key={key} style={styles.slide}>
									<ImageBackground source={{url: item.images.default}} resizeMode="cover" style={styles.thumbnail}/>
								</View>
							</TouchableOpacity>
						);
					} )}
				</Swiper>
			</View>
			{/* /이미지 스와이퍼 */}

			{this.props.store.homeSeriesData.length > 6 &&
			<View style={[ CommonStyles.contentContainer, styles.seriesContainer ]}>
				<View>
					<Text style={[ styles.mainTitleCenter, styles.titleH2 ]}>
						윌라 추천 시리즈
					</Text>
					<Text style={[ styles.mainTitleCenter, styles.titleH4 ]}>
						당신이 배우고 싶은 모든 것
					</Text>
				</View>

				<View style={styles.seriesComponent}>
					<Series itemData={this.props.store.homeSeriesData}/>
				</View>

				<TouchableOpacity activeOpacity={0.9}>
					<View style={styles.linkViewAll} borderRadius={5}>
						<Text style={styles.linkViewAllText}>
							추천 시리즈 전체 보기 <Image source={IcAngleRightGrey} style={styles.linkViewAllIcon}/>
						</Text>
					</View>
				</TouchableOpacity>
			</View>
			}

			<View style={[ CommonStyles.contentContainer, styles.classContainer ]}>
				<View>
					<Text style={[ styles.mainTitleCenter, styles.titleH2 ]}>
						윌라 프리미엄 클래스
					</Text>
					<Text style={[ styles.mainTitleCenter, styles.titleH4 ]}>
						당신의 커리어 성공과 행복한 일상을 위한 교육
					</Text>
				</View>

				<View style={styles.classCategory}>
					<View style={styles.classCategoryHr}/>
					<PageCategory data={this.props.store.videoCategoryData}/>
					<View style={styles.classCategoryHr}/>
				</View>

				<View style={CommonStyles.alignJustifyContentBetween}>
					<Text style={styles.titleH3}>
						회원들이 듣고 있는 클래스
					</Text>
					<Text style={[ styles.titleParagraph, { marginLeft: 0 } ]}>
						2018. 07.09 업데이트
					</Text>
				</View>

				<ClassList classType="hot" itemData={this.props.store.classHotData}/>

				<View style={CommonStyles.alignJustifyContentBetween}>
					<Text style={styles.titleH3}>
						새로 나온 클래스
					</Text>
					<Text style={[ styles.titleParagraph, { marginLeft: 0 } ]}>
						2018. 07.09 업데이트
					</Text>
				</View>

				<ClassList itemData={this.props.store.classNewData}/>

				<View style={CommonStyles.alignJustifyContentBetween}>
					<Text style={styles.titleH3}>
						윌라 추천 클래스
					</Text>
					<Text style={[ styles.titleParagraph, { marginLeft: 0 } ]}>
						2018. 07.09 업데이트
					</Text>
				</View>

				<ClassList itemData={this.props.store.classRecommendData}/>

				<TouchableOpacity activeOpacity={0.9}>
					<View style={[ styles.linkViewAll, styles.classLinkViewAll ]} borderRadius={5}>
						<Text style={styles.linkViewAllText}>
							클래스 전체 보기 <Image source={IcAngleRightGrey} style={styles.linkViewAllIcon}/>
						</Text>
					</View>
				</TouchableOpacity>

				<View style={CommonStyles.alignJustifyContentBetween}>
					<Text style={styles.titleH3}>
						지금 많이 듣고 있는 강의클립
					</Text>
					<Text style={[ styles.titleParagraph, { marginLeft: 'auto' } ]}>
						2018. 07.09 업데이트
					</Text>
				</View>
				<View style={styles.titleHr}/>

				<ClipRank itemData={this.props.store.clipRankData} clipRankContentSize={this.props.store.clipRankContentSize}/>

				<View style={CommonStyles.alignJustifyItemCenter}>
					<Text style={styles.titleH3}>
						이어보기
					</Text>
					<Text style={styles.titleParagraph}>
						2018. 07.09 업데이트
					</Text>
				</View>
				<View style={styles.titleHr}/>

				<ClassContinueList/>
			</View>
		</ScrollView>
	}
}