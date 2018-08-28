import React from "react";
import {Text, View, StyleSheet,} from "react-native";
import Summary from "../video/Summary";

const styles = StyleSheet.create({
	clipListItem: {
		backgroundColor: '#ffffff',
		padding: 15,
		marginBottom: 15,
	},
	titleContainer: {
		flexDirection: 'row',
		paddingRight: 15,
	},
	clipNumber: {
		width: 30,
		fontWeight: 'bold',
		fontSize: 18,
		color: '#333333',
	},
	clipTitle: {
		marginRight: 15,
		marginBottom: 15,
		fontSize: 18,
		color: '#333333',
	},
	clipParagraph: {
		marginBottom: 15,
		fontSize: 13,
		color: '#555555',
	},
});

export default class ClipListItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <View style={styles.clipListItem}>
			<View style={styles.titleContainer}>
				<Text style={styles.clipNumber}>
					{this.props.itemData.clipNumber < 10 &&
					<Text>0</Text>
					}
					{this.props.itemData.itemNumber}
				</Text>
				<Text style={styles.clipTitle}>{this.props.itemData.title}</Text>
			</View>

			{1 === 2 &&
			<Text style={styles.clipParagraph}>subtitle</Text>
			}

			<Summary type={"detailClip"} itemData={this.props.itemData}/>
		</View>
	}
}