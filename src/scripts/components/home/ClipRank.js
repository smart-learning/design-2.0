import React from "react";
import { View, StyleSheet, FlatList, } from "react-native";
// import _ from 'underscore';
import ClipRankItem from "./ClipRankItem";

const styles = StyleSheet.create( {
	rankGrid: {
		marginTop: 20,
		marginBottom: 40,
	},
	rankGridItem: {},
} );

export default class ClipRank extends React.Component {

	render() {

		// let list = [];
		// if( _.isArray( this.props.itemData.items ) ) {
		// 	list = this.props.itemData.items;
		// }
		// else if( _.isArray( this.props.itemData ) ) {
		// 	list = this.props.itemData;
		// }

		let clipRankNumber = 1;

		return <View style={styles.rankGrid}>
			<FlatList
				style={{ width: '100%' }}
				data={this.props.itemData.items}
				renderItem={
					( { item } ) => <ClipRankItem id={item.id} itemData={item} rankNumber={clipRankNumber++}
												  clipRankContentSize={this.props.clipRankContentSize}/>
				}/>
		</View>
	}
}