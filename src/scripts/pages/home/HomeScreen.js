import React from "react";
import {createStackNavigator} from "react-navigation";
import HomeSubScreen1 from "./HomeSubScreen1";
import HomeSubScreen2 from "./HomeSubScreen2";
import {NAV_OPTS_STACK_WITH_SEARCH, NAV_OPTS_MAIN, NAV_OPTS_DRAWER, NAV_OPTS_COMMON} from "../../commons/nav";


const HomeScreen = createStackNavigator({

		// 키이름은 변경 가능합니다. 1,2로 되있는건 테스트 페이지라...
        HomeScreen1: {
            screen: HomeSubScreen1, // 사용하실 페이지용 컴퍼넌트를 제작하셔서 screen속성에 넣으면 됩니다.
            navigationOptions: NAV_OPTS_MAIN, // 로고를 포함한 메인헤더를 가질 페이지용 헤더 설정
        },

        HomeScreen2: {
            screen: HomeSubScreen2,
            navigationOptions: NAV_OPTS_MAIN, // 로고없이 서브타이틀과 검색버튼을 가질 페이지용 헤더 설정
        }
    },

    { navigationOptions: NAV_OPTS_COMMON } // 공통 적용입니다.
);

HomeScreen.navigationOptions = NAV_OPTS_DRAWER; // 사이드바 목록에 노출되는 형태를 결정합니다.

export default HomeScreen;