import React from "react";
import {AsyncStorage, Button, ScrollView, StyleSheet, Text, View} from "react-native";
import Store from '../../../scripts/commons/store';
import CommonStyles from "../../../styles/common";
import {SafeAreaView} from "react-navigation";

const styles = StyleSheet.create({
	//
});

export default class LectureBuyPage extends React.Component {

	render() {
		return <View style={CommonStyles.container}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<Text>LectureBuyPage 서브페이지</Text>
					<Button
						onPress={() => this.props.navigation.navigate('MyInfoHome')}
						title="뒤로"
					/>
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}