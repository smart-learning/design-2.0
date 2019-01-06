// 네비게이션 기본 속성 옵션
import React from 'react';
import { Button, Image, Linking, Text, View } from 'react-native';
import { DrawerActions, NavigationActions } from 'react-navigation';
import IcAngleRight from '../../images/ic-angle-right-primary.png';
import CommonStyle from '../../styles/common';
import HistoryBackButton from '../components/header/HistoryBackButton';
import HomeButton from '../components/header/HomeButton';
import HomeWelaaaButton from '../components/header/HomeWelaaaButton';
import SearchAndCartButton from '../components/header/SearchAndCart';
import Native from './native';

export const NAV_OPTS_COMMON = {
  headerStyle: {
    backgroundColor: '#fff',
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 0,
    elevation: 0,
  },
  headerTintColor: '#000',
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export const NAV_OPTS_MAIN = ({ navigation, navigationOptions }) => ({
  headerLeft: <HomeButton />,
  headerTitle: <HomeWelaaaButton />,
  headerRight: <SearchAndCartButton navigation={navigation} />,
});

export const NAV_OPTS_STACK = ({ navigation, navigationOptions }) => {
  return {
    ...NAV_OPTS_COMMON,
    title:
      (navigation.state.params && navigation.state.params.title) ||
      navigation.state.routeName,
  };
};

export const NAV_OPTS_STACK_WITH_SEARCH = ({
  navigation,
  navigationOptions,
}) => {
  return {
    title:
      (navigation.state.params && navigation.state.params.title) ||
      navigation.state.routeName,
    headerRight: <SearchAndCartButton navigation={navigation} />,
    headerLeft: <HomeButton />,
  };
};

export const NAV_OPTS_STACK_HISTORY_BACK = ({
  navigation,
  navigationOptions,
}) => {
  return {
    ...NAV_OPTS_COMMON,
    title:
      (navigation.state.params && navigation.state.params.title) ||
      navigation.state.routeName,
    headerLeft: <HistoryBackButton />,
  };
};

export const NAV_OPTS_MY_HOME = ({ navigation, navigationOptions }) => {
  return {
    headerStyle: {
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      paddingLeft: 0,
      paddingRight: 0,
      borderBottomWidth: 0,
      shadowOpacity: 0,
    },
    headerLeft: <HomeButton />,
    headerTitle: <HomeWelaaaButton />,
    headerRight: <Button title="설정버튼" onPress={() => alert('설쩡')} />,
    gesturesEnabled: false,
  };
};

const DRAWER_LABEL = {
  HomeScreen: {
    label: '홈',
    icon: require('../../images/chats-icon.png'),
  },

  VideoScreen: {
    label: '동영상 강의',
    icon: require('../../images/chats-icon.png'),
  },

  AudioScreen: {
    label: '오디오북',
    icon: require('../../images/chats-icon.png'),
  },

  MyScreen: {
    label: '마이윌라',
    icon: require('../../images/chats-icon.png'),
  },

  InquireListScreen: {
    label: '1:1 문의',
    icon: require('../../images/chats-icon.png'),
  },
};

export const NAV_OPTS_DRAWER = ({ navigation, navigationOptions }) => {
  let { label, icon } = DRAWER_LABEL[navigation.state.key] || {
    label: navigation.state.key,
    icon: require('../../images/chats-icon.png'),
  };

  let option = {
    drawerLabel: label,
    drawerIcon: ({ tintColor, focused }) => (
      <Image
        source={icon}
        style={[CommonStyle.size24, { tintColor: tintColor }]}
      />
    ),
  };

  // TODO: Custom Drawer 메뉴 구현( June으로 샘플구현해둠 ) drawLabel 에 react element 를 반환하는함수를 재정의
  // README: https://reactnavigation.org/docs/en/drawer-navigator.html
  // if (label === "June") {
  // 	console.log('커스텀 메뉴 생성');
  // 	option = {
  // 		drawerLabel: () => (<View style={{flex: 1, backgroundColor: '#FF0000'}}>
  // 				<Text>커스텀 드로어 메뉴 ~~~~ </Text>
  // 			</View>
  // 		)
  // 	}
  // }

  if (label === '홈') {
    option = {
      drawerLabel: () => (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            height: 65,
            backgroundColor: '#ffffff',
          }}
        >
          <Text style={{ paddingLeft: 15, fontSize: 15, color: '#34342C' }}>
            홈
          </Text>
          <Image
            source={IcAngleRight}
            style={{ width: 9, height: 14, marginRight: 15 }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: 1,
              backgroundColor: '#dddddd',
            }}
          />
        </View>
      ),
    };
  }
  if (label === '동영상 강의') {
    option = {
      drawerLabel: () => (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            height: 65,
            backgroundColor: '#ffffff',
          }}
        >
          <Text style={{ paddingLeft: 15, fontSize: 15, color: '#34342C' }}>
            클래스 전체목록
          </Text>
          <Image
            source={IcAngleRight}
            style={{ width: 9, height: 14, marginRight: 15 }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: 1,
              backgroundColor: '#dddddd',
            }}
          />
        </View>
      ),
    };
  }
  if (label === '오디오북') {
    option = {
      drawerLabel: () => (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            height: 65,
            backgroundColor: '#ffffff',
          }}
        >
          <Text style={{ paddingLeft: 15, fontSize: 15, color: '#34342C' }}>
            오디오북 전체목록
          </Text>
          <Image
            source={IcAngleRight}
            style={{ width: 9, height: 14, marginRight: 15 }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: 1,
              backgroundColor: '#dddddd',
            }}
          />
        </View>
      ),
    };
  }
  if (label === '마이윌라') {
    option = {
      drawerLabel: () => (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            height: 65,
            backgroundColor: '#ffffff',
          }}
        >
          <Text style={{ paddingLeft: 15, fontSize: 15, color: '#34342C' }}>
            마이윌라
          </Text>
          <Image
            source={IcAngleRight}
            style={{ width: 9, height: 14, marginRight: 15 }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: 1,
              backgroundColor: '#dddddd',
            }}
          />
        </View>
      ),
    };
  }
  if (label === '1:1 문의') {
    option = {
      drawerLabel: () => (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            height: 65,
            backgroundColor: '#ffffff',
          }}
        >
          <Text style={{ paddingLeft: 15, fontSize: 15, color: '#34342C' }}>
            1:1 문의
          </Text>
          <Image
            source={IcAngleRight}
            style={{ width: 9, height: 14, marginRight: 15 }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: 1,
              backgroundColor: '#dddddd',
            }}
          />
        </View>
      ),
    };
  }

  return option;
};

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  console.log('nav.js::setTopLevelNavigator');
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  console.log('nav.js::navigate:', routeName, params);
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function goBack() {
  console.log('nav.js::goBack');
  _navigator.dispatch(NavigationActions.back());
}

function goHome() {
  console.log('nav.js::goHome');
  navigate('HomeScreen', {});
}

function toggleDrawer() {
  _navigator.dispatch(DrawerActions.toggleDrawer());
}

export default {
  setTopLevelNavigator,

  navigate,

  goBack,

  goHome,

  toggleDrawer,

  // welaaa://video_list 동영상 리스트
  // welaaa://video_list/{category}/{index} 동영상 특정 카테고리 특정 순서로 이동
  // welaaa://video/{cid} 동영상 상세
  // welaaa://video_play/{cid} 동영상 재생
  // welaaa://audiobook_list 오디오북 리스트
  // welaaa://audiobook_list/{category}/{index} 동영상 특정 카테고리 특정 순서로 이동
  // welaaa://audiobook/{cid} 오디오북 상세
  // welaaa://audiobook_play/{cid} 오디오북 재생
  // welaaa://in_browser/{url} 인앱 브라우져로 url 이동(닫기버튼포함)
  // welaaa://out_browser/{url}` 외부 브라우져 실행
  // welaaa://sign_up 회원가입 이동
  // welaaa://sign_in 로그인 이동
  // welaaa://mywela 마이윌라로 이동

  // welaaa://app_setting 설정으로 이동
  // welaaa://membership 나의 멤버십으로 이동
  // welaaa://download_page 다운로드페이지로 이동
  parseDeepLink: scheme => {
    try {
      // 필요한 내용만 '/' 로 나눠서
      const schemes = scheme.replace('welaaa://', '').split('/');

      // 맨 앞에 내용을 action 뒤에 내용을 params으로 분리
      const action = schemes.shift();
      const paramsLen = schemes.length; // action을 제외한 길이

      console.log('scheme:', action, schemes);

      switch (action) {
        case 'video_list':
          if (paramsLen === 2)
            navigate('ClassListPage', {
              category: schemes[0],
              index: schemes[1],
            });
          else navigate('ClassListPage');
          break;

        case 'video':
          navigate('ClassDetailPage', { id: schemes[0] });
          break;

        case 'audiobook_list':
          if (paramsLen === 2)
            navigate('AudioBookPage', {
              category: schemes[0],
              index: schemes[1],
            });
          else navigate('AudioBookPage');
          break;

        case 'audiobook':
          navigate('AudioBookDetailPage', { id: schemes[0] });
          break;

        case 'video_play':
        case 'audiobook_play':
          Native.play(schemes[0]);
          break;

        case 'in_browser':
          navigate('WebView', { url: schemes[0] });
          break;

        case 'inner_browser':
          navigate('InnerWebViewPage', { url: schemes.join('/') });
          break;

        //이달의 책 바로가기
        case 'botm':
          const params = schemes[0].split(',');

          navigate('HomeMonthlyReviewPage', {
            month: params[0],
            sort: params[1],
            title: '이달의 책 북리뷰',
          });
          break;

        //이달의 책 소개용 페이지
        case 'botm_intro':
          navigate('BotmIntroPage', {
            title: '이달의 책',
            info: schemes[0],
          });
          break;

        case 'out_browser':
          Linking.openURL(decodeURIComponent(schemes[0]));
          break;

        case 'sign_up':
          navigate('SignUpPage');
          break;

        case 'sign_in':
          navigate('Login');
          break;

        case 'mywela':
          navigate('MyScreen');
          break;

        case 'app_setting':
          navigate('AuthCheck', {
            requestScreenName: 'SetAppPage',
            title: '설정',
          });
          break;

        case 'event':
          navigate('EventDetailPage', {
            title: '공지사항 및 이벤트',
            id: schemes[0],
          });
          break;

        case 'download_page':
          navigate('DownloadContentPage', {
            title: '다운로드 콘텐츠',
          });
          break;

        case 'membership':
          navigate('MembershipPage', {});
          break;

        case 'series':
          switch (schemes[0]) {
            case '035':
              navigate('Series_4genPage', {
                title: '윌라 추천 시리즈',
              });
              break;
            default:
              navigate('HomeSeriesPage', {
                title: '윌라 추천 시리즈',
              });
              break;
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  },
};
