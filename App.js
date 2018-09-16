import React from 'react';
import {
  createDrawerNavigator,
  DrawerItems,
  SafeAreaView
} from 'react-navigation';
import HomeScreen from './src/scripts/pages/home/HomeScreen';
import VideoScreen from './src/scripts/pages/video/VideoScreen';
import AudioScreen from './src/scripts/pages/audio/AudioScreen';
import MyScreens from './src/scripts/pages/my/MyScreens';
import MembershipScreens from './src/scripts/pages/membership/MembershipScreen';
import {
  Alert,
  AsyncStorage,
  DeviceEventEmitter,
  Platform,
  View,
  Linking,
  AppState
} from 'react-native';
import EventEmitter from 'events';
import globalStore from './src/scripts/commons/store';

import SidebarUserInfo from './src/scripts/components/SidebarUserInfo';
import net from './src/scripts/commons/net';
import BottomController from './src/scripts/components/BottomController';
import Native from './src/scripts/commons/native';
import { observer } from 'mobx-react';
import firebase, { RemoteMessage } from 'react-native-firebase';
import nav from './src/scripts/commons/nav';

@observer
class App extends React.Component {
  getTokenFromAsyncStorage = async () => {
    let welaaaAuth = await AsyncStorage.getItem('welaaaAuth');
    console.log('welaaaAuth:', welaaaAuth);
    if (welaaaAuth) {
      welaaaAuth = JSON.parse(welaaaAuth);
      globalStore.welaaaAuth = welaaaAuth;

      globalStore.profile = await net.getProfile();
      // 멤버쉽 가져오기
      globalStore.currentMembership = await net.getMembershipCurrent();
    }
  };

  getAppSettings = async () => {
    const settings = await AsyncStorage.multiGet([
      'config::isAutoLogin',
      'config::isWifiPlay',
      'config::isWifiDownload',
      'config::isAlert',
      'config::isEmail'
    ]);

    settings.forEach(setting => {
      const bool = setting[1] === 'true';
      globalStore.appSettings[setting[0].split('::').pop()] = bool;
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
    globalStore.emitter = new EventEmitter();
    globalStore.emitter.addListener('loginCompleted', () => {
      this.getTokenFromAsyncStorage();
    });
  }

  async componentDidMount() {
    this.subscription.push(
      DeviceEventEmitter.addListener('miniPlayer', params => {
        Native.toggleMiniPlayer(params.visible);
      })
    );
    this.subscription.push(
      DeviceEventEmitter.addListener('selectDatabase', params => {
        console.log('database receiveDownloadList:', params);
        globalStore.downloadItems =
          params.selectDownload || params.selectDatabase || 'null';
      })
    );
    this.subscription.push(
      DeviceEventEmitter.addListener('selectDownload', params => {
        console.log('download receiveDownloadList:', params);
        globalStore.downloadItems =
          params.selectDownload || params.selectDatabase || 'null';
      })
    );

    Linking.addEventListener('url', this._handleOpenURL);

    /* 앱 떠있는 상태에서 노티 들어올때 */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log('FCM NOTI:', notification);

        if (Platform.OS !== 'ios') {
          notification.android.setChannelId('welaaa');
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

        console.log('OPEN BY NOTI:', action, notification);
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

      console.log('OPEN BY NOTI-C:', action, notification);
    }

    Native.getF_TOKEN(f_token => {
      if (undefined === f_token || '' === f_token) {
        return;
      }

      console.log('f_token: ' + f_token);

      const resultAuthToken = net.issueAuthToken(f_token);

      resultAuthToken
        .then(data => {
          globalStore.welaaaAuth = data;

          // 로그인이 완료 되면 loginCompleted를 보내 App.js의
          // 프로필 및 현재멤버십을 가져오는 루틴을 실행하도록 함
          globalStore.emitter.emit('loginCompleted');
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
  }

  componentWillUnmount() {
    this.subscription.forEach(listener => {
      listener.remove();
    });
    this.subscription.length = 0;
    globalStore.emitter.removeAllListeners();
    Linking.removeEventListener('url', this._handleOpenURL);
    // this.messageListener();
    // this.notificationDisplayedListener();
    // this.notificationListener();
  }

  _handleOpenURL = event => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', event.url);
    nav.parseDeepLink(event.url);
  };

  render() {

  	console.log( 'changeInitialRoute:', globalStore.initialRoute );


    return (
      <View style={{ flex: 1 }}>
        <AppDrawer
          ref={navigatorRef => {
            globalStore.drawer = navigatorRef;
            // 플래이어 크래시 때문에 코드 추가
            nav.setNav(navigatorRef);
          }}
          style={{ width: '80%' }}
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = getActiveRouteName(currentState);
            const prevScreen = getActiveRouteName(prevState);

            if (prevScreen !== currentScreen) {

            	console.log( 'change screen:', prevScreen, '-->', currentScreen );
				// console.log( 'action :', currentState );

              if (currentScreen !== 'AuthCheck') {
                globalStore.lastLocation = currentScreen;
                if( prevScreen !== 'AuthCheck' ) globalStore.prevLocations.push(prevScreen);
                globalStore.prevLocations.length = Math.min(
                  globalStore.prevLocations.length,
                  10
                );
              }

            }
          }}
        />

        {globalStore.miniPlayerVisible &&
          Platform.select({
            android: <BottomController />,
            ios: null
          })}
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

class Hidden extends React.Component {
  render() {
    return null;
  }
}

const HOME_SCREEN = HomeScreen;
const DEFAULT_SCREEN = VideoScreen;

const AppDrawer = createDrawerNavigator(
  {
    // SampleScreen: {
    // 	screen: SampleScreen,
    // },

    HomeScreen: {
      screen: HOME_SCREEN
    },

    VideoScreen: {
      screen: VideoScreen
      // path: 'video_list',
    },

    AudioScreen: {
      screen: AudioScreen
    },

    MembershipScreen: {
      screen: MembershipScreens,
      navigationOptions: {
        drawerIcon: <Hidden />,
        drawerLabel: <Hidden />
      }
    },

    MyScreen: {
      screen: MyScreens
    }

    // Playground: {
    // 	screen: Playground,
    // },
    // June: {
    // 	screen: PlaygroundJune,
    // },
    // BottomControllerTEST: {
    // 	screen: BottomControllerPage,
    // },
    // AndroidNativeCall: {
    // 	screen: PlaygroundJune,
    // }
  },

  {
    contentComponent: props => (
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ top: 'always', horizontal: 'never' }}
      >
        <SidebarUserInfo {...props} />
        <DrawerItems {...props} />
      </SafeAreaView>
    )
  }
);

export default App;
