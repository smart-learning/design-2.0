import React from "react";
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, } from "react-native";
import CommonStyles from "../../../styles/common";
import TabContentInfo from "./TabContentInfo";
// import TabContentList from "./TabContentList";
import TabContentReview from "./TabContentReview";
import PaymentStatus from "./PaymentStatus";
import TopBanner from "./TopBanner";
import CountView from "./CountView";
import TabContentList from "./TabContentList";

const styles = StyleSheet.create( {
	tabContainer: {
		width: '33.3%',
	},
	tabItem: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		height: 60,
		backgroundColor: '#ffffff',
	},
	tabNormalText: {
		fontSize: 15,
		color: '#555555',
	},
	tabActiveText: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#333333',
	},
	tabNormalHr: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		height: 3,
		backgroundColor: '#ffffff',
	},
	tabActiveHr: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		width: '100%',
		height: 3,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
} );

class TabStore {
	@observable lectureView = false;
	@observable teacherView = false;
	@observable slideHeight = null;
	@observable reviewText = '';
	@observable reviewStar = 0;
}

const tabStore = new TabStore();

@observer
class DetailLayout extends React.Component {

	@observable tabStatus = 'review';

	constructor( props ) {
		super( props );
	}

	render() {
		return <View style={[ CommonStyles.container, { backgroundColor: '#ffffff' } ]}>
			<ScrollView style={{ width: '100%' }}>
				<TopBanner learnType={"class"}/>

				<CountView/>

				<Text>일반 회원 구매 전 - 오디오북</Text>
				<PaymentStatus learnType={"audioBook"} paymentType={"normal"}/>

				<Text>일반 회원 구매 전 - 클래스</Text>
				<PaymentStatus learnType={"class"} paymentType={"normal"}/>

				<Text>일반 회원 구매 후 - 오디오북</Text>
				<PaymentStatus learnType={"audioBook"} paymentType={"buy"}/>

				<Text>일반 회원 구매 후 - 클래스</Text>
				<PaymentStatus learnType={"class"} paymentType={"buy"}/>

				<Text>멤버십 회원 수강 전 - 오디오북</Text>
				<PaymentStatus learnType={"audioBook"} paymentType={"membershipBeforeLearn"}/>

				<Text>멤버십 회원 수강 전 - 클래스</Text>
				<PaymentStatus learnType={"class"} paymentType={"membershipBeforeLearn"}/>

				<Text>멤버십 회원 수강 시작 - 오디오북</Text>
				<PaymentStatus learnType={"audioBook"} paymentType={"membershipStartLearn"}/>

				<Text>멤버십 회원 수강 시작 - 클래스</Text>
				<PaymentStatus learnType={"class"} paymentType={"membershipStartLearn"}/>

				<View style={CommonStyles.alignJustifyContentBetween}>
					<View style={styles.tabContainer}>
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => {
											  this.tabStatus = 'info'
										  }}>
							<View style={styles.tabItem}>
								<Text style={this.tabStatus === 'info' ? styles.tabActiveText : styles.tabNormalText}>
									클래스정보
								</Text>
								<View style={ this.tabStatus === 'info' ? styles.tabActiveHr : styles.tabNormalHr }/>
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.tabContainer}>
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => {
											  this.tabStatus = 'list'
										  }}>
							<View style={styles.tabItem}>
								<Text style={this.tabStatus === 'list' ? styles.tabActiveText : styles.tabNormalText}>
									강의목차 (00)
								</Text>
								<View style={ this.tabStatus === 'list' ? styles.tabActiveHr : styles.tabNormalHr }/>
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.tabContainer}>
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => {
											  this.tabStatus = 'review'
										  }}>
							<View style={styles.tabItem}>
								<Text style={ this.tabStatus === 'review' ? styles.tabActiveText : styles.tabNormalText }>
									리뷰 (00)
								</Text>
								<View style={ this.tabStatus === 'review' ? styles.tabActiveHr : styles.tabNormalHr }/>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				{this.tabStatus === 'info' &&
				<TabContentInfo store={ tabStore }/>
				}
				{this.tabStatus === 'list' &&
				<TabContentList/>
				}
				{this.tabStatus === 'review' &&
				<TabContentReview store={ tabStore }/>
				}
			</ScrollView>
		</View>
	}
}

export default DetailLayout