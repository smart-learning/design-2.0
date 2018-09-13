import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image} from "react-native";
import IcHeadphone from "../../../images/ic-headphones.png";
import Dummy from "../../../images/dummy-audioBook.png";
import Swiper from "react-native-swiper";
import _ from "underscore";
import {withNavigation} from "react-navigation";
import CommonStyles from "../../../styles/common";
import moment from "moment";

const styles = StyleSheet.create({
	bookMonthly: {},
	bookMonthlyItem: {
		justifyContent: 'center',
		position: 'relative',
	},
	couponContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 30,
	},
	coupon: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '80%',
		height: 30,
		paddingLeft: 25,
		paddingRight: 35,
		backgroundColor: '#1c9165',

	},
	couponIcon: {
		width: 19,
		height: 19,
		marginRight: 7,
	},
	couponText: {
		fontSize: 13,
		color: '#ffffff',
	},
	couponCountText: {
		color: '#fff1b2',
	},
	wrapper: {
		width: '100%',
		paddingBottom: 20,
	},
	bookItemContainer: {
		marginTop: 10,
	},
	bookItem: {
		flexDirection: 'row',
		alignItems: 'center',
		width: 250,
		height: 160,
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: 20,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333333',
	},
	author: {
		paddingTop: 10,
		paddingBottom: 10,
		fontSize: 12,
		color: '#555555',
	},
	detailButton: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 25,
		paddingLeft: 10,
		paddingRight: 10,
		borderWidth: 1,
		borderColor: '#555555',
	},
	detailButtonText: {
		textAlign: 'center',
		fontSize: 12,
		color: '#555555'
	},
	bookThumbnailContainer: {
		width: 100,
		marginRight: 20,
	},
	thumbnail: {
		width: '100%',
		paddingTop: '80%',
		paddingBottom: '80%',
	},
	bullet: {
		position: 'absolute',
		zIndex: -9,
		left: 0,
		bottom: 40,
		width: '100%',
		height: 200,
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
});

export default withNavigation(class BookMonthly extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		// let list = this.props.itemData;
		// let bookList = [];
		//
		// _.each( list, element => {
		// 	bookList.push( element.book_a );
		// 	bookList.push( element.book_b );
		// } );

		return <View style={styles.bookMonthly}>

			<View style={styles.swiper}>
				<Swiper style={styles.wrapper}
						showsButtons={false}
						height={520}
						dotColor={"#9bcdba"}
						activeDotColor={CommonStyles.COLOR_PRIMARY}
						paginationStyle={{bottom: 0}}>

					{this.props.itemData.map((item, key) => {
						const MonthData = moment(item.month).format("M");
						return (
							<View style={styles.bookMonthlyItem} key={key}>
								<View>
									<Text style={[styles.mainTitleCenter, styles.titleH2]}>
										{MonthData}월 이달의 책
									</Text>
									<Text style={[styles.mainTitleCenter, styles.titleH4]}>
										이 정도는 읽어주자! 리딩멘토가 추천하는 『좋은 책』
									</Text>
								</View>
								{this.props.voucherStatus &&
								<View style={styles.couponContainer}>
									<View style={styles.coupon} borderRadius={20}>
										<Image source={IcHeadphone} style={styles.couponIcon}/>
										<Text style={styles.couponText}>
											보유한 오디오북 이용권
											<Text
												style={styles.couponCountText}> {this.props.voucherStatus.total}개</Text>
										</Text>
									</View>
								</View>
								}
								<View style={styles.bookItemContainer}>
									<TouchableOpacity activeOpacity={0.9}
													  onPress={() => this.props.navigation.navigate('HomeMonthlyReviewPage', {
														  itemData: item.book_a,
														  title: '이달의 책 북리뷰'
													  })}>
										<View style={styles.bookItem}>
											<View style={styles.bookThumbnailContainer}>
												<ImageBackground source={{uri: item.book_a.audiobook.images.cover}}
																 resizeMode={"cover"} style={styles.thumbnail}/>
											</View>
											<View style={{width: '48%'}}>
												<Text style={styles.title}>{item.book_a.title}</Text>
												<Text style={styles.author}>{item.book_a.mentor.name}</Text>
												<View style={styles.detailButton} borderRadius={13}>
													<Text style={styles.detailButtonText}>자세히보기</Text>
												</View>
											</View>
										</View>
									</TouchableOpacity>
									<TouchableOpacity activeOpacity={0.9}
													  onPress={() => this.props.navigation.navigate('HomeMonthlyReviewPage', {
														  itemData: item.book_b,
														  title: '이달의 책 북리뷰'
													  })}>
										<View style={styles.bookItem}>
											<View style={styles.bookThumbnailContainer}>
												<ImageBackground source={{uri: item.book_b.audiobook.images.cover}}
																 resizeMode={"cover"} style={styles.thumbnail}/>
											</View>
											<View style={{width: '48%'}}>
												<Text style={styles.title}>{item.book_b.title}</Text>
												<Text style={styles.author}>{item.book_b.mentor.name}</Text>
												<View style={styles.detailButton} borderRadius={13}>
													<Text style={styles.detailButtonText}>자세히보기</Text>
												</View>

											</View>
										</View>
									</TouchableOpacity>
								</View>
							</View>
						);
					})}
				</Swiper>
			</View>
		</View>
	}
})