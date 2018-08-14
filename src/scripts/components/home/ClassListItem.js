import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, } from "react-native";
import CommonStyles from "../../../styles/common";
import Summary from "../video/Summary";

const styles = StyleSheet.create( {
	classList: {
		marginBottom: 20,
	},
	classItem: {
		position: 'relative',
		marginBottom: 15,
		padding: 15,
		borderWidth: 1,
		borderColor: '#dddddd',
	},
	classRank: {
		marginBottom: 15,
		alignItems: 'center',
	},
	classRankText: {
		textAlign: 'center',
		fontSize: 15,
		fontWeight: 'bold',
		color: CommonStyles.COLOR_PRIMARY,
	},
	classRankHr: {
		width: 20,
		borderTopWidth: 0,
		borderRightWidth: 0,
		borderBottomWidth: 1,
		borderLeftWidth: 0,
		borderColor: '#00b870',
	},
	classTitle: {
		fontSize: 16,
		color: CommonStyles.COLOR_PRIMARY,
	},
	classAuthor: {
		fontSize: 14,
		color: '#888888',
	},
	classLabels: {
		marginBottom: 15,
	},
	classLabel: {
		height: 22,
		marginTop: 9,
		marginRight: 3,
		paddingTop: 3,
		paddingRight: 10,
		paddingBottom: 3,
		paddingLeft: 10,
		borderWidth: 1,
	},
	classLabelText: {
		fontSize: 12,
	},
	classLabelBlank: {
		borderColor: 'transparent',
		opacity: 0,
	},
	classLabelExclusive: {
		borderColor: '#ff761b',
	},
	classLabelExclusiveText: {
		color: '#ff761b',
	},
	classLabelFree: {
		borderColor: '#00afba',
	},
	classLabelFreeText: {
		color: '#00afba',
	},
} );

export default class ClassListItem extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {

		return <View style={styles.classItem}>
			{this.props.classType === 'hot' &&
			<View style={styles.classRank}>
				<Text style={styles.classRankText}>
					{this.props.rankNumber}
				</Text>
				<View style={styles.classRankHr}/>
			</View>
			}
			<TouchableOpacity activeOpacity={0.9}>
				<Text style={styles.classTitle}>
					{this.props.itemData.headline}
				</Text>
			</TouchableOpacity>
			<Text style={styles.classAuthor}>
				{this.props.itemData.teacher.name}
			</Text>
			<View style={[ styles.classLabels, CommonStyles.alignJustifyFlex ]}>
				{this.props.itemData.is_exclusive === false &&
				<View style={[ styles.classLabel, styles.classLabelBlank ]} borderRadius={10}>
					<Text>blank</Text>
				</View>
				}
				{this.props.itemData.is_exclusive === true &&
				<View style={[ styles.classLabel, styles.classLabelExclusive ]} borderRadius={10}>
					<Text style={[ styles.classLabelText, styles.classLabelExclusiveText ]}>독점</Text>
				</View>
				}
				{/*<View style={[ styles.classLabel, styles.classLabelFree ]} borderRadius={10}>*/}
					{/*<Text style={[ styles.classLabelText, styles.classLabelFreeText ]}>무료</Text>*/}
				{/*</View>*/}
			</View>
			<Summary type="course"
					 title={this.props.itemData.title}
					 course={this.props.itemData.id}
					 thumbnail={this.props.itemData.images.wide}
					 clipCount={this.props.itemData.clip_count}
					 hitCount={this.props.itemData.hit_count}
					 starAvg={this.props.itemData.star_avg}
					 reviewCount={this.props.itemData.review_count}/>
		</View>
	}
}