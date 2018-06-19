import React from "react";
import {
	Image,
	ImageBackground,
	Text,
	View,
	StyleSheet,
} from "react-native";
import { COLOR_PRIMARY } from "../../../styles/common";
import IcFilm from "../../../images/icons/film.png"
import IcComment from "../../../images/icons/commenting.png"
import IcPin from "../../../images/ic-pin-light.png";
import IcShare from "../../../images/ic-share-light.png";
import IcStar from "../../../images/icons/star.png";
import IcView from "../../../images/icons/eye.png";
import IcPlay from "../../../images/ic-play.png";

const styles = StyleSheet.create( {
	itemContainer: {
		width: '100%',
		position: 'relative',
	},
	thumbnail: {
		position: 'relative',
		width: '100%',
		paddingTop: '22%',
		paddingBottom: '22%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	thumbnailTitle: {
		position: 'absolute',
		top: 15,
		left: '5%',
		width: '70%',
		fontSize: 18,
		fontWeight: '800',
		color: '#ffffff',
		textShadowColor: 'rgba(0, 0, 0, 0.8)',
		textShadowOffset: {width: 1, height: 2},
		textShadowRadius: 4,
	},
	clipIcon: {
		position: 'absolute',
		bottom: '30%',
		left: '5%',
	},
	clipCount: {
		position: 'absolute',
		bottom: '30%',
		left: '11.5%',
		fontSize: 14,
		fontWeight: 'bold',
		color: '#ffffff'
	},
	play: {
		position: 'absolute',
		right: 15,
		width: 42,
		height: 42,
	},
	btnGroup: {
		width: '100%',
		height: 40,
		paddingRight: 12,
		paddingLeft: 12,
		backgroundColor: '#222222',
	},
	alignJustify: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	btnSetSmall: {
		width: 12,
		height: 12,
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
} );

export default class Summary extends React.Component {
	render() {
		return <View style={styles.itemContainer}>
			<ImageBackground
				source={{ uri: this.props.thumbnail }}
				resizeMode="cover"
				style={styles.thumbnail}>
				<Text style={styles.thumbnailTitle}>
					{this.props.title}
				</Text>
				<Image source={IcFilm} style={[styles.btnSetSmall, styles.clipIcon]}/>
				<Text style={styles.clipCount}>
					{this.props.clipCount}
					개 강의
				</Text>
				<Image source={IcPlay} style={styles.play}/>
			</ImageBackground>
			<View style={styles.btnGroup}>
				<View style={styles.alignJustify}>

					<Image source={IcView} style={styles.btnSetSmall}/>
					<Text style={styles.countText}>조회수 {this.props.hitCount}</Text>
					<Image source={IcStar} style={styles.btnSetSmall}/>
					<Text style={styles.countText}>별점 {this.props.starAvg}</Text>
					<Image source={IcComment} style={styles.btnSetSmall}/>
					<Text style={styles.countText}>리뷰 {this.props.reviewCount}</Text>
					<Image source={IcPin} style={[ styles.btnSetLarge, { marginLeft: 'auto' } ]}/>
					<Image source={IcShare} style={styles.btnSetLarge}/>
				</View>
			</View>
		</View>
	}
}