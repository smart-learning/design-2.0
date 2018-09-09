import React from "react";
import {StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import CommonStyles from "../../../styles/common";

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

	componentWillReceiveProps(props) {
		console.log('PaymentStatus.js', props.store)
	}

	renderPriceOrExpire(itemData, paymentType, expire) {
		// 3: 소장중
		return (
			<View>
				{
					paymentType === 3 ? (
						<View style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}>
							<Text style={styles.priceText}>
								{expire}
							</Text>
						</View>
					) : (
						<View style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}>
							<Text style={styles.priceOriginal}>
								₩{itemData.sale_price}
							</Text>
							{
								(itemData.sale_price > 0 || itemData.sale_price !== itemData.orig_price) &&
								<Text style={styles.priceText}>
									<Text style={styles.priceDiscount}>₩{itemData.orig_price}</Text>
								</Text>
							}
						</View>
					)
				}
			</View>
		)
	}

	render() {
		const { paymentType, expire, itemData, permissionLoading } = this.props

		return <View>

			{ permissionLoading ? (
				<View style={[ CommonStyles.alignJustifyContentBetween, styles.paymentContainer ]}>
                    <Text style={[styles.priceText, {alignItems: 'center'}]}>구매 정보를 로딩 중입니다.</Text>
				</View>
			) : (
				<View style={[ CommonStyles.alignJustifyContentBetween, styles.paymentContainer ]}>
					{ this.renderPriceOrExpire(itemData, paymentType, expire) }

					{/* paymentType: 0, // 0 무료, 1 구매, 2 이용권 사용, 3 소장중 */}
					{(paymentType === 1 || paymentType === 2)
						? (
							<TouchableOpacity
								onPress={() => this.props.purchase(paymentType)}
							>
								<View style={[styles.buttonBuy, {width: paymentType === 2 ? 120 : 80}]}
									  borderRadius={5}>
									<Text style={styles.buttonBuyText}>
										{paymentType === 2 ? '이용권 사용' : '구매'}
									</Text>
								</View>
							</TouchableOpacity>
						)
						: (
							<View style={styles.buttonBuy} borderRadius={5}>
								<Text style={styles.buttonBuyText}>
									{paymentType === 0 ? '무료' : '소장중'}
								</Text>
							</View>
						)
					}
				</View>
			) }

		</View>
	}
}