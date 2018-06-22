import React from "react";
import store from "../../commons/store";
import CommonStyles from "../../../styles/common";
import {
	Button,
	Image,
	Text,
	View,
	StyleSheet,
	ImageBackground
} from "react-native";
import Swiper from 'react-native-swiper';
import Dummy1 from '../../../images/swiper-dummy-1.png';
import Dummy2 from '../../../images/swiper-dummy-2.png';

const styles = StyleSheet.create({
	wrapper: {
	},
	slide: {
		flex: 1,
		height: '60%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#9DD6EB',
	},
	text: {
		width: '100%',
		paddingTop: '42%',
		paddingBottom: '42%',
		// color: '#fff',
		// fontSize: 30,
		// fontWeight: 'bold',
	},
});

export default class LectureDetailPage extends React.Component {

	render() {
		return <View style={CommonStyles.container}>
			<Text>강좌 강의클립 목록</Text>
			<Text>{this.props.navigation.state.params.id}</Text>
			<Text>하트/리뷰/뷰</Text>
			<Text>이미지스와이퍼</Text>
			<Swiper style={styles.wrapper} showsButtons={false} >
				<View style={styles.slide}>
					{/*<Text style={styles.text}>Swiper1</Text>*/}
					<ImageBackground source={Dummy1} resizeMode="cover" style={ styles.text }/>
				</View>
				<View style={styles.slide}>
					{/*<Text style={styles.text}>Swiper2</Text>*/}
					<ImageBackground source={Dummy2} resizeMode="cover" style={ styles.text }/>
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