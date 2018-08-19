import React from "react";
import {AsyncStorage, Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';
import {SafeAreaView} from "react-navigation";

const noticeData = [
	{
		key: '1',
		title: 'title',
		createdAt: '0000-00-00',
		content: 'content',
	},
	{
		key: '2',
		title: 'title',
		createdAt: '0000-00-00',
		content: 'content',
	},
	{
		key: '3',
		title: 'title',
		createdAt: '0000-00-00',
		content: 'content',
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
	listItemTime: {
		paddingLeft: 15,
		fontSize: 12,
		color: '#999999'
	},
	listItemHr: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		height: 1,
		backgroundColor: '#efefef'
	}
});

export default class GuideListPage extends React.Component {

	render() {
		return <View style={CommonStyles.container}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<FlatList
						style={{width: '100%'}}
						data={noticeData}
						renderItem={
							({item}) => <View>
								<TouchableOpacity
									onPress={() => this.props.navigation.navigate('GuideViewPage', {id: item.key})}
									navigation={this.props.navigation}
									itemData={item}>
									<View style={styles.listItem}>
										<Text style={styles.listItemTitle}>{item.title}</Text>
										<Text style={styles.listItemTime}>{item.createdAt}</Text>
										<View style={styles.listItemHr}/>
									</View>
								</TouchableOpacity>
							</View>
						}
					/>
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}