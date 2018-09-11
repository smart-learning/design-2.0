import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList, } from "react-native";
import CommonStyles from "../../../styles/common";
import IcAngleDownGrey from "../../../images/ic-angle-down-grey.png";
import ClassListItem from "./ClassListItem";
import { observer } from 'mobx-react';
import createStore from "../../commons/createStore";
import _ from 'underscore';

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

@observer class ClassList extends React.Component {
	store = createStore( {
		isOpen: false,
	} );
	render() {
		let list = _.toArray( this.props.itemData );

		if( !this.store.isOpen ) {
			list = list.slice( 0, 3 );
		}
		return (
			<View style={styles.classContainer}>
				<View style={styles.classList}>
					<FlatList
						style={{width: '100%'}}
						data={list}
						renderItem={
							({item}) => <ClassListItem id={item.id} itemData={item} classType={this.props.classType}/>
						}/>
				</View>

				{!this.store.isOpen &&
				<TouchableOpacity activeOpacity={0.9} style={styles.viewMoreContainer}
								  onPress={() => this.store.isOpen = true}>
					<View style={[styles.viewMore, CommonStyles.alignJustifyContentBetween]}>
						<Text style={styles.viewMoreText}>
							더보기
						</Text>
						<Image source={IcAngleDownGrey} style={styles.viewMoreIcon}/>
					</View>
				</TouchableOpacity>
				}
			</View>
		)
	}
}

export default ClassList;