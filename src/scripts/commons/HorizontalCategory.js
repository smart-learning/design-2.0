import React from "react";
import {
	FlatList,
	Text,
	StyleSheet,
} from "react-native";

const styles = StyleSheet.create( {
	categoryContainer: {
		width: '100%',
		height: 40,
	}
} );

export default class HorizontalCategory extends React.Component {
	render() {
		return <FlatList
			style={ styles.categoryContainer }
			data={[
				{key: 'Devin'},
				{key: 'Jackson'},
				{key: 'James'},
				{key: 'Joel'},
				{key: 'John'},
				{key: 'Jillian'},
				{key: 'Jimmy'},
				{key: 'Julie'},
			]}
			horizontal={true}
			renderItem={
				({item}) => <Text>{item.key}</Text>
			}
		/>
	}
}