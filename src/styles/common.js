import {StyleSheet} from "react-native";

/*
* '속성이름_구분값' 의 형태로 자주 쓰는 값들 정의
* */
export const COLOR_PRIMARY = 'red'; // 대충 넣어놓은거에여..
export const COLOR_SECOND = '#0000'; // 이것도 임시에여. 마음껏 수정부탁드립니다.



export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#CCCCCC',
        alignItems: 'center',
        justifyContent: 'center',
    },

    size24:{
        width: 24,
        height: 24,
    },


    // 정렬관련
    alignJustify:{
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-between'
    }

});
