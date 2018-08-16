import React from "react";
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image, } from "react-native";
import CommonStyles from "../../../styles/common";
import IcStarOrange from "../../../images/ic-star-orange.png";

const styles = StyleSheet.create( {
	reviewForm: {
		paddingTop: 30,
		paddingRight: 15,
		paddingBottom: 30,
		paddingLeft: 15,
		backgroundColor: '#f1f1f1',
	},
	reviewFormParagraph: {
		textAlign: 'center',
		fontSize: 15,
		color: '#555555',
	},
	reviewInput: {
		backgroundColor: '#ffffff',
	},
	submitButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 40,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	submitButtonText: {
		fontSize: 15,
		color: '#ffffff'
	}
} );

@observer
class ReviewForm extends React.Component {
	@observable reviewText = '';

	constructor( props ) {
		super( props );
	}

	render() {
		return <View style={styles.reviewForm}>
			<Text style={styles.reviewFormParagraph}>여러분의 평가를 바탕으로</Text>
			<Text style={styles.reviewFormParagraph}>더 좋은 강의를 만들겠습니다^^</Text>

			<TouchableOpacity activeOpacity={0.9}>
				<View style={styles.submitButton} borderRadius={5}>
					<Text style={styles.submitButtonText}>등록</Text>
				</View>
			</TouchableOpacity>
			<Text>review form</Text>
		</View>
	}
}

export default ReviewForm;