// 네비게이션 기본 속성 옵션
import React from 'react';
import { Button, Image, Linking, Text, View } from 'react-native';
import IcAngleRight from '../../images/ic-angle-right-primary.png';
import CommonStyle from '../../styles/common';
import HistoryBackButton from '../components/header/HistoryBackButton';
import HomeButton from '../components/header/HomeButton';
import HomeWelaaaButton from '../components/header/HomeWelaaaButton';
import Native from './native';
import globalStore from './store';
import SearchAndCartButton from '../components/header/SearchAndCart';

export const NAV_OPTS_COMMON = {
  headerStyle: {
    backgroundColor: CommonStyle.COLOR_PRIMARY,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontSize: 16,
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
          <Text style={{ paddingLeft: 15, fontSize: 15, color: '#333333' }}>
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
          <Text style={{ paddingLeft: 15, fontSize: 15, color: '#333333' }}>
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
          <Text style={{ paddingLeft: 15, fontSize: 15, color: '#333333' }}>
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
          <Text style={{ paddingLeft: 15, fontSize: 15, color: '#333333' }}>
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
          <Text style={{ paddingLeft: 15, fontSize: 15, color: '#333333' }}>
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

let navigation = null;
export default {
  setNav: nav => {
    if (nav && navigation === null) {
      navigation = nav._navigation;
      console.log('set global nav:', navigation);
    }
  },
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
            navigation.navigate('ClassListPage', {
              category: schemes[0],
              index: schemes[1],
            });
          else navigation.navigate('ClassListPage');
          break;

        case 'video':
          navigation.navigate('ClassDetailPage', { id: schemes[0] });
          break;

        case 'audiobook_list':
          if (paramsLen === 2)
            navigation.navigate('AudioBookPage', {
              category: schemes[0],
              index: schemes[1],
            });
          else navigation.navigate('AudioBookPage');
          break;

        case 'audiobook':
          navigation.navigate('AudioBookDetailPage', { id: schemes[0] });
          break;

        case 'video_play':
        case 'audiobook_play':
          Native.play(schemes[0]);
          break;

        case 'in_browser':
          navigation.navigate('WebView', { url: schemes[0] });
          break;

        //이달의 책 바로가기
        case 'botm':
          const params = schemes[0].split(',');

          navigation.navigate('HomeMonthlyReviewPage', {
            month: params[0],
            sort: params[1],
            title: '이달의 책 북리뷰',
          });
          break;

        //이달의 책 소개용 페이지
        case 'botm_intro':
          navigation.navigate('BotmIntroPage', {
            title: '이달의 책',
            info: schemes[0],
          });
          break;

        case 'out_browser':
          Linking.openURL(decodeURIComponent(schemes[0]));
          break;

        case 'sign_up':
          navigation.navigate('SignUpPage');
          break;

        case 'sign_in':
          navigation.navigate('Login');
          break;

        case 'mywela':
          navigation.navigate('MyScreen');
          break;

        case 'app_setting':
          navigation.navigate('AuthCheck', {
            requestScreenName: 'SetAppPage',
            title: '설정',
          });
          break;

        case 'event':
          navigation.navigate('EventDetailPage', {
            title: '공지사항 및 이벤트',
            id: schemes[0],
          });
          break;

        case 'download_page':
          navigation.navigate('DownloadContentPage', {
            title: '다운로드 콘텐츠',
          });
          break;

        case 'membership':
          navigation.navigate('MembershipPage', {});
      }
    } catch (error) {
      console.log(error);
    }
  },

  goBack: () => {
    console.log('nav.js::navigation', navigation);
    if (!navigation.goBack()) {
      console.log('nav.js::no previous route', navigation);
      navigation.dismiss();
    }
  },
};
