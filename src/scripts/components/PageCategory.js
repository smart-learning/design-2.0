import React from "react";
import {
	FlatList,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
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

export default class PageCategory extends React.Component {
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
			data={this.props.data}
			horizontal={true}
			showsHorizontalScrollIndicator={false}
			renderItem={
				( { item } ) => <View style={styles.categoryItem}>
					<TouchableOpacity activeOpacity={0.9}
									  onPress={this.test}
					>
						<Text style={styles.categoryText}>{item.title}</Text>
					</TouchableOpacity>
				</View>
			}
		/>
	}
}