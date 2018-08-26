import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import CommonStyles from "../../../styles/common";
import IcAngleDownGrey from "../../../images/ic-angle-down-grey.png";
import DummyBg from "../../../images/dummy-audioBookSimple.png";
import DummyIcon from "../../../images/dummy-review.png";
import _ from 'underscore';
import { observer } from 'mobx-react';
import createStore from "../../commons/createStore";

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

const dummy = [];

_.times( 11, n => {
	dummy.push( {
		key: n,
		headline: '인간관계에 흔들리지 않고 나의 삶을 살아가는 법',
		title: 'titleText',
		is_exclusive: true,
		hit_count: 0,
		star_avg: 0,
		review_count: 0,
		thumbnail: '',
	} );
} );

@observer class BookFreeList extends React.Component {

	store = createStore( {
		isOpen: false,
	} );

	render() {
		let list = dummy;
		let BookList = [];

		if( !this.store.isOpen ) {
			list = dummy.slice( 0, 3 );
		}

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

			{!this.store.isOpen &&
			<TouchableOpacity activeOpacity={0.9} style={styles.viewMoreContainer} onPress={ () => this.store.isOpen = true }>
				<View style={[ styles.viewMore, CommonStyles.alignJustifyContentBetween ]}>
					<Text style={styles.viewMoreText}>
						더보기
					</Text>
					<Image source={IcAngleDownGrey} style={styles.viewMoreIcon}/>
				</View>
			</TouchableOpacity>
			}
		</View>
	}
}

export default BookFreeList;