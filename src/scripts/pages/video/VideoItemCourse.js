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
import IcPin from "../../../images/ic-pin-light.png";
import IcShare from "../../../images/ic-share-light.png";
import IcStar from "../../../images/ic-star-light.png";
import IcStarActive from "../../../images/ic-star.png";
import IcView from "../../../images/ic-view-light.png";
import Dummy from "../../../images/dummy-videocourse.png";
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
		color: COLOR_PRIMARY,
	},
	subTitle: {
		fontSize: 14,
		color: '#999999'
	},
	thumbnail: {
		position: 'relative',
		width: '100%',
		paddingTop: '21%',
		paddingBottom: '21%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	courseCount: {
		position: 'absolute',
		bottom: '30%',
		left: '11.5%',
		fontSize: 14,
		color: '#ffffff'
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
		// justifyContent: 'center',
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

export default class VideoItemCourse extends React.Component {
	render() {
		return <View style={styles.itemContainer}>
			{/*타이틀*/}
			<Text style={styles.title}>
				{this.props.title}
			</Text>
			{/*서브타이틀*/}
			<Text style={styles.subTitle}>
				{this.props.subTitle}
			</Text>
			{/*썸네일*/}
			<ImageBackground source={Dummy} style={styles.thumbnail}>
				<Text style={styles.courseCount}>
					{this.props.courseCount}
					개 강의
				</Text>
				<Image source={IcPlay} style={styles.play}/>
			</ImageBackground>
			<View style={styles.btnGroup}>
				<View style={styles.alignJustify}>

					<Image source={IcView} style={styles.btnSetSmall}/>
					<Text style={ styles.countText }>조회수 {this.props.viewCount}</Text>
					<Image source={IcStar} style={styles.btnSetSmall}/>
					<Text style={ styles.countText }>별점 {this.props.starCount}</Text>
					<Image source={IcComment} style={styles.btnSetSmall}/>
					<Text style={ styles.countText }>리뷰 {this.props.reviewCount}</Text>
					<Image source={IcPin} style={ [styles.btnSetLarge, {marginLeft: 'auto'}] }/>
					<Image source={IcShare} style={styles.btnSetLarge}/>
				</View>
			</View>
		</View>
	}
}