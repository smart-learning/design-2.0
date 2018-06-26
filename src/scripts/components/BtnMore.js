import React from "react";
import {
	View, Text, TouchableOpacity, Image, StyleSheet,
} from "react-native";
import IcAngleDown from "../../images/icons/angle-down.png"

const styles = StyleSheet.create( {
	btnContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 60,
		marginLeft: 'auto',
		marginRight: 20,
		padding: 4,
	},
	textColor: {
		fontSize: 12,
		color: '#ffffff',
	},
	imageSize: {
		position: 'relative',
		top: -2,
		width: 20,
		height: 20,
	},
} );

export default class BtnMore extends React.Component {
	constructor( props ) {
		super( props );

		//
	}

	render() {
		return <View>
			<TouchableOpacity activeOpacity={0.9} style={styles.btnContainer} onPress={this.props.onPress}>
				<Text style={styles.textColor}>More</Text>
				<Image source={ IcAngleDown } style={styles.imageSize}></Image>
			</TouchableOpacity>
		</View>
	}
}