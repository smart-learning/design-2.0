import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CommonStyles from "../../../styles/common";
import { SafeAreaView } from "react-navigation";
import net from "../../commons/net"
import moment from "moment";
import globalStore from '../../commons/store'


const styles = StyleSheet.create({
	listItem: {
		justifyContent: 'center',
		position: 'relative',
		backgroundColor: '#ffffff',
		height: 60,
	},
	listItemTitle: {
		paddingLeft: 15,
		fontSize: 16,
		color: '#4a4a4a'
	},
	listItemSub: {
		flexDirection: 'row',
	},
	listItemTime: {
		paddingLeft: 15,
		fontSize: 12,
		color: '#999999'
	},
	AnswerText: {
		position: 'relative',
		top: 1,
		paddingLeft: 15,
		fontSize: 12,
		color: CommonStyles.COLOR_PRIMARY,
	},
	listItemHr: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		height: 1,
		backgroundColor: '#efefef'
	},
	inquireButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 40,
		marginTop: 20,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	inquireButtonText: {
		fontSize: 15,
		color: '#ffffff',
	},
	NoticeText: {
		marginTop: 20,
		paddingLeft: 15,
		paddingRight: 15,
		fontSize: 15,
		textAlign: 'center',
	},
	NoticeTextBoldText: {
		marginTop: 20,
		paddingLeft: 15,
		paddingRight: 15,
		fontSize: 15,
		textAlign: 'center',
		fontWeight: 'bold',
	},
});

export default class InquireListPage extends React.Component {

	state = {
		isLoading: true,
		inquiryData: [],
	}

	async componentDidMount() {
		if (!globalStore.welaaaAuth) this.props.navigation.navigate('Login');
		await this.fetchInquiries()
	}

	async fetchInquiries() {
		this.setState({
			inquiryData: await net.getInquiryData()
		})
	}

	render() {
		return <View style={CommonStyles.container}>
			<SafeAreaView style={{ flex: 1, width: '100%' }}>
				<ScrollView style={{ flex: 1 }}>
					<FlatList
						style={{ width: '100%' }}
						data={this.state.inquiryData}
						renderItem={
							({ item }) => <View key={item.id}>
								<TouchableOpacity
									onPress={() => this.props.navigation.navigate('InquireViewPage', { id: item.id, 'title': '1:1 문의 상세' })}
									navigation={this.props.navigation}
								>
									<View style={styles.listItem}>
										<Text style={styles.listItemTitle}>{item.title}</Text>
										<View style={styles.listItemSub}>
											<Text
												style={styles.listItemTime}>{moment(item.created_at).format('YYYY-MM-DD')}</Text>
											{
												!!item.has_reply ? (

													<Text style={styles.AnswerText}>답변완료</Text>
												) : undefined
											}
										</View>
										<View style={styles.listItemHr} />
									</View>
								</TouchableOpacity>
							</View>
						}
						keyExtractor={(item, index) => item.id}
					/>
					<View style={CommonStyles.contentContainer}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InquireFormPage',
							{ title: '1:1 문의 등록하기', fetchInquiries: () => this.fetchInquiries() })}>
							<View style={styles.inquireButton} borderRadius={5}>
								<Text style={styles.inquireButtonText}>문의하기</Text>
							</View>

						</TouchableOpacity>
					</View>

					{/* <View>
						<Text style={styles.NoticeText}>[추석 연휴 운영 안내] 추석 연휴 기간인
							<Text style={styles.NoticeTextBoldText}>9월 22일(토)부터 9월 26일(목)까지</Text>
							고객센터도 휴무입니다.
						</Text>
					</View>
					<View>
						<Text style={styles.NoticeText}>연휴 동안 남겨주신 문의 내용은
							<Text style={styles.NoticeTextBoldText}>09월 27일(목)</Text>
							부터 신속히 처리될 예정입니다.
						</Text>
					</View>
					<View>
						<Text style={styles.NoticeText}>빠르게 도와드리지 못하는 점 양해 부탁드립니다.</Text>
					</View>
					<View>
						<Text style={styles.NoticeText}>풍성한 한가위 되세요-</Text>
					</View>
					<View>
						<Text style={styles.NoticeText}>고맙습니다.</Text>
					</View>
					<View>
						<Text style={styles.NoticeText}>윌라 운영팀 드림</Text>
					</View> */}
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}