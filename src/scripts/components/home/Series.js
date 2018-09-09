import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, ImageBackground, Alert,} from "react-native";
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
} );

export default class Series extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		return <View>
			<View style={styles.seriesItemLg}>
				<TouchableOpacity activeOpacity={0.9} onPress={() => {Alert.alert('준비중입니다.')}}>
					<ImageBackground
						source={{ uri: this.props.itemData[ 0 ].image }}
						resizeMode="cover"
						borderRadius={5}
						style={styles.thumbnail}>
						<Text style={styles.title}>
							{this.props.itemData[ 0 ].title}
						</Text>
					</ImageBackground>
				</TouchableOpacity>
			</View>
			<View style={styles.seriesItemLg}>
				<TouchableOpacity activeOpacity={0.9} onPress={() => {Alert.alert('준비중입니다.')}}>
					<ImageBackground
						source={{ uri: this.props.itemData[ 1 ].image }}
						resizeMode="cover"
						borderRadius={5}
						style={styles.thumbnail}>
						<Text style={styles.title}>
							{this.props.itemData[ 1 ].title}
						</Text>
					</ImageBackground>
				</TouchableOpacity>
			</View>
			<View style={styles.seriesItemLg}>
				<TouchableOpacity activeOpacity={0.9} onPress={() => {Alert.alert('준비중입니다.')}}>
					<ImageBackground
						source={{ uri: this.props.itemData[ 2 ].image }}
						resizeMode="cover"
						borderRadius={5}
						style={styles.thumbnail}>
						<Text style={styles.title}>
							{this.props.itemData[ 2 ].title}
						</Text>
					</ImageBackground>
				</TouchableOpacity>
			</View>
			<View style={styles.seriesItemLg}>
				<TouchableOpacity activeOpacity={0.9} onPress={() => {Alert.alert('준비중입니다.')}}>
					<ImageBackground
						source={{ uri: this.props.itemData[ 3 ].image }}
						resizeMode="cover"
						borderRadius={5}
						style={styles.thumbnail}>
						<Text style={styles.title}>
							{this.props.itemData[ 3 ].title}
						</Text>
					</ImageBackground>
				</TouchableOpacity>
			</View>
			<View style={styles.seriesItemLg}>
				<TouchableOpacity activeOpacity={0.9} onPress={() => {Alert.alert('준비중입니다.')}}>
					<ImageBackground
						source={{ uri: this.props.itemData[ 4 ].image }}
						resizeMode="cover"
						borderRadius={5}
						style={styles.thumbnail}>
						<Text style={styles.title}>
							{this.props.itemData[ 4 ].title}
						</Text>
					</ImageBackground>
				</TouchableOpacity>
			</View>
			<View style={styles.seriesItemLg} onPress={() => {Alert.alert('준비중입니다.')}}>
				<TouchableOpacity activeOpacity={0.9}>
					<ImageBackground
						source={{ uri: this.props.itemData[ 5 ].image }}
						resizeMode="cover"
						borderRadius={5}
						style={styles.thumbnail}>
						<Text style={styles.title}>
							{this.props.itemData[ 5 ].title}
						</Text>
					</ImageBackground>
				</TouchableOpacity>
			</View>
			<View style={styles.seriesItemLg} onPress={() => {Alert.alert('준비중입니다.')}}>
				<TouchableOpacity activeOpacity={0.9}>
					<ImageBackground
						source={{ uri: this.props.itemData[ 6 ].image }}
						resizeMode="cover"
						borderRadius={5}
						style={styles.thumbnail}>
						<Text style={styles.title}>
							{this.props.itemData[ 6 ].title}
						</Text>
					</ImageBackground>
				</TouchableOpacity>
			</View>
		</View>
	}
}