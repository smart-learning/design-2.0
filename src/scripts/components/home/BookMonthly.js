import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image } from "react-native";
import IcHeadphone from "../../../images/ic-headphones.png";
import Bg from "../../../images/bg-audiobook-month.png";
import Swiper from "react-native-swiper";
import _ from "underscore";

const styles = StyleSheet.create( {
	bookMonthly: {
		position: 'relative',
	},
	couponContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
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
	swiper: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 180,
		marginTop: 30,
	},
	wrapper: {
		width: 250,
		paddingBottom: 20,
	},
	bookItem: {
		flexDirection: 'row',
		alignItems: 'center',
		width: 250,
		height: 160,
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
	}
} );

export default class BookMonthly extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let list = this.props.itemData;
		let bookList = [];

		_.each( list, element => {
			bookList.push( element.book_a );
			bookList.push( element.book_b );
		} );

		console.log( 'this.props.voucherStatus', this.props.voucherStatus );

		return <View style={styles.bookMonthly}>
			{this.props.voucherStatus &&
			<View style={styles.couponContainer}>
				<View style={styles.coupon} borderRadius={20}>
					<Image source={IcHeadphone} style={styles.couponIcon}/>
					<Text style={styles.couponText}>
						보유한 오디오북 이용권
						<Text style={styles.couponCountText}> {this.props.voucherStatus.total}개</Text>
					</Text>
				</View>
			</View>
			}
			<View style={styles.swiper}>
				<Swiper style={styles.wrapper}
						showsButtons={false}
						height={160}
						dotColor={"#9bcdba"}
						activeDotColor={"#379b75"}
						paginationStyle={{bottom: 0}}>

					{bookList.map( ( item, key ) => {
						return (
							<View style={styles.slide} key={key}>
								<View style={styles.bookItem}>
									<View style={styles.bookThumbnailContainer}>
										<ImageBackground source={{uri:item.audiobook.images.list}} resizeMode={"cover"} style={styles.thumbnail}/>
									</View>
									<View style={{width: '48%'}}>
										<Text style={styles.title}>{item.audiobook.title}</Text>
										<Text style={styles.author}>{item.audiobook.teacher.name}</Text>
										<TouchableOpacity activeOpacity={0.9} onPress={ () => this.props.navigation.navigate('AudioBookDetailPage', {id: item.audiobook.id, title: ' '})}>
											<View style={styles.detailButton} borderRadius={13}>
												<Text style={styles.detailButtonText}>자세히보기</Text>
											</View>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						);
					} )}
				</Swiper>
			</View>
			<Image source={Bg} style={styles.bullet}/>
		</View>
	}
}