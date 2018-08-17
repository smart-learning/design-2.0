import React from "react";
import {observer} from 'mobx-react';
import {Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image, TextInput, AppRegistry,} from "react-native";
import CommonStyles from "../../../styles/common";
import IcStarOrange from "../../../images/ic-star-orange-lg.png";
import IcStarGrey from "../../../images/ic-star-grey-lg.png";


const styles = StyleSheet.create({
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
		height: 100,
		marginTop: 30,
		marginBottom: 10,
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
	},
	starIcons: {
		position: 'relative',
		width: 185,
		height: 32,
		marginTop: 20,
		marginRight: 'auto',
		marginLeft: 'auto',
	},
	starIconContainer: {
		position: 'absolute',
	},
	starIconContainer1: {
		left: 0,
	},
	starIconContainer2: {
		left: 37,
	},
	starIconContainer3: {
		left: 74,
	},
	starIconContainer4: {
		left: 111,
	},
	starIconContainer5: {
		left: 148,
	},
	starIcon: {
		position: 'absolute',
		left: 0,
		top: 0,
		width: 33,
		height: 32,
	},
});

class UselessTextInput extends React.Component {
	render() {
		return (
			<TextInput
				{...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
				editable={true}
			/>
		);
	}
}

@observer
class ReviewForm extends React.Component {

	constructor(props) {
		super(props);
	}


	render() {
		return <View style={styles.reviewForm}>
			<Text style={styles.reviewFormParagraph}>여러분의 평가를 바탕으로</Text>
			<Text style={styles.reviewFormParagraph}>더 좋은 강의를 만들겠습니다^^</Text>

			<View style={styles.starIcons}>
				<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.store.reviewStar = 1}>
					<View style={[styles.starIconContainer, styles.starIconContainer1]}>
						<Image source={IcStarGrey}
							   style={(this.props.store.reviewStar === 0) ? styles.starIcon : {opacity: 0}}/>
						<Image source={IcStarOrange}
							   style={(this.props.store.reviewStar === 1 || this.props.store.reviewStar === 2 || this.props.store.reviewStar === 3 || this.props.store.reviewStar === 4 || this.props.store.reviewStar === 5) ? styles.starIcon : {opacity: 0}}/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.store.reviewStar = 2}>
					<View style={[styles.starIconContainer, styles.starIconContainer2]}>
						<Image source={IcStarGrey}
							   style={(this.props.store.reviewStar === 0 || this.props.store.reviewStar === 1) ? styles.starIcon : {opacity: 0}}/>
						<Image source={IcStarOrange}
							   style={(this.props.store.reviewStar === 2 || this.props.store.reviewStar === 3 || this.props.store.reviewStar === 4 || this.props.store.reviewStar === 5) ? styles.starIcon : {opacity: 0}}/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.store.reviewStar = 3}>
					<View style={[styles.starIconContainer, styles.starIconContainer3]}>
						<Image source={IcStarGrey}
							   style={(this.props.store.reviewStar === 0 || this.props.store.reviewStar === 1 || this.props.store.reviewStar === 2) ? styles.starIcon : {opacity: 0}}/>
						<Image source={IcStarOrange}
							   style={(this.props.store.reviewStar === 3 || this.props.store.reviewStar === 4 || this.props.store.reviewStar === 5) ? styles.starIcon : {opacity: 0}}/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.store.reviewStar = 4}>
					<View style={[styles.starIconContainer, styles.starIconContainer4]}>
						<Image source={IcStarGrey}
							   style={(this.props.store.reviewStar === 0 || this.props.store.reviewStar === 1 || this.props.store.reviewStar === 2 || this.props.store.reviewStar === 3) ? styles.starIcon : {opacity: 0}}/>
						<Image source={IcStarOrange}
							   style={(this.props.store.reviewStar === 4 || this.props.store.reviewStar === 5) ? styles.starIcon : {opacity: 0}}/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.store.reviewStar = 5}>
					<View style={[styles.starIconContainer, styles.starIconContainer5]}>
						<Image source={IcStarGrey}
							   style={(this.props.store.reviewStar === 0 || this.props.store.reviewStar === 1 || this.props.store.reviewStar === 2 || this.props.store.reviewStar === 3 || this.props.store.reviewStar === 4) ? styles.starIcon : {opacity: 0}}/>
						<Image source={IcStarOrange}
							   style={(this.props.store.reviewStar === 5) ? styles.starIcon : {opacity: 0}}/>
					</View>
				</TouchableOpacity>
			</View>

			<View style={styles.reviewInput} borderRadius={5}>
				<UselessTextInput
					multiline={true}
					numberOfLines={4}
					onChangeText={(text) => this.props.store.reviewText = {text}}
					value={this.props.store.reviewText}
				/>
			</View>

			<TouchableOpacity activeOpacity={0.9}>
				<View style={styles.submitButton} borderRadius={5}>
					<Text style={styles.submitButtonText}>등록</Text>
				</View>
			</TouchableOpacity>
		</View>
	}
}

export default ReviewForm;