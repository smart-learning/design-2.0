import React from "react";
import Summary from "../../components/video/Summary";
import {
	View,
	Text,
} from "react-native";
import m from "moment";

class BookDailyListItem extends React.Component {
	render() {
		let itemData = '';
		if( this.props.itemData !== undefined ) {
			itemData = this.props.itemData[0];
		}
		const month = m( itemData.open_date ).format( "M" );
		const day = m( itemData.open_date ).format( "D" );
		return <View>
			<View>
				<Text>{ month } / { day }</Text>
				<Text>{ itemData.title }</Text>
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