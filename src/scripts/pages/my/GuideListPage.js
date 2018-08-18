import React from "react";
import {AsyncStorage, Button, ScrollView, StyleSheet, Text, View} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';

const styles = StyleSheet.create({
	//
});

export default class GuideListPage extends React.Component {

	render() {
		return <View style={CommonStyles.container}>
			<ScrollView style={{width: '100%'}}>
				<View style={{height: 50}}><Text>!!!header area!!!</Text></View>
				<Text>GuideListPage 서브페이지</Text>
				<Button
					onPress={() => this.props.navigation.navigate('MyInfoHome')}
					title="뒤로"
				/>
			</ScrollView>
		</View>
	}
}