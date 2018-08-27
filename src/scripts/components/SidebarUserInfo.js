import React from 'react';
import {Button, Text, View, Image, ImageBackground, TouchableOpacity, StyleSheet, AsyncStorage} from "react-native";
import IcFree from '../../images/ic-stamp-free.png';
import DummyUser from '../../images/dummy-my-profile-2.png';
import IcAngleRight from '../../images/ic-my-angle-right.png';
import MembershipPremium from '../../images/bullet-membership-premium.png';
import MembershipBookClub from '../../images/bullet-membership-book-club.png';
import MembershipCampus from '../../images/bullet-membership-campus.png';
import MembershipNormal from '../../images/bullet-membership-normal.png';
import CommonStyles from "../../styles/common";
import store from "../commons/store";
import NavigationActions from "react-navigation/src/NavigationActions";
import MyScreens from "../pages/my/MyScreens";

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
	render() {
		return <View>
			<View style={styles.userInfoContainer}>
				<View style={styles.userInfo}>
					<ImageBackground source={DummyUser} resizeMode="cover" borderRadius={25} style={styles.thumbnail}/>
					<View>
						{/*beforeLogin*/}
						{store.welaaaAuth === undefined &&
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => this.props.navigation.navigate('Login')}>
							<Text style={styles.loginText}>로그인</Text>
						</TouchableOpacity>
						}
						{/*isLogin*/}
						{store.welaaaAuth &&
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => this.props.navigation.navigate('MyScreen')}>
							<View>
								<Text style={styles.userName}><Text style={styles.userNameImportant}>유저이름</Text>님</Text>
								<Text style={styles.userEmail}>mail@mail.com</Text>
							</View>
						</TouchableOpacity>
						}
					</View>
				</View>
			</View>
			{/*noMembership*/}
			<View style={styles.memberShipContainerNoMembership}>
				<TouchableOpacity activeOpacity={0.9}>
					<View style={styles.membershipButton} borderRadius={4}>
						<Image source={IcFree} style={styles.membershipButtonBullet}/>
						<View>
							<Text style={styles.membershipButtonText}>멤버십 첫 달 무료로</Text>
							<Text style={styles.membershipButtonText}>클래스&오디오북 마음껏 보기!</Text>
						</View>
						<Image source={IcAngleRight} style={styles.membershipButtonIcon}></Image>
					</View>
				</TouchableOpacity>
			</View>
			{/*isMembership*/}
			{/*<View style={styles.memberShipContainer}>*/}
			{/*<Text style={styles.membershipTitle}>나의멤버십</Text>*/}
			{/*<View>*/}
			{/*<View style={styles.membershipItem}>*/}
			{/*<Text style={styles.membershipItemLabel}>가입한 멤버십</Text>*/}
			{/*<Image source={MembershipCampus}/>*/}
			{/*</View>*/}
			{/*<View style={styles.membershipItem}>*/}
			{/*<Text style={styles.membershipItemLabel}>가입일</Text>*/}
			{/*<Text style={styles.membershipItemText}>2018년 08월 23일</Text>*/}
			{/*</View>*/}
			{/*<View style={styles.membershipItem}>*/}
			{/*<Text style={styles.membershipItemLabel}>다음 결제일</Text>*/}
			{/*<Text style={styles.membershipItemText}>2018년 08월 23일</Text>*/}
			{/*</View>*/}
			{/*<View style={styles.membershipItem}>*/}
			{/*<Text style={styles.membershipItemLabel}>이용권한</Text>*/}
			{/*<View>*/}
			{/*<Text style={styles.membershipItemText}>모든 클래스 무제한 보기,</Text>*/}
			{/*<Text style={styles.membershipItemText}>오디오북 이용권 2개</Text>*/}
			{/*</View>*/}
			{/*</View>*/}
			{/*</View>*/}
			{/*</View>*/}
		</View>
	}
}