import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
  View,
} from 'react-native';
import { AppEventsLogger } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import Swiper from 'react-native-swiper';
import icEmail from '../../../images/ic-email.png';
import icLogin from '../../../images/ic-login.png';
import Slide1 from '../../../images/login_bg1.png';
import Slide2 from '../../../images/login_bg2.png';
import Slide3 from '../../../images/login_bg3.png';
import Slide4 from '../../../images/login_bg4.png';
import SmallLogo from '../../../images/smallLogo.png';
import CommonStyles from '../../../styles/common';
import Native from '../../commons/native';
import net from '../../commons/net';
import store from '../../commons/store';
import FBLoginButton from '../../components/auth/FBLoginButton';
import KakaoLoginButton from '../../components/auth/KakaoLoginButton';
import appsFlyer from 'react-native-appsflyer';

const styles = StyleSheet.create({
  landingContainer: {
    position: 'relative',
  },
  background: {
    width: '100%',
    height: '100%',
    paddingTop: 50,
  },
  logoWrap: {
    position: 'absolute',
    top: 20,
    zIndex: 9,
    alignItems: 'center',
    height: 50,
  },
  logo: {
    width: 88,
    height: 22,
    marginTop: 15,
  },
  contentWrap: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    position: 'absolute',
    bottom: 60,
    width: '100%',
    marginLeft: '10%',
    backgroundColor: '#FFFFFF'
  },
  thumbnail: {
    width: '100%',
    height: '75%',
    backgroundColor: '#00C73C'
  },
  alignJustify: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emailButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 48,
    marginTop: 10,
    backgroundColor: '#00C73C'
  },
  emailImage: {
    width: 22,
    height: 20,
    marginRight: 30,
  },
  emailText: {
    lineHeight: 40,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loginWrap: {
    width: '70%',
    marginLeft: '10%',
    marginBottom: 10,
  },
  loginButton: {
    flexDirection: 'row',
  },
  loginLabel: {
    fontSize: 15,
    color: '#00C73C',
  },
  loginImage: {
    width: 16,
    height: 14,
    marginRight: 5,
    marginLeft: 15,
  },
  loginText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00C73C',
  },
  ruleWrap: {
    marginTop: 15,
    alignItems: 'center',
  },
  ruleTextContainer: {
    flexDirection: 'row',
  },
  ruleText: {
    fontSize: 14,
    color: '#767B80',
  },
  ruleButton: {
    position: 'relative',
    top: 1,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#767B80',
    textDecorationLine: 'underline',
  },
  headWrap: {
    marginTop: 50,
    alignItems: 'center',
  },
  headline: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headSubline: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  smalllogo: {
    width: 50,
    height: 28,
  },
  largelogo: {
    width: 50,
    height: 28,
  },
});

class SignUpLandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slideHeight: null,
    };
  }

  componentDidMount() {
    let windowHeight = Dimensions.get('window').height;

    this.setState({
      slideHeight: windowHeight,
    });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  showFullModal() {
    this.props.navigation.navigate('FullModalSectionPageCall'
      , {
        popup_type: 'AndroidMainExit',
        preview_page: 'SignUpLandingPage',
      }
    );

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.props.navigation.isFocused()) {
      this.showFullModal();
      return true;
    }
  };

  onAccessToken(type, token) {
    let { navigation } = this.props;
    const resultAuthToken = net.signUp('', type, token);
    resultAuthToken
      .then(data => {
        store.socialType = type;
        // store.welaaaAuth = JSON.stringify(data);

        if (Platform.OS === 'android') {
          // 2018.10.29 facebook event: 마케팅 요청.
          const NativeConstants = Native.getConstants();
          const EVENT_NAME_COMPLETED_REGISTRATION =
            NativeConstants.EVENT_NAME_COMPLETED_REGISTRATION;
          const EVENT_PARAM_REGISTRATION_METHOD =
            NativeConstants.EVENT_PARAM_REGISTRATION_METHOD;
          AppEventsLogger.logEvent(EVENT_NAME_COMPLETED_REGISTRATION, {
            [EVENT_PARAM_REGISTRATION_METHOD]: store.socialType,
          });

          firebase.analytics().logEvent('EVENT_NAME_COMPLETED_REGISTRATION', {
            EVENT_PARAM_REGISTRATION_METHOD: store.socialType,
            OS_TYPE: Platform.OS,
          });
        } else if (Platform.OS === 'ios') {
          // 2019.1.11 facebook event: 마케팅 요청.
          // Android 와 동일한 내용이지만 일단 분기 해서 별도로 관리.
          const NativeConstants = Native.getConstants();
          const EVENT_NAME_COMPLETED_REGISTRATION =
            NativeConstants.EVENT_NAME_COMPLETED_REGISTRATION;
          const EVENT_PARAM_REGISTRATION_METHOD =
            NativeConstants.EVENT_PARAM_REGISTRATION_METHOD;
          AppEventsLogger.logEvent(EVENT_NAME_COMPLETED_REGISTRATION, {
            [EVENT_PARAM_REGISTRATION_METHOD]: store.socialType,
          });

          firebase.analytics().logEvent('EVENT_NAME_COMPLETED_REGISTRATION', {
            EVENT_PARAM_REGISTRATION_METHOD: store.socialType,
            OS_TYPE: Platform.OS,
          });
        }

        store.welaaaAuth = data;
        // 2018. 11. 9. jungon
        // 회원가입 후 Membership 가입 촉진 페이지 노출.
        navigation.navigate('Main', {
          trackEvent: { af_registration_method: type, OS_TYPE: Platform.OS },
        });
      })
      .catch(error => {

        try {
          const code = error.response.code;
          let message = '회원가입 실패';
          if (error.response.data && error.response.data.error) {
            message += ` (server message: ${error.response.data.error})`;
          }
          Alert.alert(message);
          console.log(error);
        } catch (err) {
          console.log(err);
        }
      });
  }

  render() {
    return (
      <View style={[CommonStyles.container, styles.landingContainer]}>
        {/* 이미지 스와이퍼 */}
        <View style={{ width: '100%', height: this.state.slideHeight }}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            dotColor={'#888888'}
            activeDotColor={'#ffffff'}
            height={window.width}
            paginationStyle={{ bottom: '95%' }}
          >
            <View style={styles.slide}>
              <ImageBackground
                source={Slide1}
                resizeMode="cover"
                style={styles.thumbnail}
              >
                <View style={styles.headWrap}>
                  <Text style={styles.headline}>당신이 알아야 할 모든 것</Text>
                </View>
                <View>
                  <Text style={styles.headSubline}>{'지식콘텐츠 플랫폼  '}
                    <Image
                      source={SmallLogo}
                      resizeMode="cover"
                      style={styles.smalllogo}
                    />
                  </Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.slide}>
              <ImageBackground
                source={Slide2}
                resizeMode="cover"
                style={styles.thumbnail}
              >
                <View style={styles.headWrap}>
                  <Text style={styles.headline}><Image
                    source={SmallLogo}
                    resizeMode="cover"
                    style={styles.smalllogo}
                  />{' 클래스'}</Text>
                </View>
                <View>
                  <Text style={styles.headSubline}>오프라인에만 있던{"\n"}최고의 명강을 내 손 안에서!
                  </Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.slide}>
              <ImageBackground
                source={Slide3}
                resizeMode="cover"
                style={styles.thumbnail}
              >
                <View style={styles.headWrap}>
                  <Text style={styles.headline}><Image
                    source={SmallLogo}
                    resizeMode="cover"
                    style={styles.smalllogo}
                  />{' 오디오북'}</Text>
                </View>
                <View>
                  <Text style={styles.headSubline}>베스트셀러를{"\n"}오디오북으로 더 생생하게!</Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.slide}>
              <ImageBackground
                source={Slide4}
                resizeMode="cover"
                style={styles.thumbnail}
              >
                <View style={styles.headWrap}>
                  <Text style={styles.headline}>{'모든 지식콘텐츠를 즐기세요'}</Text>
                </View>
                <View>
                  <Text style={styles.headSubline}>한달간 무제한! 해지는 언제든</Text>
                </View>
              </ImageBackground>
            </View>
          </Swiper>
        </View>
        {/* /이미지 스와이퍼 */}

        <View style={styles.contentWrap}>
          <View style={[styles.alignJustify, styles.loginWrap]}>
            <Text style={styles.loginLabel}>이미 윌라 계정이 있으신가요?</Text>
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.9}
              onPress={() => this.props.navigation.navigate('Login')}
            >
              {/* <Image source={icLogin} style={styles.loginImage} /> */}
              <Text style={styles.loginText}>로그인 ></Text>
            </TouchableOpacity>
          </View>

          <KakaoLoginButton
            onAccess={token => this.onAccessToken('kakaotalk', token)}
            type={'landing'}
          />

          <FBLoginButton
            onAccess={token => this.onAccessToken('facebook', token)}
            type={'landing'}
          />

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.props.navigation.navigate('EmailSignUpForm')}
          >
            <View
              style={styles.emailButton}
              // borderWidth={1}
              // borderStyle={'solid'}
              // borderColor={'#ffffff'}
              borderRadius={30}
            >
              <Image source={icEmail} style={styles.emailImage} />
              <Text style={styles.emailText}>이메일 간편 가입</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.ruleWrap}>
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleText}>윌라 계정을 생성하시면 월라</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.navigation.navigate('PolicyPage')}
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
                onPress={() => this.props.navigation.navigate('PrivacyPage')}
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

            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleText}>윌라 서비스 이용/제휴문의</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.navigation.navigate('PrivacyPage')}
              >
                <Text
                  style={styles.ruleButton}
                  textDecorationLine={'underline'}
                >
                  문의하기 >
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

SignUpLandingPage.navigationOptions = () => {
  return {
    header: null,
  };
};

export default SignUpLandingPage;
