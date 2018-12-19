import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Swiper from 'react-native-swiper';
import _ from 'underscore';
import bgLogin from '../../../images/bg-signup.jpg';
import logo from '../../../images/logo-en-primary.png';
import store from '../../../scripts/commons/store';
import CommonStyles from '../../../styles/common';
import createStore from '../../commons/createStore';
import net from '../../commons/net';
import globalStore from '../../commons/store';
import EmailAuthPack from '../../components/auth/EmailAuthPack';
import FBLoginButton from '../../components/auth/FBLoginButton';
import KakaoLoginButton from '../../components/auth/KakaoLoginButton';

const styles = StyleSheet.create({
  loginContainer: {
    position: 'relative',
  },
  background: {
    width: '100%',
  },
  logoWrap: {
    alignItems: 'center',
    height: 50,
    marginTop: 0,
    marginBottom: 50,
    paddingTop: 50,
  },
  logo: {
    width: 110,
    height: 28,
  },
  contentWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginLeft: '10%',
  },
  headline: {
    paddingBottom: 60,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bulletText: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  inputContentWrap: {
    position: 'absolute',
    bottom: 100,
    width: '90%',
    marginLeft: '5%',
  },
});

class Data {
  @observable
  isAppFirstLoadLoginPage = false;
}

class LoginPage extends React.Component {
  data = createStore({
    windowHeight: null,
  });

  constructor(props) {
    super(props);

    this.windowHeight = Dimensions.get('window').height;

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  keyboardStateChanged = isKeyboardOn => {
    console.log('keyboardStateChanged isKeyboardOn: ', isKeyboardOn);
    // 키보드 때문에 텍스트입력창이 가려지는 이슈를 해결하기 위해 KeyboardAvoidingView 를 통해
    // 자동으로 뷰가 움직이도록 처리하였으나 이 방식 말고 화면 사이즈를 수동으로 변경하여 처리하고자 하거나
    // (디바이스별 키보드 사이즈를 구해서 스크롤뷰 사이즈에서 직접 빼준다든지 하는 등의 처리)
    // 기타 키보드 show/hide 에 따른 부가적인 처리를 해줘야 할 경우 여기에서 하면 된다.
    // - 2018.11.16. 김요한.
    if (isKeyboardOn) {
    } else {
    }
  };

  /*
   * @params email: 이메일이나 소셜 타입
   * @params password: 이메일비번이나 소셜 토큰
   * */
  login = (email, password, callback) => {
    let { navigation } = this.props;
    const resultAuthToken = net.getAuthToken(email, password);

    // 로딩 보이기
    this.setState({ loading: true });

    resultAuthToken
      .then(data => {
        store.socialType = email;
        store.welaaaAuth = data;
        navigation.navigate(navigation.getParam('requestScreenName', 'Main'), {
          reload_mbs: true,
        });

        // 로그인이 완료 되면 loginCompleted를 보내 App.js의
        // 프로필 및 현재멤버십을 가져오는 루틴을 실행하도록 함
        globalStore.emitter.emit('loginCompleted');

        this.setState({ loading: false });

        if (_.isFunction(callback)) {
          callback();
        }
      })
      .catch(error => {
        // 이 부분에 서버에서 오는 다양한 코드 및 메시지를 통해
        // 에러 메시지를 사용자에게 출력하면 됨
        let message = '';
        switch (error.response.data.error) {
          case 'invalid_grant':
            message = '아이디와 비밀번호를 다시 확인해 주세요.';
            break;
          default:
            message = '관리자에게 문의해 주세요.';
            break;
        }

        Alert.alert(
          '로그인에 실패하였습니다.',
          message,
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('loading set to false');
                this.setState({ loading: false });
                if (_.isFunction(callback)) {
                  callback();
                }
              },
            },
          ],
          { cancelable: false },
        );
      });
  };

  render() {
    return (
      <View
        style={[
          CommonStyles.container,
          styles.loginContainer,
          { height: this.windowHeight },
        ]}
      >
        <ScrollView
          style={{ flex: 1, width: '100%' }}
          keyboardShouldPersistTaps="always"
        >
          <KeyboardAvoidingView
            style={styles.container}
            behavior="position"
            enabled
          >
            <View style={{ width: '100%', height: this.windowHeight }}>
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
                    source={bgLogin}
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
                <Spinner // 로딩 인디케이터
                  visible={this.state.loading}
                />
                <Text style={styles.headline}>LOGIN</Text>

                <FBLoginButton
                  onAccess={(token, cb) => this.login('facebook', token, cb)}
                  type={'login'}
                />

                <KakaoLoginButton
                  onAccess={(token, cb) => this.login('kakaotalk', token, cb)}
                  type={'login'}
                />

                <Text style={styles.bulletText}>OR</Text>

                <EmailAuthPack
                  onAccess={this.login}
                  onKeyboardStatus={this.keyboardStateChanged}
                  onNavigate={routerName =>
                    this.props.navigation.navigate(routerName)
                  }
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

export default observer(LoginPage);
