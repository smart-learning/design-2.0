import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground,} from "react-native";
import CommonStyles from "../../../styles/common";
import IcPlay from "../../../images/ic-play.png";
import moment from "moment";
import _ from "underscore";
import Native from "../../commons/native";

const styles = StyleSheet.create({
	continueList: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
		marginBottom: 50,
	},
	continueItem: {
		width: '31%',
		borderWidth: 1,
		borderColor: '#dddddd',
	},
	thumbnail: {
		width: '100%',
		paddingTop: '80%',
		paddingBottom: '80%',
	},
	play: {
		position: 'absolute',
		right: 15,
		bottom: 15,
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

export default class BookContinueList extends React.Component {
	constructor(props) {
		super(props);

		if (this.props.itemData && this.props.itemData.length > 3) {
			this.props.itemData.length = 3;
		}
	}

	render() {
		let items = this.props.itemData;

		return <View style={styles.continueList}>
			{items.map((item, key) => {
				let playTime;
				if( !item.data.play_time ) {
					playTime = '';
				}
				else {
					playTime = moment.duration(item.data.play_time);
				}

				let progress = parseFloat(item.data.progress);
				if (_.isNaN(progress)) {
					progress = 0;
				}

				let expireAt;
				if( !item.expire_at ) {
					expireAt = '';
				}
				else {
					expireAt = moment(item.expire_at).format('MM월 DD일 만료');
				}

				return (
					<View style={styles.continueItem} key={key}>
						<TouchableOpacity activeOpacity={0.9} onPress={() => Native.play(item.data.id)}>
							<ImageBackground
								source={{uri: (item.data.teacher && item.data.teacher.images) ? item.data.teacher.images.default : null}}
								resizeMode={"cover"} style={styles.thumbnail}/>
							<Image source={IcPlay} style={styles.play}/>
						</TouchableOpacity>
						<View style={styles.progress}>
							<View style={[styles.progressBar, {width: progress+'%'}]}/>
						</View>
						<View style={styles.info}>
							<Text style={styles.infoText}>{playTime}</Text>
							<Text style={styles.infoText}>{expireAt}</Text>
						</View>
					</View>
				)
			})}
		</View>
	}
}