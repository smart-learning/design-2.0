import React from "react";
import { Button, ScrollView, StyleSheet, Text, View} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';
import {SafeAreaView} from "react-navigation";

const styles = StyleSheet.create({
	//
});

export default class AudioBookBuyPage extends React.Component {

	render() {
		return <View style={CommonStyles.container}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<Text>AudioBookBuyPage 서브페이지</Text>
					<Button
						onPress={() => this.props.navigation.navigate('MyInfoHome')}
						title="뒤로"
					/>
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}