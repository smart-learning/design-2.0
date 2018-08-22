import React from "react";
import {Text, View, Button, FlatList, ScrollView, TouchableOpacity, StyleSheet,} from "react-native";
import { SafeAreaView } from "react-navigation";
import CommonStyles from "../../../styles/common";

const styles = StyleSheet.create( {
	//
} );

export default class MembershipDetailPage extends React.Component {

	constructor( props ) {
		super( props );
	}

	render() {
		return <SafeAreaView style={[ CommonStyles.container, { backgroundColor: '#ffffff' } ]}>
			<ScrollView style={{ width: '100%' }}>
				<View><Text>Membership Detail Page</Text></View>
			</ScrollView>
		</SafeAreaView>
	}
}

