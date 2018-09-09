import React from "react";
import Summary from "../../components/video/Summary";
import {
	View,
	Text,
	StyleSheet
} from "react-native";
import m from "moment";
import {COLOR_PRIMARY} from "../../../styles/common";

const styles = StyleSheet.create({
	bookListItemContainer: {
		padding: 13,
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#dddddd',
	},
	bookListItemHeadline: {
		marginBottom: 13,
	},
	dateBox: {
		position: 'relative',
		flexDirection: 'column',
		marginTop: 0,
		marginBottom: 0,
		marginRight: 'auto',
		marginLeft: 'auto',
	},
	date: {
		width: 50,
		textAlign: 'center',
		fontSize: 15,
		color: COLOR_PRIMARY,
	},
	dateHr: {
		width: 50,
		height: 1,
		backgroundColor: COLOR_PRIMARY,
	},
	listItemTitle: {
		fontSize: 16,
		color: '#333333',
		marginTop: 14,
	},
});

class BookDailyListItem extends React.Component {
	render() {
		let itemData = '';
		if( this.props.itemData !== undefined ) {
			itemData = this.props.itemData[0];
		}
		console.log( '데이터', this.props.itemData );
		const month = m( itemData.open_date ).format( "M" );
		const day = m( itemData.open_date ).format( "D" );
		return <View style={styles.bookListItemContainer}>
			<View style={styles.bookListItemHeadline}>
				<View style={styles.dateBox}>
					<Text style={styles.date}>{ month } / { day }</Text>
					<View style={styles.dateHr}/>
				</View>
				<Text style={styles.listItemTitle}>{ itemData.title }</Text>
			</View>
			<View>
				<Summary type={ 'dailyBook' }
						 thumbnail={ itemData.image }
						 cid={ itemData.cid }
						 hitCount={ itemData.hit_count }
						 starAvg={ itemData.star_avg }
						 reviewCount={ itemData.review_count }/>
			</View>
		</View>
	}
}

export default BookDailyListItem;