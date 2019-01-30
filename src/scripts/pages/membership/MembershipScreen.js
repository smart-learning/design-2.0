import { createStackNavigator, navigationOptions } from 'react-navigation';
import {
  NAV_OPTS_COMMON,
  NAV_OPTS_DRAWER,
  NAV_OPTS_STACK_HISTORY_BACK,
} from '../../commons/nav';
import MembershipDetailPage from './MembershipDetailPage';
import MembershipFormPage from './MembershipFormPage';
import MembershipPage from './MembershipPage';

const MembershipScreen = createStackNavigator(
  {
    MembershipPage: {
      screen: MembershipPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },
    MembershipFormPage: {
      screen: MembershipFormPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },
    MembershipDetailPage: {
      screen: MembershipDetailPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },
  },

  { navigationOptions: NAV_OPTS_COMMON },
);

export default MembershipScreen;
