import React from "react";
import {
	Text,
	View,
	StyleSheet,
	Button,
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
	render() {
		return <View style={styles.itemContainer}>
			<View>
				<Button
					onPress={() => this.props.navigation.navigate( 'LectureDetailPage' )}
					title="강좌 강의클립 목록"
				/>
			</View>
			{/*타이틀*/}
			<Text style={styles.headline}>
				{this.props.headline}
			</Text>
			{/*서브타이틀*/}
			<Text style={styles.subTitle}>
				{this.props.teacherHeadline}
				{this.props.teacherName}
			</Text>
			{/*썸네일*/}
			<Summary type="lecture"
					 title={this.props.title}
					 thumbnail={this.props.thumbnail}
					 clipCount={this.props.clipCount}
					 hitCount={this.props.hitCount}
					 starAvg={this.props.starAvg}
					 reviewCount={this.props.reviewCount}/>
		</View>
	}
}