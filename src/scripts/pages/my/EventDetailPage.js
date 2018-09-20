import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import CommonStyles from "../../../styles/common";
import net from '../../commons/net'
import {SafeAreaView} from "react-navigation";
import moment from "moment";

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
		marginTop: 30,
		padding: 20,
		borderWidth: 1,
		borderColor: '#E5E4E6',
		backgroundColor: '#F6F6F6',
	},
	answerText: {
		fontSize: 14,
		color: '#777777',
	},
	dateText: {
		fontSize: 12,
		color: '#999999'
	}

});

export default class EventDetailPage extends React.Component {

	state = {
		detail: {
			title: '',
			content: '',
		}
	}

	async componentDidMount() {
	}

	render() {
		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<View>
						<Text>이벤트 상세 페이지</Text>
					</View>
					<View>
						<Text>{JSON.stringify(this.props.navigation)}</Text>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}