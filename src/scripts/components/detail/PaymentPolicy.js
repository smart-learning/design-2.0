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

export default class PaymentPolicy extends React.Component {
  render() {
    console.log('this.props.itemData', this.props.itemData);
    return (
      <View style={[CommonStyles.alignJustifyFlex, styles.contentContainer]}>
        <View>
          <View style={{ height: 22 }}>
            {/*<Text style={styles.originPriceText}>₩10,000</Text>*/}
            <Text style={styles.labelText}>이용 가능 기간</Text>
          </View>
          <View>
            <Text style={styles.paymentText}>
              ₩10,000
              <Text style={styles.durationText}>/00일</Text>
            </Text>
            {/*<Text style={styles.paymentText}>0000년 00월 00일</Text>*/}
            {/*<Text style={styles.paymentText}>무료! 마음껏 이용 :)</Text>*/}
            <Text style={styles.paymentText}>소장중</Text>
            <Text style={styles.paymentText}>클래스 멤버십 전용</Text>
          </View>
          <View>
            <Text style={styles.infoText}>별도 구매가 필요합니다</Text>
          </View>
        </View>
        <View style={{ marginLeft: 'auto' }}>
          <View style={CommonStyles.alignJustifyFlex}>
            <TouchableOpacity activeOpacity={0.9}>
              <View style={[styles.buttonItem, styles.buttonTextDisabled]}>
                <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
                  다운로드
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9}>
              <View style={[styles.buttonItem, styles.buttonItemActive]}>
                <Text style={[styles.buttonText, styles.buttonTextActive]}>
                  구매
                </Text>
              </View>
            </TouchableOpacity>
            {/*<TouchableOpacity activeOpacity={0.9}>*/}
            {/*<View style={[styles.buttonItem, styles.buttonItemActive]}>*/}
            {/*<Text style={[styles.buttonText, styles.buttonTextActive]}>*/}
            {/*이용권 사용*/}
            {/*</Text>*/}
            {/*</View>*/}
            {/*</TouchableOpacity>*/}
          </View>
        </View>
      </View>
    );
  }
}
