import React, { Component } from 'react';
import {StyleSheet, Text, View,SafeAreaView, ScrollView} from "react-native";
import CommonStyles from "../../../styles/common";

const styles = StyleSheet.create({
	pageTitle: {
		paddingTop: 40,
		paddingBottom: 10,
		fontSize: 28,
		fontWeight: 'bold',
		color: '#000000',
	},
	sectionTitle: {
		paddingTop: 40,
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000000',
	},
	contentTitle: {
		paddingTop: 20,
		paddingBottom: 10,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333333',
	},
	sectionList: {
		paddingBottom: 10,
	},
	sectionListItemText: {
		fontSize: 14,
		color: '#333333',
	},
} );

class PolicyPage extends Component {
    render() {
		return <SafeAreaView style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<ScrollView style={{width: '100%'}}>
				<View style={CommonStyles.contentContainer}>
					<Text style={styles.pageTitle}>개인정보보호정책</Text>
					<Text style={styles.sectionTitle}>0.</Text>
					<Text style={styles.contentTitle}>제0조</Text>
					<View style={styles.sectionList}>
						<Text style={styles.sectionListItem}>text</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
    }
}

    
export default PolicyPage;
