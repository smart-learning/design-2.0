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
	monthContainer: {
		paddingTop: 50,
		paddingBottom: 50,
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
						<View>
							<Text style={[ styles.mainTitleCenter, styles.titleH2 ]}>
								8월 이달의 책
							</Text>
							<Text style={[ styles.mainTitleCenter, styles.titleH4 ]}>
								이 정도는 읽어주자! 리딩멘토가 추천하는 『좋은 책』
							</Text>
						</View>

						<BookMonthly itemData={this.props.store.audioMonth} voucherStatus={ this.props.store.voucherStatus }/>
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
								2018. 07.09 업데이트
							</Text>
						</View>

						<BookList itemType="hot" itemData={this.props.store.audioRealTimeChartData}/>

						<View style={CommonStyles.alignJustifyContentBetween}>
							<Text style={styles.titleH3}>
								새로 나온 오디오북
							</Text>
						</View>

						<BookList itemType={"new"} itemData={this.props.store.audioNewData.items}/>

						<View style={CommonStyles.alignJustifyContentBetween}>
							<Text style={styles.titleH3}>
								윌라 추천 오디오북
							</Text>
						</View>

						<BookList itemType={"new"} itemData={this.props.store.audioNewData.items}/>

						<View style={CommonStyles.alignJustifyContentBetween}>
							<Text style={styles.titleH3}>
								매일 책 한권 - 무료 북 리뷰
							</Text>
						</View>

						<BookFreeList itemType={"review"} itemData={this.props.store.audioNewData.items}/>

						<TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate('AudioBookPage')}>
							<View style={[ styles.linkViewAll, styles.classLinkViewAll ]} borderRadius={5}>
								<Text style={styles.linkViewAllText}>
									오디오북 전체 보기 <Image source={IcAngleRightGrey} style={styles.linkViewAllIcon}/>
								</Text>
							</View>
						</TouchableOpacity>

						<View style={CommonStyles.alignJustifyItemCenter}>
							<Text style={styles.titleH3}>
								구매한 오디오북
							</Text>
						</View>
						<View style={styles.titleHr}/>

						<BookContinueList/>

						<View style={CommonStyles.alignJustifyItemCenter}>
							<Text style={styles.titleH3}>
								최근재생 오디오북
							</Text>
						</View>
						<View style={styles.titleHr}/>

						<BookContinueList/>
					</View>
				</ScrollView>
			</PTRView>
		)

	}
}

export default HomeAudioPage;