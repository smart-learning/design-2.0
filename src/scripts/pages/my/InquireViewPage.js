import React from "react";
import {AsyncStorage, Button, ScrollView, StyleSheet, Text, View} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';
import {SafeAreaView} from "react-navigation";

const styles = StyleSheet.create({
	title: {
		backgroundColor: '#F6F6F6',
		padding: 15,
	},
	titleText: {
		fontSize: 15,
		color: '#4a4a4a',
	},
	content: {
		padding: 15,
	},
	contentText: {
		fontSize: 14,
		color: '#4a4a4a',
	},
	answerBox: {
		marginTop: 50,
		padding: 20,
		borderWidth: 1,
		borderColor: '#E5E4E6',
		backgroundColor: '#F6F6F6',
	},
	answerText: {
		fontSize: 14,
		color: '#777777',
	}
});

export default class InquireViewPage extends React.Component {

	render() {
		return <View style={[ CommonStyles.container, { backgroundColor: '#ffffff' } ]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					{/*<Text>{this.props.navigation.state.params.id}</Text>*/}
					<View style={styles.title}>
						<Text style={styles.titleText}>title</Text>
					</View>
					<View style={styles.content}>
						<Text style={styles.contentText}>content</Text>
						<View style={styles.answerBox}>
							<Text style={styles.answerText}>답변</Text>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}