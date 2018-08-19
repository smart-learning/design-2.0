import React from "react";
import {AsyncStorage, Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';
import {SafeAreaView} from "react-navigation";

const inquireData = [
	{
		key: '1',
		title: 'title',
		createdAt: '0000-00-00',
		content: 'content',
		isAnswer: false,
	},
	{
		key: '2',
		title: 'title',
		createdAt: '0000-00-00',
		content: 'content',
		isAnswer: true,
	},
	{
		key: '3',
		title: 'title',
		createdAt: '0000-00-00',
		content: 'content',
		isAnswer: true,
	},
];

const styles = StyleSheet.create({
	listItem: {
		justifyContent: 'center',
		position: 'relative',
		backgroundColor: '#ffffff',
		height: 60,
	},
	listItemTitle: {
		paddingLeft: 15,
		fontSize: 16,
		color: '#4a4a4a'
	},
	listItemSub: {
		flexDirection: 'row',
	},
	listItemTime: {
		paddingLeft: 15,
		fontSize: 12,
		color: '#999999'
	},
	AnswerText: {
		position: 'relative',
		top: 1,
		paddingLeft: 15,
		fontSize: 12,
		color: CommonStyles.COLOR_PRIMARY,
	},
	listItemHr: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		height: 1,
		backgroundColor: '#efefef'
	},
	inquireButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 40,
		marginTop: 20,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	inquireButtonText: {
		fontSize: 15,
		color: '#ffffff',
	},
});

export default class InquireListPage extends React.Component {

	render() {
		return <View style={CommonStyles.container}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<FlatList
						style={{width: '100%'}}
						data={inquireData}
						renderItem={
							({item}) => <View>
								<TouchableOpacity
									onPress={() => this.props.navigation.navigate('InquireViewPage', {id: item.key})}
									navigation={this.props.navigation}
									itemData={item}>
									<View style={styles.listItem}>
										<Text style={styles.listItemTitle}>{item.title}</Text>
										<View style={styles.listItemSub}>
											<Text style={styles.listItemTime}>{item.createdAt}</Text>
											{item.isAnswer === true &&
											<Text style={styles.AnswerText}>답변완료</Text>
											}
										</View>
										<View style={styles.listItemHr}/>
									</View>
								</TouchableOpacity>
							</View>
						}
					/>
					<View style={CommonStyles.contentContainer}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InquireFormPage')}>
							<View style={styles.inquireButton} borderRadius={5}>
								<Text style={styles.inquireButtonText}>문의하기</Text>
							</View>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}