import React from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import CommonStyles from "../../../styles/common";
import { observer } from "mobx-react";
import createStore from "../../commons/createStore";
import net from "../../commons/net";

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

@observer class AudioBookTicketPage extends React.Component {
	state = {
		list: [],
		isLoading: true,
	}
	async componentDidMount() {
		this.setState({
			isLoading: true
		})
		this.setState({
			list: await net.getMembershipVouchers(),
		})
		this.setState({
			isLoading: false
		})
	}

	render() {
		const { isLoading, list } = this.state

		return <View style={CommonStyles.container}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<View style={CommonStyles.contentContainer}>
						{isLoading &&
						<View style={{ marginTop: 12 }}>
							<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
						</View>}

						{ ( !isLoading && ( !list || list.length === 0 ) ) &&
						<View style={styles.ticketBox} borderRadius={10}>
							<Text style={styles.ticketBoxText}>보유하고 있는 오디오북 이용권이 없습니다.</Text>
						</View>
						}
						{ ( !isLoading && ( list && list.length > 0 ) ) &&
							<View>
								<Text style={styles.ticketText}>전체 이용권 0개</Text>
								<Text style={styles.ticketText}>인기 오디오북 이용권 0개 보유중</Text>
								<Text>이용권 목록</Text>
							</View>
						}
					</View>

					{list
						? list.map(item => (
							<View>
								<Text>
									{JSON.stringify(item, null, 2)}
								</Text>
							</View>
						))
						: <View />}

				</ScrollView>
			</SafeAreaView>
		</View>
	}
}

export default AudioBookTicketPage;