import React from 'react';
import moment from 'moment';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import globalStore from '../../../scripts/commons/store';
import CommonStyles from '../../../styles/common';
import numeral from 'numeral';

const styles = StyleSheet.create({
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
  stateText: {
    paddingRight: 7,
    fontSize: 15,
    fontWeight: 'bold',
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
  membershipDescText: {
    fontSize: 13,
    color: '#ffffff',
  },
});

export default class AudiobookPaymentStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  useVoucher = () => {};

  renderFreeContent() {
    return (
      <View
        style={[
          CommonStyles.alignJustifyContentBetween,
          styles.paymentContainer,
        ]}
      >
        <View>
          <View style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}>
            <Text style={styles.priceOriginal}>₩0</Text>
          </View>
        </View>

        <View>
          <View style={styles.buttonBuy} borderRadius={5}>
            <Text style={styles.buttonBuyText}>무료</Text>
          </View>
        </View>
      </View>
    );
  }

  renderUserHaveMembership() {
    return (
      <View
        style={[
          CommonStyles.alignJustifyContentBetween,
          styles.paymentContainer,
        ]}
      >
        <View>
          <View style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}>
            <Text style={styles.membershipDescText}>무제한 시청</Text>
          </View>
        </View>

        <View>
          <View
            style={[
              styles.buttonBuy,
              { width: 'auto', alignSelf: 'flex-start', paddingHorizontal: 12 },
            ]}
            borderRadius={5}
          >
            <Text style={styles.buttonBuyText}>
              {globalStore.currentMembership.type_text}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  renderUserOwned() {
    return (
      <View
        style={[
          CommonStyles.alignJustifyContentBetween,
          styles.paymentContainer,
        ]}
      >
        <View>
          <View style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}>
            <Text style={styles.stateText}>영구소장</Text>
          </View>
        </View>
        <View>
          <View style={styles.buttonBuy} borderRadius={5}>
            <Text style={styles.buttonBuyText}>소장중</Text>
          </View>
        </View>
      </View>
    );
  }

  renderUserRent(expire_at) {
    return (
      <View
        style={[
          CommonStyles.alignJustifyContentBetween,
          styles.paymentContainer,
        ]}
      >
        <View>
          <View style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}>
            <Text style={styles.stateText}>
              {moment(expire_at).format('YYYY/MM/DD')} 만료
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.buttonBuy} borderRadius={5}>
            <Text style={styles.buttonBuyText}>소장중</Text>
          </View>
        </View>
      </View>
    );
  }

  renderUserCanUseVoucher(origPrice, userPrice, iosPrice) {
    return (
      <View
        style={[
          CommonStyles.alignJustifyContentBetween,
          styles.paymentContainer,
        ]}
      >
        {Platform.select({
          ios: (
            <View>
              <View
                style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}
              >
                <Text style={styles.priceOriginal}>
                  ₩{numeral(iosPrice).format('0,0')}
                </Text>
              </View>
            </View>
          ),
          android: (
            <View>
              <View
                style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}
              >
                <Text style={styles.priceOriginal}>
                  ₩{numeral(userPrice).format('0,0')}
                </Text>

                {origPrice !== userPrice
                  ? (userPrice > 0 || userPrice !== origPrice) && (
                      <Text style={styles.priceText}>
                        <Text style={styles.priceDiscount}>
                          ₩{numeral(origPrice).format('0,0')}
                        </Text>
                      </Text>
                    )
                  : undefined}
              </View>
            </View>
          ),
        })}

        <View>
          <TouchableOpacity onPress={this.props.useVoucher}>
            <View style={[styles.buttonBuy, { width: 120 }]} borderRadius={5}>
              <Text style={styles.buttonBuyText}>이용권 사용</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderUserCanBuy(origPrice, userPrice, iosPrice) {
    return (
      <View
        style={[
          CommonStyles.alignJustifyContentBetween,
          styles.paymentContainer,
        ]}
      >
        <View>
          {Platform.select({
            ios: (
              <View
                style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}
              >
                <Text style={styles.priceOriginal}>
                  ₩{numeral(iosPrice).format('0,0')}
                </Text>
              </View>
            ),
            android: (
              <View
                style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}
              >
                <Text style={styles.priceOriginal}>
                  ₩{numeral(userPrice).format('0,0')}
                </Text>

                {origPrice !== userPrice
                  ? (userPrice > 0 || userPrice !== origPrice) && (
                      <Text style={styles.priceText}>
                        <Text style={styles.priceDiscount}>
                          ₩{numeral(origPrice).format('0,0')}
                        </Text>
                      </Text>
                    )
                  : undefined}
              </View>
            ),
          })}
        </View>
        <View>
          <TouchableOpacity
            onPress={
              Platform.os === 'ios' ? this.props.iosBuy : this.props.addToCart
            }
          >
            <View style={styles.buttonBuy} borderRadius={5}>
              <Text style={styles.buttonBuyText}>구매</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderPermissionLoading() {
    return (
      <View
        style={[
          CommonStyles.alignJustifyContentBetween,
          styles.paymentContainer,
        ]}
      >
        <Text style={[styles.priceText, { alignItems: 'center' }]}>
          구매 정보를 불러오는 중입니다.
        </Text>
      </View>
    );
  }

  render() {
    const { permission, permissionLoading } = this.props;
    const {
      orig_price: origPrice,
      user_price: userPrice,
      ios_price: iosPrice,
      expire_at: expireAt,
    } = permission;
    console.log('permission', permission);

    if (permissionLoading) {
      return this.renderPermissionLoading();
    } else {
      return (
        <View>
          {permission.type === 'free' && this.renderFreeContent()}
          {permission.type === 'membership' && this.renderUserHaveMembership()}
          {permission.type === 'owned' && this.renderUserOwned()}
          {permission.type === 'rental' && this.renderUserRent(expireAt)}
          {permission.type === 'can_use_voucher' &&
            this.renderUserCanUseVoucher(origPrice, userPrice, iosPrice)}
          {permission.type === 'can_buy' &&
            this.renderUserCanBuy(origPrice, userPrice, iosPrice)}
        </View>
      );
    }
  }
}
