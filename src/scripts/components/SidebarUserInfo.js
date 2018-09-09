import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import IcFree from '../../images/ic-stamp-free.png';
import DummyUser from '../../images/dummy-my-profile-2.png';
import IcAngleRight from '../../images/ic-my-angle-right.png';
import CommonStyles from "../../styles/common";
import store from "../commons/store";
import globalStore from "../commons/store";
import MembershipBookClub from "../../images/bullet-membership-book-club.png";
import MembershipCampus from "../../images/bullet-membership-campus.png";
import MembershipPremium from "../../images/bullet-membership-premium.png";
import moment from "moment";

const styles = StyleSheet.create({
	userInfoContainer: {
		justifyContent: 'center',
		height: 110,
		paddingLeft: 15,
		paddingRight: 15,
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	thumbnail: {
		width: 50,
		height: 50,
		marginRight: 15,
	},
	loginText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#555555',
	},
	afterLogin: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	userName: {
		fontSize: 13,
		fontWeight: 'bold',
		color: CommonStyles.COLOR_PRIMARY,
	},
	userNameImportant: {
		fontSize: 15,
	},
	userEmail: {
		fontSize: 13,
		color: '#888888',
	},
	memberShipContainerNoMembership: {
		justifyContent: 'center',
		height: 100,
		backgroundColor: '#f0f0f0',
	},
	memberShipContainer: {
		justifyContent: 'center',
		height: 190,
		backgroundColor: '#f0f0f0',
	},
	membershipButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 15,
		marginRight: 15,
		padding: 10,
		borderWidth: 1,
		borderColor: '#c5c5c5',
		backgroundColor: '#F8F8F8',
	},
	membershipButtonBullet: {
		width: 35,
		height: 35,
		marginRight: 7,
	},
	membershipButtonText: {
		fontSize: 13,
		color: '#555555',
	},
	membershipButtonIcon: {
		width: 7,
		height: 13,
		marginLeft: 'auto',
	},
	membershipTitle: {
		paddingLeft: 15,
		paddingBottom: 15,
		fontSize: 17,
		color: '#333333',
	},
	membershipItem: {
		flexDirection: 'row',
		marginBottom: 7,
	},
	membershipItemLabel: {
		width: '40%',
		paddingLeft: 15,
		fontSize: 13,
		fontWeight: 'bold',
		color: '#888888'
	},
	membershipItemText: {
		fontSize: 13,
		color: '#555555'
	},
});

export default class SidebarUserInfo extends React.Component {

	renderMembershipButton() {
		if (store.welaaaAuth === undefined) {

			return (
				<View style={styles.memberShipContainerNoMembership}>
					<TouchableOpacity activeOpacity={0.9}
									  onPress={() => this.props.navigation.navigate('SignUpPage')}>
						<View style={styles.membershipButton} borderRadius={4}>
							<Image source={IcFree} style={styles.membershipButtonBullet}/>
							<View>
								<Text style={styles.membershipButtonText}>계정 만들고</Text>
								<Text style={styles.membershipButtonText}>무료 콘텐츠 마음껏 보기!</Text>
							</View>
							<Image source={IcAngleRight} style={styles.membershipButtonIcon}/>
						</View>
					</TouchableOpacity>
				</View>
			)
		}

		if (globalStore.currentMembership && globalStore.currentMembership.type_text) {
			let startAtData = globalStore.currentMembership.start_at;
			let expireAtData = globalStore.currentMembership.expire_at;
			let startAt = moment( startAtData ).format('YYYY-MM-DD');
			let expireAt = moment( expireAtData ).format('YYYY-MM-DD');
			return (
				<View style={styles.memberShipContainer}>
					<Text style={styles.membershipTitle}>나의멤버십</Text>
					<View>
						<View style={styles.membershipItem}>
							<Text style={styles.membershipItemLabel}>가입한 멤버십</Text>
							{globalStore.currentMembership.type_text === "프리미엄 멤버십" &&
							<Image source={MembershipPremium}/>
							}
							{globalStore.currentMembership.type_text === "캠퍼스" &&
							<Image source={MembershipCampus}/>
							}
							{globalStore.currentMembership.type_text === "오디오 북 클럽" &&
							<Image source={MembershipBookClub}/>
							}
						</View>
						<View style={styles.membershipItem}>
							<Text style={styles.membershipItemLabel}>가입일</Text>
							<Text style={styles.membershipItemText}>{startAt}</Text>
						</View>
						<View style={styles.membershipItem}>
							<Text style={styles.membershipItemLabel}>다음 결제일</Text>
							<Text style={styles.membershipItemText}>{expireAt}</Text>
						</View>
						<View style={styles.membershipItem}>
							<Text style={styles.membershipItemLabel}>이용권한</Text>
							<View>
								{globalStore.currentMembership.type_text === "프리미엄 멤버십" &&
								<View>
									<Text style={styles.membershipItemText}>모든 클래스 무제한 보기,</Text>
									<Text style={styles.membershipItemText}>오디오북 이용권 2개</Text>
								</View>
								}
								{globalStore.currentMembership.type_text === "캠퍼스" &&
								<Text style={styles.membershipItemText}>모든 클래스 무제한 보기,</Text>
								}
								{globalStore.currentMembership.type_text === "오디오 북 클럽" &&
								<Text style={styles.membershipItemText}>오디오북 이용권 2개</Text>
								}
							</View>
						</View>
					</View>
				</View>
			)
		}

		return (
			<View style={styles.memberShipContainerNoMembership}>
				<TouchableOpacity activeOpacity={0.9}
								  onPress={() => this.props.navigation.navigate('MembershipScreen')}>
					<View style={styles.membershipButton} borderRadius={4}>
						<Image source={IcFree} style={styles.membershipButtonBullet}/>
						<View>
							<Text style={styles.membershipButtonText}>멤버십 첫 달 무료로</Text>
							<Text style={styles.membershipButtonText}>클래스&오디오북 마음껏 보기!</Text>
						</View>
						<Image source={IcAngleRight} style={styles.membershipButtonIcon}/>
					</View>
				</TouchableOpacity>
			</View>
		)
	}

	render() {
		console.log('globalStore.currentMembership', globalStore.currentMembership);
		return <View>
			<View style={styles.userInfoContainer}>
				<View style={styles.userInfo}>
					{1 === 2 &&
					<ImageBackground source={DummyUser} resizeMode="cover" borderRadius={25} style={styles.thumbnail}/>
					}
					<View>
						{/*beforeLogin*/}
						{store.welaaaAuth === undefined &&
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => this.props.navigation.navigate('Login')}
						>

							<Text style={styles.loginText}>로그인</Text>
						</TouchableOpacity>
						}
						{/*isLogin*/}
						{store.welaaaAuth &&
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => this.props.navigation.navigate('MyScreen')}>
							<View>
								<Text style={styles.userName}><Text
									style={styles.userNameImportant}>{globalStore.profile ? globalStore.profile.name || '<윌라회원님>' : '<윌라회원님>'}</Text></Text>
								<Text
									style={styles.userEmail}>{globalStore.profile ? globalStore.profile.email : ''}</Text>
							</View>
						</TouchableOpacity>
						}
					</View>
				</View>
			</View>
			{/*noMembership*/}
			{this.renderMembershipButton()}
		</View>
	}
}