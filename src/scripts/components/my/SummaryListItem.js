import React from "react";
import {ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, } from "react-native";
import dummy from "../../../images/dummy-summary.jpg";
import IcHeart from "../../../images/ic-heart-green-line.png";
import IcHeartActive from "../../../images/ic-heart-green.png";
import IcReview from "../../../images/ic-comment-dark.png";


const styles = StyleSheet.create({
	summary: {
		flexDirection: 'row',
		position: 'relative',
		paddingTop: 15,
	},
	summaryThumbnail: {
		width: 65,
		height: 92,
		marginLeft: 15,
		marginRight: 10,
	},
	summaryContent: {
		position: 'relative',
		width: '65%',
		paddingRight: 15,
	},
	summaryTitle: {
		fontSize: 16,
		color: '#4a4a4a',
	},
	summaryAuthor: {
		fontSize: 12,
		color: '#999999',
	},
	summaryCountContainer: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
	},
	summaryIcon: {
		width: 14,
		height: 14,
	},
	summaryCountText: {
		paddingLeft: 3,
		paddingRight: 7,
		fontSize: 12,
		color: '#999999',
	},
	summaryLikeButtonActive: {
		width: 24,
		height: 24,
	},
	summaryLikeButton: {
		width: 24,
		height: 24,
	},
	summaryHr: {
		marginTop: 15,
		width: '100%',
		height: 1,
		backgroundColor: '#efefef'
	},
});

export default class SummaryListItem extends React.Component {

	onPress = () => {
		if( this.props.onPress ) {
			this.props.onPress();
		}
	};

	render() {
		return <View>
			<View style={styles.summary}>
				{this.props.thumbnail &&
				<ImageBackground source={{ uri: this.props.thumbnail }} resizeMode="cover" style={styles.summaryThumbnail}/>
				}
				{!this.props.thumbnail &&
				<ImageBackground source={dummy} resizeMode="cover" style={styles.summaryThumbnail}/>
				}
				<View style={styles.summaryContent}>
					<TouchableOpacity activeOpacity={0.9} onPress={ this.onPress }>
						<Text style={styles.summaryTitle}>{this.props.title}</Text>
					</TouchableOpacity>
					<Text style={styles.summaryAuthor}>{this.props.author}</Text>
					<View style={styles.summaryCountContainer}>
						<Image source={IcHeartActive} style={styles.summaryIcon}/>
						<Text style={styles.summaryCountText}>{this.props.likeCount}</Text>
						<Image source={IcReview} style={styles.summaryIcon}/>
						<Text style={styles.summaryCountText}>{this.props.reviewCount}</Text>
					</View>
				</View>
				<View>
					{/* TODO: 터치시 상태변경 작업 필요 */}
					<TouchableOpacity activeOpacity={0.9}>
						{!!this.props.isLike &&
						<Image source={IcHeartActive} style={styles.summaryLikeButtonActive}/>
						}
						{!this.props.isLike &&
						<Image source={IcHeart} style={styles.summaryLikeButton}/>
						}
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.summaryHr}/>
		</View>
	}
}