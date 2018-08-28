import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, Image,} from "react-native";
import CommonStyles from "../../../styles/common";
import IcPlayPreview from "../../../images/ic-play-preview.png";
import IcPlay from "../../../images/ic-audio-play.png";

const styles = StyleSheet.create({
	chapterTitleText: {
		paddingTop: 40,
		paddingBottom: 15,
		fontWeight: 'bold',
		fontSize: 18,
		color: CommonStyles.COLOR_PRIMARY,
	},
	chapterHr: {
		width: '100%',
		height: 1,
		backgroundColor: '#dddddd',
	},
	chapterItem: {
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
	},
	previewTitleText: {
		width: '75%',
		fontWeight: 'bold',
		fontSize: 15,
		color: '#333333',
	},
	itemTitleText: {
		width: '75%',
		fontSize: 13,
		color: '#333333',
	},
	itemTime: {
		fontSize: 11,
		color: '#555555',
	},
	playButtonPreview: {
		width: 80,
		height: 25,
	},
	playButton: {
		width: 30,
		height: 30,
	},
});

export default class ChapterListItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <View>
			<View>
				<Text style={styles.chapterTitleText}>chapter title</Text>
				<View style={styles.chapterHr}/>
			</View>
			<View>
				<View style={[CommonStyles.alignJustifyContentBetween, styles.chapterItem]}>
					<Text style={styles.previewTitleText}>previewTitle</Text>
					<TouchableOpacity activeOpacity={0.9}>
						<Image source={IcPlayPreview} style={styles.playButtonPreview}/>
					</TouchableOpacity>
				</View>
				<View style={styles.chapterHr}/>
			</View>
			<View>
				<View style={[CommonStyles.alignJustifyContentBetween, styles.chapterItem]}>
					<Text style={styles.itemTitleText}>itemTitleitemTitleitemTitleitemTitleitemTitleitemTitle</Text>
					<Text style={styles.itemTime}>00:00</Text>
					<TouchableOpacity activeOpacity={0.9}>
						<Image source={IcPlay} style={styles.playButton}/>
					</TouchableOpacity>
				</View>
				<View style={styles.chapterHr}/>
			</View>

			<View>
				<Text style={styles.chapterTitleText}>chapter title</Text>
				<View style={styles.chapterHr}/>
			</View>
			<View>
				<View style={[CommonStyles.alignJustifyContentBetween, styles.chapterItem]}>
					<Text style={styles.previewTitleText}>previewTitle</Text>
					<TouchableOpacity activeOpacity={0.9}>
						<Image source={IcPlayPreview} style={styles.playButtonPreview}/>
					</TouchableOpacity>
				</View>
				<View style={styles.chapterHr}/>
			</View>
			<View>
				<View style={[CommonStyles.alignJustifyContentBetween, styles.chapterItem]}>
					<Text style={styles.itemTitleText}>itemTitleitemTitleitemTitleitemTitleitemTitleitemTitle</Text>
					<Text style={styles.itemTime}>00:00</Text>
					<TouchableOpacity activeOpacity={0.9}>
						<Image source={IcPlay} style={styles.playButton}/>
					</TouchableOpacity>
				</View>
				<View style={styles.chapterHr}/>
			</View>
		</View>
	}
}