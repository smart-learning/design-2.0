import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, } from "react-native";
import CommonStyles from "../../../styles/common";
import ReviewItem from "./ReviewItem";
import { observer } from "mobx-react/index";
import ReviewForm from "./ReviewForm";

const styles = StyleSheet.create( {
	sectionTitle: {
		paddingTop: 20,
		paddingBottom: 30,
		fontSize: 18,
		fontWeight: 'bold',
		color: '#34342C',
	},
	sectionTitleBullet: {
		fontSize: 15,
		fontWeight: 'bold',
		color: CommonStyles.COLOR_PRIMARY,
	},
} );

export default class TabContentReview extends React.Component {

	constructor( props ) {
		super( props );
	}

	render() {
		return <View>
			<ReviewForm store={ this.props.store }/>

                <Text style={{
                    marginTop: 30,
                    marginBottom: 15,
					marginLeft: 15,
					marginRight: 15,
                    fontSize: 13,
                    color: '#34342C',
                    borderWidth: 1,
                    borderColor: '#bbbbbe',
                    padding: 15
                }}>데이터 준비중입니다.</Text>

			{/*<View style={CommonStyles.contentContainer}>*/}
				{/*<Text style={styles.sectionTitle}>전체 댓글 <Text style={styles.sectionTitleBullet}>(00)</Text></Text>*/}
				{/*<ReviewItem/>*/}
				{/*<ReviewItem/>*/}
				{/*<ReviewItem/>*/}
			{/*</View>*/}
		</View>
	}
}