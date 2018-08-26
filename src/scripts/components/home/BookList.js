import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, Image, FlatList, ImageBackground,} from "react-native";
import CommonStyles from "../../../styles/common";
import IcAngleDownGrey from "../../../images/ic-angle-down-grey.png";
import BookListItem from "./BookListItem";
import Dummy from "../../../images/dummy-audioBookSimple.png";
import IcView from "../../../images/ic-detail-view.png";
import IcStar from "../../../images/ic-detail-star.png";
import IcComment from "../../../images/ic-detail-message.png";

const styles = StyleSheet.create({
	bookContainer: {
		marginTop: 20,
		marginBottom: 50,
	},
	viewMoreContainer: {
		alignItems: 'center',
	},
	viewMore: {
		width: 50,
		height: 36,
		justifyContent: 'center',
	},
	viewMoreText: {
		fontSize: 12,
		color: '#888888',
	},
	viewMoreIcon: {
		position: 'relative',
		top: 2,
	},
	bookList: {
		flex: 1,
		marginBottom: 20,
	},
});

const dummy = [
	{
		key: 0,
		headline: '인간관계에 흔들리지 않고 나의 삶을 살아가는 법',
		title: 'titleText',
		is_exclusive: true,
		hit_count: 0,
		star_avg: 0,
		review_count: 0,
		thumbnail: '',
	},
	{
		key: 1,
		headline: '인간관계에 흔들리지 않고 나의 삶을 살아가는 법',
		title: 'titleText',
		is_exclusive: true,
		hit_count: 0,
		star_avg: 0,
		review_count: 0,
		thumbnail: '',
	},
	{
		key: 2,
		headline: '인간관계에 흔들리지 않고 나의 삶을 살아가는 법',
		title: 'titleText',
		is_exclusive: true,
		hit_count: 0,
		star_avg: 0,
		review_count: 0,
		thumbnail: '',
	},
	{
		key: 3,
		headline: '인간관계에 흔들리지 않고 나의 삶을 살아가는 법',
		title: 'titleText',
		is_exclusive: true,
		hit_count: 0,
		star_avg: 0,
		review_count: 0,
		thumbnail: '',
	},
	{
		key: 4,
		headline: '인간관계에 흔들리지 않고 나의 삶을 살아가는 법',
		title: 'titleText',
		is_exclusive: true,
		hit_count: 0,
		star_avg: 0,
		review_count: 0,
		thumbnail: '',
	},
];

export default class BookList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let list = dummy;
		let BookList = [];

		for (let i = 0; i < Math.ceil(list.length / 2); i++) {
			let listObject = [];

			listObject.push(list[i * 2]);
			listObject.push(list[i * 2 + 1]);

			BookList.push(listObject);
		}


		let rankNumber = 1;

		return <View style={styles.bookContainer}>
			<View style={styles.bookList}>
				{BookList.map((items, key) => {
					return (
						<View key={key} style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1,}}>
							{
								items.map((item, innerKey) => {
									console.log( 'item', item );
									return <View style={{width: '50%'}} key={innerKey}>
										{item !== undefined &&
										<BookListItem itemType={this.props.itemType} rankNumber={rankNumber++} key={innerKey} itemData={item}/>
										}
									</View>
								})
							}
						</View>
					);
				})}
			</View>

			<TouchableOpacity activeOpacity={0.9} style={styles.viewMoreContainer}>
				<View style={[styles.viewMore, CommonStyles.alignJustifyContentBetween]}>
					<Text style={styles.viewMoreText}>
						더보기
					</Text>
					<Image source={IcAngleDownGrey} style={styles.viewMoreIcon}/>
				</View>
			</TouchableOpacity>
		</View>
	}
}