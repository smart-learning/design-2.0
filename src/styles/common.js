import {StyleSheet} from "react-native";

/*
* '속성이름_구분값' 의 형태로 자주 쓰는 값들 정의
* */
export const COLOR_PRIMARY = 'red';
export const COLOR_SECOND = '#0000';



export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#CCCCCC',
        alignItems: 'center',
        justifyContent: 'center',
    },

    sidebarIcon:{
        width: 24,
        height: 24,
    },

});