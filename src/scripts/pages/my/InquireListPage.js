import React from "react";
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CommonStyles from "../../../styles/common";
import {SafeAreaView} from "react-navigation";
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
});

export default class InquireListPage extends React.Component {

	state = {
		isLoading: true,
		inquiryData: [],
	}

	async componentDidMount() {
		if( !globalStore.welaaaAuth ) this.props.navigation.navigate( 'Login' );
		await this.fetchInquiries()
	}

	async fetchInquiries() {
		this.setState({
			inquiryData: await net.getInquiryData()
		})
	}

	render() {
		return <View style={CommonStyles.container}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<FlatList
						style={{width: '100%'}}
						data={this.state.inquiryData}
						renderItem={
							({item}) => <View key={item.id}>
								<TouchableOpacity
									onPress={() => this.props.navigation.navigate('InquireViewPage', {id: item.id, 'title': '1:1 문의 상세'})}
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
										<View style={styles.listItemHr}/>
									</View>
								</TouchableOpacity>
							</View>
						}
						keyExtractor={(item, index) => item.id}
					/>
					<View style={CommonStyles.contentContainer}>
						<TouchableOpacity onPress={() => this.props.navigation.navigate('InquireFormPage',
							{title: '1:1 문의 등록하기', fetchInquiries: () => this.fetchInquiries()})}>
							<View style={styles.inquireButton} borderRadius={5}>
								<Text style={styles.inquireButtonText}>문의하기</Text>
							</View>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}