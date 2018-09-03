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
	@observable videos = [];
	@observable audios = [];


	componentDidMount(){
		/* TODO sql로 리스트 가져오기 */

		const db = SQLite.openDatabase( 'welaaa.db', '1.0', '', 1 );
		db.transaction( txn => {
			console.log( 'txn:', txn );
			txn.executeSql('SELECT * FROM DOWNLOAD', [], (tx, res)=>{
				console.log( 'res:', res );
			});
		});


		setTimeout( ()=>{
			this.videos = [0, 1, 2, 3, 4];
			this.audios = [];
		}, 0 );
	}

	makeListItem = ( {item, index} ) =>{
		return <TouchableOpacity activeOpacity={0.9} key={index}
								 style={ styles.downloadItem }
								 onPress={ ()=> Native.download() }>
			<Text>다운받은 아이템{ item }</Text>
		</TouchableOpacity>
	}

	render() {

		let vcontent = <Text>다운받은 항목이 없습니다.</Text>;
		let acontent = <Text>다운받은 항목이 없습니다.</Text>;

		if( this.videos.length > 0 ){
			vcontent = <FlatList
				data = { this.videos }
				renderItem = { this.makeListItem }
			/>
		}

		if( this.audios.length > 0 ){
			acontent = <FlatList
				data = { this.audios }
				renderItem = { this.makeListItem }
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
								{ vcontent }
							</View>
						</View>
						}

						{this.tabStatus === 'audioBook' &&
						<View style={styles.tabContent}>
							<View style={[CommonStyles.contentContainer, styles.noContent]}>
								{ acontent }
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
									<Text style={this.tabStatus === 'audioBook' ? styles.tabTextActive : styles.tabText}>
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