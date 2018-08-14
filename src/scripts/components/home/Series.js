import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, } from "react-native";
import CommonStyles from "../../../styles/common";

const styles = StyleSheet.create( {
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
		position: 'relative',
		width: '100%',
		paddingTop: '29.41176471%',
		paddingBottom: '29.41176471%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#efefef',
	},
	title: {
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 12,
		color: '#ffffff',
	},
} );

export default class Series extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		console.log( 'props data',this.props.itemData );
		return <View>
			<View style={[ CommonStyles.alignJustifyContentBetween ]}>
				<View style={styles.seriesItemSm} borderRadius={5}>
					<TouchableOpacity activeOpacity={0.9}>
						<ImageBackground
							source={{ uri: this.props.itemData[ 0 ].image }}
							resizeMode="cover"
							style={styles.thumbnail}>
							<Text style={styles.title}>
								{this.props.itemData[ 0 ].title}
							</Text>
						</ImageBackground>
					</TouchableOpacity>
				</View>
				<View style={styles.seriesItemSm} borderRadius={5}>
					<TouchableOpacity activeOpacity={0.9}>
						<ImageBackground
							source={{ uri: this.props.itemData[ 1 ].image }}
							resizeMode="cover"
							style={styles.thumbnail}>
							<Text style={styles.title}>
								{this.props.itemData[ 1 ].title}
							</Text>
						</ImageBackground>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.seriesItemLg} borderRadius={5}>
				<TouchableOpacity activeOpacity={0.9}>
					<ImageBackground
						source={{ uri: this.props.itemData[ 2 ].image }}
						resizeMode="cover"
						style={styles.thumbnail}>
						<Text style={styles.title}>
							{this.props.itemData[ 2 ].title}
						</Text>
					</ImageBackground>
				</TouchableOpacity>
			</View>
			<View style={[ CommonStyles.alignJustifyContentBetween ]}>
				<View style={styles.seriesItemSm} borderRadius={5}>
					<TouchableOpacity activeOpacity={0.9}>
						<ImageBackground
							source={{ uri: this.props.itemData[ 3 ].image }}
							resizeMode="cover"
							style={styles.thumbnail}>
							<Text style={styles.title}>
								{this.props.itemData[ 3 ].title}
							</Text>
						</ImageBackground>
					</TouchableOpacity>
				</View>
				<View style={styles.seriesItemSm} borderRadius={5}>
					<TouchableOpacity activeOpacity={0.9}>
						<ImageBackground
							source={{ uri: this.props.itemData[ 4 ].image }}
							resizeMode="cover"
							style={styles.thumbnail}>
							<Text style={styles.title}>
								{this.props.itemData[ 4 ].title}
							</Text>
						</ImageBackground>
					</TouchableOpacity>
				</View>
			</View>
			<View style={[ CommonStyles.alignJustifyContentBetween ]}>
				<View style={styles.seriesItemSm} borderRadius={5}>
					<TouchableOpacity activeOpacity={0.9}>
						<ImageBackground
							source={{ uri: this.props.itemData[ 5 ].image }}
							resizeMode="cover"
							style={styles.thumbnail}>
							<Text style={styles.title}>
								{this.props.itemData[ 5 ].title}
							</Text>
						</ImageBackground>
					</TouchableOpacity>
				</View>
				<View style={styles.seriesItemSm} borderRadius={5}>
					<TouchableOpacity activeOpacity={0.9}>
						<ImageBackground
							source={{ uri: this.props.itemData[ 6 ].image }}
							resizeMode="cover"
							style={styles.thumbnail}>
							<Text style={styles.title}>
								{this.props.itemData[ 6 ].title}
							</Text>
						</ImageBackground>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	}
}