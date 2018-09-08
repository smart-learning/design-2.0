import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, ImageBackground,} from "react-native";
import {withNavigation} from "react-navigation";

const styles = StyleSheet.create({
	seriesItemSm: {
		width: '48%',
		marginBottom: 13,
		backgroundColor: '#efefef',
	},
	seriesItemLg: {
		width: '100%',
		marginBottom: 13,
		backgroundColor: '#dddddd',
	},
	thumbnail: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		width: '100%',
		paddingTop: '29.8245614035%',
		paddingBottom: '29.8245614035%',
		backgroundColor: '#efefef',
	},
	title: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 24,
		color: '#ffffff',
	},
});

export default withNavigation( class Series extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <View>
			{this.props.itemData.map((item, key) => {
				return (
					<View style={styles.seriesItemLg} key={key}>
						<TouchableOpacity activeOpacity={0.9} onPress={ () => this.props.navigation.navigate('HomeSeriesPage', {id: '', title: ''})}>
							<ImageBackground
								source={{uri: item.image}}
								resizeMode="cover"
								borderRadius={5}
								style={styles.thumbnail}>
								<Text style={styles.title}>
									{item.title}
								</Text>
							</ImageBackground>
						</TouchableOpacity>
					</View>
				)
			})}

		</View>
	}
} )