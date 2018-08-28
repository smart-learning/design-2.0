import React from "react";
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import DummyIcon from "../../../images/dummy-review.png";
import createStore from "../../commons/createStore";
import {withNavigation} from "react-navigation";

const styles = StyleSheet.create({
	listItem: {
		width: '31%',
		marginBottom: 15,
	},
	thumbnail: {
		position: 'relative',
		width: '100%',
		paddingTop: '80%',
		paddingBottom: '80%',
	},
	thumbnailDim: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		height: 80,
		padding: 7,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
	},
	thumbnailTitle: {
		fontSize: 12,
		color: '#ffffff',
	},
	bullet: {
		position: 'absolute',
		bottom: 70,
		left: '35%',
		width: 40,
		height: 40,
	}
});

export default withNavigation(class BookFreeList extends React.Component {

	store = createStore({
		isOpen: false,
	});

	render() {
		return <View style={styles.listItem}>
			{this.props.itemData !== undefined &&
			<TouchableOpacity activeOpacity={0.9} onPress={ () => this.props.navigation.navigate('AudioBookDetailPage', {id: this.props.itemData.id, title: ' '})}>
				<ImageBackground source={{uri: this.props.itemData.images.list}} resizeMode={"cover"}
								 style={styles.thumbnail}>
					<View style={styles.thumbnailDim}>
						<Text style={styles.thumbnailTitle}>{this.props.itemData.title}</Text>
					</View>
					<Image source={DummyIcon} style={styles.bullet}/>
				</ImageBackground>
			</TouchableOpacity>
			}
		</View>
	}
})