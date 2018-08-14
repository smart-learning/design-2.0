import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image, } from "react-native";
import CommonStyles from "../../../styles/common";
import Device from "../../commons/device";
import IcPlay from "../../../images/ic-play.png";

const styles = StyleSheet.create( {
	continueGrid: {
		marginTop: 20,

	},
	continueItem: {
		width: '48%',
		borderWidth: 1,
		borderColor: '#dddddd',
	},
	thumbnail: {
		position: 'relative',
		width: '100%',
		paddingTop: '22%',
		paddingBottom: '22%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#efefef',
	},
	thumbnailTitle: {
		position: 'absolute',
		top: 15,
		left: '5%',
		width: '65%',
		fontSize: 14,
		fontWeight: '800',
		color: '#ffffff',
		textShadowColor: 'rgba(0, 0, 0, 0.8)',
		textShadowOffset: {
			width: 1,
			height: 2
		},
		textShadowRadius: 4,
	},
	play: {
		position: 'absolute',
		right: 15,
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
} );


export default class ClassContinueList extends React.Component {

	constructor( props ) {
		super( props );
	}

	render() {
		return <View style={[CommonStyles.alignJustifyContentBetween, styles.continueGrid]}>
			<View style={styles.continueItem}>
				<View style={styles.itemContainer}>
					<TouchableOpacity activeOpacity={0.9}>
						<ImageBackground
							source={{ uri: this.props.thumbnail }}
							resizeMode="cover"
							style={styles.thumbnail}>
							<Text style={styles.thumbnailTitle}>
								{/*{this.props.title}*/}
								titleasdfasdfasfasdfas
							</Text>
							<Image source={IcPlay} style={styles.play}/>
						</ImageBackground>
					</TouchableOpacity>
				</View>
				<View style={styles.progress}>
					<View style={[styles.progressBar, {width: '10%'}]}/>
				</View>
				<View style={styles.info}>
					<Text style={styles.infoText}>
						00개 클립, 00시간 00분
					</Text>
				</View>
			</View>
			<View style={styles.continueItem}>
				<View style={styles.itemContainer}>
					<TouchableOpacity activeOpacity={0.9}>
						<ImageBackground
							source={{ uri: this.props.thumbnail }}
							resizeMode="cover"
							style={styles.thumbnail}>
							<Text style={styles.thumbnailTitle}>
								{this.props.title}
							</Text>
							<Image source={IcPlay} style={styles.play}/>
						</ImageBackground>
					</TouchableOpacity>
				</View>
				<View style={styles.progress}>
					<View style={[styles.progressBar, {width: '10%'}]}/>
				</View>
				<View style={styles.info}>
					<Text style={styles.infoText}>
						00개 클립, 00시간 00분
					</Text>
				</View>
			</View>
		</View>
	}
}