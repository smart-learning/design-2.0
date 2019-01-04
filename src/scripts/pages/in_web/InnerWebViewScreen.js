import { createStackNavigator, navigationOptions } from 'react-navigation';
import {
  NAV_OPTS_COMMON,
  NAV_OPTS_DRAWER,
  NAV_OPTS_STACK_HISTORY_BACK,
} from '../../commons/nav';
import InnerWebViewPage from './InnerWebViewPage';

const InnerWebViewScreen = createStackNavigator(
  {
    InnerWebViewPage: {
      screen: InnerWebViewPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK,
    },
  },

  { navigationOptions: NAV_OPTS_COMMON },
);

export default InnerWebViewScreen;
