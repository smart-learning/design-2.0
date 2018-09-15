import React from "react";
import {createStackNavigator} from "react-navigation";
import HomePage from "./HomePage";
import SampleSubScreen2 from '../sample/SampleSubScreen2';
import {
	NAV_OPTS_MAIN,
	NAV_OPTS_DRAWER,
	NAV_OPTS_COMMON,
	NAV_OPTS_STACK_HISTORY_BACK, NAV_OPTS_STACK,
} from "../../commons/nav";
import HomeSeriesPage from "./HomeSeriesPage";
import AudioBookInfoPage from "../audio/AudioBookInfoPage";


const HomeScreen = createStackNavigator({

        HomeScreen: {
            screen: HomePage, // 사용하실 페이지용 컴퍼넌트를 제작하셔서 screen속성에 넣으면 됩니다.
            navigationOptions: NAV_OPTS_MAIN, // 로고를 포함한 메인헤더를 가질 페이지용 헤더 설정
        },

		HomeSeriesPage: {
			screen: HomeSeriesPage,
			navigationOptions: NAV_OPTS_STACK,
		},

		HomeMonthlyReviewPage: {
			screen: AudioBookInfoPage,
			navigationOptions: NAV_OPTS_STACK,
		},

        HomeScreen2: {
            screen: SampleSubScreen2,
            navigationOptions: NAV_OPTS_MAIN, // 로고없이 서브타이틀과 검색버튼을 가질 페이지용 헤더 설정
        },

    },

    { navigationOptions: NAV_OPTS_COMMON } // 공통 적용입니다.
);

HomeScreen.navigationOptions = NAV_OPTS_DRAWER; // 사이드바 목록에 노출되는 형태를 결정합니다.

export default HomeScreen;