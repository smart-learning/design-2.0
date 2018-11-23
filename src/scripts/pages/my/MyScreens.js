import { createStackNavigator } from 'react-navigation';
import {
  NAV_OPTS_DRAWER,
  NAV_OPTS_STACK,
  NAV_OPTS_STACK_HISTORY_BACK
} from '../../commons/nav';
import globalStore from '../../commons/store';
import AudioBookDetailPage from '../audio/AudioBookDetailPage';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import EmailSignUpForm from '../auth/EmailSignUpForm';
import FindPasswordPage from '../auth/FindPasswordPage';
import LoginPage from '../auth/LoginPage';
import Policy from '../auth/PolicyPage';
import Privacy from '../auth/PrivacyPage';
import SignUpLandingPage from '../auth/SignUpLandingPage';
import ClassDetailPage from '../video/ClassDetailPage';
import AudioBookBuyPage from './AudioBookBuyPage';
import AudioBookTicketPage from './AudioBookTicketPage';
import AudioBookUsePage from './AudioBookUsePage';
import ClipPlayListPage from './ClipPlayListPage';
import DownloadContentPage from './DownloadContentPage';
import EventDetailPage from './EventDetailPage';
import EventListPage from './EventListPage';
import FriendPage from './FriendPage';
import GuideListPage from './GuideListPage';
import GuideViewPage from './GuideViewPage';
import InquireFormPage from './InquireFormPage';
import InquireListPage from './InquireListPage';
import InquireViewPage from './InquireViewPage';
import LectureBuyPage from './LectureBuyPage';
import LectureUsePage from './LectureUsePage';
import MyInfoHome from './MyInfoHome';
import MyLogPage from './MyLogPage';
import SetAppPage from './SetAppPage';
import SetTagPage from './SetTagPage';
import UserHeartContentsPage from './UserHeartContentsPage';

const MyScreens = createStackNavigator(
  {
    MyInfoHome: {
      screen: MyInfoHome,
      navigationOptions: { header: null }
    },

    FindPassword: {
      screen: FindPasswordPage
    },

    Login: {
      screen: LoginPage,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },

    SignUpPage: {
      screen: SignUpLandingPage
    },

    PrivacyPage: {
      screen: Privacy
      // navigationOptions: NAV_OPTS_STACK,
    },

    PolicyPage: {
      screen: Policy
      // navigationOptions: NAV_OPTS_STACK,
    },

    EmailSignUpForm: {
      screen: EmailSignUpForm
    },

    //------------------------ before Auth ----------------------------------
    AuthCheck: {
      screen: AuthLoadingScreen
    },
    //------------------------ after Auth -----------------------------------
    SetAppPage: {
      screen: SetAppPage,
      navigationOptions: NAV_OPTS_STACK
    },
    LectureUsePage: {
      screen: LectureUsePage,
      navigationOptions: NAV_OPTS_STACK
    },
    LectureBuyPage: {
      screen: LectureBuyPage,
      navigationOptions: NAV_OPTS_STACK
    },
    AudioBookTicketPage: {
      screen: AudioBookTicketPage,
      navigationOptions: NAV_OPTS_STACK
    },
    AudioBookUsePage: {
      screen: AudioBookUsePage,
      navigationOptions: NAV_OPTS_STACK
    },
    AudioBookBuyPage: {
      screen: AudioBookBuyPage,
      navigationOptions: NAV_OPTS_STACK
    },
    ClassDetail: {
      screen: ClassDetailPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK
    },
    AudioBookDetail: {
      screen: AudioBookDetailPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK
    },
    DownloadContentPage: {
      screen: DownloadContentPage,
      navigationOptions: NAV_OPTS_STACK
    },
    SetTagPage: {
      screen: SetTagPage,
      navigationOptions: NAV_OPTS_STACK
    },
    ClipPlayListPage: {
      screen: ClipPlayListPage,
      navigationOptions: NAV_OPTS_STACK
    },
    UserHeartContentsPage: {
      screen: UserHeartContentsPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK
    },
    MyLogPage: {
      screen: MyLogPage,
      navigationOptions: NAV_OPTS_STACK
    },
    FriendPage: {
      screen: FriendPage,
      navigationOptions: NAV_OPTS_STACK
    },
    GuideListPage: {
      screen: GuideListPage,
      navigationOptions: NAV_OPTS_STACK
    },
    GuideViewPage: {
      screen: GuideViewPage,
      navigationOptions: NAV_OPTS_STACK
    },
    InquireListPage: {
      screen: InquireListPage,
      navigationOptions: NAV_OPTS_STACK
    },
    InquireViewPage: {
      screen: InquireViewPage,
      navigationOptions: NAV_OPTS_STACK
    },
    InquireFormPage: {
      screen: InquireFormPage,
      navigationOptions: NAV_OPTS_STACK
    },
    EventListPage: {
      screen: EventListPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK
    },
    EventDetailPage: {
      screen: EventDetailPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK
    }
  },

  globalStore.initialRoute
);

MyScreens.navigationOptions = NAV_OPTS_DRAWER;

export default MyScreens;
