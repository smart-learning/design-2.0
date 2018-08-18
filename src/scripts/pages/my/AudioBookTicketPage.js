import React from "react";
import {AsyncStorage, Button, StyleSheet, Text, View, ScrollView} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';

const styles = StyleSheet.create({
	ticketText: {
		fontSize: 14,
		color: '#4a4a4a',
	},
	ticketBox: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 60,
		marginTop: 25,
		borderWidth: 1,
		borderColor: '#e3e3e3',
		backgroundColor: 'rgba(103, 58, 183, 0.05)',
	},
	ticketBoxText: {
		color: '#5F45B4',
	},
});

export default class AudioBookTicketPage extends React.Component {


	render() {
		return <View style={CommonStyles.container}>
			<ScrollView style={{width: '100%'}}>
				<View style={{height: 50}}><Text>!!!header area!!!</Text></View>
				<View style={CommonStyles.contentContainer}>
					<Text style={styles.ticketText}>전체 이용권 0개</Text>
					<Text style={styles.ticketText}>인기 오디오북 이용권 0개 보유중</Text>

					{/*이용권이 없을때*/}
					<View style={styles.ticketBox} borderRadius={10}>
						<Text style={styles.ticketBoxText}>보유하고 있는 오디오북 이용권이 없습니다.</Text>
					</View>

					{/*이용권이 있을때*/}
					<View><Text>이용권 목록</Text></View>
				</View>
				<Text>AudioBookTicketPage 서브페이지</Text>
				<Button
					onPress={() => this.props.navigation.navigate('MyInfoHome')}
					title="뒤로"
				/>
			</ScrollView>
		</View>
	}
}