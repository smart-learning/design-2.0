import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import CommonStyles from "../../../styles/common";
import IcAngleDownGrey from "../../../images/ic-angle-down-grey.png";
import _ from 'underscore';
import { observer } from 'mobx-react';
import createStore from "../../commons/createStore";
import BookFreeListItem from "./BookFreeListItem";

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

@observer class BookFreeList extends React.Component {

	store = createStore( {
		isOpen: false,
	} );

	render() {
		let list;
		let BookList = [];

		if( !this.store.isOpen ) {
			list = this.props.itemData.slice( 0, 3 );
		} else {
			list = this.props.itemData;
		}

		if( this.props.itemType === 'review' ) {
			list = _.filter(list, (element) => {
				return element.is_bookreview == true;
			} );
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
									return <BookFreeListItem key={innerKey} itemData={item}/>
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