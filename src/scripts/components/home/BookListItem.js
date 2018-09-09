import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CommonStyles from "../../../styles/common";
import Dummy from "../../../images/dummy-audioBookSimple.png";
import IcView from "../../../images/ic-detail-view.png";
import IcStar from "../../../images/ic-detail-star.png";
import IcComment from "../../../images/ic-detail-message.png";
import {withNavigation} from "react-navigation";
import {observer} from "mobx-react";

const styles = StyleSheet.create( {
	alignJustify: {
		marginTop: 10,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	bookList: {
		marginBottom: 20,
	},
	bookItem: {
		position: 'relative',
		marginBottom: 15,
		marginRight: 5,
		marginLeft: 5,
		paddingTop: 15,
		paddingLeft: 10,
		paddingRight: 10,
		borderWidth: 1,
		borderColor: '#dddddd',
	},
	bookRank: {
		marginBottom: 15,
		alignItems: 'center',
	},
	bookRankText: {
		textAlign: 'center',
		fontSize: 15,
		fontWeight: 'bold',
		color: CommonStyles.COLOR_PRIMARY,
	},
	bookRankHr: {
		width: 20,
		borderTopWidth: 0,
		borderRightWidth: 0,
		borderBottomWidth: 1,
		borderLeftWidth: 0,
		borderColor: CommonStyles.COLOR_PRIMARY,
	},
	bookTitle: {
		fontSize: 16,
		color: CommonStyles.COLOR_PRIMARY,
	},
	bookAuthor: {
		fontSize: 14,
		color: '#888888',
	},
	bookLabels: {
		marginBottom: 15,
	},
	bookLabel: {
		height: 22,
		marginTop: 9,
		marginRight: 3,
		paddingTop: 3,
		paddingRight: 10,
		paddingBottom: 3,
		paddingLeft: 10,
	},
	bookLabelText: {
		fontSize: 12,
		color: '#ffffff',
	},
	bookLabelBlank: {
		borderColor: 'transparent',
		opacity: 0,
	},
	bookLabelNew: {
		backgroundColor: '#5f45b4',
	},
	bookLabelExclusive: {
		backgroundColor: '#ff761b',
	},
	bookLabelFree: {
		backgroundColor: '#00afba',
	},
	bookLabelDefault: {
		backgroundColor: CommonStyles.COLOR_PRIMARY,
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
	btnSetSmall: {
		width: 20,
		height: 14,
	},
	countText: {
		paddingLeft: 3,
		paddingRight: 7,
		fontSize: 12,
		color: '#444444',
	}
} );

export default withNavigation(@observer class BookListItem extends React.Component {
	constructor( props ) {
		super( props );
	}

	render() {
		return <View style={styles.bookItem}>
			{this.props.itemType === 'hot' &&
			<View style={styles.bookRank}>
				<Text style={styles.bookRankText}>
					{this.props.itemData.itemNumber < 10 &&
						<Text>0</Text>
					}
					{this.props.itemData.itemNumber}
				</Text>
				<View style={styles.bookRankHr}/>
			</View>
			}
			<TouchableOpacity activeOpacity={0.9} onPress={ () => this.props.navigation.navigate('AudioBookDetailPage', {id: this.props.itemData.id, title: this.props.itemData.title})}>
				<Text style={styles.bookTitle} ellipsizeMode={'tail'} numberOfLines={1}>
					{this.props.itemData.title}
				</Text>
			</TouchableOpacity>
			<View style={[ styles.bookLabels, CommonStyles.alignJustifyFlex ]}>
				{(!this.props.itemData.is_new && !this.props.itemData.is_exclusive && !this.props.itemData.is_free && !this.props.itemData.audiobook_type) &&
				<View style={[ styles.bookLabel, styles.bookLabelBlank ]} borderRadius={10}>
					<Text style={[ styles.bookLabelText, styles.bookLabelExclusiveText ]}/>
				</View>
				}
				{!!this.props.itemData.is_new &&
				<View style={[ styles.bookLabel, styles.bookLabelNew ]} borderRadius={10}>
					<Text style={[ styles.bookLabelText]}>New</Text>
				</View>
				}
				{!!this.props.itemData.is_exclusive &&
				<View style={[ styles.bookLabel, styles.bookLabelExclusive ]} borderRadius={10}>
					<Text style={[ styles.bookLabelText]}>독점</Text>
				</View>
				}
				{!!this.props.itemData.is_free &&
				<View style={[styles.bookLabel, styles.bookLabelFree]} borderRadius={10}>
					<Text style={[styles.bookLabelText]}>무료</Text>
				</View>
				}
				{this.props.itemData.audiobook_type === '완독' &&
				<View style={[styles.bookLabel, styles.bookLabelDefault]} borderRadius={10}>
					<Text style={[styles.bookLabelText]}>완독</Text>
				</View>
				}
				{this.props.itemData.audiobook_type === '요약' &&
				<View style={[styles.bookLabel, styles.bookLabelDefault]} borderRadius={10}>
					<Text style={[styles.bookLabelText]}>요약</Text>
				</View>
				}
			</View>
			<View>
				<ImageBackground source={{uri: this.props.itemData.images.list}} resizeMode={"cover"} style={styles.thumbnail}>
					<View style={styles.thumbnailDim}>
						<Text style={styles.thumbnailTitle}>{this.props.itemData.subtitle}</Text>
					</View>
				</ImageBackground>
			</View>
			<View style={styles.alignJustify}>
				<Image source={IcView} style={styles.btnSetSmall}/>
				<Text style={styles.countText}>{this.props.itemData.hit_count}</Text>
				<Image source={IcStar} style={styles.btnSetSmall}/>
				<Text style={styles.countText}>{this.props.itemData.star_avg}</Text>
				<Image source={IcComment} style={styles.btnSetSmall}/>
				<Text style={styles.countText}>{this.props.itemData.review_count}</Text>
			</View>
		</View>
	}
} )