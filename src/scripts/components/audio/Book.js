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
import IcPin from "../../../images/ic-pin-grey.png";
import IcShare from "../../../images/ic-share-grey.png";
import IcHeart from "../../../images/ic-heart-pink.png";
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
					<Text style={styles.bookTitleRecommend}>{this.props.title}</Text>
					<Text style={styles.bookAuthorRecommend}>{this.props.teacherName}</Text>
					<Text>하트 핀</Text>
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
			</View>
			<View style={styles.bookThumbnail}>
				<Image source={{ uri: this.props.bookThumbnail }} style={styles.bookThumbnailSize}/>
			</View>
		</View>
	}
}