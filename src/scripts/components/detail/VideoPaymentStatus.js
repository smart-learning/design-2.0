import { observer } from 'mobx-react';
import numeral from 'numeral';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import globalStore from '../../../scripts/commons/store';
import CommonStyles from '../../../styles/common';
import moment from 'moment';

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingLeft: 25,
    paddingRight: 20,
  },
  originPriceText: {
    textDecorationLine: 'line-through',
    fontSize: 17,
    color: '#919191',
  },
  labelText: {
    fontSize: 14,
    color: '#919191',
  },
  paymentText: {
    fontSize: 23,
    fontWeight: '400',
    color: '#000000',
  },
  durationText: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#767B80',
  },
  infoText: {
    fontSize: 14,
    color: CommonStyles.COLOR_PRIMARY,
  },
  buttonItem: {
    width: 80,
    height: 25,
    marginTop: 28,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonItemDisabled: {
    borderColor: '#C7C7C7',
  },
  buttonItemActive: {
    borderColor: CommonStyles.COLOR_PRIMARY,
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '400',
  },
  buttonTextDisabled: {
    color: '#ACACAC',
  },
  buttonTextActive: {
    color: '#ffffff',
  },
});

@observer
export default class VideoPaymentStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  renderFreeContent() {
    return (
      <View style={[CommonStyles.alignJustifyFlex, styles.contentContainer]}>
        <View>
          <View style={{ height: 22 }} />
          <View>
            <Text style={styles.paymentText}>₩0</Text>
          </View>
        </View>
        <View style={{ marginLeft: 'auto' }}>
          <View style={CommonStyles.alignJustifyFlex}>
            <TouchableOpacity activeOpacity={0.9}>
              <View style={[styles.buttonItem, styles.buttonItemActive]}>
                <Text style={[styles.buttonText, styles.buttonTextActive]}>
                  무료
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderUserHaveMembership() {
    return (
      <View style={[CommonStyles.alignJustifyFlex, styles.contentContainer]}>
        <View>
          <View>
            <Text style={styles.paymentText}>무제한 시청</Text>
          </View>
        </View>
        <View style={{ marginLeft: 'auto' }}>
          <View style={CommonStyles.alignJustifyFlex}>
            <TouchableOpacity activeOpacity={0.9}>
              <View style={[styles.buttonItem, styles.buttonItemActive]}>
                <Text style={[styles.buttonText, styles.buttonTextActive]}>
                  {globalStore.currentMembership.type_text}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderUserOwned() {
    return (
      <View style={[CommonStyles.alignJustifyFlex, styles.contentContainer]}>
        <View>
          <View>
            <Text style={styles.paymentText}>영구소장</Text>
          </View>
        </View>
        <View style={{ marginLeft: 'auto' }}>
          <View style={CommonStyles.alignJustifyFlex}>
            <TouchableOpacity activeOpacity={0.9}>
              <View style={[styles.buttonItem, styles.buttonItemActive]}>
                <Text style={[styles.buttonText, styles.buttonTextActive]}>
                  소장중
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderUserRent(expire_at) {
    return (
      <View style={[CommonStyles.alignJustifyFlex, styles.contentContainer]}>
        <View>
          <View style={{ height: 22 }}>
            <Text style={styles.labelText}>이용 가능 기간</Text>
          </View>
          <View>
            <Text style={styles.paymentText}>
              {moment(expire_at).format('YYYY년 MM월 DD일')}
            </Text>
          </View>
        </View>
        <View style={{ marginLeft: 'auto' }}>
          <View style={CommonStyles.alignJustifyFlex}>
            <TouchableOpacity activeOpacity={0.9}>
              <View style={[styles.buttonItem, styles.buttonTextDisabled]}>
                <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
                  소장중
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderUserCanBuy(origPrice, userPrice, rentDuration) {
    if (Platform.OS === 'ios') {
      return null;
    }

    return (
      <View style={[CommonStyles.alignJustifyFlex, styles.contentContainer]}>
        <View>
          <View style={{ height: 22 }}>
            {origPrice !== userPrice
              ? (userPrice > 0 || userPrice !== origPrice) && (
                  <Text style={styles.originPriceText}>
                    ₩{numeral(origPrice).format('0,0')}
                  </Text>
                )
              : undefined}
          </View>
          <View>
            <Text style={styles.paymentText}>
              ₩{numeral(userPrice).format('0,0')}
              <Text style={styles.durationText}>/{rentDuration}일</Text>
            </Text>
          </View>
        </View>
        <View style={{ marginLeft: 'auto' }}>
          <View style={CommonStyles.alignJustifyFlex}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={this.props.addToCart}
            >
              <View style={[styles.buttonItem, styles.buttonItemActive]}>
                <Text style={[styles.buttonText, styles.buttonTextActive]}>
                  구매
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderPermissionLoading() {
    return (
      <View style={[CommonStyles.alignJustifyFlex, styles.contentContainer]}>
        <Text style={styles.paymentText}>구매 정보를 불러오는 중입니다.</Text>
      </View>
    );
  }

  render() {
    const { permission, permissionLoading } = this.props;
    const {
      orig_price: origPrice,
      user_price: userPrice,
      expire_at: expireAt,
      rental_period: rentalPeriod,
    } = permission;

    if (permissionLoading) {
      return this.renderPermissionLoading();
    } else {
      return (
        <View>
          {permission.type === 'free' && this.renderFreeContent()}
          {permission.type === 'membership' && this.renderUserHaveMembership()}
          {permission.type === 'owned' && this.renderUserOwned()}
          {permission.type === 'rental' && this.renderUserRent(expireAt)}
          {permission.type === 'can_buy' &&
            this.renderUserCanBuy(origPrice, userPrice, rentalPeriod)}
        </View>
      );
    }
  }
}
