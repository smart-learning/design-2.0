import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image, } from "react-native";
import CommonStyles from "../../../styles/common";
import IcStarGrey from "../../../images/ic-star-grey.png";
import IcStarOrange from "../../../images/ic-star-orange.png";

const styles = StyleSheet.create( {
	evaluation: {},
	starCount: {
		fontSize: 30,
		color: '#333333',
	},
	evaluationItem: {
		alignItems: 'center',
		marginTop: 10,
	},
	evaluationIcon: {
		position: 'relative',
		top: 1,
		width: 14,
		height: 13,
	},
	evaluationText: {
		fontSize: 13,
		color: '#888888',
	},
	evaluationTextBullet: {
		fontSize: 12,
		color: '#888888',
	},
	evaluationBar: {
		position: 'relative',
		width: 200,
		height: 10,
		backgroundColor: '#eaeaea',
	},
	evaluationProgress : {
		position: 'absolute',
		top: 0,
		left: 0,
		height: 10,
		backgroundColor: '#838d92',
	}
} );

export default class Evaluation extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		return <View style={styles.evaluation}>
			<Text style={styles.starCount}>0.0</Text>

			<View style={[CommonStyles.alignJustifyContentBetween, styles.evaluationItem]}>
				<View style={styles.evaluationBar}>
					<View style={[styles.evaluationProgress, {width: '10%'}]}/>
				</View>
				<View>
					<View style={CommonStyles.alignJustifyFlex}>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
					</View>
				</View>
				<Text style={styles.evaluationText}>
					00 <Text style={styles.evaluationTextBullet}>%</Text>
				</Text>
			</View>

			<View style={[CommonStyles.alignJustifyContentBetween, styles.evaluationItem]}>
				<View style={styles.evaluationBar}>
					<View style={[styles.evaluationProgress, {width: '10%'}]}/>
				</View>
				<View>
					<View style={CommonStyles.alignJustifyFlex}>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarGrey} style={styles.evaluationIcon}/>
					</View>
				</View>
				<Text style={styles.evaluationText}>
					00 <Text style={styles.evaluationTextBullet}>%</Text>
				</Text>
			</View>

			<View style={[CommonStyles.alignJustifyContentBetween, styles.evaluationItem]}>
				<View style={styles.evaluationBar}>
					<View style={[styles.evaluationProgress, {width: '10%'}]}/>
				</View>
				<View>
					<View style={CommonStyles.alignJustifyFlex}>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarGrey} style={styles.evaluationIcon}/>
						<Image source={IcStarGrey} style={styles.evaluationIcon}/>
					</View>
				</View>
				<Text style={styles.evaluationText}>
					00 <Text style={styles.evaluationTextBullet}>%</Text>
				</Text>
			</View>

			<View style={[CommonStyles.alignJustifyContentBetween, styles.evaluationItem]}>
				<View style={styles.evaluationBar}>
					<View style={[styles.evaluationProgress, {width: '10%'}]}/>
				</View>
				<View>
					<View style={CommonStyles.alignJustifyFlex}>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarGrey} style={styles.evaluationIcon}/>
						<Image source={IcStarGrey} style={styles.evaluationIcon}/>
						<Image source={IcStarGrey} style={styles.evaluationIcon}/>
					</View>
				</View>
				<Text style={styles.evaluationText}>
					00 <Text style={styles.evaluationTextBullet}>%</Text>
				</Text>
			</View>

			<View style={[CommonStyles.alignJustifyContentBetween, styles.evaluationItem]}>
				<View style={styles.evaluationBar}>
					<View style={[styles.evaluationProgress, {width: '10%'}]}/>
				</View>
				<View>
					<View style={CommonStyles.alignJustifyFlex}>
						<Image source={IcStarOrange} style={styles.evaluationIcon}/>
						<Image source={IcStarGrey} style={styles.evaluationIcon}/>
						<Image source={IcStarGrey} style={styles.evaluationIcon}/>
						<Image source={IcStarGrey} style={styles.evaluationIcon}/>
						<Image source={IcStarGrey} style={styles.evaluationIcon}/>
					</View>
				</View>
				<Text style={styles.evaluationText}>
					00 <Text style={styles.evaluationTextBullet}>%</Text>
				</Text>
			</View>
			<Text>Evaluation Contents</Text>
		</View>
	}
}