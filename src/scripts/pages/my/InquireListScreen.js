import React from 'react';
import {
  NAV_OPTS_COMMON,
  NAV_OPTS_MAIN,
  NAV_OPTS_DRAWER,
  NAV_OPTS_STACK_WITH_SEARCH,
  NAV_OPTS_STACK_HISTORY_BACK,
  NAV_OPTS_STACK
} from '../../commons/nav';
import { createStackNavigator } from 'react-navigation';
import InquireListPage from './InquireListPage';
import InquireViewPage from './InquireViewPage';
import InquireFormPage from './InquireFormPage';

const InquireListScreen = createStackNavigator(
  {
    InquireListPage: {
      screen: InquireListPage,
      navigationOptions: options => {
        let navOpions = NAV_OPTS_STACK_HISTORY_BACK(options);
        return { ...navOpions, title: '1:1 문의' };
      }
    },
    InquireViewPage: {
      screen: InquireViewPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK
    },
    InquireFormPage: {
      screen: InquireFormPage,
      navigationOptions: NAV_OPTS_STACK_HISTORY_BACK
    }
  },

  { navigationOptions: NAV_OPTS_COMMON }
);

InquireListScreen.navigationOptions = NAV_OPTS_DRAWER;

export default InquireListScreen;
