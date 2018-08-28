import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, ImageBackground, FlatList, ScrollView,} from "react-native";
import CommonStyles from "../../../styles/common";
import Summary from "../video/Summary";
import ClipListItem from "./ClipListItem";
import ChapterListItem from "./ChapterListItem";

const styles = StyleSheet.create({
	clipListContainer: {
		paddingBottom: 30,
		backgroundColor: '#2a2c31',
	},
	clipInfoText: {
		marginTop: 30,
		marginBottom: 15,
		fontSize: 13,
		color: '#ffffff'
	},
	clipInfoTextImportant: {
		fontWeight: 'bold',
		color: CommonStyles.COLOR_PRIMARY,
	},
	chapterListContainer: {
		paddingBottom: 30,
	},
	chapterInfoText: {
		marginTop: 30,
		marginBottom: 15,
		fontSize: 13,
		color: '#333333'
	},
	chapterInfoTextImportant: {
		fontWeight: 'bold',
		color: CommonStyles.COLOR_PRIMARY,
	},
});

export default class TabContentList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <View>
			<ScrollView style={{flex: 1}}>
				{this.props.learnType === 'class' &&
				<View style={styles.clipListContainer}>
					<View style={CommonStyles.contentContainer}>
						<Text style={styles.clipInfoText}>
							<Text style={styles.clipInfoTextImportant}>7개</Text>
							강의클립, 전체 재생시간
							<Text style={styles.clipInfoTextImportant}>6시간 20분</Text>
						</Text>

						<FlatList
							style={{width: '100%'}}
							data={this.props.store.itemClipData}
							renderItem={
								({item}) => <ClipListItem type={'detailClip'} itemData={item}/>
							}
						/>

					</View>
				</View>
				}
				{this.props.learnType === 'audioBook' &&
				<View style={styles.chapterListContainer}>
					<View style={CommonStyles.contentContainer}>
						<Text style={styles.chapterInfoText}>
							<Text style={styles.clipInfoTextImportant}>7개</Text>
							강의클립, 전체 재생시간
							<Text style={styles.clipInfoTextImportant}>6시간 20분</Text>
						</Text>

						<ChapterListItem/>
						{/*<FlatList*/}
						{/*style={{width: '100%'}}*/}
						{/*data={this.props.store.itemClipData}*/}
						{/*renderItem={*/}
						{/*({item}) => <ClipListItem type={'detailClip'} itemData={item}/>*/}
						{/*}*/}
						{/*/>*/}
					</View>
				</View>
				}
			</ScrollView>
		</View>
	}
}