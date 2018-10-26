import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { AppEventsLogger } from 'react-native-fbsdk';
import Swiper from 'react-native-swiper';
import bgSignUp from '../../../images/bg-join.png';
import logo from '../../../images/logo-en-primary.png';
import CommonStyles, { COLOR_PRIMARY } from '../../../styles/common';
import Net from '../../commons/net';
import store from '../../commons/store';

const styles = StyleSheet.create({
  landingContainer: {
    position: 'relative'
  },
  background: {
    width: '100%',
    height: '100%',
    paddingTop: 50
  },
  logoWrap: {
    alignItems: 'center',
    height: 50,
    marginTop: 0,
    marginBottom: 20
  },
  logo: {
    width: 88,
    height: 22,
    marginTop: 15
  },
  contentWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginLeft: '10%',
    height: 100
  },
  content: {
    width: '100%'
  },
  headline: {
    paddingBottom: 60,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  inputWrap: {
    width: '100%',
    backgroundColor: '#ffffff'
  },
  inputBr: {
    width: '100%',
    height: 1,
    backgroundColor: '#d8d8d8'
  },
  input: {
    width: '100%',
    height: 40,
    paddingLeft: 15
  },
  submitContainer: {
    width: '100%'
  },
  btnSubmit: {
    width: '100%',
    height: 48,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: COLOR_PRIMARY
  },
  textSubmit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    lineHeight: 48,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  ruleWrap: {
    marginTop: 15,
    alignItems: 'center'
  },
  ruleTextContainer: {
    flexDirection: 'row'
  },
  ruleText: {
    fontSize: 12,
    color: '#ffffff'
  },
  ruleButton: {
    position: 'relative',
    top: 1,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    textDecorationLine: 'underline'
  },
  checkboxContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 15
  },
  checkbox: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  checkBoxImage: {
    width: 17,
    height: 17
  },
  agreeText: {
    position: 'absolute',
    top: -15,
    left: 25,
    width: 200,
    fontSize: 12,
    color: '#ffffff'
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  inputContentWrap: {
    position: 'absolute',
    bottom: '50%',
    width: '90%',
    marginLeft: '5%'
  }
});

class Data {
  @observable
  name = '이름';
  @observable
  email = null;
  @observable
  password = null;
  @observable
  passconf = null;
  @observable
  isAgree = false;
  @observable
  windowHeight = null;
}

@observer
class EmailSignUpForm extends Component {
  data = new Data();

  state = {
    signupButtonDisabled: false,
  }

  constructor(props) {
    super(props);

    this.data.windowHeight = Dimensions.get('window').height;
  }

  validityNameOnFocus = () => {
    if (this.data.name === '이름') {
      this.data.name = '';
    }
  };
  validityEmailOnFocus = () => {
    if (this.data.email === '이메일') {
      this.data.email = '';
    }
  };
  validityPasswordOnFocus = () => {
    if (this.data.password === '비밀번호') {
      this.data.password = '';
    }
  };
  validityPassconfOnFocus = () => {
    if (this.data.passconf === '비밀번호확인') {
      this.data.passconf = '';
    }
  };

  handleJoin = () => {

    this.setState({ signupButtonDisabled: true })

    if (this.data.email === null) {
      Alert.alert('이메일은 필수 입력항목입니다.');
      this.setState({ signupButtonDisabled: false })
      return false;
    } else if (!this.data.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      this.setState({ signupButtonDisabled: false })
      Alert.alert('이메일 형식이 맞지 않습니다.');
      return false;
    } else if (this.data.password === null) {
      this.setState({ signupButtonDisabled: false })
      Alert.alert('비밀번호는 필수 입력항목입니다.');
      return false;
    }

    if (this.data.passconf !== this.data.password) {
      Alert.alert('비밀번호와 비밀번호 확인이 일치 하지 않습니다.');
      this.setState({ signupButtonDisabled: false })
      return false;
    }

    Net.signUp(this.data.name, this.data.email, this.data.password)
      .then(data => {
        // 이메일 회원 가입이 완료된 상태
        AppEventsLogger.logEvent('WELAAARN_EMAIL_SIGN_UP');
        store.welaaaAuth = data;
        this.props.navigation.navigate('HomeScreen');
      })
      .catch(e => {
        alert(e);
        this.setState({ signupButtonDisabled: false })
      });
  };

  agreeStatus = () => {
    this.data.isAgree = !this.data.isAgree;
  };

  render() {
    return (
      <View
        style={[CommonStyles.container, styles.loginContainer]}
        behavior="padding"
      >
        <ScrollView style={{ flex: 1, width: '100%' }}>
          <View style={{ width: '100%', height: this.data.windowHeight }}>
            <Swiper
              style={styles.wrapper}
              showsButtons={false}
              dotColor={'#888888'}
              activeDotColor={'#ffffff'}
              height={window.width}
              paginationStyle={{ bottom: '50%' }}
            >
              <View style={styles.slide}>
                <ImageBackground
                  source={bgSignUp}
                  resizeMode="cover"
                  style={styles.thumbnail}
                />
              </View>
            </Swiper>
          </View>
          <View style={styles.inputContentWrap}>
            <View style={styles.logoWrap}>
              <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.contentWrap}>
              <View style={styles.content}>
                <Text style={styles.headline}>무료계정만들기</Text>

                <View borderRadius={4} style={styles.inputWrap}>

                  <View style={styles.inputBr} />
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    placeholder="이름"
                    onFocus={this.validityNameOnFocus}
                    value={this.data.name}
                    autoCapitalize={'none'}
                    onChangeText={text => {
                      this.data.name = text;
                    }}
                  />

                  <View style={styles.inputBr} />
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    onFocus={this.validityEmailOnFocus}
                    keyboardType="email-address"
                    placeholder="이메일"
                    onSubmitEditing={Keyboard.dismiss}
                    value={this.data.email}
                    autoCapitalize={'none'}
                    onChangeText={text => {
                      this.data.email = text;
                    }}
                  />
                  <View style={styles.inputBr} />
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    onFocus={this.validityPasswordOnFocus}
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    value={this.data.password}
                    placeholder="비밀번호"
                    onSubmitEditing={Keyboard.dismiss}
                    onChangeText={text => {
                      this.data.password = text;
                    }}
                  />
                  <View style={styles.inputBr} />
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid={'rgba(0,0,0,0)'}
                    onFocus={this.validityPassconfOnFocus}
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    value={this.data.passconf}
                    placeholder="비밀번호 확인"
                    onSubmitEditing={Keyboard.dismiss}
                    onChangeText={text => {
                      this.data.passconf = text;
                    }}
                  />

                  <View style={styles.submitContainer}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={this.handleJoin}
                      disabled={this.state.signupButtonDisabled}
                    >
                      <View borderRadius={4} style={styles.btnSubmit}>
                        <Text style={styles.textSubmit}>
                          {this.state.signupButtonDisabled
                            ? '처리중입니다.'
                            : '가입하기'
                          }
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/*<View style={styles.checkboxContainer}>*/}
                  {/*<View style={styles.checkbox}>*/}
                  {/*<TouchableOpacity activeOpacity={0.9} onPress={this.agreeStatus}>*/}
                  {/*{!!this.data.isAgree &&*/}
                  {/*<Image source={BulletBoxChecked} style={styles.checkBoxImage}/>*/}
                  {/*}*/}
                  {/*{!this.data.isAgree &&*/}
                  {/*<Image source={BulletBoxCheck} style={styles.checkBoxImage}/>*/}
                  {/*}*/}
                  {/*</TouchableOpacity>*/}
                  {/*<View>*/}
                  {/*<Text style={styles.agreeText}>*/}
                  {/*새로운 콘텐츠 및 이벤트 정보 받기*/}
                  {/*</Text>*/}
                  {/*</View>*/}
                  {/*</View>*/}
                  {/*</View>*/}

                  <View style={styles.ruleWrap}>
                    <View style={styles.ruleTextContainer}>
                      <Text style={styles.ruleText}>
                        무료 계정을 생성하시면 월라
                    </Text>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() =>
                          this.props.navigation.navigate('PolicyPage')
                        }
                      >
                        <Text
                          style={styles.ruleButton}
                          textDecorationLine={'underline'}
                        >
                          이용약관
                      </Text>
                      </TouchableOpacity>
                      <Text style={styles.ruleText}>및</Text>
                    </View>
                    <View style={styles.ruleTextContainer}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() =>
                          this.props.navigation.navigate('PrivacyPage')
                        }
                      >
                        <Text
                          style={styles.ruleButton}
                          textDecorationLine={'underline'}
                        >
                          개인정보보호정책
                      </Text>
                      </TouchableOpacity>
                      <Text style={styles.ruleText}>
                        에 동의하는 것으로 간주합니다.
                    </Text>
                    </View>
                  </View>
                </View>
              </View>

              {!!store.isKeyboardOn && <View style={{ height: 50 }} />}
            </View>
        </ScrollView>
      </View>
        );
      }
    }

EmailSignUpForm.navigationOptions = () => {
  return {
          header: null
    };
  };
  
  export default EmailSignUpForm;
