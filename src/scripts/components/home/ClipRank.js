import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
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
		this.props.itemData.forEach( ( element, n ) => {
			element.rankNumber = n + 1;
		} );

		return <View style={styles.rankGrid}>
			<FlatList
				style={{ width: '100%' }}
				data={this.props.itemData}
				renderItem={
					( { item } ) => <ClipRankItem id={item.id} itemData={item}
												  clipRankContentSize={this.props.clipRankContentSize}/>
				}/>
		</View>
	}
}