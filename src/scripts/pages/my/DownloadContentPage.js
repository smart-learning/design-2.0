import React from "react";
import {
	AsyncStorage,
	Button,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import CommonStyles, {COLOR_PRIMARY} from "../../../styles/common";
import globalStore from '../../../scripts/commons/store';
import {SafeAreaView} from "react-navigation";
import {observer} from "mobx-react";
import {observable} from "mobx";
import Native from "../../commons/native";
import IcPlay from "../../../images/ic-play.png";

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
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	tabContentContainer: {
		paddingTop: 40,
	},
	noContent: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 50,
		textAlign: 'center'
	},

	flatList: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 20,
	},

	downloadItem: {
		flex: 1,
		flexDirection: 'row',
		paddingTop: 10,
		paddingBottom: 10,
		alignItems: 'flex-start',
		borderBottomWidth: 1,
		borderBottomColor: '#F3F3F3'
	},

	downloadItemImg: {
		width: 60,
		height: 60,
	},

	downloadItemInfo: {
		paddingLeft: 20,
	},

	downloadItemPlayButton: {
		marginLeft: 'auto',
	},
});

@observer
export default class DownloadContentPage extends React.Component {

	@observable tabStatus = 'video';
	@observable videos = [
		{
			gTitle: '[더미] 청중의 OK를 끌어내는 프레젠테이션 전략',
			audioVideoType: 'video_course',
			drmSchemeUuid: "widevine",
			drmLicenseUrl: "http://tokyo.pallycon.com/ri/licenseManager.do",
			cPlayTime: '00:15:16',
			groupImg: '',
			oid: 'order id',
			thumbnailImg: 'https://static.welaaa.co.kr/static/courses/v100015/v100015_list.jpg',
			userId: 'userId',
			groupkey: null,
			groupAllPlayTime: '01:10:55',
			groupContentScnt: 0,
			view_limitdate: 'Tue, 27 Jul 2117 00:00:00 GMT',
			ckey: 'v100015_001',
			contentPath: 'https://contents.welaaa.com/media/v200001/DASH_v200001_001/stream.mpd',
			totalSize: '',
			groupTeacherName: '유달내 상무',
			cTitle: '지기지피 백전백승! 나의 발표 목적을 제일 먼저 고려하라',
			modified: '2018-09-03 14:07:36',
			cid: 'v200064_001',
			key: 'dummy',
		},
	];
	@observable audios = [];


	componentDidMount() {
		Native.getDatabase();
	}


	play( item ){
		Native.play( item.cid );
	}

	makeListItem = ({item, index}) => {
		return <TouchableOpacity activeOpacity={0.9}
								 style={styles.downloadItem}>
			<Image source={{uri: item.thumbnailImg}} style={styles.downloadItemImg}/>
			<View style={styles.downloadItemInfo}>
				<Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.gTitle}</Text>
				<Text style={{ fontSize: 12, color: COLOR_PRIMARY }}>{item.cTitle}</Text>
				<Text style={{ fontSize: 12, color: '#A6A6A6' }}>{item.groupTeacherName} | {item.cPlayTime}</Text>
				{item.view_limitdate !== 'null' &&
					<Text style={{ fontSize: 12, color:'#E10D38' }}>{item.view_limitdate}</Text>
				}
			</View>
			<TouchableOpacity activeOptacity={0.9}
							  style={styles.downloadItemPlayButton}
							  onPress={ ()=>{ this.play( item ) } }
			>
				<Image source={IcPlay} style={{ width:20, height:20 }}/>
			</TouchableOpacity>
		</TouchableOpacity>
	}

	render() {

		let vcontent = <Text style={styles.noContent}>다운받은 항목이 없습니다.</Text>;
		let acontent = <Text style={styles.noContent}>다운받은 항목이 없습니다.</Text>;


		let vvv = [];
		let aaa = [];
		// store의 downloadItems이 변경되면..
		if (globalStore.downloadItems !== 'null') {

			/* TODO: 어떤 형태로 들어오는지는 봐야되는데, audioVideoType 값을 가지고 videos, audios로 각각 분배*/
			// 일단 array안에 object라고 가정하고...
			try {
				const json = JSON.parse(globalStore.downloadItems);
				json.forEach((item, idx) => {
					if (item.audioVideoType === 'video-course') vvv.push({...item, key: idx + ''});
					else aaa.push({...item, key: idx + ''});
				});
			} catch (e) {
				vcontent = <Text>JSON 변환에 실패하였습니다.</Text>;
				acontent = <Text>JSON 변환에 실패하였습니다.</Text>;
			}

		}
		else {

			// 데이터 없을경우 임시로 더미 생성 TODO: 추후 삭제
			vvv.push(this.videos[0]);
		}


		// 데이터를 가지고 리스트를 생성
		if (vvv.length > 0) {
			vcontent = <FlatList
				style={ styles.flatList }
				data={vvv}
				renderItem={this.makeListItem}
			/>
		}

		if (aaa.length > 0) {
			acontent = <FlatList
				style={ styles.flatList }
				data={aaa}
				renderItem={this.makeListItem}
			/>
		}

		// console.log( 'videos', this.videos );


		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<View style={styles.tabContentContainer}>
						{this.tabStatus === 'video' && vcontent}
						{this.tabStatus === 'audioBook' && acontent }
					</View>
				</ScrollView>
				<View style={styles.tabContainer}>
					<View style={styles.tabFlex}>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.tabStatus = 'video'}>
								<View style={styles.tabItem}>
									<Text style={this.tabStatus === 'video' ? styles.tabTextActive : styles.tabText}>
										클래스
									</Text>
									<View style={this.tabStatus === 'video' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.tabStatus = 'audioBook'}>
								<View style={styles.tabItem}>
									<Text
										style={this.tabStatus === 'audioBook' ? styles.tabTextActive : styles.tabText}>
										오디오북
									</Text>
									<View style={this.tabStatus === 'audioBook' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</SafeAreaView>
		</View>
	}
}