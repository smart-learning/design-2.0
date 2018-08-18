import React from "react";
import {AsyncStorage, Button, ScrollView, Text, View} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';

export default class SetAppPage extends React.Component {


	render() {
		return <View style={CommonStyles.container}>
			<ScrollView style={{width: '100%'}}>
				<View style={{height: 50}}><Text>!!!header area!!!</Text></View>
				<Text>SetAppPage 서브페이지</Text>
				<Button
					onPress={() => this.props.navigation.navigate('MyInfoHome')}
					title="뒤로"
				/>
			</ScrollView>
		</View>
	}
}