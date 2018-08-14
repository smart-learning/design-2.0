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
	headline: {
		fontSize: 16,
		fontWeight: 'bold',
		color: COLOR_PRIMARY,
	},
	subTitle: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#999999',
		marginBottom: 20,
	},
} );

export default class Lecture extends React.Component {
	constructor( props ) {
		super( props );

		this.changePage = this.changePage.bind( this );
	}

	changePage() {
		this.props.navigation.navigate( 'LectureDetailPage', { id: this.props.id } );
	}

	render() {
		console.log( 'this.changePage', this.changePage );
		return <View style={styles.itemContainer}>
			{/*타이틀*/}
			<TouchableOpacity activeOpacity={0.9} onPress={this.changePage}>
				<Text style={styles.headline}>
					{this.props.headline}
				</Text>
				{/*서브타이틀*/}
				<Text style={styles.subTitle}>
					{this.props.teacherHeadline}
					{this.props.teacherName}
				</Text>
			</TouchableOpacity>
			{/*썸네일*/}
			<Summary type="lecture"
					 title={this.props.title}
					 thumbnail={this.props.thumbnail}
					 clipCount={this.props.clipCount}
					 hitCount={this.props.hitCount}
					 starAvg={this.props.starAvg}
					 url={this.props.url}
					 reviewCount={this.props.reviewCount}
					 onPress={this.changePage}
			/>
		</View>
	}
}