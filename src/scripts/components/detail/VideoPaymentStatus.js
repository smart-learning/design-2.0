import { observer } from 'mobx-react';
import numeral from 'numeral';
import React from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import globalStore from '../../../scripts/commons/store';
import CommonStyles from '../../../styles/common';
import moment from 'moment';

const styles = StyleSheet.create({
  paymentContainer: {
    alignItems: 'center',
    position: 'relative',
    height: 60,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: CommonStyles.COLOR_PRIMARY
  },
  priceContainer: {
    alignItems: 'center'
  },
  priceOriginal: {
    paddingRight: 7,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  priceText: {
    position: 'relative',
    top: 2,
    fontSize: 12,
    color: '#ffffff'
  },
  rentDurationText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingLeft: 7
  },
  stateText: {
    paddingRight: 7,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  priceDiscount: {
    textDecorationLine: 'line-through',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  buttonBuy: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 40,
    backgroundColor: '#008350'
  },
  buttonBuyText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  buttonAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingRight: 15,
    paddingLeft: 15,
    backgroundColor: '#ffffff'
  },
  buttonAddImage: {
    width: 13,
    height: 15,
    marginRight: 5
  },
  buttonAddText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: CommonStyles.COLOR_PRIMARY
  },
  bulletMy: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ffffff'
  },
  bulletMyImage: {
    width: 9,
    height: 11,
    marginRight: 5
  },
  bulletMyText: {
    fontSize: 15,
    color: '#ffffff'
  },
  buyText: {
    fontSize: 13,
    color: '#ffffff'
  },
  buyTextBullet: {
    opacity: 0.2,
    paddingRight: 5,
    paddingLeft: 5
  },
  finishText: {
    paddingTop: 5,
    fontSize: 11,
    color: '#ffffff'
  }
});

@observer
export default class VideoPaymentStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  purchase() {
    Alert.alert('알림', '강좌 전편 구매는 준비중입니다.');
  }

  renderFreeVideo() {
    return (
      <View
        style={[
          CommonStyles.alignJustifyContentBetween,
          styles.paymentContainer
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

  renderRentVideo(expire_at) {
    return (
      <View
        style={[
          CommonStyles.alignJustifyContentBetween,
          styles.paymentContainer
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

  renderBuyVideo(origPrice, userPrice, rentDuration) {
    return (
      <View
        style={[
          CommonStyles.alignJustifyContentBetween,
          styles.paymentContainer
        ]}
      >
        <View>
          <View style={[CommonStyles.alignJustifyFlex, styles.priceContainer]}>
            <Text style={styles.priceOriginal}>
              ₩{numeral(userPrice).format('0,0')}
            </Text>

            {origPrice !== userPrice
              ? (userPrice > 0 || userPrice !== origPrice) && (
                  <Text style={styles.priceText}>
                    {Platform.select({
                      ios: <Text />,
                      android: (
                        <Text style={styles.priceDiscount}>
                          ₩{numeral(origPrice).format('0,0')}
                        </Text>
                      )
                    })}
                  </Text>
                )
              : undefined}

            <Text style={styles.priceText}>
              <Text style={styles.rentDurationText}>
                ({rentDuration}
                일)
              </Text>
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={this.props.addToCart}>
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
          styles.paymentContainer
        ]}
      >
        <Text style={[styles.priceText, { alignItems: 'center' }]}>
          구매 정보를 불러오는 중입니다.
        </Text>
      </View>
    );
  }

  render() {
    const { itemData, permissionLoading } = this.props;

    if (permissionLoading) {
      return this.renderPermissionLoading();
    } else {
      return (
        <View>
          <View style={{ marginTop: 5 }}>{this.renderFreeVideo()}</View>
          <View style={{ marginTop: 5 }}>
            {this.renderRentVideo('2019-07-14T01:00:00+09:00')}
          </View>
          <View style={{ marginTop: 5 }}>
            {this.renderBuyVideo(12000, 10500, 14)}
          </View>
        </View>
      );
    }
  }
}
