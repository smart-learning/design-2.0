import { createStackNavigator } from 'react-navigation';
import {
  NAV_OPTS_COMMON,
  NAV_OPTS_DRAWER,
  NAV_OPTS_MAIN,
  NAV_OPTS_STACK,
  NAV_OPTS_STACK_HISTORY_BACK,
} from '../../commons/nav';
import InAppWebView from '../../components/InAppWebView';
import AudioBookDetailPage from '../audio/AudioBookDetailPage';
import AudioBookInfoPage from '../audio/AudioBookInfoPage';
import EmailSignUpForm from '../auth/EmailSignUpForm';
import LoginPage from '../auth/LoginPage';
import Policy from '../auth/PolicyPage';
import Privacy from '../auth/PrivacyPage';
import SignUpLandingPage from '../auth/SignUpLandingPage';
import SampleSubScreen2 from '../sample/SampleSubScreen2';
import ClassDetailPage from '../video/ClassDetailPage';
import HomePage from './HomePage';
import HomeSeriesPage from './HomeSeriesPage';
import SearchResultPage from './SearchResultPage';
import MembershipScreens from '../membership/MembershipScreen';
import CartScreen from '../cart/CartScreen';
import SerieseIntro from '../series/SeriesIntroPage';
import HomeSeriesListPage from './HomeSeriesListPage';
import HomeSeriesDetailPage from './HomeSeriesDetailPage';
import InnerWebViewPage from '../in_web/InnerWebViewPage';
import HomeBookDailyDetailPage from './HomeBookDailyDetailPage';

const HomeScreen = createStackNavigator(
  {
    HomeScreen: {
      screen: HomePage, // 사용하실 페이지용 컴퍼넌트를 제작하셔서 screen속성에 넣으면 됩니다.
      navigationOptions: NAV_OPTS_MAIN, // 로고를 포함한 메인헤더를 가질 페이지용 헤더 설정
    },
    HomeSeriesPage: {
      screen: HomeSeriesPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },

    HomeMonthlyReviewPage: {
      screen: AudioBookInfoPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },

    HomeScreen2: {
      screen: SampleSubScreen2,
      navigationOptions: NAV_OPTS_MAIN, // 로고없이 서브타이틀과 검색버튼을 가질 페이지용 헤더 설정
    },
    ClassDetail: {
      screen: ClassDetailPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },
    AudioBookDetail: {
      screen: AudioBookDetailPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },
    SearchResultPage: {
      screen: SearchResultPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },
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
    MembershipScreen: {
      screen: MembershipScreens,
      navigationOptions: {
        header: null,
      },
    },
    WebView: {
      screen: InAppWebView,
    },

    PrivacyPage: {
      screen: Privacy,
      // navigationOptions: NAV_OPTS_STACK,
    },

    PolicyPage: {
      screen: Policy,
      // navigationOptions: NAV_OPTS_STACK,
    },
    CartScreen: {
      screen: CartScreen,
    },
    Series_4genPage: {
      screen: SerieseIntro,
      navigationOptions: NAV_OPTS_STACK,
    },
    HomeSeriesListPage: {
      screen: HomeSeriesListPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },
    HomeSeriesDetailPage: {
      screen: HomeSeriesDetailPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },
    InnerWebViewPage: {
      screen: InnerWebViewPage,
      navigationOptions: NAV_OPTS_STACK,
    },
	HomeBookDailyDetailPage: {
	screen: HomeBookDailyDetailPage,
		navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
},
  },

  { navigationOptions: NAV_OPTS_COMMON }, // 공통 적용입니다.
);

HomeScreen.navigationOptions = NAV_OPTS_DRAWER; // 사이드바 목록에 노출되는 형태를 결정합니다.

export default HomeScreen;
