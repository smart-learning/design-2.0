import React from "react";
import {
	FlatList,
	View,
	Text,
	Button,
	StyleSheet,
} from "react-native";

const styles = StyleSheet.create( {
	categoryContainer: {
		width: '100%',
	},
	categoryItem: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		paddingLeft: 20,
		paddingRight: 20,
	},
	categoryText: {
		color: '#A1A1A1',
		fontSize: 14,
	}
} );

export default class HorizontalCategory extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			//
		};

		this.test = this.test.bind( this );
	}

	test() {
		alert( '!!!' );
	}

	render() {
		return <FlatList
			style={styles.categoryContainer}
			data={[
				{ key: 'Devin' },
				{ key: 'Jackson' },
				{ key: 'James' },
				{ key: 'Joel' },
				{ key: 'John' },
				{ key: 'Jillian' },
				{ key: 'Jimmy' },
				{ key: 'Julie' },
			]}
			horizontal={true}
			showsHorizontalScrollIndicator={false}
			renderItem={
				( { item } ) => <View style={styles.categoryItem}>
					<Button
						onPress={this.test}
						style={styles.categoryText}
						title={item.key}/>
				</View>
			}
		/>
	}
}