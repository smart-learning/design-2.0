import React from "react";
import {
	Image,
	ImageBackground,
	Text,
	View,
	StyleSheet
} from "react-native";
import {COLOR_PRAMARY} from "../../../styles/common";
// import CommonStyles from "../../../styles/common";
import IcComment from "../../../images/ic-comment-light.png"
import IcPin from "../../../images/ic-pin-light.png";
import IcShare from "../../../images/ic-share-light.png";
import IcStar from "../../../images/ic-star-light.png";
import IcStarActive from "../../../images/ic-star.png";
import IcView from "../../../images/ic-view-light.png";
// import Dummy from "../../../images/dummy-videocourse.png";


export default class VideoItemCourse extends React.Component {
	render() {
		return <View style={ styles.itemContainer }>
			{/*타이틀*/}
			<Text style={ styles.title }>Title</Text>

			<Text style={ styles.subTitle }>sub title</Text>
			<View style={ styles.thumbnail }>
				<Text>Thumbnail</Text>
			</View>
			{/*<ImageBackground source={ Dummy } style={ styles.thumbnail }>*/}
				{/*<Text>Inside</Text>*/}
			{/*</ImageBackground>*/}
			<Image source={ IcComment }/>
			<Image source={ IcPin }/>
			<Image source={ IcShare }/>
			<Image source={ IcStar }/>
			<Image source={ IcStarActive }/>
			<Image source={ IcView }/>
		</View>
	}
}

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
		color: COLOR_PRAMARY,
	},
	subTitle: {
		fontSize: 16,
		color: '#999999'
	},
	thumbnail: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		width: '88%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	bigblue: {
		color: 'blue',
		fontWeight: 'bold',
		fontSize: 30,
	},
	red: {
		color: 'red',
	},
});