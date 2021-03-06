import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import { SafeAreaView } from 'react-navigation';
import Net from '../../commons/net';
import Util from '../../commons/util';
import globalStore from '../../commons/store';
import Spinner from 'react-native-loading-spinner-overlay';

const styles = StyleSheet.create({
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponInput: {
    flex: 0.95,
    height: 40,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  couponButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 40,
    backgroundColor: '#00c73c',
  },
  couponButtonDisabled: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 40,
    backgroundColor: '#b5bfb8',
  },
  buttonRestoreText: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#ffffff',
  },
  buttonDisableText: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#eee',
  },
  infoText: {
    color: '#ababab',
    fontWeight: 'normal',
  },
});

class CouponInputPage extends React.Component {
  @observable
  coupon = '';
  @observable
  loading = false;

  couponTextInput;

  async componentDidMount() {
    if (!globalStore.welaaaAuth) this.props.navigation.navigate('Login');
  }

  registerCoupon() {
    this.loading = true;
    Net.registerCoupon(this.coupon)
      .then(async data => {
        await Util.updateCurrentMembership();
        this.loading = false;
        Alert.alert('알림', data.msg, [
          {
            text: 'OK',
            onPress: () => {
              this.props.navigation.navigate('MyInfoHome');
            },
          },
        ]);
      })
      .catch(e => {
        this.loading = false;
        Alert.alert('오류', e.message, [
          {
            text: 'OK',
            onPress: () => {
              this.coupon = '';
              this.couponTextInput.focus();
            },
          },
        ]);
      });
  }

  render() {
    return (
      <View style={CommonStyles.container}>
        <Spinner // 로딩 인디케이터
          visible={this.loading}
        />

        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView keyboardShouldPersistTaps={'always'} style={{ flex: 1 }}>
            <View style={CommonStyles.contentContainer}>
              <View style={{ height: 16 }} />
              <View style={styles.couponContainer}>
                <TextInput
                  style={styles.couponInput}
                  placeholder={'쿠폰번호입력'}
                  onChangeText={text => (this.coupon = text)}
                  value={this.coupon}
                  ref={input => {
                    this.couponTextInput = input;
                  }}
                  autoCapitalize={'none'}
                  underlineColorAndroid={'rgba(0,0,0,0)'}
                  onSubmitEditing={() => this.registerCoupon()}
                />
                <TouchableOpacity
                  disabled={this.coupon.trim() === ''}
                  onPress={() => this.registerCoupon()}
                >
                  <View
                    style={[
                      this.coupon.trim() === ''
                        ? styles.couponButtonDisabled
                        : styles.couponButton,
                    ]}
                    borderRadius={5}
                  >
                    <Text
                      style={[
                        this.coupon.trim() === ''
                          ? styles.buttonDisableText
                          : styles.buttonRestoreText,
                      ]}
                    >
                      {'등록'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ height: 16 }} />
              <View>
                <Text style={styles.infoText}>
                  {'대소문자를 구분하지 않습니다.'}
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default observer(CouponInputPage);
