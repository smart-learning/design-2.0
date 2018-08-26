import React from "react";
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

@observer
class DetailLayout extends React.Component {

	constructor( props ) {
		super( props );
	}

	render() {
		return <View style={[ CommonStyles.container, { backgroundColor: '#ffffff', width: '100%' } ]}>
			<ScrollView style={{ width: '100%' }}>
				<TopBanner learnType={this.props.learnType} store={this.props.store}/>

				<CountView store={this.props.store}/>

				<PaymentStatus learnType={this.props.learnType} paymentType={"normal"}/>

				{/*<Text>일반 회원 구매 전 - 오디오북</Text>*/}
				{/*<PaymentStatus learnType={"audioBook"} paymentType={"normal"}/>*/}

				{/*<Text>일반 회원 구매 전 - 클래스</Text>*/}
				{/*<PaymentStatus learnType={"class"} paymentType={"normal"}/>*/}

				{/*<Text>일반 회원 구매 후 - 오디오북</Text>*/}
				{/*<PaymentStatus learnType={"audioBook"} paymentType={"buy"}/>*/}

				{/*<Text>일반 회원 구매 후 - 클래스</Text>*/}
				{/*<PaymentStatus learnType={"class"} paymentType={"buy"}/>*/}

				{/*<Text>멤버십 회원 수강 전 - 오디오북</Text>*/}
				{/*<PaymentStatus learnType={"audioBook"} paymentType={"membershipBeforeLearn"}/>*/}

				{/*<Text>멤버십 회원 수강 전 - 클래스</Text>*/}
				{/*<PaymentStatus learnType={"class"} paymentType={"membershipBeforeLearn"}/>*/}

				{/*<Text>멤버십 회원 수강 시작 - 오디오북</Text>*/}
				{/*<PaymentStatus learnType={"audioBook"} paymentType={"membershipStartLearn"}/>*/}

				{/*<Text>멤버십 회원 수강 시작 - 클래스</Text>*/}
				{/*<PaymentStatus learnType={"class"} paymentType={"membershipStartLearn"}/>*/}

				<View style={CommonStyles.alignJustifyContentBetween}>
					<View style={styles.tabContainer}>
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => {
											  this.props.store.tabStatus = 'info'
										  }}>
							<View style={styles.tabItem}>
								<Text style={this.props.store.tabStatus === 'info' ? styles.tabActiveText : styles.tabNormalText}>
									클래스정보
								</Text>
								<View style={ this.props.store.tabStatus === 'info' ? styles.tabActiveHr : styles.tabNormalHr }/>
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.tabContainer}>
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => {
											  this.props.store.tabStatus = 'list'
										  }}>
							<View style={styles.tabItem}>
								<Text style={this.props.store.tabStatus === 'list' ? styles.tabActiveText : styles.tabNormalText}>
									{this.props.learnType === 'audioBook' &&
										<Text>목차({this.props.store.itemClipData.length})</Text>
									}
									{this.props.learnType === 'class' &&
									<Text>강의목차({this.props.store.itemClipData.length})</Text>
									}
								</Text>
								<View style={ this.props.store.tabStatus === 'list' ? styles.tabActiveHr : styles.tabNormalHr }/>
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.tabContainer}>
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => {
											  this.props.store.tabStatus = 'review'
										  }}>
							<View style={styles.tabItem}>
								<Text style={ this.props.store.tabStatus === 'review' ? styles.tabActiveText : styles.tabNormalText }>
									리뷰 ({this.props.store.itemData.review_count})
								</Text>
								<View style={ this.props.store.tabStatus === 'review' ? styles.tabActiveHr : styles.tabNormalHr }/>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				{this.props.store.tabStatus === 'info' &&
				<TabContentInfo store={ this.props.store }/>
				}
				{this.props.store.tabStatus === 'list' &&
				<TabContentList/>
				}
				{this.props.store.tabStatus === 'review' &&
				<TabContentReview store={ this.props.store }/>
				}
			</ScrollView>
		</View>
	}
}

export default DetailLayout