import React from "react";
import {Text, View, Button, FlatList, ScrollView, TouchableOpacity, StyleSheet,} from "react-native";
import { SafeAreaView } from "react-navigation";
import CommonStyles from "../../../styles/common";

const styles = StyleSheet.create( {
	//
} );

export default class MembershipPage extends React.Component {

	constructor( props ) {
		super( props );
	}

	render() {
		return <SafeAreaView style={[ CommonStyles.container, { backgroundColor: '#ffffff' } ]}>
			<ScrollView style={{ width: '100%' }}>
				<View><Text>Membership Page</Text></View>
				<Button title={"멤버십정책상세보기"} onPress={() => this.props.navigation.navigate('MembershipDetailPage', { title:'윌라 멤버십'} )}/>
			</ScrollView>
		</SafeAreaView>
	}
}

