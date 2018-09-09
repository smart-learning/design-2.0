import React from "react";
import CommonStyles from "../../../styles/common";
import {
	ActivityIndicator,
	Image,
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import { observer } from "mobx-react";
import Swiper from "react-native-swiper";
import IcAngleRightGrey from "../../../images/ic-angle-right-grey.png";
import BookMonthly from "../../components/home/BookMonthly";
import PageCategory from "../../components/PageCategory";
import BookList from "../../components/home/BookList";
import BookFreeList from "../../components/home/BookFreeList";
import BookContinueList from "../../components/home/BookCoutinueList";
import PTRView from 'react-native-pull-to-refresh';
import moment from "moment";
import ClassContinueList from "../../components/home/ClassContinueList";
import BookDailyList from "../../components/home/BookDailyList";
import {withNavigation} from "react-navigation";

const styles = StyleSheet.create( {
	wrapper: {},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	thumbnail: {
		width: '100%',
		paddingTop: '17.3571428572%',
		paddingBottom: '17.3571428572%',
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
	monthContainer: {
		paddingTop: 50,
		paddingBottom: 30,
		backgroundColor: '#8cd8b1',
	},
	dailyContainer: {
		paddingTop: 50,
		paddingBottom: 50,
	},
	audioBookContainer: {
		paddingTop: 50,
		paddingBottom: 50,
	},
	audioCategory: {
		marginTop: 20,
		marginBottom: 20,
	},
	audioCategoryHr: {
		height: 1,
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
} );

@observer
class HomeAudioPage extends React.Component {

	render() {
		let updatedAt = moment().format('YYYY. MM. DD');
		return (
			<PTRView onRefresh={() => this.props.onRefresh()}>
				<ScrollView style={{ flex: 1 }}>
					{/* 이미지 스와이퍼 */}
					<View style={{ height: this.props.store.slideHeight }}>
						{( this.props.store.homeBannerData && this.props.store.homeBannerData.length > 0 ) &&
						<Swiper style={styles.wrapper}
								showsButtons={false}
								height={window.width}
								dotColor={"#888888"}
								activeDotColor={"#ffffff"}
								paginationStyle={{ bottom: 10 }}>

							{this.props.store.homeBannerData.map( ( item, key ) => {
								return (
									<TouchableOpacity activeOpacity={0.9} key={key}>
										<ImageBackground source={{ uri: item.images.default }} resizeMode="cover"
														 style={styles.thumbnail}/>
									</TouchableOpacity>
								);
							} )}
						</Swiper>
						}
						{this.props.store.homeBannerData.length === 0 &&
						<View style={{ marginTop: '20%' }}>
							<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
						</View>
						}
					</View>
					{/* /이미지 스와이퍼 */}

					<View style={styles.monthContainer}>
						<BookMonthly itemData={this.props.store.audioMonth} voucherStatus={ this.props.store.voucherStatus }/>
					</View>

					{/*매일 책 한 권*/}
					<View style={[CommonStyles.contentContainer, styles.dailyContainer]}>
						<BookDailyList itemData={this.props.store.audioDaily} store={ this.props.store }/>
					</View>

					<View style={[ CommonStyles.contentContainer, styles.audioBookContainer ]}>
						<View>
							<Text style={[ styles.mainTitleCenter, styles.titleH2 ]}>
								윌라 오디오북
							</Text>
							<Text style={[ styles.mainTitleCenter, styles.titleH4 ]}>
								4차 산업혁명 시대의 새로운 책 읽기
							</Text>
						</View>

						<View style={styles.audioCategory}>
							<View style={styles.audioCategoryHr}/>
							<PageCategory data={this.props.store.audioBookCategoryData}/>
							<View style={styles.audioCategoryHr}/>
						</View>

						<View style={CommonStyles.alignJustifyContentBetween}>
							<Text style={styles.titleH3}>
								많이 듣고있는 오디오북
							</Text>
							<Text style={[ styles.titleParagraph, { marginLeft: 0 } ]}>
								{updatedAt} 업데이트
							</Text>
						</View>

						<BookList itemType="hot" itemData={this.props.store.audioHotData.items ? this.props.store.audioHotData.items : this.props.store.audioHotData}/>

						<View style={CommonStyles.alignJustifyContentBetween}>
							<Text style={styles.titleH3}>
								새로 나온 오디오북
							</Text>
						</View>

						<BookList itemType={"new"} itemData={this.props.store.audioNewData.items ? this.props.store.audioNewData.items : this.props.store.audioNewData}/>

						<View style={CommonStyles.alignJustifyContentBetween}>
							<Text style={styles.titleH3}>
								윌라 추천 오디오북
							</Text>
						</View>

						<BookList itemType={"new"} itemData={this.props.store.audioRecommendData.items ? this.props.store.audioRecommendData.items : this.props.store.audioRecommendData}/>

						<TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate('AudioBookPage')}>
							<View style={[ styles.linkViewAll, styles.classLinkViewAll ]} borderRadius={5}>
								<Text style={styles.linkViewAllText}>
									오디오북 전체 보기 <Image source={IcAngleRightGrey} style={styles.linkViewAllIcon}/>
								</Text>
							</View>
						</TouchableOpacity>

						{1 === 2 && <View>
						<View style={CommonStyles.alignJustifyItemCenter}>
							<Text style={styles.titleH3}>
								구매한 오디오북
							</Text>
						</View>
						< View style={styles.titleHr}/>

						{(this.props.store.audioBuyData && this.props.store.audioBuyData.length === 0) &&
							<Text style={{paddingTop: 20, paddingBottom: 20, textAlign: 'center'}}>구매한 내역이 없습니다</Text>
						}

						{(this.props.store.audioBuyData && this.props.store.audioBuyData.length > 0) &&
							<BookContinueList itemData={this.props.store.audioBuyData}/>
						}

							<View style={CommonStyles.alignJustifyItemCenter}>
							<Text style={styles.titleH3}>
							최근재생 오디오북
							</Text>
							</View>
							<View style={styles.titleHr}/>

						{(this.props.store.audioUseData && this.props.store.audioUseData.length === 0) &&
							<Text style={{paddingTop: 20, paddingBottom: 20, textAlign: 'center'}}>재생 내역이 없습니다</Text>
						}

						{(this.props.store.audioUseData && this.props.store.audioUseData.length > 0) &&
							<BookContinueList itemData={this.props.store.audioUseData}/>
						}
						</View>}
					</View>
				</ScrollView>
			</PTRView>
		)

	}
}

export default withNavigation(HomeAudioPage);