import React from "react";
import store from "../../commons/store";
import CommonStyles from "../../../styles/common";
import {
	Button,
	Image,
	Text,
	View,
	StyleSheet
} from "react-native";
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
	wrapper: {
	},
	slide1: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#9DD6EB',
	},
	slide2: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#97CAE5',
	},
	slide3: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#92BBD9',
	},
	text: {
		color: '#fff',
		fontSize: 30,
		fontWeight: 'bold',
	}
})

export default class LectureDetailPage extends React.Component {

	render() {
		return <View style={CommonStyles.container}>
			<Text>강좌 강의클립 목록</Text>
			<Text>{this.props.navigation.state.params.id}</Text>
			<Text>하트/리뷰/뷰</Text>
			<Text>이미지스와이퍼</Text>
			<Swiper style={styles.wrapper} showsButtons={true}>
				<View style={styles.slide1}>
					<Text style={styles.text}>Swiper1</Text>
				</View>
				<View style={styles.slide2}>
					<Text style={styles.text}>Swiper2</Text>
				</View>
				<View style={styles.slide3}>
					<Text style={styles.text}>Swiper3</Text>
				</View>
			</Swiper>
			);
			<Text>소개글</Text>
			<Text>강사</Text>
			<Text>강사 이미지</Text>
			<Text>강사 이름</Text>
			<Text>강사 소개글</Text>
			<Text>강의클립 목차</Text>
			<Text>공유버튼</Text>
			{/*<Button*/}
				{/*onPress={()=>this.props.navigation.goBack()}*/}
				{/*title="뒤로"*/}
			{/*/>*/}

		</View>
	}
}