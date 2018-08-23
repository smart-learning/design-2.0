import React from "react";
import {Text, View, StyleSheet, Image,} from "react-native";
import CommonStyles from "../../../styles/common";
import IcView from "../../../images/ic-detail-view.png"
import IcStar from "../../../images/ic-detail-star.png"
import IcMessage from "../../../images/ic-detail-message.png"
import {observer} from "mobx-react";

const styles = StyleSheet.create({
	countView: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		backgroundColor: '#333333',
	},
	countContainer: {
		flexDirection: 'row',
	},
	countIcon: {
		width: 21,
		height: 15,
		marginRight: 7,
	},
	countText: {
		marginRight: 20,
		fontSize: 12,
		color: '#dddddd',
	}
});

@observer
export default class CountView extends React.Component {
	render()
		{
			return <View style={styles.countView}>
				<View style={styles.countContainer}>
					<Image source={IcView} style={styles.countIcon}/>
					<Text style={styles.countText}>{this.props.store.itemData.hit_count}</Text>
					<Image source={IcStar} style={styles.countIcon}/>
					<Text style={styles.countText}>{this.props.store.itemData.star_avg}</Text>
					<Image source={IcMessage} style={styles.countIcon}/>
					<Text style={styles.countText}>{this.props.store.itemData.review_count}</Text>
				</View>
			</View>
		}
	}