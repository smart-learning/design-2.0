import React from "react";
import {Text, View, Button, FlatList, ScrollView, TouchableOpacity, StyleSheet,} from "react-native";
import {SafeAreaView} from "react-navigation";
import CommonStyles from "../../../styles/common";
import {observer} from "mobx-react";
import {observable} from "mobx";

const styles = StyleSheet.create({
	pageTitle: {
		paddingTop: 25,
		paddingBottom: 40,
		textAlign: 'center',
		fontSize: 17,
		fontWeight: 'bold',
	},
	tabContainer: {
		width: '33.333333333%',
	},
	tabItem: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 35,
		borderWidth: 1,
		borderColor: '#cccccc',
		backgroundColor: '#ffffff'
	},
	tabItemActive: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 35,
		borderWidth: 1,
		borderColor: CommonStyles.COLOR_PRIMARY,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	tabItemText: {
		fontSize: 14,
		color: '#333333',
	},
	tabItemTextActive: {
		fontSize: 14,
		color: '#ffffff',
	},
	sectionTitle: {
		paddingTop: 20,
		paddingBottom: 10,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333333',
	},
	sectionSubTitle: {
		paddingBottom: 7,
		fontSize: 14,
		color: '#333333',
	},
	sectionList: {
		paddingBottom: 10,
	},
	sectionListItem: {
		position: 'relative',
	},
	sectionListItemBullet: {
		position: 'absolute',
		left: 0,
		top: 8,
		width: 4,
		height: 4,
		backgroundColor: '#333333',
	},
	sectionListItemText: {
		paddingLeft: 15,
		fontSize: 14,
		color: '#333333',
	},
	sectionListItemTextImportant: {
		fontSize: 14,
		color: CommonStyles.COLOR_PRIMARY,
	},
	sectionHr: {
		width: '100%',
		height: 1,
		marginTop: 20,
		backgroundColor: '#eeeeee'
	},
});

@observer
export default class MembershipDetailPage extends React.Component {

	@observable tabStatus = 'premium';

	constructor(props) {
		super(props);
	}

	render() {
		return <SafeAreaView style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<ScrollView style={{width: '100%'}}>
				<Text style={styles.pageTitle}>윌라 멤버십 상세보기</Text>
				<View style={CommonStyles.contentContainer}>
					<View style={CommonStyles.alignJustifyContentBetween} borderRadius={4}>
						<View style={styles.tabContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => {this.tabStatus = 'premium'}}>
								<View style={this.tabStatus === 'premium' ? styles.tabItemActive : styles.tabItem}>
									<Text style={this.tabStatus === 'premium' ? styles.tabItemTextActive : styles.tabItemText}>프리미엄</Text>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.tabContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => {this.tabStatus = 'audioBook'}}>
								<View style={this.tabStatus === 'audioBook' ? styles.tabItemActive : styles.tabItem}>
									<Text style={this.tabStatus === 'audioBook' ? styles.tabItemTextActive : styles.tabItemText}>오디오북클럽</Text>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.tabContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => {this.tabStatus = 'campus'}}>
								<View style={this.tabStatus === 'campus' ? styles.tabItemActive : styles.tabItem}>
									<Text style={this.tabStatus === 'campus' ? styles.tabItemTextActive : styles.tabItemText}>캠퍼스</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>

					{this.tabStatus === 'premium' &&
					<View>
						<View style={styles.sectionHr}/>
						<Text style={styles.sectionTitle}>프리미엄 멤버십 권한</Text>
						<Text style={styles.sectionSubTitle}>(동영상 강좌)</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>모든 프리미엄 동영상 강좌 무제한 이용</Text>
							</View>
						</View>
						<Text style={styles.sectionSubTitle}>(오디오북)</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>리딩멘토 추천 이달의 책 1권, 선택일로부터 60일 동안 무료 이용</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 인기 오디오북 1권, 선택일로부터 60일 동안 무료 이용
								</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>마음에 드는 책이 없으면 위 2개의 이용권 모두 무한 이월 가능</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>
									2권 선택하고 또 듣고 싶으면 30% 할인된 가격으로 추가 구매 가능(일부 도서 제외)
								</Text>
							</View>
						</View>
						<Text style={styles.sectionSubTitle}>(공통)</Text>
						<View style={styles.sectionListItem}>
							<View style={styles.sectionListItemBullet} borderRadius={3}/>
							<Text style={styles.sectionListItemText}>
								윌라 멤버십 회원만을 위한 전용 데일리 콘텐츠 무료 이용
							</Text>
						</View>
						<Text style={styles.sectionTitle}>멤버십 가입과 갱신</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십에 <Text style={styles.sectionListItemTextImportant}>가입 즉시</Text> 멤버십 권한이 시작됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>단, 각종 쿠폰/이벤트 등을 통해 <Text style={styles.sectionListItemTextImportant}>이미 이용 중인 무료 멤버십이 있으면, 해당 멤버십 기간 종료 후</Text> 유료 멤버십이 시작됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십은 ‘월 단위’로 <Text style={styles.sectionListItemTextImportant}>매월 가입일에 권한이 새롭게 갱신</Text>됩니다.</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 회비 결제</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 회비는 <Text style={styles.sectionListItemTextImportant}>매월 가입일에 입력하신 결제 정보</Text>를 통해 자동으로 결제됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>현재는 윌라 런칭기념 <Text style={styles.sectionListItemTextImportant}>첫 달 무료</Text> 이벤트 진행 중으로 첫 달은 무료, <Text style={styles.sectionListItemTextImportant}>첫 결제는 다음달 가입일</Text>부터 시작됩니다.</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 변경</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 변경 신청을 하시면 이미 가입된 멤버십 기간이 종료 된 후에 새로운 멤버십이 적용됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>즉시 멤버십 변경을 원하시는 경우는 기존 멤버십을 해지 하신 후 신규 가입 하셔야 합니다. 중간에 멤버십을 해지하시면 환불은 되지 않으니 신중하게 결정해 주세요. ^^</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 해지</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십은 <Text style={styles.sectionListItemTextImportant}>무약정</Text> 입니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십 해지는 <Text style={styles.sectionListItemTextImportant}>‘멤버십 해지’ 버튼을 통해 원클릭으로 가능</Text>합니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 해지가 윌라 회원 탈퇴를 의미하는 것은 아닙니다. 회원 탈퇴는 <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>를 통해 신청해 주세요.</Text>
							</View>
						</View>
						<Text style={styles.sectionSubTitle}>(동영상 강좌)</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>오늘 해지해도 멤버십 기간이 남아 있으면 <Text style={styles.sectionListItemTextImportant}>해당 월 멤버십 마지막날 자정까지</Text> 동영상 강좌를 이용할 수 있습니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 해지 이후에도 개별 구매한 콘텐츠, 무료 콘텐츠 등을 계속 이용할 수 있습니다.</Text>
							</View>
						</View>
						<Text style={styles.sectionSubTitle}>(오디오북)</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 해지 이후에도 이용 기간이 남아 있는 오디오북은 해당 이용일 마지막 날 자정까지 이용할 수 있습니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>아직 사용하지 않은 오디오북 이용권은 멤버십 해지 후에도 사라지지 않으며, 윌라 회원 탈퇴 전까지 언제든 이용할 수 있습니다.</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>환불</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십 환불은 <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>를 통해 신청해 주시면 됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>결제일로부터 <Text style={styles.sectionListItemTextImportant}>7일 이내</Text>이고, <Text style={styles.sectionListItemTextImportant}>콘텐츠 이용 내역이 전혀 없으면</Text> 즉시 환불 조치 해드립니다.</Text>
							</View>
						</View>
					</View>
					}
					{this.tabStatus === 'audioBook' &&
					<View>
						<View style={styles.sectionHr}/>
						<Text style={styles.sectionTitle}>오디오북클럽 멤버십 권한</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>리딩멘토 추천 이달의 책 1권, 선택일로부터 60일 동안 무료 이용</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 인기 오디오북 1권, 선택일로부터 60일 동안 무료 이용</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>마음에 드는 책이 없으면 위 2개의 이용권 모두 무한 이월 가능</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>2권 선택하고 또 듣고 싶으면 30% 할인된 가격으로 추가 구매 가능(일부 도서 제외)</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십 회원만을 위한 전용 데일리 콘텐츠 무료 이용</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 가입과 갱신</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십에 <Text style={styles.sectionListItemTextImportant}>가입 즉시</Text> 멤버십 권한이 시작됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>단, 각종 쿠폰/이벤트 등을 통해 <Text style={styles.sectionListItemTextImportant}>이미 이용 중인 무료 멤버십이 있으면, 해당 멤버십 기간 종료 후</Text> 유료 멤버십이 시작됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십은 ‘월 단위’로 <Text style={styles.sectionListItemTextImportant}>매월 가입일에 권한이 새롭게 갱신</Text>됩니다.</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 회비 결제</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 회비는 <Text style={styles.sectionListItemTextImportant}>매월 가입일에 입력하신 결제 정보</Text>를 통해 자동으로 결제됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>현재는 윌라 런칭기념 <Text style={styles.sectionListItemTextImportant}>첫 달 무료</Text> 이벤트 진행 중으로 첫 달은 무료, <Text style={styles.sectionListItemTextImportant}>첫 결제는 다음달 가입일</Text>부터 시작됩니다.</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 변경</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 변경 신청을 하시면 이미 가입된 멤버십 기간이 종료 된 후에 새로운 멤버십이 적용됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>즉시 멤버십 변경을 원하시는 경우는 기존 멤버십을 해지 하신 후 신규 가입 하셔야 합니다. 중간에 멤버십을 해지하시면 환불은 되지 않으니 신중하게 결정해 주세요. ^^</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 해지</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십은 <Text style={styles.sectionListItemTextImportant}>무약정</Text> 입니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십 해지는 <Text style={styles.sectionListItemTextImportant}>‘멤버십 해지’ 버튼을 통해 원클릭으로 가능</Text>합니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 해지 이후에도 이용 기간이 남아 있는 오디오북은 해당 이용일 마지막 날 자정까지 이용할 수 있습니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>아직 사용하지 않은 오디오북 이용권은 멤버십 해지 후에도 사라지지 않으며, 윌라 회원 탈퇴 전까지 언제든 이용할 수 있습니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 해지가 윌라 회원 탈퇴를 의미하는 것은 아닙니다. 회원 탈퇴는 <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>를 통해 신청해 주세요.</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>환불</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십 환불은 <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>를 통해 신청해 주시면 됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>결제일로부터 <Text style={styles.sectionListItemTextImportant}>7일 이내</Text>이고, <Text style={styles.sectionListItemTextImportant}>콘텐츠 이용 내역이 전혀 없으면</Text> 즉시 환불 조치 해드립니다.</Text>
							</View>
						</View>
					</View>
					}
					{this.tabStatus === 'campus' &&
					<View>
						<View style={styles.sectionHr}/>
						<Text style={styles.sectionTitle}>캠퍼스 멤버십의 권한</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>모든 프리미엄 동영상 강좌 무제한 이용</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십 회원만을 위한 전용 데일리 콘텐츠 무료 이용</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 가입과 갱신</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십에 <Text style={styles.sectionListItemTextImportant}>가입 즉시</Text> 멤버십 권한이 시작됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>단, 각종 쿠폰/이벤트 등을 통해 <Text style={styles.sectionListItemTextImportant}>이미 이용 중인 무료 멤버십이 있으면, 해당 멤버십 기간 종료 후</Text> 유료 멤버십이 시작됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십은 ‘월 단위’로 <Text style={styles.sectionListItemTextImportant}>매월 가입일에 권한이 새롭게 갱신</Text>됩니다.</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 회비 결제</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 회비는 <Text style={styles.sectionListItemTextImportant}>매월 가입일에 입력하신 결제 정보</Text>를 통해 자동으로 결제됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>현재는 윌라 런칭기념 <Text style={styles.sectionListItemTextImportant}>첫 달 무료</Text> 이벤트 진행 중으로 첫 달은 무료, <Text style={styles.sectionListItemTextImportant}>첫 결제는 다음달 가입일</Text>부터 시작됩니다.</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 변경</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 변경 신청을 하시면 이미 가입된 멤버십 기간이 종료 된 후에 새로운 멤버십이 적용됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>즉시 멤버십 변경을 원하시는 경우는 기존 멤버십을 해지 하신 후 신규 가입 하셔야 합니다. 중간에 멤버십을 해지하시면 환불은 되지 않으니 신중하게 결정해 주세요. ^^</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>멤버십 해지</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십은 <Text style={styles.sectionListItemTextImportant}>무약정</Text> 입니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십 해지는 <Text style={styles.sectionListItemTextImportant}>‘멤버십 해지’ 버튼을 통해 원클릭으로</Text>가능합니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 해지 이후에도 이용 기간이 남아 있는 오디오북은 해당 이용일 마지막 날 자정까지 이용할 수 있습니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>아직 사용하지 않은 오디오북 이용권은 멤버십 해지 후에도 사라지지 않으며, 윌라 회원 탈퇴 전까지 언제든 이용할 수 있습니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>멤버십 해지가 윌라 회원 탈퇴를 의미하는 것은 아닙니다. 회원 탈퇴는 <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>를 통해 신청해 주세요.</Text>
							</View>
						</View>
						<Text style={styles.sectionTitle}>환불</Text>
						<View style={styles.sectionList}>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>윌라 멤버십 환불은 <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>를 통해 신청해 주시면 됩니다.</Text>
							</View>
							<View style={styles.sectionListItem}>
								<View style={styles.sectionListItemBullet} borderRadius={3}/>
								<Text style={styles.sectionListItemText}>결제일로부터 <Text style={styles.sectionListItemTextImportant}>7일 이내</Text>이고, <Text style={styles.sectionListItemTextImportant}>콘텐츠 이용 내역이 전혀 없으면</Text> 즉시 환불 조치 해드립니다.</Text>
							</View>
						</View>
					</View>
					}
				</View>
			</ScrollView>
		</SafeAreaView>
	}
}

