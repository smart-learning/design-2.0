import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image, } from "react-native";
import CommonStyles from "../../../styles/common";
import icCheckPrimary from "../../../images/ic-class-check-primary.png";
import icCheckWhite from "../../../images/ic-class-check-white.png";

const styles = StyleSheet.create( {
	paymentContainer: {
		alignItems: 'center',
		position: 'relative',
		height: 60,
		paddingRight: 20,
		paddingLeft: 20,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	priceContainer: {
		alignItems: 'center',
	},
	priceOriginal: {
		paddingRight: 7,
		fontSize: 25,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	priceText: {
		position: 'relative',
		top: 2,
		fontSize: 12,
		color: '#ffffff',
	},
	priceDiscount: {
		textDecorationLine: 'line-through',
		fontSize: 15,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	buttonBuy: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 80,
		height: 40,
		backgroundColor: '#008350',
	},
	buttonBuyText: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	buttonAdd: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 40,
		paddingRight: 15,
		paddingLeft: 15,
		backgroundColor: '#ffffff',
	},
	buttonAddImage: {
		width: 13,
		height: 15,
		marginRight: 5,
	},
	buttonAddText: {
		fontSize: 15,
		fontWeight: 'bold',
		color: CommonStyles.COLOR_PRIMARY,
	},
	bulletMy: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 30,
		paddingRight: 10,
		paddingLeft: 10,
		marginRight: 10,
		borderWidth: 1,
		borderColor: '#ffffff',
	},
	bulletMyImage: {
		width: 9,
		height: 11,
		marginRight: 5,
	},
	bulletMyText: {
		fontSize: 15,
		color: '#ffffff',
	},
	buyText: {
		fontSize: 13,
		color: '#ffffff',
	},
	buyTextBullet: {
		opacity: 0.2,
		paddingRight: 5,
		paddingLeft: 5,
	},
	finishText: {
		paddingTop: 5,
		fontSize: 11,
		color: '#ffffff',
	},
} );

export default class PaymentStatus extends React.Component {
	constructor( props ) {
		super( props );

		this.learnType = this.learnType.bind(this);
	}

	learnType() {
		if( this.props.learnType === 'audioBook' ) {
			return '오디오북';
		} else if( this.props.learnType === 'class' ) {
			return '클래스';
		} else {
			return '';
		}
	}

	render() {
		return <View>
			{this.props.paymentType === 'normal' &&
			// 구매 전
			<View style={[ CommonStyles.alignJustifyContentBetween, styles.paymentContainer ]}>
				<View>
					<View style={[ CommonStyles.alignJustifyFlex, styles.priceContainer ]}>
						<Text style={styles.priceOriginal}>
							₩00,000
						</Text>
						<Text style={styles.priceText}>
							<Text style={styles.priceDiscount}>30,000</Text> (00일)
						</Text>
					</View>
				</View>
				<TouchableOpacity>
					<View style={styles.buttonBuy} borderRadius={5}>
						<Text style={styles.buttonBuyText}>구매</Text>
					</View>
				</TouchableOpacity>
			</View>
			}
			{this.props.paymentType !== 'normal' &&
			<View style={ this.props.paymentType === 'membershipBeforeLearn' ? [ CommonStyles.alignJustifyContentBetween, styles.paymentContainer ] : [ CommonStyles.alignJustifyFlex, styles.paymentContainer ]}>
				<View>
					{( this.props.paymentType === 'buy' || this.props.paymentType === 'membershipStartLearn' ) &&
					// 구매후
					<View style={styles.bulletMy} borderRadius={15}>
						<Image source={icCheckWhite} style={styles.bulletMyImage}/>
						<Text style={styles.bulletMyText}>마이 {this.learnType()}</Text>
					</View>
					}
					{this.props.paymentType === 'membershipBeforeLearn' &&
					// 멤버십 수강 전
					<Text style={styles.priceOriginal}>
						₩00,000
					</Text>
					}
				</View>
				<View>
					{this.props.paymentType === 'membershipBeforeLearn' &&
					<TouchableOpacity>
						<View style={styles.buttonAdd} borderRadius={5}>
							<Image source={icCheckPrimary} style={styles.buttonAddImage}/>
							<Text style={styles.buttonAddText}>마이 {this.learnType()} 등록</Text>
						</View>
					</TouchableOpacity>
					}
					{this.props.paymentType === 'buy' &&
					// 일반 회원 구매 후
						<View>
							<Text style={styles.buyText}>00% 학습 <Text style={styles.buyTextBullet}>|</Text> 남은시간 00분</Text>
							<Text style={styles.finishText}>0000-00-00 만료</Text>
						</View>
					}
					{this.props.paymentType === 'membershipStartLearn' &&
					// 멤버십 회원 수강 시작
						<Text style={styles.buyText}>00% 학습 <Text style={styles.buyTextBullet}>|</Text> 남은시간 00분</Text>
					}
				</View>
			</View>
			}
		</View>
	}
}