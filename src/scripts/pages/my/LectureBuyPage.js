import React from "react";
import {AsyncStorage, Button, ScrollView, StyleSheet, Text, View} from "react-native";
import Store from '../../../scripts/commons/store';
import CommonStyles from "../../../styles/common";
import {SafeAreaView} from "react-navigation";
import SummaryListItem from "../../components/my/SummaryListItem";

const styles = StyleSheet.create({
	//
});

export default class LectureBuyPage extends React.Component {

	render() {
		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<SummaryListItem title={"TITLE"}
									 author={"AUTHOR"}
									 likeCount={"0"}
									 reviewCount={"0"}
									 isLike={true}/>

					<SummaryListItem title={"TITLE"}
									 author={"AUTHOR"}
									 likeCount={"0"}
									 reviewCount={"0"}
									 isLike={false}/>
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}