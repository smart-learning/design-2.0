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

export default class InquireViewPage extends React.Component {

	state = {
		detail: {
			title: '',
			content: '',
		}
	}

	async componentDidMount() {
		this.setState({detail: await net.getInquiryDetail(this.props.navigation.state.params.id)})
	}

	render() {
		console.log(this.state.detail)

		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<View style={styles.title}>
						<Text style={styles.titleText}>{this.state.detail.title}</Text>
						<Text style={styles.dateText}>{moment(this.state.detail.create_at).format('YYYY-MM-DD')}</Text>
					</View>
					<View style={styles.content}>
						<Text style={styles.contentText}>{this.state.detail.content}</Text>
						<View style={styles.answerBox}>
							{
								(this.state.detail.has_reply) ? (

									<Text style={styles.answerText}>{this.state.detail.reply}</Text>
								) : (
									<Text style={styles.answerText}>아직 답변이 등록되지 않았습니다.</Text>

								)
							}
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}