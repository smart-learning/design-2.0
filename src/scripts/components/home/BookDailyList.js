import React from "react";
import {
	StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import CommonStyles from "../../../styles/common";
import BookDailyListItem from "../../components/home/BookDailyListItem";
import {observer} from "mobx-react";

const styles = StyleSheet.create({
	mainTitleCenter: {
		textAlign: 'center',
	},
	titleH2: {
		fontSize: 26,
		fontWeight: 'bold',
		color: '#333333',
	},
	titleH4: {
		paddingTop: 10,
		fontSize: 13,
		color: '#888888',
	},
	categoryHr: {
		width: '100%',
		height: 1,
		backgroundColor: '#cecece',
	},
	categoryContainer: {
		width: '100%',
		height: 40,
	},
	categoryItem: {
		width: '20%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	categoryText: {
		color: '#A1A1A1',
		fontSize: 14,
		textAlign: 'center',
	},
	categoryButtonHrActive: {
		width: 10,
		height: 1,
		backgroundColor: '#ff0000',
	},
	categoryButtonHr: {},
	dailyBookListBlock: {

	},
	dailyBookListHidden: {

	},
});

@observer
class BookDailyList extends React.Component {
	render() {
		const monday = this.props.itemData['월'];
		const tuesday = this.props.itemData['화'];
		const wednesday = this.props.itemData['수'];
		const thursday = this.props.itemData['목'];
		const friday = this.props.itemData['금'];

		return <View>
			{/*헤더*/}
			<View>
				<Text style={[styles.mainTitleCenter, styles.titleH2]}>
					매일 책 한 권
				</Text>
				<Text style={[styles.mainTitleCenter, styles.titleH4]}>
					책 좀 아는 사람들이 요약해 주는 읽은 척 매뉴얼
				</Text>
			</View>

			{/*카테고리*/}
			<View style={styles.categoryHr}/>
			<View style={[CommonStyles.alignJustifyFlex, styles.categoryContainer]}>
				<View style={styles.categoryItem}>
					<TouchableOpacity onPress={() => this.props.store.dailyTabSelected = 'mon'}>
						<View>
							<Text style={styles.categoryText}>월</Text>
							<View
								style={this.props.store.dailyTabSelected === 'mon' ? styles.categoryButtonHrActive : styles.categoryButtonHr}/>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.categoryItem}>
					<TouchableOpacity onPress={() => this.props.store.dailyTabSelected = 'tue'}>
						<View>
							<Text style={styles.categoryText}>화</Text>
							<View
								style={this.props.store.dailyTabSelected === 'tue' ? styles.categoryButtonHrActive : styles.categoryButtonHr}/>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.categoryItem}>
					<TouchableOpacity onPress={() => this.props.store.dailyTabSelected = 'wed'}>
						<View>
							<Text style={styles.categoryText}>수</Text>
							<View
								style={this.props.store.dailyTabSelected === 'wed' ? styles.categoryButtonHrActive : styles.categoryButtonHr}/>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.categoryItem}>
					<TouchableOpacity onPress={() => this.props.store.dailyTabSelected = 'thu'}>
						<View>
							<Text style={styles.categoryText}>목</Text>
							<View
								style={this.props.store.dailyTabSelected === 'thu' ? styles.categoryButtonHrActive : styles.categoryButtonHr}/>
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.categoryItem}>
					<TouchableOpacity onPress={() => this.props.store.dailyTabSelected = 'fri'}>
						<View>
							<Text style={styles.categoryText}>금</Text>
							<View
								style={this.props.store.dailyTabSelected === 'fri' ? styles.categoryButtonHrActive : styles.categoryButtonHr}/>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.categoryHr}/>

			{/*콘텐츠*/}
			<View>

				{this.props.store.dailyTabSelected === 'mon' &&
				<View
					style={this.props.store.mondayTab === true ? styles.dailyBookListBlock : styles.dailyBookListHidden}>
					<Text>[월] 하지현의 마음을 치유하는 책</Text>
					<View>
						<BookDailyListItem itemData={monday}/>
					</View>
				</View>
				}
				{this.props.store.dailyTabSelected === 'tue' &&
				<View
					style={this.props.store.tuesdayTab === true ? styles.dailyBookListBlock : styles.dailyBookListHidden}>
					<Text>[화] 하지현의 마음을 치유하는 책</Text>
					<View>
						<BookDailyListItem itemData={tuesday}/>
					</View>
				</View>
				}
				{this.props.store.dailyTabSelected === 'wed' &&
				<View
					style={this.props.store.wednesdayTab === true ? styles.dailyBookListBlock : styles.dailyBookListHidden}>
					<Text>[수] 하지현의 마음을 치유하는 책</Text>
					<View>
						<BookDailyListItem itemData={wednesday}/>
					</View>
				</View>
				}
				{this.props.store.dailyTabSelected === 'thu' &&
				<View
					style={this.props.store.thursdayTab === true ? styles.dailyBookListBlock : styles.dailyBookListHidden}>
					<Text>[목] 하지현의 마음을 치유하는 책</Text>
					<View>
						<BookDailyListItem itemData={thursday}/>
					</View>
				</View>
				}
				{this.props.store.dailyTabSelected === 'fri' &&
				<View
					style={this.props.store.fridayTab === true ? styles.dailyBookListBlock : styles.dailyBookListHidden}>
					<Text>[금] 하지현의 마음을 치유하는 책</Text>
					<View>
						<BookDailyListItem itemData={friday}/>
					</View>
				</View>
				}
			</View>
		</View>
	}
}

export default BookDailyList;