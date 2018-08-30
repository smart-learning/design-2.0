import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image,} from "react-native";
import CommonStyles from "../../../styles/common";
import IcPlay from "../../../images/ic-play.png";
import Native from "../../commons/native";
import moment from "moment";
import _ from 'underscore';

const styles = StyleSheet.create({
	continueGrid: {
		marginTop: 20,

	},
	continueItem: {
		width: '48%',
		borderWidth: 1,
		borderColor: '#dddddd',
	},
	thumbnail: {
		position: 'relative',
		width: '100%',
		paddingTop: '22%',
		paddingBottom: '22%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#efefef',
	},
	thumbnailTitle: {
		position: 'absolute',
		top: 15,
		left: '5%',
		width: '65%',
		fontSize: 14,
		fontWeight: '800',
		color: '#ffffff',
		textShadowColor: 'rgba(0, 0, 0, 0.8)',
		textShadowOffset: {
			width: 1,
			height: 2
		},
		textShadowRadius: 4,
	},
	play: {
		position: 'absolute',
		right: 15,
		width: 32,
		height: 32,
	},
	progress: {
		position: 'relative',
		width: '100%',
		height: 4,
		backgroundColor: '#b7b7b7',
	},
	progressBar: {
		position: 'absolute',
		top: 0,
		left: 0,
		height: 4,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	info: {
		paddingTop: 6,
		paddingRight: 10,
		paddingBottom: 6,
		paddingLeft: 10,
	},
	infoText: {
		fontSize: 12,
		color: '#555555',
	},
});


export default class ClassContinueList extends React.Component {

	constructor(props) {
		super(props);

		if( this.props.itemData && this.props.itemData.length > 2 ) {
			this.props.itemData.length = 2;
		}
	}

	render() {
		let items = this.props.itemData;

		return <View style={[CommonStyles.alignJustifyContentBetween, styles.continueGrid]}>
			{ items.map( ( item, key ) => {
				const playTime = moment.duration(item.data.play_time);
				let progress = parseFloat( item.data.progress );
				if( _.isNaN( progress ) ) {
					progress = 0;
				}
				return (
					<View style={styles.continueItem} key={ key }>
						<View style={styles.itemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => Native.play(item.data.id)}>
								<ImageBackground
									source={{uri: item.data.images ? item.data.images.list : null}}
									resizeMode="cover"
									style={styles.thumbnail}>
									<Text style={styles.thumbnailTitle} ellipsizeMode={'tail'} numberOfLines={3}>
										{item.data.headline}
									</Text>
									<View style={styles.play}>
										<Image source={IcPlay} style={CommonStyles.fullImg}/>
									</View>
								</ImageBackground>
							</TouchableOpacity>
						</View>
						<View style={styles.progress}>
							<View style={[styles.progressBar, {width: progress + '%'}]}/>
						</View>
						<View style={styles.info}>
							<Text style={styles.infoText}>
								{item.data.clip_count}개 클립, {`${playTime.hours()}시간 ${playTime.minutes()}분`}
							</Text>
						</View>
					</View>
				)
			} ) }
		</View>
	}
}