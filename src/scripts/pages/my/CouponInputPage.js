import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import CommonStyles from "../../../styles/common";
import { SafeAreaView } from "react-navigation";
import Net from "../../commons/net"
import globalStore from '../../commons/store'
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
    backgroundColor: '#00c73c'
  },
  couponButtonDisabled: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 40,
    backgroundColor: '#b5bfb8'
  },
  buttonRestoreText: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#ffffff'
  },
  buttonDisableText: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#eee'
  },
  infoText: {
    color: '#ababab',
    fontWeight: 'normal',
  },
});

class CouponInputPage extends React.Component {
  @observable coupon = '';
  @observable loading = false

  couponTextInput

  async componentDidMount() {
    if (!globalStore.welaaaAuth) this.props.navigation.navigate('Login');
  }

  handle() {
    // 로딩 보이기
    this.loading = true

    // 시간 한계 주기
    setTimeout(() => {
      // 10초 후에 로딩이 아직도 떠 있다면
      if (this.loading) {
        Alert.alert('오류', '관리자에게 문의 하거나 잠시 후 다시 시도해 주세요.')
        this.loading = false
      }
    }, 10000)
    this.props.onAccess(this.data.email, this.data.password, () => {
      this.loading = false
    });
  }

  registerCoupon() {
    Net.registerCoupon(this.coupon)
      .then(data => {
        // alert 후 'ok'누르면 이전 페이지로 이동
        Alert.alert('알림', data.message,
          [{ text: 'OK', onPress: () => this.props.navigation.pop() }],
        );
      })
      .catch(e => {
        // alert 후 'ok'누르면 입력해둔 coupon 번호 삭제 후 textinput focus
        Alert.alert('오류', e.message,
          [{
            text: 'OK', onPress: () => {
              this.coupon = '';
              this.couponTextInput.focus();
            }
          }],
        );
      })
  }

  render() {
    return <View style={CommonStyles.container}>

      <Spinner // 로딩 인디케이터
        visible={this.loading}
      />

      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          style={{ flex: 1 }}>
          <View style={CommonStyles.contentContainer}>
            <View style={{ height: 16 }} />
            <View style={styles.couponContainer}>
              <TextInput
                style={styles.couponInput}
                placeholder={'쿠폰번호입력'}
                onChangeText={(text) => this.coupon = text}
                value={this.coupon}
                ref={(input) => { this.couponTextInput = input }}
                autoCapitalize={'none'}
                underlineColorAndroid={'rgba(0,0,0,0)'}
                onSubmitEditing={() => this.registerCoupon()}
              />
              <TouchableOpacity
                disabled={this.coupon.trim() === ''}
                onPress={() => this.registerCoupon()}
              >
                <View
                  style={[this.coupon.trim() === ''
                    ? styles.couponButtonDisabled
                    : styles.couponButton]}
                  borderRadius={5}
                >
                  <Text
                    style={[this.coupon.trim() === ''
                      ? styles.buttonDisableText
                      : styles.buttonRestoreText]}
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
  }
}

export default observer(CouponInputPage);