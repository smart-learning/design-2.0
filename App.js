import EventEmitter from 'events';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  DeviceEventEmitter,
  Keyboard,
  Linking,
  NativeEventEmitter,
  NetInfo,
  Platform,
  View,
} from 'react-native';
import firebase from 'react-native-firebase';
import NotificationUI from 'react-native-in-app-notification';
import {
  createDrawerNavigator,
  createStackNavigator,
  createSwitchNavigator,
  DrawerItems,
  SafeAreaView,
} from 'react-navigation';
import Native from './src/scripts/commons/native';
import nav from './src/scripts/commons/nav';
import net from './src/scripts/commons/net';
import utils from './src/scripts/commons/utils';
import store from './src/scripts/commons/store';
import BottomController from './src/scripts/components/BottomController';
import InAppWebView from './src/scripts/components/InAppWebView';
import SidebarUserInfo from './src/scripts/components/SidebarUserInfo';
import AudioScreen from './src/scripts/pages/audio/AudioScreen';
import EmailSignUpForm from './src/scripts/pages/auth/EmailSignUpForm';
import LoginPage from './src/scripts/pages/auth/LoginPage';
import Policy from './src/scripts/pages/auth/PolicyPage';
import Privacy from './src/scripts/pages/auth/PrivacyPage';
import SignUpLandingPage from './src/scripts/pages/auth/SignUpLandingPage';
import HomeScreen from './src/scripts/pages/home/HomeScreen';
import InquireListScreen from './src/scripts/pages/my/InquireListScreen';
import MyScreens from './src/scripts/pages/my/MyScreens';
import VideoScreen from './src/scripts/pages/video/VideoScreen';
import commonStyle from './src/styles/common';
import SetAppScreen from './src/scripts/pages/my/SetAppPage';

class Data {
  @observable
  welaaaAuthLoaded = false;
  // FCM으로 들어온 path를 보관하는 대기열
  @observable
  queuePath = null;
}

class Hidden extends React.Component {
  render() {
    return null;
  }
}

const AppDrawer = createDrawerNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
    },
    VideoScreen: {
      screen: VideoScreen,
      // path: 'video_list',
    },
    AudioScreen: {
      screen: AudioScreen,
    },
    MyScreen: {
      screen: MyScreens,
    },
    InquireListScreen: {
      screen: InquireListScreen,
    },
    SetAppScreen: {
      screen: SetAppScreen,
      navigationOptions: {
        drawerIcon: <Hidden />,
        drawerLabel: <Hidden />,
      },
    },
  },
  {
    contentComponent: props => (
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ top: 'always', horizontal: 'never' }}
      >
        <SidebarUserInfo {...props} />
        <DrawerItems {...props} />
        {}
      </SafeAreaView>
    ),
  },
);

@observer
class App extends React.Component {
  static router = AppDrawer.router;

  data = new Data();

  // 키보드 제어 상태를 store에 기록해서 관리
  keyboardDidShow = () => {
    store.isKeyboardOn = true;
  };
  keyboardDidHide = () => {
    store.isKeyboardOn = false;
  };

  getTokenFromAsyncStorage = async () => {
    let welaaaAuth = await AsyncStorage.getItem('welaaaAuth');
    console.log('welaaaAuth:', welaaaAuth);
    if (welaaaAuth) {
      welaaaAuth = JSON.parse(welaaaAuth);
      store.welaaaAuth = welaaaAuth;
      this.data.welaaaAuthLoaded = true;

      store.profile = await net.getProfile();
      // 멤버쉽 가져오기
      store.currentMembership = await net.getMembershipCurrent();

      // 이용권 가져오기
      store.voucherStatus = await net.getVouchersStatus();
      await utils.updateCartStatus();
    } else {
      // AsyncStorage에 저장된 값이 없어도 화면은 진행이 되어아 햠
      this.data.welaaaAuthLoaded = true;
    }

    // 대기중인 path가 있다면 처리
    if (this.data.queuePath) {
      nav.parseDeepLink(this.data.queuePath);
      this.data.queuePath = null;
    }
  };

  getAppSettings = async () => {
    const settings = await AsyncStorage.multiGet([
      'config::isAutoLogin',
      'config::isWifiPlay',
      'config::isWifiDownload',
      'config::isAlert',
      'config::isEmail',
    ]);

    settings.forEach(setting => {
      const bool = setting[1] === 'true';
      store.appSettings[setting[0].split('::').pop()] = bool;
    });

    Native.updateSettings();

    await this.getTokenFromAsyncStorage();
  };

  initFCM = async () => {
    // 권한 체크 후 없으면 요청
    const enabled = await firebase.messaging().hasPermission();
    console.log('FCM enabled:', enabled);
    if (enabled) {
      // user has permissions
      try {
        await net.registeFcmToken(true);
      } catch (e) {
        console.log('FCM: ' + e);
      }
    } else {
      // user doesn't have permission

      try {
        await firebase.messaging().requestPermission();
        // User has authorised
      } catch (error) {
        // User has rejected permissions
      }
    }
  };

  constructor(prop) {
    super(prop);
    this.subscription = [];
    this.initialize();
  }

  async initialize() {
    await this.getAppSettings();
    this.initFCM();

    // 로그인 이후 발생된 이벤트를 캐치하여 "프로필" 및 "현재멤버십" 가져오기
    store.emitter = new EventEmitter();
    store.emitter.addListener('loginCompleted', () => {
      this.getTokenFromAsyncStorage();
    });
  }

  // 오프라인 상태 체크
  handleFirstConnectivityChange = connectionInfo => {
    if (connectionInfo.type === 'none') {
      nav.parseDeepLink('welaaa://download_page');
    }
  };

  addNetInfoEvent = () => {
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
  };

  removeNetInfoEvent = () => {
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
  };

  async componentDidMount() {
    this.addNetInfoEvent();
    if ('ios' === Platform.OS) {
      console.log('======', Native.getPlayerManager());
      const playerManager = Native.getPlayerManager();
      const playerManagerEmitter = new NativeEventEmitter(playerManager);
      playerManagerEmitter.addListener('downloadState', arg =>
        Native.downloadState(arg),
      );

      console.log('======', Native.getPaymentManager());
      const paymentManager = Native.getPaymentManager();
      const paymentManagerEmitter = new NativeEventEmitter(paymentManager);
      paymentManagerEmitter.addListener('buyResult', async arg => {
        const result = await Native.buyResult(arg);
        if (result) {
          this.props.navigation.navigate('HomeScreen');
        } else {
          console.log('Native.buyResult error.');
        }
      });
    } else if ('android' === Platform.OS) {
      this.subscription.push(
        DeviceEventEmitter.addListener('miniPlayer', params => {
          Native.toggleMiniPlayer(params.visible);
        }),
      );

      this.subscription.push(
        DeviceEventEmitter.addListener('miniPlayerCallPlayer', params => {
          console.log('miniPlayerCallPlayer DeviceEventEmitter ', params);
          Native.play(params.cid);
        }),
      );

      this.subscription.push(
        DeviceEventEmitter.addListener('downloadState', arg =>
          Native.downloadState(arg),
        ),
      );
    }

    Linking.addEventListener('url', this._handleOpenURL);

    /* 앱 떠있는 상태에서 노티 들어올때 */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log('FCM NOTI:', notification);

        if (Platform.OS !== 'ios') {
          notification.android.setChannelId('welaaa');
        }

        if (this.notificationUI) {
          const params = {};
          params.title = notification._title || 'Welaaa';
          params.message = notification._body;
          params.onPress = () => {
            try {
              nav.parseDeepLink(notification._data.path);
            } catch (error) {
              console.log(error);
            }
          };
          this.notificationUI.show(params);
        }
      });

    // https://rnfirebase.io/docs/v4.3.x/notifications/introduction
    // 백그라운드 상태에서 노티 클릭등을 햇을때
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;

        try {
          if (this.data.welaaaAuthLoaded) {
            nav.parseDeepLink(notification._data.path);
          } else {
            this.data.queuePath = notification._data.path;
          }
        } catch (error) {
          console.log(error);
        }
      });

    // 앱 종료상태에서 노티등을 클릭했을때
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      // App was opened by a notification
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification = notificationOpen.notification;

      try {
        if (this.data.welaaaAuthLoaded) {
          nav.parseDeepLink(notification._data.path);
        } else {
          this.data.queuePath = notification._data.path;
        }
      } catch (error) {
        console.log(error);
      }
    }

    Native.getF_TOKEN(f_token => {
      if (undefined === f_token || '' === f_token) {
        return;
      }

      console.log('f_token: ' + f_token);

      const resultAuthToken = net.issueAuthToken(f_token);

      resultAuthToken
        .then(data => {
          store.welaaaAuth = data;

          // 로그인이 완료 되면 loginCompleted를 보내 App.js의
          // 프로필 및 현재멤버십을 가져오는 루틴을 실행하도록 함
          store.emitter.emit('loginCompleted');
          // cb && cb();
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
          // Alert.alert("로그인에 실패하였습니다.", message);
          // cb && cb();
        });
    });

    // 키보드 이벤트 할당
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.subscription.forEach(listener => {
      listener.remove();
    });
    this.subscription.length = 0;
    if (store.emitter) {
      store.emitter.removeAllListeners();
    }
    Linking.removeEventListener('url', this._handleOpenURL);
    this.notificationListener();
    this.notificationOpenedListener();
    // 키보드 이벤트 해제
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.removeNetInfoEvent();
  }

  _handleOpenURL = event => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', event.url);
    nav.parseDeepLink(event.url);
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {!!this.data.welaaaAuthLoaded && (
          <AppDrawer navigation={this.props.navigation} />
        )}

        {!this.data.welaaaAuthLoaded && (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator
              size={'large'}
              color={commonStyle.COLOR_PRIMARY}
            />
          </View>
        )}

        {console.log('bottomController ? ', store.miniPlayerArg)}

        {store.miniPlayerVisible &&
          Platform.select({
            android: <BottomController arg={store.miniPlayerArg} />,
            ios: null,
          })}
        <NotificationUI
          style={{ zIndex: 999999 }}
          ref={ref => {
            this.notificationUI = ref;
          }}
        />

        {store.inAppWebViewUrl && <InAppWebView url={store.inAppWebViewUrl} />}
      </View>
    );
  }
}

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }

  return route.routeName;
}
class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const welaaaAuth = await AsyncStorage.getItem('welaaaAuth');
    console.log('App.js::welaaaAuth', welaaaAuth);
    if (welaaaAuth) {
      this.props.navigation.navigate('Main');
    } else {
      const isAppFirstLoad = await AsyncStorage.getItem('isAppFirstLoad');
      console.log('App.js::isAppFirstLoad', isAppFirstLoad);
      if (isAppFirstLoad && isAppFirstLoad === 'false') {
        this.props.navigation.navigate('Signin');
      } else {
        this.props.navigation.navigate('Signup');
      }
    }
  };

  render() {
    return (
      <View style={commonStyle.container}>
        <ActivityIndicator />
      </View>
    );
  }
}

const SignupStack = createStackNavigator(
  {
    SignUpPage: {
      screen: SignUpLandingPage,
    },
    EmailSignUpForm: {
      screen: EmailSignUpForm,
    },
    Login: {
      screen: LoginPage,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    PrivacyPage: {
      screen: Privacy,
    },
    PolicyPage: {
      screen: Policy,
    },
  },
  {
    initialRouteName: 'SignUpPage',
  },
);

const SigninStack = createStackNavigator(
  {
    SignUpPage: {
      screen: SignUpLandingPage,
    },
    EmailSignUpForm: {
      screen: EmailSignUpForm,
    },
    Login: {
      screen: LoginPage,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      },
    },
    PrivacyPage: {
      screen: Privacy,
    },
    PolicyPage: {
      screen: Policy,
    },
  },
  {
    initialRouteName: 'Login',
  },
);

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: {
      screen: AuthLoadingScreen,
    },
    Main: {
      screen: App,
    },
    Signup: {
      screen: SignupStack,
    },
    Signin: {
      screen: SigninStack,
    },
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default () => (
  <AppNavigator
    ref={navigatorRef => {
      store.drawer = navigatorRef;
      // 플래이어 크래시 때문에 코드 추가
      nav.setNav(navigatorRef);
    }}
    onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getActiveRouteName(currentState);
      const prevScreen = getActiveRouteName(prevState);

      if (prevScreen !== currentScreen) {
        console.log(
          'App.js::onNavigationStateChange',
          prevScreen,
          '-->',
          currentScreen,
        );

        firebase.analytics().setCurrentScreen(currentScreen, currentScreen);
      }
    }}
  />
);
