import React from "react";
import { Image, StyleSheet, Text, View, } from "react-native";
import CommonStyles from "../../../styles/common";
import IcStarOrange from "../../../images/ic-star-orange.png";
import globalStore from '../../commons/store';

const styles = StyleSheet.create( {
	reviewItem: {
		paddingBottom: 30,
	},
	reviewHr: {
		width: '100%',
		height: 1,
		marginTop: 30,
		backgroundColor: '#dddddd',
	},
	reviewName: {
		marginRight: 10,
		fontSize: 15,
		fontWeight: 'bold',
		color: '#333333',
	},
	reviewIcon: {
		position: 'relative',
		top: 1,
		width: 14,
		height: 13,
	},
	reviewText: {
		paddingTop: 12,
		paddingBottom: 15,
		fontSize: 15,
		color: '#555555',
	},
	reviewTime: {
		fontSize: 12,
		color: '#888888',
	}
} );

export default class ReviewItem extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {

		return <View style={styles.reviewItem}>
			<View style={CommonStyles.alignJustifyFlex}>
				<Text style={styles.reviewName}>{ globalStore.profile ? globalStore.profile.name || '시연용' : '' }</Text>
				<View>
					<View style={CommonStyles.alignJustifyFlex}>
						<Image source={IcStarOrange} style={styles.reviewIcon}/>
						<Image source={IcStarOrange} style={styles.reviewIcon}/>
					</View>
				</View>
			</View>
			<Text style={styles.reviewText}>ReviewItem</Text>
			<Text style={styles.reviewTime}>0000-00-00 00:00:00</Text>
			<View style={styles.reviewHr}/>
		</View>
	}
}