import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { observer } from "mobx-react";

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

@observer class PageCategory extends React.Component {
	select = item => {
		if( this.props.onCategorySelect ) {
			this.props.onCategorySelect( item );
		}
	};

	render() {
		return <FlatList
			style={styles.categoryContainer}
			data={this.props.data}
			horizontal={true}
			showsHorizontalScrollIndicator={false}
			extraData={this.props.selectedCategory}
			renderItem={
				( { item } ) => {
					const localStyle = {
						color: this.props.selectedCategory === item.id ? '#444444' : '#A1A1A1'
					};
					return <View style={styles.categoryItem}>
						<TouchableOpacity activeOpacity={0.9}
										  onPress={ () => this.select( item ) }>
							<Text style={[styles.categoryText, localStyle]}>{item.label}</Text>
						</TouchableOpacity>
					</View>
				}
			}
		/>
	}
}

export default PageCategory;