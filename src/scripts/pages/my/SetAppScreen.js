import { createStackNavigator } from 'react-navigation';
import {
  NAV_OPTS_COMMON,
  NAV_OPTS_DRAWER,
  NAV_OPTS_STACK_HISTORY_BACK
} from '../../commons/nav';
import SetAppPage from './SetAppPage';

const SetAppScreen = createStackNavigator(
  {
    SetAppPage: {
      screen: SetAppPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK
    }
  },
  { navigationOptions: NAV_OPTS_COMMON }
);

SetAppScreen.navigationOptions = NAV_OPTS_DRAWER;

export default SetAppScreen;
