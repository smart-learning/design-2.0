import React from "react";
import CommonStyles from "../../../styles/common";
import {AsyncStorage, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground} from "react-native";
import store from '../../../scripts/commons/store';
import BgMy from "../../../images/bg-my.png";
import IcAngleRight from "../../../images/ic-my-angle-right.png";
import IcDownload from "../../../images/ic-my-download.png";
import IcMusic from "../../../images/ic-my-music.png";
import IcPlay from "../../../images/ic-my-play.png";
import IcProfile from "../../../images/ic-my-profile.png";
import IcTag from "../../../images/ic-my-tag.png";
import DummyProfile from "../../../images/dummy-my-profile.png";


const styles = StyleSheet.create({
	sectionLayout: {
		width: '100%',
		backgroundColor: '#ffffff',
		paddingTop: 20,
		paddingRight: 15,
		paddingBottom: 20,
		paddingLeft: 15,
	},
	sectionTitle: {
		marginBottom: 10,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#4A4A4A'
	},
	listItem: {
		height: 46,
		flexDirection: 'row',
		alignItems: 'center',
	},
	listItemIcon: {
		width: 36,
		height: 36,
		marginRight: 10,
	},
	listItemTitle: {
		fontSize: 15,
		color: '#4a4a4a',
	},
	listItemBullet: {
		width: 7,
		height: 13,
	},
	listItemBarContainer: {
		position: 'relative',
	},
	listItemBar: {
		width: '100%',
		height: 1,
		backgroundColor: '#eeeeee',
	},
	listItemBarBullet: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 46,
		height: 1,
		backgroundColor: '#ffffff',
	},
	friendParagraph: {
		marginBottom: 10,
		fontSize: 15,
		color: '#999999',
	},
	friendButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 50,
		backgroundColor: '#32C183',
	},
	friendButtonText: {
		fontSize: 15,
		color: '#ffffff',
	},
	guideItem: {
		height: 40,
		justifyContent: 'center',
	},
	guideTitle: {
		fontSize: 15,
		color: '#4a4a4a',
	},
	guideHr: {
		width: '100%',
		height: 1,
		backgroundColor: '#eeeeee',
	},
	myInfo: {
		// height: 165,
		paddingLeft: 40,
		paddingRight: 40,
	},
	myInfoContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	myInfoProfile: {
		width: 60,
		height: 60,
		marginRight: 10,
	},
	myInfoName: {
		fontSize: 16,
		color: '#efefef'
	},
	myInfoParagraphContainer: {
		marginTop: 7,
		marginBottom: 4,
	},
	myInfoParagraph: {
		fontSize: 12,
		color: '#cccccc'
	},
	myInfoParagraphButton: {
		marginLeft: 10,
		fontSize: 12,
		color: '#cccccc'
	},
	myInfoEmail: {
		fontSize: 12,
		color: '#9A9A9A',
	},
});
/*
* 로그인 후 보여지는 화면
* */
export default class MyInfoHome extends React.Component {

	logout = () => {
		store.clearTokens();
		this.props.navigation.navigate('Login');
	}

	render() {

		const {navigation} = this.props;

		return <View style={[CommonStyles.container, {backgroundColor: '#F5F5F5'}]}>
			<ScrollView style={{width: '100%'}}>
				<View style={{height: 50}}><Text>!!!header area!!!</Text></View>
				<ImageBackground source={BgMy} style={styles.myInfo}>
					<View style={[styles.myInfoContent, {height: 165}]}>
						<Image source={DummyProfile} style={styles.myInfoProfile} borderRadius={30}/>
						<View>
							<View style={styles.myInfoContent}>
								<Text style={styles.myInfoName}>김딸기</Text>
								<View>package</View>
							</View>
							<View style={[styles.myInfoContent, styles.myInfoParagraphContainer]}>
								<Text style={styles.myInfoParagraph}>한줄 메세지를 작성해주세요~</Text>
								<TouchableOpacity activeOpacity={0.9}>
									<Text style={styles.myInfoParagraphButton}>쓰기</Text>
								</TouchableOpacity>
							</View>
							<Text style={styles.myInfoEmail}>mail@mail.com</Text>
						</View>
					</View>
				</ImageBackground>

				<View style={styles.sectionLayout}>
					<Text style={styles.sectionTitle}>콘텐츠 이용 현황</Text>

					<TouchableOpacity activeOpacity={0.9}
									  onPress={() => this.props.navigation.navigate('LectureUsePage')}>
						<View style={styles.listItem}>
							<Image source={IcPlay} style={styles.listItemIcon}/>
							<Text style={styles.listItemTitle}>최근 재생중 강좌</Text>
							<Image source={IcAngleRight} style={[styles.listItemBullet, {marginLeft: 'auto'}]}/>
						</View>
					</TouchableOpacity>
					<View style={styles.listItemBarContainer}>
						<View style={styles.listItemBar}/>
						<View style={styles.listItemBarBullet}/>
					</View>
					<TouchableOpacity activeOpacity={0.9}
									  onPress={() => this.props.navigation.navigate('LectureBuyPage')}>
						<View style={styles.listItem}>
							<Image source={IcPlay} style={styles.listItemIcon}/>
							<Text style={styles.listItemTitle}>구매한 강좌</Text>
							<Image source={IcAngleRight} style={[styles.listItemBullet, {marginLeft: 'auto'}]}/>
						</View>
					</TouchableOpacity>
					<View style={styles.listItemBarContainer}>
						<View style={styles.listItemBar}/>
						<View style={styles.listItemBarBullet}/>
					</View>
					<TouchableOpacity activeOpacity={0.9}
									  onPress={() => this.props.navigation.navigate('AudioBookTicketPage')}>
						<View style={styles.listItem}>
							<Image source={IcMusic} style={styles.listItemIcon}/>
							<Text style={styles.listItemTitle}>나의 오디오북 이용권</Text>
							<Image source={IcAngleRight} style={[styles.listItemBullet, {marginLeft: 'auto'}]}/>
						</View>
					</TouchableOpacity>
					<View style={styles.listItemBarContainer}>
						<View style={styles.listItemBar}/>
						<View style={styles.listItemBarBullet}/>
					</View>
					<TouchableOpacity activeOpacity={0.9}
									  onPress={() => this.props.navigation.navigate('AudioBookUsePage')}>
						<View style={styles.listItem}>
							<Image source={IcMusic} style={styles.listItemIcon}/>
							<Text style={styles.listItemTitle}>이용중 오디오북</Text>
							<Image source={IcAngleRight} style={[styles.listItemBullet, {marginLeft: 'auto'}]}/>
						</View>
					</TouchableOpacity>
					<View style={styles.listItemBarContainer}>
						<View style={styles.listItemBar}/>
						<View style={styles.listItemBarBullet}/>
					</View>
					<TouchableOpacity activeOpacity={0.9}
									  onPress={() => this.props.navigation.navigate('AudioBookBuyPage')}>
						<View style={styles.listItem}>
							<Image source={IcMusic} style={styles.listItemIcon}/>
							<Text style={styles.listItemTitle}>구매한 오디오북</Text>
							<Image source={IcAngleRight} style={[styles.listItemBullet, {marginLeft: 'auto'}]}/>
						</View>
					</TouchableOpacity>
					<View style={styles.listItemBarContainer}>
						<View style={styles.listItemBar}/>
						<View style={styles.listItemBarBullet}/>
					</View>
					<TouchableOpacity activeOpacity={0.9}
									  onPress={() => this.props.navigation.navigate('DownloadContentPage')}>
						<View style={styles.listItem}>
							<Image source={IcDownload} style={styles.listItemIcon}/>
							<Text style={styles.listItemTitle}>다운로드 컨텐츠</Text>
							<Image source={IcAngleRight} style={[styles.listItemBullet, {marginLeft: 'auto'}]}/>
						</View>
					</TouchableOpacity>
					<View style={styles.listItemBarContainer}>
						<View style={styles.listItemBar}/>
						<View style={styles.listItemBarBullet}/>
					</View>
					<TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate('SetTagPage')}>
						<View style={styles.listItem}>
							<Image source={IcTag} style={styles.listItemIcon}/>
							<Text style={styles.listItemTitle}>관심태그 설정하기</Text>
							<Image source={IcAngleRight} style={[styles.listItemBullet, {marginLeft: 'auto'}]}/>
						</View>
					</TouchableOpacity>
					<View style={styles.listItemBarContainer}>
						<View style={styles.listItemBar}/>
						<View style={styles.listItemBarBullet}/>
					</View>
					<TouchableOpacity activeOpacity={0.9}
									  onPress={() => this.props.navigation.navigate('ClipPlayListPage')}>
						<View style={styles.listItem}>
							<Image source={IcPlay} style={styles.listItemIcon}/>
							<Text style={styles.listItemTitle}>최근 재생 강의클립 목록</Text>
							<Image source={IcAngleRight} style={[styles.listItemBullet, {marginLeft: 'auto'}]}/>
						</View>
					</TouchableOpacity>
					<View style={styles.listItemBarContainer}>
						<View style={styles.listItemBar}/>
						<View style={styles.listItemBarBullet}/>
					</View>
					<TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate('MyLogPage')}>
						<View style={styles.listItem}>
							<Image source={IcProfile} style={styles.listItemIcon}/>
							<Text style={styles.listItemTitle}>활동로그 보기</Text>
							<Image source={IcAngleRight} style={[styles.listItemBullet, {marginLeft: 'auto'}]}/>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{height: 8}}/>
				<View style={styles.sectionLayout}>
					<Text style={styles.sectionTitle}>윌라친구</Text>
					<Text style={styles.friendParagraph}>친구와 함께하면 스마트러닝이 더 즐겁습니다!</Text>
					<TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate('FriendPage')}>
						<View style={styles.friendButton} borderRadius={5}>
							<Text style={styles.friendButtonText}>친구보기</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{height: 8}}/>
				<View style={styles.sectionLayout}>
					<Text style={styles.sectionTitle}>알림 문의</Text>

					<TouchableOpacity activeOpacity={0.9}
									  onPress={() => this.props.navigation.navigate('GuideListPage')}>
						<View style={styles.guideItem}>
							<Text style={styles.guideTitle}>윌라소개 & 이용가이드</Text>
						</View>
					</TouchableOpacity>
					<View style={styles.guideHr}/>
					<TouchableOpacity activeOpacity={0.9}
									  onPress={() => this.props.navigation.navigate('InquireListPage')}>
						<View style={styles.guideItem}>
							<Text style={styles.guideTitle}>1:1 문의</Text>
						</View>
					</TouchableOpacity>
					<View style={styles.guideHr}/>

				</View>

				<View style={{height: 8}}/>
				<View style={styles.sectionLayout}>
					{/*<Text style={styles.sectionTitle}>알림 문의</Text>*/}

					{/*<Button title="Logout이 원래 이 위치는 아니지만 그냥 테스트로..." onPress={this.logout}/>*/}

					{/*<Button title="서브페이지로..." onPress={ ()=> this.props.navigation.navigate('MyInfoSubExample')}/>*/}

					{/*<TouchableOpacity activeOpacity={0.9}*/}
					{/*onPress={ ()=> navigation.navigate('DownloadContent') }*/}
					{/*>*/}
					{/*<Text>다운로드 콘텐츠</Text>*/}
					{/*</TouchableOpacity>*/}
				</View>

				{/*<Image*/}
				{/*style={{ position:'absolute', top:0, width:'100%', height:'50%' }}*/}
				{/*source={ { uri:"https://t1.daumcdn.net/cfile/tistory/99361E475B24737B2D"}}/>*/}

			</ScrollView>
		</View>
	}
}