import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, Image, FlatList, ImageBackground,} from "react-native";
import CommonStyles from "../../../styles/common";
import IcAngleDownGrey from "../../../images/ic-angle-down-grey.png";
import DummyBg from "../../../images/dummy-audioBookSimple.png";
import DummyIcon from "../../../images/dummy-review.png";

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
	listItem: {
		width: '31%',
		marginBottom: 15,
	},
	thumbnail: {
		position: 'relative',
		width: '100%',
		paddingTop: '80%',
		paddingBottom: '80%',
	},
	thumbnailDim: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		height: 80,
		padding: 7,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
	},
	thumbnailTitle: {
		fontSize: 12,
		color: '#ffffff',
	},
	bullet: {
		position: 'absolute',
		bottom: 70,
		left: '35%',
		width: 40,
		height: 40,
	}
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

export default class BookFreeList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let list = dummy;
		let BookList = [];

		for (let i = 0; i < Math.ceil(list.length / 3); i++) {
			let listObject = [];

			listObject.push(list[i * 3]);
			listObject.push(list[i * 3 + 1]);
			listObject.push(list[i * 3 + 2]);

			BookList.push(listObject);
		}


		return <View style={styles.bookContainer}>
			<View style={styles.bookList}>
				{BookList.map((items, key) => {
					return (
						<View key={key} style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1,}}>
							{
								items.map((item, innerKey) => {
									return <View style={styles.listItem} key={innerKey}>
										{item !== undefined &&
										<ImageBackground source={DummyBg} resizeMode={"cover"} style={styles.thumbnail}>
											<View style={styles.thumbnailDim}>
												<Text style={styles.thumbnailTitle}>title</Text>
											</View>
											<Image source={DummyIcon} style={styles.bullet}/>
										</ImageBackground>
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