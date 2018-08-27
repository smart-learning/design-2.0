import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, Image, FlatList, ImageBackground,} from "react-native";
import CommonStyles from "../../../styles/common";
import IcAngleDownGrey from "../../../images/ic-angle-down-grey.png";
import DummyBg from "../../../images/dummy-audioBookSimple.png";
import IcPlay from "../../../images/ic-play.png";

const styles = StyleSheet.create({
	continueList: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
		marginBottom: 50,
	},
	continueItem: {
		width: '31%',
		borderWidth: 1,
		borderColor: '#dddddd',
	},
	thumbnail: {
		width: '100%',
		paddingTop: '80%',
		paddingBottom: '80%',
	},
	play: {
		position: 'absolute',
		right: 15,
		bottom: 15,
		width: 32,
		height: 32,
	},
	progress: {
		position: 'relative',
		width: '100%',
		height: 4,
		backgroundColor: '#b7b7b7',
	},
	progressBar: {
		position: 'absolute',
		top: 0,
		left: 0,
		height: 4,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	info: {
		paddingTop: 6,
		paddingRight: 10,
		paddingBottom: 6,
		paddingLeft: 10,
	},
	infoText: {
		fontSize:12,
		color: '#555555',
	},
});

export default class BookContinueList extends React.Component {
	render() {
		return <View style={styles.continueList}>
			<View style={styles.continueItem}>
				<TouchableOpacity activeOpacity={0.9}>
					<Image source={IcPlay} style={styles.play}/>
					<ImageBackground source={DummyBg} resizeMode={"cover"} style={styles.thumbnail}/>
				</TouchableOpacity>
				<View style={styles.progress}>
					<View style={[styles.progressBar, {width: '10%'}]}/>
				</View>
				<View style={styles.info}>
					<Text style={styles.infoText}>00시간 00분</Text>
					<Text style={styles.infoText}>0월 0일 만료</Text>
				</View>
			</View>
			<View style={styles.continueItem}>
				<TouchableOpacity activeOpacity={0.9}>
					<Image source={IcPlay} style={styles.play}/>
					<ImageBackground source={DummyBg} resizeMode={"cover"} style={styles.thumbnail}/>
				</TouchableOpacity>
				<View style={styles.progress}>
					<View style={[styles.progressBar, {width: '10%'}]}/>
				</View>
				<View style={styles.info}>
					<Text style={styles.infoText}>00시간 00분</Text>
					<Text style={styles.infoText}>0월 0일 만료</Text>
				</View>
			</View>
			<View style={styles.continueItem}>
				<TouchableOpacity activeOpacity={0.9}>
					<Image source={IcPlay} style={styles.play}/>
					<ImageBackground source={DummyBg} resizeMode={"cover"} style={styles.thumbnail}/>
				</TouchableOpacity>
				<View style={styles.progress}>
					<View style={[styles.progressBar, {width: '10%'}]}/>
				</View>
				<View style={styles.info}>
					<Text style={styles.infoText}>00시간 00분</Text>
					<Text style={styles.infoText}>0월 0일 만료</Text>
				</View>
			</View>
		</View>
	}
}