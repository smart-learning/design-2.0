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
  View
} from 'react-native';
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
    position: 'relative'
  },
  background: {
    width: '100%'
  },
  logoWrap: {
    alignItems: 'center',
    height: 50,
    marginTop: 0,
    marginBottom: 50,
    paddingTop: 50
  },
  logo: {
    width: 110,
    height: 28
  },
  contentWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginLeft: '10%'
  },
  headline: {
    paddingBottom: 60,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  bulletText: {
    marginTop: 15,
    marginBottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff'
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  inputContentWrap: {
    position: 'absolute',
    bottom: 100,
    width: '90%',
    marginLeft: '5%'
  }
});

class Data {
  @observable
  isAppFirstLoadLoginPage = false;
}

@observer
class LoginPage extends React.Component {
  data = createStore({
    windowHeight: null
  });

  constructor(props) {
    super(props);

    this.windowHeight = Dimensions.get('window').height;
  }

  componentDidMount() {}

  componentWillUnmount() {}

  /*
	* @params email: 이메일이나 소셜 타입
	* @params password: 이메일비번이나 소셜 토큰
	* */
  login = (email, password, callback) => {
    let { navigation } = this.props;
    const resultAuthToken = net.getAuthToken(email, password);

    resultAuthToken
      .then(data => {
        store.socialType = email;
        store.welaaaAuth = data;
        navigation.navigate(navigation.getParam('requestScreenName', 'Main'));

        // 로그인이 완료 되면 loginCompleted를 보내 App.js의
        // 프로필 및 현재멤버십을 가져오는 루틴을 실행하도록 함
        globalStore.emitter.emit('loginCompleted');

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
        Alert.alert('로그인에 실패하였습니다.', message);

        if (_.isFunction(callback)) {
          callback();
        }
      });
  };

  render() {
    return (
      <View
        style={[
          CommonStyles.container,
          styles.loginContainer,
          { height: this.windowHeight }
        ]}
      >
        <ScrollView style={{ flex: 1, width: '100%' }} keyboardShouldPersistTaps='always' >
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
                onNavigate={routerName =>
                  this.props.navigation.navigate(routerName)
                }
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default LoginPage;
