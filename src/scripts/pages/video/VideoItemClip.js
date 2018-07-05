import React from "react";
import {
	Image,
	ImageBackground,
	Text,
	View,
	StyleSheet,
} from "react-native";
import {COLOR_PRIMARY} from "../../../styles/common";
import IcComment from "../../../images/ic-comment-light.png"
import IcPin from "../../../images/ic-pin-light-line.png";
import IcShare from "../../../images/ic-share-light.png";
import IcStar from "../../../images/ic-star-light.png";
import IcStarActive from "../../../images/ic-star.png";
import IcView from "../../../images/ic-view-light.png";
import Dummy from "../../../images/dummy-videoClip.png";
import IcPlay from "../../../images/ic-play.png";
import {DrawerActions} from "react-navigation";
import CommonStyles from "../../../styles/common";

const styles = StyleSheet.create({
	itemContainer: {
		width: '100%',
		paddingTop: 30,
		paddingRight: 30,
		paddingBottom: 30,
		paddingLeft: 30,
		position: 'relative',
		backgroundColor: '#ffffff',
		marginBottom: 10,
	},
	title: {
		fontSize: 18,
		color: '#4A4A4A',
	},
	subTitle: {
		fontSize: 14,
		color: COLOR_PRIMARY,
	},
	authorInfo: {
		fontSize: 14,
		color: '#999999'
	},
	paragraph: {
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		fontSize: 16,
		color: '#999999',
	},
	thumbnail: {
		position: 'relative',
		width: '100%',
		paddingTop: '20%',
		paddingBottom: '20%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	thumbnailBtnGroup: {
		position: 'absolute',
		bottom: '30%',
		left: '11.5%',
		width: '100%',
	},
	play: {
		position: 'absolute',
		right: 20,
		width: 50,
		height: 50,
	},
	btnGroup: {
		width: '100%',
		height: 50,
		backgroundColor: '#222222',
	},
	alignJustify: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	btnSetSmall: {
		width: 18,
		height: 18,
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
	}
});

export default class VideoItemClip extends React.Component {
	render() {
		return <View style={styles.itemContainer}>
			{/*서브타이틀*/}
			<Text style={styles.subTitle}>
				{this.props.subTitle}
			</Text>
			{/*타이틀*/}
			<Text style={styles.title}>
				{this.props.title}
			</Text>
			{/*작성자*/}
			<Text style={styles.authorInfo}>
				{this.props.authorInfo}
			</Text>
			{/*설명*/}
			<Text style={styles.paragraph}>
				{this.props.paragraph}
			</Text>
			{/*썸네일*/}
			<ImageBackground source={Dummy} style={styles.thumbnail}>
				<View style={styles.thumbnailBtnGroup}>
					<View style={styles.alignJustify}>
						<Image source={IcView} style={styles.btnSetSmall}/>
						<Text style={styles.countText}>{this.props.viewCount}</Text>
						<Image source={IcStar} style={styles.btnSetSmall}/>
						<Text style={styles.countText}>{this.props.starCount}</Text>
					</View>
				</View>
				<Image source={IcPlay} style={styles.play}/>
			</ImageBackground>
			<View style={styles.btnGroup}>
				<View style={styles.alignJustify}>
					<Image source={IcStar} style={styles.btnSetLarge}/>
					<Image source={IcComment} style={styles.btnSetLarge}/>
					<Image source={IcPin} style={styles.btnSetLarge}/>
					<Image source={IcShare} style={styles.btnSetLarge}/>
				</View>
			</View>
		</View>
	}
}