import React from "react";
import CommonStyles from "../../../styles/common";
import {
	ActivityIndicator, Alert,
	Image,
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import {observer} from "mobx-react";
import IcAngleRightGrey from '../../../images/ic-angle-right-grey.png';
import Series from "../../components/home/Series";
import PageCategory from "../../components/PageCategory";
import ClassList from "../../components/home/ClassList";
import ClipRank from "../../components/home/ClipRank";
import ClassContinueList from "../../components/home/ClassContinueList";
import Swiper from "react-native-swiper";
import {withNavigation} from "react-navigation";
import PTRView from 'react-native-pull-to-refresh';
import moment from "moment";
import globalStore from "../../commons/store";

const styles = StyleSheet.create({
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
});

@observer
export default withNavigation(class HomeVideoPage extends React.Component {


	/* 카테고리 클릭시 클래스 리스트 페이지로 이동 with Params */
	premiumCategorySelect = (data) => {
		this.props.navigation.navigate('ClassListPage',
			{action: 'category', data: data} // 전달할 데이터
		);
	}

	render() {
		let updatedAt = moment().format('YYYY. MM. DD');
		return (
			<PTRView onRefresh={() => this.props.onRefresh()}>
				<ScrollView style={{flex: 1}}>
					{/* 이미지 스와이퍼 */}

					<View style={{height: this.props.store.slideHeight}}>
						{this.props.store.homeBannerData.length > 0 &&
						<Swiper style={styles.wrapper}
								showsButtons={false}
								height={window.width}
								dotColor={"#888888"}
								activeDotColor={"#ffffff"}
								paginationStyle={{bottom: 10}}>

							{this.props.store.homeBannerData.map((item, key) => {
								return (
									<TouchableOpacity activeOpacity={0.9} key={key}>
										<ImageBackground source={{uri: item.images.default}} resizeMode="cover"
														 style={styles.thumbnail}/>
									</TouchableOpacity>
								);
							})}
						</Swiper>
						}
						{this.props.store.homeBannerData.length === 0 &&
						<View style={{marginTop: '20%'}}>
							<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
						</View>
						}
					</View>
					{/* /이미지 스와이퍼 */}

					{this.props.store.homeSeriesData.length <= 6 &&
					<View style={{marginTop: 12}}>
						<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
					</View>
					}
					{this.props.store.homeSeriesData.length > 6 &&
					<View style={[CommonStyles.contentContainer, styles.seriesContainer]}>
						<View>
							<Text style={[styles.mainTitleCenter, styles.titleH2]}>
								윌라 추천 시리즈
							</Text>
							<Text style={[styles.mainTitleCenter, styles.titleH4]}>
								당신이 배우고 싶은 모든 것
							</Text>
						</View>

						<View style={styles.seriesComponent}>
							<Series itemData={this.props.store.homeSeriesData}/>
						</View>

						<TouchableOpacity activeOpacity={0.9} onPress={() => {Alert.alert('준비중입니다.')}}>
							<View style={styles.linkViewAll} borderRadius={5}>
								<Text style={styles.linkViewAllText}>
									추천 시리즈 전체 보기 <Image source={IcAngleRightGrey} style={styles.linkViewAllIcon}/>
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					}

					{this.props.store.classHotData.length > 0 &&
					<View style={[CommonStyles.contentContainer, styles.classContainer]}>
						<View>
							<Text style={[styles.mainTitleCenter, styles.titleH2]}>
								윌라 프리미엄 클래스
							</Text>
							<Text style={[styles.mainTitleCenter, styles.titleH4]}>
								당신의 커리어 성공과 행복한 일상을 위한 교육
							</Text>
						</View>

						<View style={styles.classCategory}>
							<View style={styles.classCategoryHr}/>
							<PageCategory data={this.props.store.videoCategoryData}
										  onCategorySelect={this.premiumCategorySelect}
							/>
							<View style={styles.classCategoryHr}/>
						</View>

						<View style={CommonStyles.alignJustifyContentBetween}>
							<Text style={styles.titleH3}>
								회원들이 듣고 있는 클래스
							</Text>
							<Text style={[styles.titleParagraph, {marginLeft: 0}]}>
								{updatedAt} 업데이트
							</Text>
						</View>

						<ClassList classType="hot" itemData={this.props.store.classHotData}/>

						<View style={CommonStyles.alignJustifyContentBetween}>
							<Text style={styles.titleH3}>
								새로 나온 클래스
							</Text>
							<Text style={[styles.titleParagraph, {marginLeft: 0}]}>
								{updatedAt} 업데이트
							</Text>
						</View>

						<ClassList itemData={this.props.store.classNewData}/>

						<View style={CommonStyles.alignJustifyContentBetween}>
							<Text style={styles.titleH3}>
								윌라 추천 클래스
							</Text>
							<Text style={[styles.titleParagraph, {marginLeft: 0}]}>
								{updatedAt} 업데이트
							</Text>
						</View>

						<ClassList itemData={this.props.store.classRecommendData}/>

						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => this.props.navigation.navigate('ClassListPage')}>
							<View style={[styles.linkViewAll, styles.classLinkViewAll]} borderRadius={5}>
								<Text style={styles.linkViewAllText}>
									클래스 전체 보기 <Image source={IcAngleRightGrey} style={styles.linkViewAllIcon}/>
								</Text>
							</View>
						</TouchableOpacity>

						<View style={CommonStyles.alignJustifyContentBetween}>
							<Text style={styles.titleH3}>
								지금 많이 듣고 있는 강의클립
							</Text>
							<Text style={[styles.titleParagraph, {marginLeft: 'auto'}]}>
								{updatedAt} 업데이트
							</Text>
						</View>
						<View style={styles.titleHr}/>

						<ClipRank itemData={this.props.store.clipRankData}
								  clipRankContentSize={this.props.store.clipRankContentSize}/>

						{globalStore.welaaaAuth &&
						<View>
							<View style={CommonStyles.alignJustifyItemCenter}>
								<Text style={styles.titleH3}>
									이어보기
								</Text>
								<Text style={styles.titleParagraph}>
									{updatedAt} 업데이트
								</Text>
							</View>
							<View style={styles.titleHr}/>

							{(this.props.store.classUseData && this.props.store.classUseData.length === 0) &&
								<Text style={{paddingTop: 20, paddingBottom: 20, textAlign: 'center'}}>재생 내역이 없습니다</Text>
							}

							{(this.props.store.classUseData && this.props.store.classUseData.length > 0) &&
							<ClassContinueList itemData={this.props.store.classUseData}/>
							}
						</View>
						}
					</View>
					}
				</ScrollView>
			</PTRView>
		);
	}
});