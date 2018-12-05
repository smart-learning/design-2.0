import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image,} from "react-native";
import CommonStyles from "../../../styles/common";
import IcPlay from "../../../images/ic-class-continue-play.png";
import Native from "../../commons/native";

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
		paddingTop: '20%',
		paddingBottom: '20%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#efefef',
	},
	thumbnailTitle: {
		position: 'absolute',
		top: 10,
		left: '5%',
		width: '90%',
		fontSize: 14,
		fontWeight: '800',
		color: '#ffffff',
	},
	play: {
		width: 40,
		height: 40,
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
				return (
					<View style={styles.continueItem} key={ key }>
						<View style={styles.itemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => Native.play(item.data.id)}>
								<ImageBackground
									source={{uri: item.data.images ? item.data.images.list : null}}
									resizeMode="cover"
									style={styles.thumbnail}>
									<Text style={styles.thumbnailTitle} ellipsizeMode={'tail'} numberOfLines={1}>
										{item.data.headline}
									</Text>
									<View style={styles.play}>
										<Image source={IcPlay} style={CommonStyles.fullImg}/>
									</View>
								</ImageBackground>
							</TouchableOpacity>
						</View>
					</View>
				)
			} ) }
		</View>
	}
}