import React from "react";
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Image, } from "react-native";
import CommonStyles from "../../../styles/common";
import icChartStar from '../../../images/ic-chart-star.png';
import icChartMessage from '../../../images/ic-chart-message.png';

const styles = StyleSheet.create( {

	rankGridItem: {
		marginBottom: 15,
	},
	rankNumber: {
		width: 25,
	},
	rankNumberText: {
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#4a4a4a',
	},
	thumbnail: {
		width: 40,
		height: 40,
		marginRight: 10,
		marginLeft: 10,
	},
	rankIcon: {
		position: 'relative',
		top: 1,
		width: 14,
		height: 14,
		marginRight: 2,
	},
	rankContentText: {
		paddingRight: 14,
		fontSize: 11,
		color: '#888888',
	},
} );

export default class ClipRankItem extends React.Component {

	constructor( props ) {
		super( props );
		// console.log( 'ClipRankItem.constructor' );
		// console.log( 'props', props );
	}

	render() {
		return <View style={styles.rankGridItem}>
			<View style={CommonStyles.alignJustifyItemCenter}>
				<View style={styles.rankNumber}>
					<Text style={styles.rankNumberText}>
						{/*{this.props.rankNumber}*/}
						00
					</Text>
				</View>
				<ImageBackground
					source={{ uri: this.props.itemData.images.list }}
					resizeMode="cover"
					style={styles.thumbnail}/>
				<View style={{ width: this.props.itemData.clipRankContentSize }}>
					<TouchableOpacity>
						<Text>
							{this.props.itemData.title}
						</Text>
					</TouchableOpacity>
					<View style={CommonStyles.alignJustifyFlex}>
						<Image source={icChartStar} style={styles.rankIcon}/>
						<Text style={styles.rankContentText}>
							{this.props.itemData.star_avg.toFixed( 1 )}
						</Text>
						<Image source={icChartMessage} style={styles.rankIcon}/>
						<Text style={styles.rankContentText}>
							{this.props.itemData.review_count}
						</Text>
						<Text style={styles.rankContentText}>
							{this.props.itemData.course.teacher.name}
						</Text>
					</View>
				</View>
			</View>
		</View>
	}
}