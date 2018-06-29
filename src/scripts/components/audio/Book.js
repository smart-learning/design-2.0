import React from "react";
import {
	Image,
	Text,
	View,
	StyleSheet,
} from "react-native";
import {DrawerActions} from "react-navigation";
import CommonStyles from "../../../styles/common";
import IcComment from "../../../images/ic-comment-dark.png"
import IcPin from "../../../images/ic-pin-grey.png";
import IcShare from "../../../images/ic-share-grey.png";
import IcHeart from "../../../images/ic-heart-pink.png";
import IcView from "../../../images/ic-view-dark.png";
import Dummy from "../../../images/dummy-audioBook.png";

const styles = StyleSheet.create({
	itemContainer: {
		position: 'relative',
	},
	alignJustify: {
		flex: 1,
		flexDirection: 'row',
		// alignItems: 'center',
		// justifyContent: 'center',
	},
	itemInfo: {
		width: '100%',
		height: 135,
		paddingTop: 30,
		paddingBottom: 30,
		paddingLeft: 30,
		backgroundColor: '#ffffff',
	},
	itemContent: {
		height: 145,
		paddingTop: 30,
		paddingBottom: 30,
		paddingLeft: 30,
	},
	bookThumbnail: {
		position: 'absolute',
		top: '17%',
		right: 10,
		width: 160,
		height: 188,
	},
	bookThumbnailSize: {
		width: '100%',
		height: '100%',
	}
});

export default class Book extends React.Component {
	render() {
		return <View style={ styles.itemContainer }>
			<View style={ [ styles.alignJustify, styles.itemInfo ] }>
				<Text>1</Text>
				<Text>2</Text>
			</View>
			<View style={ [ {backgroundColor: this.props.itemColor}, styles.itemContent ] }><Text>2</Text></View>
			<View style={styles.bookThumbnail}>
				<Image source={Dummy} style={styles.bookThumbnailSize}/>
			</View>
		</View>
	}
}