import React from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
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
		lineHeight: 22,
		color: '#000000',
	},
	paragraph: {
		paddingTop: 5,
		paddingBottom: 10,
		fontSize: 13,
		lineHeight: 17,
		color: '#696969',
	},
} );

export default class Chapter extends React.Component {
	constructor( props ) {
		super( props );

		this.changePage = this.changePage.bind( this );
	}

	changePage() {
		alert( 'load player' );
	}

	render() {
		console.log( 'this.changePage', this.changePage );
		return <View style={styles.itemContainer}>
			{/*타이틀*/}
			<TouchableOpacity activeOpacity={0.9} onPress={this.changePage}>
				{/*타이틀*/}
				<Text style={styles.title}>
					{this.props.title}
				</Text>
				{/*설명*/}
				<Text style={styles.paragraph}>
					{this.props.paragraph}
				</Text>
			</TouchableOpacity>
			{/*썸네일*/}
			<Summary type="chapter"
					 thumbnail={this.props.thumbnail}
					 hitCount={this.props.hitCount}
					 starAvg={this.props.starAvg}
					 reviewCount={this.props.reviewCount}
					 playTime={this.props.playTime}
					 onPress={this.changePage}
			/>
		</View>
	}
}