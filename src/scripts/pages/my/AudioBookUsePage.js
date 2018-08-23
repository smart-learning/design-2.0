import React from "react";
import { Button, ScrollView, StyleSheet, Text, View} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';
import {SafeAreaView} from "react-navigation";
import SummaryListItem from "../../components/my/SummaryListItem";

const styles = StyleSheet.create({
	//
});

export default class AudioBookUsePage extends React.Component {

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