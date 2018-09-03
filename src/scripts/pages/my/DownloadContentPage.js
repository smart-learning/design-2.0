import React from "react";
import {AsyncStorage, Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';
import {SafeAreaView} from "react-navigation";
import {observer} from "mobx-react";
import {observable} from "mobx";
import Native from "../../commons/native";
import SQLite from 'react-native-sqlite-2';

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
		backgroundColor: '#26c281',
	},
	tabContentContainer: {
		paddingTop: 40,
	},
	noContent: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 50,
		paddingBottom: 50,
	},
	downloadItem: {
		justifyContent: 'flex-start',
		paddingTop: 10,
		paddingBottom: 10,
	}
});

@observer
export default class DownloadContentPage extends React.Component {

	@observable tabStatus = 'video';
	@observable videos = [
		{
			gTitle: '[더미] 청중의 OK를 끌어내는 프레젠테이션 전략',
			audioVideoType: 'video-course',
			drmLicenseUrl: 'drmUrl',
			drmSchemeUuid: 'widevine',
			cPlayTime: '00:15:16',
			groupImg: '',
			oid: '',
			thumbnailImg: 'https://static.welaaa.co.kr/static/courses/v100015/v100015_list.jpg',
			userId: 'userId',
			groupkey: null,
			groupAllPlayTime: '01:10:55',
			groupContentScnt: 0,
			view_limitdate: 'Tue, 27 Jul 2117 00:00:00 GMT',
			ckey: 'v100015_001',
			contentPath: '',
			totalSize: '',
			groupTeacherName: '유달내 상무',
			cTitle: '지기지피 백전백승! 나의 발표 목적을 제일 먼저 고려하라',
			modified: '2018-09-03 14:07:36',
			cid: 'v100015_001'
		},
	];
	@observable audios = [];


	componentDidMount() {
		const db = SQLite.openDatabase('welaaa.db', '1.0', '', 1);
		db.transaction(txn => {
			console.log('txn:', txn);
			txn.executeSql('SELECT * FROM DOWNLOAD', [], (tx, res) => {
				console.log('res:', res);
				res.rows.forEach( item => {
					if( item.audioVideoType === 'video-course' ) this.videos.push( item );
					else                                         this.audios.push( item );
				});
			});
		});
	}

	makeListItem = ({item, index}) => {
		return <TouchableOpacity activeOpacity={0.9} key={index}
								 style={styles.downloadItem}
								 onPress={() => Native.download()}>
			<Text>다운받은 아이템{item}</Text>
		</TouchableOpacity>
	}

	render() {

		let vcontent = <Text>다운받은 항목이 없습니다.</Text>;
		let acontent = <Text>다운받은 항목이 없습니다.</Text>;

		if (this.videos.length > 0) {
			vcontent = <FlatList
				data={this.videos}
				renderItem={this.makeListItem}
			/>
		}

		if (this.audios.length > 0) {
			acontent = <FlatList
				data={this.audios}
				renderItem={this.makeListItem}
			/>
		}

		// console.log( 'videos', this.videos );


		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<View style={styles.tabContentContainer}>
						{this.tabStatus === 'video' &&
						<View style={styles.tabContent}>
							<View style={[CommonStyles.contentContainer, styles.noContent]}>
								{vcontent}
							</View>
						</View>
						}

						{this.tabStatus === 'audioBook' &&
						<View style={styles.tabContent}>
							<View style={[CommonStyles.contentContainer, styles.noContent]}>
								{acontent}
							</View>
						</View>
						}
					</View>
				</ScrollView>
				<View style={styles.tabContainer}>
					<View style={styles.tabFlex}>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.tabStatus = 'video'}>
								<View style={styles.tabItem}>
									<Text style={this.tabStatus === 'video' ? styles.tabTextActive : styles.tabText}>
										비디오
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