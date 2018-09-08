import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity } from "react-native";
import CommonStyles from "../../../styles/common";
import BookDailyListItem from "../../components/home/BookDailyListItem";

const styles = StyleSheet.create( {
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
	}
} );

class BookDailyList extends React.Component {
	render() {
		return <View>
			{/*헤더*/}
			<View>
				<Text style={[ styles.mainTitleCenter, styles.titleH2 ]}>
					매일 책 한 권
				</Text>
				<Text style={[ styles.mainTitleCenter, styles.titleH4 ]}>
					책 좀 아는 사람들이 요약해 주는 읽은 척 매뉴얼
				</Text>
			</View>

			{/*카테고리*/}
			<View style={ styles.categoryHr }/>
			<View style={[ CommonStyles.alignJustifyFlex, styles.categoryContainer ]}>
				<View style={ styles.categoryItem }>
					<TouchableOpacity><Text style={ styles.categoryText }>월</Text></TouchableOpacity>
				</View>
				<View style={ styles.categoryItem }>
					<TouchableOpacity><Text style={ styles.categoryText }>화</Text></TouchableOpacity>
				</View>
				<View style={ styles.categoryItem }>
					<TouchableOpacity><Text style={ styles.categoryText }>수</Text></TouchableOpacity>
				</View>
				<View style={ styles.categoryItem }>
					<TouchableOpacity><Text style={ styles.categoryText }>목</Text></TouchableOpacity>
				</View>
				<View style={ styles.categoryItem }>
					<TouchableOpacity><Text style={ styles.categoryText }>금</Text></TouchableOpacity>
				</View>
			</View>
			<View style={ styles.categoryHr }/>

			{/*콘텐츠*/}
			<View>
				<View style={styles.dailyBookList}>
					<Text>[월] 하지현의 마음을 치유하는 책</Text>
					<View>
						<BookDailyListItem/>
					</View>
				</View>
				<View style={styles.dailyBookList}>
					<Text>[화] 하지현의 마음을 치유하는 책</Text>
					<View>
						<BookDailyListItem/>
					</View>
				</View>
				<View style={styles.dailyBookList}>
					<Text>[수] 하지현의 마음을 치유하는 책</Text>
					<View>
						<BookDailyListItem/>
					</View>
				</View>
				<View style={styles.dailyBookList}>
					<Text>[목] 하지현의 마음을 치유하는 책</Text>
					<View>
						<BookDailyListItem/>
					</View>
				</View>
				<View style={styles.dailyBookList}>
					<Text>[금] 하지현의 마음을 치유하는 책</Text>
					<View>
						<BookDailyListItem/>
					</View>
				</View>
			</View>
		</View>
	}
}

export default BookDailyList;