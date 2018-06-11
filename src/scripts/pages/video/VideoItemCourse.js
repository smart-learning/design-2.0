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
import Store from "../../commons/store";
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
		fontSize: 22,
		color: COLOR_PRIMARY,
	},
	subTitle: {
		fontSize: 16,
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
		bottom: '14%',
		left: '11.5%',
		fontSize: 16,
		color: '#ffffff'
	},
	play: {
		position: 'absolute',
		top: '75%',
		right: 20,
		width: 50,
		height: 50,
	},
});

export default class VideoItemCourse extends React.Component {

	render() {
		return <View style={styles.itemContainer}>
			{/*타이틀*/}
			<Text style={styles.title}>Title</Text>
			{/*서브타이틀*/}
			<Text style={styles.subTitle}>sub title</Text>
			{/*썸네일*/}
			<ImageBackground source={Dummy} style={styles.thumbnail}>
				<Text style={styles.courseCount}>11개 강의</Text>
				<Image source={ IcPlay } style={styles.play}/>
			</ImageBackground>
			<View>
				<Image source={ IcView }/>
				<Image source={ IcStar }/>
				<Image source={ IcComment }/>
				<Image source={ IcPin }/>
				<Image source={ IcShare }/>
			</View>
		</View>
	}
}