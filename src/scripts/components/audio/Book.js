import React from "react";
import {
	Image,
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { DrawerActions } from "react-navigation";
import CommonStyles from "../../../styles/common";
import IcComment from "../../../images/ic-comment-dark.png"
import IcPin from "../../../images/ic-pin-grey-fill.png";
import IcPinDarkLine from "../../../images/ic-pin-dark-line.png";
import IcShare from "../../../images/ic-share-grey.png";
import IcHeart from "../../../images/ic-heart-pink.png";
import IcHeartLine from "../../../images/ic-heart-pink-line.png";
import IcView from "../../../images/ic-view-dark.png";

const styles = StyleSheet.create( {
	itemContainer: {
		position: 'relative',
	},
	alignJustify: {
		flex: 1,
		flexDirection: 'row',
	},
	itemInfo: {
		width: '100%',
		height: 115,
		padding: 20,
		backgroundColor: '#ffffff',
	},
	itemContent: {
		height: 130,
		padding: 20,
	},
	bookInfoWrap: {
		width: '60%',
	},
	sequence: {
		width: 24,
		fontSize: 16,
		color: '#FF4F72',
	},
	bookThumbnail: {
		position: 'absolute',
		top: 50,
		right: 15,
		width: 120,
		height: 141,
	},
	bookThumbnailSize: {
		width: '100%',
		height: '100%',
	},
	bookTitleBest: {
		minHeight: 20,
		maxHeight: 40,
		fontSize: 16,
		lineHeight: 20,
		color: '#4a4a4a',
	},
	bookAuthorBest: {
		fontSize: 12,
		lineHeight: 20,
		color: '#999999',
	},
	bookTitleRecommend: {
		fontSize: 18,
		color: '#000000',
	},
	bookAuthorRecommend: {
		paddingTop: 5,
		paddingBottom: 5,
		fontSize: 12,
		color: '#4A4A4A',
	},
	bookMemoBest: {
		width: '60%',
		height: 60,
		fontSize: 13,
		color: '#5A5A5A',
		lineHeight: 20,
	},
	bookMemoRecommend: {
		width: '60%',
		height: 60,
		fontSize: 15,
		color: '#ffffff',
		lineHeight: 20,
	},
	socialButtonWrap: {
		position: 'absolute',
		top: 20,
		right: 20,
		zIndex: 9,
	},
	socialButton: {
		width: 20,
		height: 20,
		marginLeft: 5,
	},
	playTime: {
		fontSize: 12,
		color: '#4A4A4A',
	},
	price: {
		fontSize: 12,
		color: '#FF4F72',
	},
	bar: {
		width: 1,
		height: 12,
		marginLeft: 5,
		marginRight: 5,
		backgroundColor: '#C6C6C6',
	},
	btnSetSmall: {
		width: 17,
		height: 17,
	},
	btnSetLarge: {
		width: 24,
		height: 24,
	},
	countText: {
		paddingLeft: 3,
		paddingRight: 7,
		fontSize: 12,
		color: '#4A4A4A',
	},
	countWrap: {
		position: 'absolute',
		left: 20,
		bottom: 20,
	},
	recommendButtonWrap: {
		position: 'absolute',
		left: 0,
		bottom: 0,
	},
	recommendButton: {
		marginRight: 6,
	},
	recommendPriceWrap: {
		paddingTop: 2,
		paddingRight: 7,
		paddingBottom: 2,
		paddingLeft: 7,
		backgroundColor: '#787878',
		justifyContent: 'center',
		alignItems: 'center',
	},
	recommendPrice: {
		fontSize: 12,
		color: '#ffffff',
	},
	recommendPriceOrigin: {
		textDecorationLine: 'line-through',
	},
	recommendPriceSale: {
		color: '#ff4f72',
	}
} );

export default class Book extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			//
		};
	}

	render() {
		return <View style={styles.itemContainer}>
			{this.props.type === 'best' &&
			<View style={[ styles.alignJustify, styles.socialButtonWrap ]}>
				<TouchableOpacity activeOpacity={0.9}>
					<Image source={IcPin} style={styles.socialButton}/>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.9}>
					<Image source={IcShare} style={styles.socialButton}/>
				</TouchableOpacity>
			</View>
			}
			<View style={[ styles.alignJustify, styles.itemInfo ]}>
				{this.props.type === 'best' &&
				<Text style={styles.sequence}>00</Text>
				}
				{this.props.type === 'best' &&
				<View style={styles.bookInfoWrap}>
					<Text style={styles.bookTitleBest}>{this.props.title}</Text>
					<Text style={styles.bookAuthorBest}>{this.props.teacherName}</Text>
					<View style={styles.alignJustify}>
						<Text style={styles.playTime}>06시간 23분</Text>
						<View style={styles.bar}/>
						<Text style={styles.price}>₩11,900</Text>
					</View>
				</View>
				}
				{this.props.type === 'recommend' &&
				<View style={styles.bookInfoWrap}>
					<Text style={styles.bookTitleRecommend} numberOfLines={1}
						  ellipsizeMode={'tail'}>{this.props.title}</Text>
					<Text style={styles.bookAuthorRecommend}>{this.props.teacherName}</Text>
					<View style={[ styles.alignJustify, styles.recommendButtonWrap ]}>
						<Image source={IcHeartLine} style={[styles.btnSetLarge, styles.recommendButton]}/>
						<Image source={IcPinDarkLine} style={[styles.btnSetLarge, styles.recommendButton]}/>
						{/*{this.props.isFree === 'true' &&*/}
						{/*<View style={styles.recommendPriceWrap} borderRadius={2}>*/}
							{/*<Text style={styles.recommendPrice}>무료</Text>*/}
						{/*</View>*/}
						{/*}*/}
						{/*{this.props.isFree === 'false' &&*/}
						<View style={styles.recommendPriceWrap} borderRadius={2}>
							<Text style={styles.recommendPrice}>
								₩11,900/
								<Text style={styles.recommendPriceOrigin}>₩11,900</Text>
								<Text style={styles.recommendPriceSale}>(0%)</Text>
							</Text>
						</View>
						{/*}*/}
					</View>
				</View>
				}
			</View>
			<View style={[ { backgroundColor: this.props.bannerColor }, styles.itemContent ]}>
				{this.props.type === 'best' &&
				<Text style={styles.bookMemoBest} numberOfLines={3} ellipsizeMode={'tail'}>{this.props.memo}</Text>
				}
				{this.props.type === 'recommend' &&
				<Text style={styles.bookMemoRecommend} numberOfLines={3} ellipsizeMode={'tail'}>{this.props.memo}</Text>
				}
				<View style={[ styles.alignJustify, styles.countWrap ]}>
					<Image source={IcView} style={styles.btnSetSmall}/>
					<Text style={styles.countText}>{this.props.hitCount}</Text>
					<Image source={IcHeart} style={styles.btnSetSmall}/>
					<Text style={styles.countText}>{this.props.likeCount}</Text>
					<Image source={IcComment} style={styles.btnSetSmall}/>
					<Text style={styles.countText}>{this.props.reviewCount}</Text>
				</View>
			</View>
			<View style={styles.bookThumbnail}>
				<Image source={{ uri: this.props.bookThumbnail }} style={styles.bookThumbnailSize}/>
			</View>
		</View>
	}
}