import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppEventsLogger } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import { SafeAreaView } from 'react-navigation';
import CommonStyles from '../../../styles/common';
import native from '../../commons/native';
import net from '../../commons/net';
import globalStore from '../../commons/store';
import appsFlyer from 'react-native-appsflyer';
import { CheckBox } from 'react-native-elements';

const productItem = {
  campus: {
    name: '클래스',
    ios: {
      price: '11,000원',
    },
    android: {
      price: '7,700원',
      originPrice: '30,000원',
    },
  },
  bookclub: {
    name: '오디오북',
    ios: {
      price: '9,500원',
    },
    android: {
      price: '6,600원',
      originPrice: '15,000원',
    },
  },
  premium: {
    name: '프리미엄',
    ios: {
      price: '20,500원',
    },
    android: {
      price: '14,300원',
      originPrice: '45,000원',
    },
  },
  none: {
    name: '',
    ios: {
      price: '',
    },
    android: {
      price: '',
      originPrice: '',
    },
  },
};

const styles = StyleSheet.create({
  itemInfoContainer: {
    position: 'relative',
    marginTop: 20,
  },
  itemInfoHrTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: '#EDEDED',
  },
  itemInfoHrBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: '#EDEDED',
  },
  itemInfo: {
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    backgroundColor: '#ffffff',
    borderWidth: 10,
    borderColor: '#EDEDED',
  },
  itemInfoBottom: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#00C73C',
  },
  itemMonthlyPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitleText: {
    fontSize: 16,
    color: '#353A3C',
    // marginLeft: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  itemTextTop: {
    // paddingTop: 15,
    // paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 16,
    color: '#4a4a4a',
  },
  itemTextTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a4a4a',
  },
  itemTextSm: {
    paddingTop: 3,
    fontSize: 12,
    color: '#4a4a4a',
  },
  itemTextImportant: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C73C',
  },
  itemPriceOrigin: {
    fontSize: 16,
    color: '#4a4a4a',
    textDecorationLine: 'line-through',
  },
  sectionTitleContainer: {
    marginTop: 40,
  },
  sectionHr: {
    height: 3,
    marginTop: 10,
    backgroundColor: '#d3d3d3',
  },
  formItem: {
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
  },
  formLabel: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  formLabelStar: {
    fontSize: 16,
    color: '#EA6118',
  },
  formInputContainer: {
    width: '75%',
  },
  formInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 4,
  },
  formHr: {
    width: '100%',
    height: 1,
    backgroundColor: '#efefef',
  },
  formValidityPeriod: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  validityPeriodInput: {
    width: 60,
    height: 50,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 4,
  },
  validityPeriodBullet: {
    paddingLeft: 7,
    paddingRight: 7,
    fontSize: 16,
    color: '#4a4a4a',
  },
  birthInput: {
    width: 100,
    height: 50,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 4,
  },
  genderInput: {
    width: 30,
    height: 50,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 4,
  },
  total: {
    marginTop: 20,
    marginBottom: 20,
  },
  totalHr: {
    width: '100%',
    height: 1,
    backgroundColor: '#4a4a4a',
  },
  totalContent: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4f72',
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: 60,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  checkboxContainer: {
    position: 'relative',
  },
  checkbox: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  checkBoxImage: {
    width: 17,
    height: 17,
  },
  agreeText: {
    paddingLeft: 25,
    fontSize: 12,
    color: '#626262',
  },
  ruleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    width: '100%',
    height: 40,
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  ruleButtonText: {
    fontSize: 15,
    color: '#ffffff',
  },
});

@observer
class MembershipFormPage extends React.Component {
  @observable
  formType = null;

  state = {
    submitButtonDisabled: false,
    agreeReceive: true,
    agreeReceivePayment: true,

    user_name: '',
    phone: '',
    email: '',
    card_num: '',
    expire_m: '',
    expire_y: '',
    birth: '',
    gender: '',
    card_pass: '',
    appsflyer_id: '',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.formType = this.props.navigation.state.params.type;

    /* 2019.01.16
     * 김중온
     * AppsFlyer Server-to-Server Events API 호출을 위한 appsflyer id 저장
     */
    appsFlyer.getAppsFlyerUID((error, appsFlyerUID) => {
      if (error) {
        console.error(error);
      } else {
        console.log('MembershipFormPage.js::getAppsFlyerUID: ' + appsFlyerUID);
        this.setState({ appsflyer_id: appsFlyerUID });
      }
    });
  }

  validityPeriodMonthOnFocus = () => {
    if (this.expire_m === '월') {
      this.expire_m = '';
    }
  };
  validityPeriodYearOnFocus = () => {
    if (this.expire_y === '년') {
      this.expire_y = '';
    }
  };
  birthOnFocus = () => {
    if (this.birth === 'YYMMDD') {
      this.birth = '';
    }
  };

  // agreeStatus = () => {
  // 	if (this.isAgree === false) {
  // 		this.isAgree = true;
  // 	} else {
  // 		this.isAgree = false;
  // 	}
  // };

  onSubmit = async () => {
    // TODO
    // validation
    this.setState({ submitButtonDisabled: true });

    const payload = {
      ...this.state,
      membership: this.formType,
    };
    delete payload.submitButtonDisabled;
    console.log(payload);

    try {
      const data = await net.registerMembership(payload);

      // 결제 완료 후 바우처 상태 갱신
      globalStore.voucherStatus = await net.getVouchersStatus();

      // register 성공
      // 결제 요청 완료에 멤버십 데이터로 갱신
      if (data && data.membership)
        globalStore.currentMembership = data.membership;
      this.setState({ submitButtonDisabled: false });

      AppEventsLogger.logEvent(
        'WELAAARN_MEMBERSHIP_REGISTER_' + globalStore.currentMembership,
      );

      // 2018.10.29 facebook event: 마케팅 요청.
      const NativeConstants = native.getConstants();
      const EVENT_NAME_INITIATED_CHECKOUT =
        NativeConstants.EVENT_NAME_INITIATED_CHECKOUT;
      const EVENT_PARAM_CONTENT = NativeConstants.EVENT_PARAM_CONTENT;
      const EVENT_PARAM_CONTENT_ID = NativeConstants.EVENT_PARAM_CONTENT_ID;
      const EVENT_PARAM_CONTENT_TYPE = NativeConstants.EVENT_PARAM_CONTENT_TYPE;
      const EVENT_PARAM_NUM_ITEMS = NativeConstants.EVENT_PARAM_NUM_ITEMS;
      const EVENT_PARAM_PAYMENT_INFO_AVAILABLE =
        NativeConstants.EVENT_PARAM_PAYMENT_INFO_AVAILABLE;
      const EVENT_PARAM_CURRENCY = NativeConstants.EVENT_PARAM_CURRENCY;
      const { params } = this.props.navigation.state;
      const product = productItem[params.type || 'none'];
      var price = 0;
      if ('android' === Platform.OS) {
        price = product.android.price;
      } else if ('ios' === Platform.OS) {
        price = product.ios.price;
      }
      AppEventsLogger.logEvent(EVENT_NAME_INITIATED_CHECKOUT, price, {
        [EVENT_PARAM_CONTENT]: params.title,
        [EVENT_PARAM_CONTENT_ID]: 'membership',
        [EVENT_PARAM_CONTENT_TYPE]: params.type,
        [EVENT_PARAM_NUM_ITEMS]: 1,
        [EVENT_PARAM_PAYMENT_INFO_AVAILABLE]: 0,
        [EVENT_PARAM_CURRENCY]: 'KRW',
      });

      firebase.analytics().logEvent('EVENT_NAME_INITIATED_CHECKOUT', {
        EVENT_PARAM_CONTENT: params.title,
        EVENT_PARAM_CONTENT_ID: 'membership',
        EVENT_PARAM_CONTENT_TYPE: params.type,
        EVENT_PARAM_NUM_ITEMS: 1,
        EVENT_PARAM_PAYMENT_INFO_AVAILABLE: 0,
        EVENT_PARAM_CURRENCY: 'KRW',
        OS_TYPE: Platform.OS,
      });

      // 2018.12.11 appsFlyer 마케팅 요청
      const eventName = 'af_initiated_checkout';
      const eventValues = {
        af_content_type: params.type,
        OS_TYPE: Platform.OS,
      };

      appsFlyer.trackEvent(
        eventName,
        eventValues,
        result => {
          console.log('appsFlyer.trackEvent', result);
        },
        error => {
          console.error('appsFlyer.trackEvent error ', error);
        },
      );

      // 멤버쉽 화면으로 이동.
      // this.props.navigation.goBack();
      // 2018. 11. 12. jungon
      if (this.formType === 'bookclub') {
        // 오디오북 멤버쉽 -> 오디오북 메인 페이지
        this.props.navigation.navigate('HomeScreen', {
          page: 'audioBook',
          popup_mbs: true,
        });
      } else {
        // 클래스 멤버쉽, 프리미엄 멤버쉽 -> 클래스 메인 페이지
        this.props.navigation.navigate('HomeScreen', { popup_mbs: true });
      }
    } catch (e) {
      // register 실패 (axios response not 200)
      console.log(e);
      this.setState({ submitButtonDisabled: false });
      Alert.alert('오류', '입력정보를 확인해 주세요.');
    }
  };

  render() {
    const data = productItem[this.formType || 'none'];
    const {
      user_name,
      phone,
      email,
      card_num,
      expire_m,
      expire_y,
      birth,
      gender,
      card_pass,
      isAgree,
    } = this.state;

    return (
      <SafeAreaView
        style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}
      >
        <ScrollView
          style={{ width: '100%' }}
          keyboardShouldPersistTaps="always"
        >
          <View style={CommonStyles.contentContainer}>

            <View>
              <Text style={styles.itemTextTitle}>
                첫 달 무료 고객은 무료기간 이후부터 결제되며, 무료기간 중 해지 가능합니다.

                  </Text>
            </View>

            <View style={styles.itemInfoContainer}>
              <View style={styles.itemInfo}>
                <View>
                  <Text style={styles.itemTextTop}>
                    가입 멤버십 :{'  '}
                    <Text style={styles.itemTextImportant}>
                      {data.name} 멤버십
                    </Text>
                  </Text>
                  <Text style={styles.itemTextTop}>
                    멤버십 혜택 :{'  '}

                    {this.formType === 'campus' && (
                      <Text style={styles.itemTextTop}>
                        1,000여개의 동영상 강좌 무제한 이용!
                      </Text>
                    )}
                    {this.formType === 'bookclub' && (
                      <Text style={styles.itemTextTop}>
                        최신작 포함 전체 오디오북 중 2권 선택! 이용권 미사용시 무한 이월 가능!
                    </Text>
                    )}
                    {this.formType === 'premium' && (
                      <Text style={styles.itemTextTop}>
                        1000여개의 클래스 무제한 이용 + 최신작 포함 오디오북 2권 선택가능
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.itemInfoHrTop} />
              <View style={styles.itemInfoHrBottom} />
            </View>

            <View>
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.formItem,
                ]}
              >
                <Text style={styles.formLabel}>이름<Text style={styles.formLabelStar}>*</Text></Text>
                <View style={styles.formInputContainer}>
                  <TextInput
                    style={styles.formInput}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    value={user_name}
                    onChangeText={user_name => {
                      this.setState({ user_name });
                    }}
                  />
                </View>
              </View>
              {/* <View style={styles.formHr} /> */}
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.formItem,
                ]}
              >
                <Text style={styles.formLabel}>이메일<Text style={styles.formLabelStar}>*</Text></Text>
                <View style={styles.formInputContainer}>
                  <TextInput
                    style={styles.formInput}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    value={email}
                    onChangeText={email => {
                      this.setState({ email });
                    }}
                  />
                </View>
              </View>

              {/* <View style={styles.formHr} /> */}
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.formItem,
                ]}
              >
                <Text style={styles.formLabel}>휴대폰<Text style={styles.formLabelStar}>*</Text></Text>
                <View style={styles.formInputContainer}>
                  <TextInput
                    style={styles.formInput}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    keyboardType={'numeric'}
                    value={phone}
                    onChangeText={phone => {
                      this.setState({ phone });
                    }}
                  />
                </View>
              </View>
            </View>


            <View>
              <Text style={styles.itemText}>* 아래 카드정보를 입력하셔도, 바로 결제되지 않습니다.
              {'\n'}* 첫 달 무료 체험기간 이후부터 자동결제가 시작되며, 언제든 해지가 가능합니다.</Text>
            </View>

            <View>
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.formItem,
                ]}
              >
                <Text style={styles.formLabel}>카드번호<Text style={styles.formLabelStar}>*</Text></Text>
                <View style={styles.formInputContainer}>
                  <TextInput
                    style={styles.formInput}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    keyboardType={'numeric'}
                    value={card_num}
                    onChangeText={card_num => {
                      this.setState({ card_num });
                    }}
                  />
                  {/* <Text style={styles.itemTextSm}>'-'없이 기재해주세요.</Text> */}
                </View>
              </View>
              {/* <View style={styles.formHr} /> */}
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.formItem,
                ]}
              >
                <Text style={styles.formLabel}>유효기간<Text style={styles.formLabelStar}>*</Text></Text>
                <View style={styles.formInputContainer}>
                  <View style={styles.formValidityPeriod}>
                    <TextInput
                      style={styles.validityPeriodInput}
                      underlineColorAndroid={'rgba(0,0,0,0)'}
                      onFocus={this.validityPeriodMonthOnFocus}
                      placeholder="월"
                      keyboardType={'numeric'}
                      value={expire_m}
                      onChangeText={expire_m => {
                        this.setState({ expire_m });
                      }}
                    />
                    <Text style={styles.validityPeriodBullet}>/</Text>
                    <TextInput
                      style={styles.validityPeriodInput}
                      underlineColorAndroid={'rgba(0,0,0,0)'}
                      onFocus={this.validityPeriodYearOnFocus}
                      placeholder="년"
                      keyboardType={'numeric'}
                      value={expire_y}
                      onChangeText={expire_y => {
                        this.setState({ expire_y });
                      }}
                    />
                  </View>
                </View>
              </View>
              {/* <View style={styles.formHr} /> */}
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.formItem,
                ]}
              >
                <Text style={styles.formLabel}>주민번호{'\n'}사업자번호<Text style={styles.formLabelStar}>*</Text></Text>
                <View style={styles.formInputContainer}>
                  <View style={styles.formValidityPeriod}>
                    <TextInput
                      style={styles.birthInput}
                      underlineColorAndroid={'rgba(0,0,0,0)'}
                      onFocus={this.birthOnFocus}
                      keyboardType={'numeric'}
                      placeholder="YYMMDD"
                      value={birth}
                      onChangeText={birth => {
                        this.setState({ birth });
                      }}
                    />
                    <Text style={styles.validityPeriodBullet}>-</Text>
                    <TextInput
                      style={styles.genderInput}
                      underlineColorAndroid={'rgba(0,0,0,0)'}
                      keyboardType={'numeric'}
                      value={gender}
                      onChangeText={gender => {
                        this.setState({ gender });
                      }}
                    />
                    <Text style={styles.validityPeriodBullet}>******</Text>
                  </View>
                </View>
              </View>
              {/* <View style={styles.formHr} /> */}
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.formItem,
                ]}
              >
                <Text style={styles.formLabel}>비밀번호{'\n'}앞 두자리<Text style={styles.formLabelStar}>*</Text></Text>
                <View style={styles.formInputContainer}>
                  <View style={styles.formValidityPeriod}>
                    <TextInput
                      style={styles.validityPeriodInput}
                      underlineColorAndroid={'rgba(0,0,0,0)'}
                      secureTextEntry={true}
                      keyboardType={'numeric'}
                      value={card_pass}
                      onChangeText={card_pass => {
                        this.setState({ card_pass });
                      }}
                    />
                    <Text style={styles.validityPeriodBullet}>**</Text>
                  </View>
                </View>
              </View>
              {/* <View style={styles.formHr} /> */}
            </View>

            <View style={styles.itemInfoContainer}>
              <View style={styles.itemInfoBottom}>
                <View>
                  <Text style={styles.itemTextImportant}>
                    한 달 무료체험 이후
                  </Text>
                  <View style={styles.itemMonthlyPrice}>
                    <Text style={styles.itemText}>매월</Text>
                    <View>
                      <View>
                        {Platform.select({
                          ios: (
                            <Text style={styles.itemTextImportant}>
                              {' '}
                              {data.ios.price}{' '}
                            </Text>
                          ),
                          android: (
                            <Text>
                              <Text style={styles.itemPriceOrigin}>
                                {data.android.originPrice}
                              </Text>
                              <Text style={styles.itemTextImportant}>
                                {' '}
                                {data.android.price}{' '}
                              </Text>
                            </Text>
                          ),
                        })}
                      </View>
                    </View>
                    <Text style={styles.itemText}> 자동결제 예정</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.total}>
              {/* <View style={styles.totalHr} />
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.totalContent,
                ]}
              >
                <Text style={styles.itemText}>총 결제 예정금액</Text>
                {this.formType === 'campus' && (
                  <View>
                    {Platform.select({
                      ios: <Text style={styles.totalPrice}>11,000 </Text>,
                      android: (
                        <Text style={styles.totalPrice}>
                          7,700 <Text style={styles.itemText}>원</Text>
                        </Text>
                      ),
                    })}
                  </View>
                )}
                {this.formType === 'bookclub' && (
                  <View>
                    {Platform.select({
                      ios: <Text style={styles.totalPrice}>9,500 </Text>,
                      android: (
                        <Text style={styles.totalPrice}>
                          6,600 <Text style={styles.itemText}>원</Text>
                        </Text>
                      ),
                    })}
                  </View>
                )}
                {this.formType === 'premium' && (
                  <View>
                    {Platform.select({
                      ios: <Text style={styles.totalPrice}>20,500 </Text>,
                      android: (
                        <Text style={styles.totalPrice}>
                          14,300 <Text style={styles.itemText}>원</Text>
                        </Text>
                      ),
                    })}
                  </View>
                )}
              </View> */}
              {/* <View style={styles.totalHr} /> */}

              <CheckBox
                title="윌라 이용약관 및 개인정보보호정책에 동의합니다."
                checked={this.state.agreeReceive}
                onPress={() =>
                  this.setState(previousState => ({
                    agreeReceive: !previousState.agreeReceive,
                  }))
                }
                textStyle={[
                  styles.agreeReceiveMarketingStyle,
                  { textAlign: 'left' },
                ]}
                containerStyle={{
                  backgroundColor: '#0000',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 0,
                  borderWidth: 0,
                }}
              />
              <CheckBox
                title="위 입력정보를 결제 서비스 업체에 제공하는데 동의합니다. 본 정보는 멤버십 가입 목적으로만 사용됩니다."
                checked={this.state.agreeReceivePayment}
                onPress={() =>
                  this.setState(previousState => ({
                    agreeReceivePayment: !previousState.agreeReceivePayment,
                  }))
                }
                textStyle={[
                  styles.agreeReceiveMarketingStyle,
                  { textAlign: 'left' },
                ]}
                containerStyle={{
                  backgroundColor: '#0000',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 0,
                  borderWidth: 0,
                }}
              />
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.itemText}>* 멤버십 변경 등 이용문의는 [마이윌라] - [1:1문의]로 문의 부탁드립니다.</Text>
              </View>

              <View>
                <TouchableOpacity
                  onPress={this.onSubmit}
                  disabled={this.state.submitButtonDisabled}
                >
                  <View style={styles.ruleButton} borderRadius={40}>
                    <Text style={styles.ruleButtonText}>
                      {this.state.submitButtonDisabled ? '처리중' : '멤버십 시작하기'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/*<View style={styles.checkboxContainer}>*/}
            {/*<TouchableOpacity onPress={this.agreeStatus}>*/}
            {/*<View style={styles.checkbox}>*/}
            {/*{this.isAgree === true &&*/}
            {/*<Image source={BulletBoxChecked} style={styles.checkBoxImage}/>*/}
            {/*}*/}
            {/*{this.isAgree === false &&*/}
            {/*<Image source={BulletBoxCheck} style={styles.checkBoxImage}/>*/}
            {/*}*/}
            {/*<View>*/}
            {/*<Text style={styles.agreeText}>매월 정기결제 되는 것에 동의합니다.</Text>*/}
            {/*<Text style={styles.agreeText}>정기결제는 마이윌라 설정에서 언제든지 해지가 가능합니다.</Text>*/}
            {/*</View>*/}
            {/*</View>*/}
            {/*</TouchableOpacity>*/}
            {/*</View>*/}

            {/*<TouchableOpacity activeOpacity={0.9}>*/}
            {/*<View style={styles.submitButton}>*/}
            {/*<Text style={styles.submitButtonText}>결제하기</Text>*/}
            {/*</View>*/}
            {/*</TouchableOpacity>*/}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default MembershipFormPage;
