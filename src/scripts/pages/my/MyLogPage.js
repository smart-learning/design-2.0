import React from "react";
import {AsyncStorage, Button, ScrollView, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';
import {SafeAreaView} from "react-navigation";
import {observable} from 'mobx';
import {observer} from "mobx-react";

const styles = StyleSheet.create({
	tabContainer: {
		position: 'absolute',
		alignSelf: 'flex-start',
		top: 0,
		left: 0,
		width: '100%',
		height: 40,
		backgroundColor: '#ffffff'
	},
	tabFlex: {
		flexDirection: 'row',
	},
	tabItemContainer: {
		width: '50%',
	},
	tabItem: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		height: 40,
	},
	tabText: {
		fontSize: 14,
		color: '#a4a4a4',
	},
	tabTextActive: {
		fontSize: 14,
		color: '#000000',
	},
	tabHr: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		width: '100%',
		height: 3,
		backgroundColor: '#ffffff',
	},
	tabHrActive: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		width: '100%',
		height: 3,
		backgroundColor: '#26c281',
	},
	tabContentContainer: {
		paddingTop: 40,
	}
});

@observer
export default class MyLogPage extends React.Component {

	@observable tabStatus = 'me';

	render() {
		return <View style={CommonStyles.container}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<View style={styles.tabContentContainer}>
						{this.tabStatus === 'me' &&
						<View style={styles.tabContent}>
							<Text>나의 활동 컨텐츠</Text>
						</View>
						}

						{this.tabStatus === 'friend' &&
						<View style={styles.tabContent}>
							<Text>친구의 활동 컨텐츠</Text>
						</View>
						}
					</View>
				</ScrollView>
				<View style={styles.tabContainer}>
					<View style={styles.tabFlex}>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.tabStatus = 'me'}>
								<View style={styles.tabItem}>
									<Text style={this.tabStatus === 'me' ? styles.tabTextActive : styles.tabText}>
										나의활동
									</Text>
									<View style={this.tabStatus === 'me' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.tabStatus = 'friend'}>
								<View style={styles.tabItem}>
									<Text style={this.tabStatus === 'friend' ? styles.tabTextActive : styles.tabText}>
										친구의활동
									</Text>
									<View style={this.tabStatus === 'friend' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</SafeAreaView>
		</View>
	}
}