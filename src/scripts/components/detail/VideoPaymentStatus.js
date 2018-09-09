import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Alert} from "react-native";
import CommonStyles from "../../../styles/common";
import {observer} from "mobx-react";
import globalStore from '../../../scripts/commons/store';

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

@observer
export default class VideoPaymentStatus extends React.Component {
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

	purchase() {
		Alert.alert('알림', '강좌 전편 구매는 준비중입니다.')
	}

	renderPriceOrExpire(membershipType) {
		return (
			<View>
				{
					(membershipType === 1 || membershipType === 2) ? (
						<View style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}>
							<Text style={styles.priceText}>
								무제한 이용 가능
							</Text>
						</View>
					) : (
						<View style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}>
							<Text style={styles.priceOriginal}>
								{/*₩{itemData.sale_price}*/}
								{/*₩200,000*/}
								₩{ this.props.itemData.orig_price }
							</Text>
						</View>
					)
				}
			</View>
		)
	}

	render() {
		let { type, type_text } = globalStore.currentMembership

		return <View>
				<View style={[ CommonStyles.alignJustifyContentBetween, styles.paymentContainer ]}>
					{ this.renderPriceOrExpire(type) }

					{ (type === 1 || type === 2) ? (
						<View style={[styles.buttonBuy, {width: 140}]} borderRadius={5}>
							<Text style={styles.buttonBuyText}>
								{ type_text}
							</Text>
						</View>

					) : (
						<TouchableOpacity
							// onPress={() => this.purchase()}
						>
							<View style={styles.buttonBuy}
								  borderRadius={5}>
								<Text style={styles.buttonBuyText}>
									구매
								</Text>
							</View>
						</TouchableOpacity>
					) }
				</View>
		</View>
	}
}