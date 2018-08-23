import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList, } from "react-native";
import CommonStyles from "../../../styles/common";
import IcAngleDownGrey from "../../../images/ic-angle-down-grey.png";
import ClassListItem from "./ClassListItem";
import Summary from "../video/Summary";

const styles = StyleSheet.create( {
	classContainer: {
		marginTop: 20,
		marginBottom: 50,
	},
	viewMoreContainer: {
		alignItems: 'center',
	},
	viewMore: {
		width: 50,
		height: 36,
		justifyContent: 'center',
	},
	viewMoreText: {
		fontSize: 12,
		color: '#888888',
	},
	viewMoreIcon: {
		position: 'relative',
		top: 2,
	},
	classList: {
		marginBottom: 20,
	},
} );

export default class ClassList extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		let rankNumber = 1;

		return <View style={styles.classContainer}>
			<View style={styles.classList}>
				<FlatList
					style={{ width: '100%' }}
					data={this.props.itemData}
					renderItem={
						( { item } ) => <ClassListItem id={item.id} itemData={item} rankNumber={rankNumber++} classType={this.props.classType}/>
					}/>
			</View>

			<TouchableOpacity activeOpacity={0.9} style={styles.viewMoreContainer}>
				<View style={[ styles.viewMore, CommonStyles.alignJustifyContentBetween ]}>
					<Text style={styles.viewMoreText}>
						더보기
					</Text>
					<Image source={IcAngleDownGrey} style={styles.viewMoreIcon}/>
				</View>
			</TouchableOpacity>
		</View>
	}
}