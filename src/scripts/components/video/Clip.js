import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { COLOR_PRIMARY } from "../../../styles/common";
import Summary from "./Summary";

const styles = StyleSheet.create( {
	itemContainer: {
		width: '100%',
		paddingTop: 20,
		paddingRight: 20,
		paddingBottom: 20,
		paddingLeft: 20,
		position: 'relative',
		backgroundColor: '#ffffff',
		marginBottom: 10,
	},
	title: {
		fontSize: 18,
		color: '#4A4A4A',
	},
	subTitle: {
		fontSize: 14,
		color: COLOR_PRIMARY,
	},
	authorInfo: {
		fontSize: 14,
		color: '#999999'
	},
	paragraph: {
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		fontSize: 16,
		color: '#999999',
	},
} );

export default class Lecture extends React.Component {
	constructor( props ) {
		super( props );

		this.changePage = this.changePage.bind( this );
	}

	changePage() {
		this.props.navigation.navigate( 'ClassDetailPage', { id: this.props.id, title:' ' } );
	}

	render() {
		return <View style={styles.itemContainer}>
			{/*타이틀*/}
			<TouchableOpacity activeOpacity={0.9} onPress={this.changePage}>
				{/*서브타이틀*/}
				<Text style={styles.subTitle}>
					{this.props.subTitle}
				</Text>
				{/*타이틀*/}
				<Text style={styles.title}>
					{this.props.title}
				</Text>
				{/*작성자*/}
				<Text style={styles.authorInfo}>
					{this.props.authorInfo}
				</Text>
				{/*설명*/}
				<Text style={styles.paragraph}>
					{this.props.paragraph}
				</Text>
			</TouchableOpacity>
			{/*썸네일*/}
			<Summary type="clip"
					 { ...this.props.item }
					 navigate={ this.props.navigate }
					 onPress={this.changePage}
			/>
		</View>
	}
}