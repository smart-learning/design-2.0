import React from "react";
import {
	AsyncStorage,
	Button,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image, ImageBackground
} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';
import {SafeAreaView} from "react-navigation";
import {observer} from "mobx-react";
import {observable, computed} from "mobx";
// import _ from "underscore";
import IcCheck from "../../../images/ic-my-check-all.png";
import IcTrash from "../../../images/ic-my-trash-xs.png";
import dummy from "../../../images/dummy-summary.jpg";
import IcDownload from "../../../images/ic-my-down-lg.png";
import IcTrashLg from "../../../images/ic-my-trash-lg.png";

const playList = [
	{
		key: '1',
		title: '플레이아이템1',
	},
	{
		key: '2',
		title: '플레이아이템2',
	},
	{
		key: '3',
		title: '플레이아이템3',
	},
	{
		key: '4',
		title: '플레이아이템4',
	},
	{
		key: '5',
		title: '플레이아이템5',
	},
	{
		key: '6',
		title: '플레이아이템6',
	}
];

const styles = StyleSheet.create({
	contentPopup: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		alignSelf: 'flex-start',
		bottom: 0,
		left: 0,
		width: '100%',
		height: 70,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	contentPopupButton: {
		flexDirection: 'row'
	},
	popupIcon: {
		width: 30,
		height: 30,
		marginLeft: 15,
		marginRight: 15,
	},
	buttonLayout: {
		flexDirection: 'row',
		padding: 15,
	},
	buttonIc: {
		width: 14,
		height: 14,
		marginRight: 5,
	},
	buttonText: {
		fontSize: 12,
		color: '#8D8D8D',
	},
	listContainerHr: {
		width: '100%',
		height: 1,
		backgroundColor: '#D4D4D4',
	},
	summary: {
		flexDirection: 'row',
		position: 'relative',
		paddingTop: 15,
	},
	summaryThumbnail: {
		width: 65,
		height: 92,
		marginLeft: 15,
		marginRight: 10,
	},
	summaryContent: {
		position: 'relative',
		width: '65%',
		paddingRight: 15,
	},
	summaryTitle: {
		fontSize: 16,
		color: '#4a4a4a',
	},
	summaryAuthor: {
		fontSize: 12,
		color: '#999999',
	},
	summaryCountContainer: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
	},
	summaryIcon: {
		width: 14,
		height: 14,
	},
	summaryCountText: {
		paddingLeft: 3,
		paddingRight: 7,
		fontSize: 12,
		color: '#999999',
	},
	summaryPlayButtonActive: {
		width: 24,
		height: 24,
	},
	summaryPlayButton: {
		width: 24,
		height: 24,
	},
	summaryHr: {
		marginTop: 15,
		width: '100%',
		height: 1,
		backgroundColor: '#efefef'
	},
	playListScrollView: {
		paddingBottom: 70,
	}
});

@observer
class ClipPlayListPage extends React.Component {

	@observable selected = [];

	changeSelect = (item) => {
		if (this.selected.indexOf(item.key) === -1) {
			this.selected.push(item.key);
		}
		else {
			this.selected.splice(this.selected.indexOf(item.key), 1);
		}
	};

	toggleSelectAll = () => {
		if (this.selected.length === playList.length) {
			this.selected.length = 0;
		}
		else {
			// this.selected = _.map(playList, element => element.key);
		}
	};

	render() {
		console.log('this.selected', this.selected);
		console.log('this.selected.length', this.selected.length);

		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}, styles.playListScrollView}>
					<View style={[CommonStyles.alignJustifyContentBetween, styles.buttonContainer]}>
						<View>
							<TouchableOpacity onPress={this.toggleSelectAll} activeOpacity={0.9}>
								<View>
									<View style={styles.buttonLayout}>
										<Image source={IcCheck} style={styles.buttonIc}/>
										<Text style={styles.buttonText}>전체선택</Text>
									</View>
								</View>
							</TouchableOpacity>
						</View>
						<View>
							<TouchableOpacity onPress={this.toggleSelectAll} activeOpacity={0.9}>
								<View>
									<View style={styles.buttonLayout}>
										<Image source={IcTrash} style={styles.buttonIc}/>
										<Text style={styles.buttonText}>중복삭제</Text>
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<View style={CommonStyles.contentContainer}>
						<View style={styles.listContainerHr}/>

						<FlatList
							style={{width: '100%'}}
							data={playList}
							renderItem={
								({item}) => <TouchableOpacity onPress={() => this.changeSelect(item)}>
									<View style={{backgroundColor: this.selected.indexOf(item.key) > -1 ? '#e5e5e5' : '#ffffff'}}>
										<View style={styles.summary}>
											<ImageBackground source={dummy} resizeMode="cover" style={styles.summaryThumbnail}/>
											<View style={styles.summaryContent}>
												<Text style={styles.summaryTitle}>{item.title}</Text>
												<Text style={styles.summaryAuthor}>author | 00시간 00분</Text>
											</View>
											<View>
												/* TODO: 터치시 상태변경 작업 필요 */
												<TouchableOpacity activeOpacity={0.9}>
													{/*<Image source={IcPlayEmpty} style={styles.summaryPlayButton}/>*/}
												</TouchableOpacity>
											</View>
										</View>
										<View style={styles.summaryHr}/>
									</View>
								</TouchableOpacity>
							}
						/>
					</View>
				</ScrollView>
				{this.selected.length > 0 &&
				<View style={styles.contentPopup}>
					<View>
						<View style={styles.contentPopupButton}>
							<TouchableOpacity activeOpacity={0.9}>
								<Image source={IcDownload} style={styles.popupIcon}/>
							</TouchableOpacity>
							<TouchableOpacity activeOpacity={0.9}>
								<Image source={IcTrashLg} style={styles.popupIcon}/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				}
			</SafeAreaView>
		</View>
	}
}

export default ClipPlayListPage;