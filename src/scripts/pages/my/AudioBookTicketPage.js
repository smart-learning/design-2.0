import React from "react";
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-navigation";
import CommonStyles from "../../../styles/common";
import {observer} from "mobx-react";
import net from "../../commons/net";
import moment from "moment";

const styles = StyleSheet.create({
	ticketText: {
		fontSize: 14,
		color: '#4a4a4a',
	},
	ticketBox: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 120,
		marginTop: 25,
		borderWidth: 1,
		borderColor: '#e3e3e3',
		backgroundColor: 'rgba(103, 58, 183, 0.05)',
	},
	ticketBoxText: {
		color: '#5F45B4',
	},
	tableBox: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#000',
	},
	tableRow: {
		flex: 1,
		alignSelf: 'stretch',
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: '#000',
		fontSize: 14,
		color: '#4a4a4a',
	},
	tableCell: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#000',
		fontSize: 14,
		color: '#4a4a4a',
		alignSelf: 'stretch'
	},
	tableText: {
		fontSize: 14,
		color: '#000000',

	},
	ticketItem: {
		width: '100%',
		marginBottom: 15,
		backgroundColor: '#eeeeee'
	},
	ticketItemHr: {
		width: '100%',
		height: 1,
		backgroundColor: '#b4b4b4',
	},
	ticketItemHrBold: {
		width: '100%',
		height: 2,
		backgroundColor: '#b4b4b4',
	},
	ticketTitle: {
		paddingTop: 8,
		paddingBottom: 8,
		backgroundColor: 'rgba(103, 58, 183, 0.05)',
	},
	ticketTitleText: {
		textAlign: 'center',
		fontSize: 16,
		fontWeight: 'bold',
	},
	ticketItemRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 8,
		paddingBottom: 8,
	},
	ticketItemLabel: {
		width: 110,
		fontSize: 16,
		textAlign: 'center',
		fontWeight: 'bold',
		color: '#4a4a4a',
	},
	ticketItemContent: {
		fontSize: 16,
		color: '#4a4a4a',
	},
});

@observer
class AudioBookTicketPage extends React.Component {
	state = {
		list: [],
		status: {},
		isLoading: true,
	}

	async componentDidMount() {
		this.setState({
			isLoading: true
		})
		this.setState({
			list: await net.getMembershipVouchers(),
			status: await net.getVouchersStatus(),
		})
		this.setState({
			isLoading: false
		})
	}

	render() {
		const {isLoading, list} = this.state


		return <View style={CommonStyles.container}>

			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>

					<View style={[CommonStyles.contentContainer, {marginTop: 15, marginBottom: 25}]}>
						{isLoading &&
						<View style={{marginTop: 12}}>
							<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
						</View>}

						{(!isLoading && (!list || list.length === 0)) &&
						<View style={styles.ticketBox} borderRadius={10}>
							<Text style={styles.ticketBoxText}>보유하고 있는 오디오북 이용권이 없습니다.</Text>
						</View>
						}
						{(!isLoading && (list && list.length > 0)) &&
						<View>
							<Text>전체 이용권 {this.state.status.botm} 개</Text>
							<Text>인기 오디오북 이용권 {this.state.status.normal} 개 보유중</Text>
						</View>
						}
					</View>

					<View style={[CommonStyles.contentContainer, {alignItems: 'center'}]}>

						{list
							? list.map(item => (
								<View key={item.id} style={styles.ticketItem}>
									<View style={styles.ticketItemHrBold}/>
									<View style={styles.ticketTitle}>
										<Text style={[styles.ticketBoxText, styles.ticketTitleText]}>
											{item.type === "ALL" ? '전체 오디오북 이용권' : '인기 오디오북 이용권'}
										</Text>
									</View>
									<View style={styles.ticketItemHr}/>

									<View style={styles.ticketItemRow}>
										<Text style={styles.ticketItemLabel}>취득일</Text>
										<Text style={styles.ticketItemContent}>{moment(item.active_at).format('YYYY.MM.DD')}</Text>
									</View>
									<View style={styles.ticketItemHr}/>

									<View style={styles.ticketItemRow}>
										<Text style={styles.ticketItemLabel}>취득 수단</Text>
										<Text style={styles.ticketItemContent}>{moment(item.active_at).format('YYYY.MM.DD')}</Text>
									</View>
									<View style={styles.ticketItemHr}/>

									<View style={styles.ticketItemRow}>
										<Text style={styles.ticketItemLabel}>유효기간</Text>
										<Text style={styles.ticketItemContent}>윌라 회원 탈퇴시 까지</Text>
									</View>
									<View style={styles.ticketItemHr}/>

									<View style={styles.ticketItemRow}>
										<Text style={styles.ticketItemLabel}>구매 권한</Text>
										<Text style={styles.ticketItemContent}>{item.type === "ALL" ? '모든 오디오북' : '인기 오디오북'}</Text>
									</View>
									<View style={styles.ticketItemHrBold}/>

								</View>
							))
							: undefined}
					</View>

				</ScrollView>
			</SafeAreaView>
		</View>
	}
}

export default AudioBookTicketPage;