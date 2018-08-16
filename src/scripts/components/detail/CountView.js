import React from "react";
import { Text, View, StyleSheet, Image, } from "react-native";
import CommonStyles from "../../../styles/common";
import IcView from "../../../images/ic-detail-view.png"
import IcStar from "../../../images/ic-detail-star.png"
import IcMessage from "../../../images/ic-detail-message.png"

const styles = StyleSheet.create( {
	countView: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		backgroundColor: '#333333',
	},
	countContainer: {
		flexDirection: 'row',
	},
	countIcon: {
		width: 21,
		height: 15,
		marginRight: 7,
	},
	countText: {
		marginRight: 20,
		fontSize: 12,
		color: '#dddddd',
	}
} );

export default class CountView extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		return <View style={styles.countView}>
			<View style={styles.countContainer}>
				<Image source={IcView} style={styles.countIcon}/>
				<Text style={styles.countText}>00</Text>
				<Image source={IcStar} style={styles.countIcon}/>
				<Text style={styles.countText}>00</Text>
				<Image source={IcMessage} style={styles.countIcon}/>
				<Text style={styles.countText}>00</Text>
			</View>
		</View>
	}
}