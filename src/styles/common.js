import React from "react";
import {StyleSheet} from "react-native";

/*
* '속성이름_구분값' 의 형태로 자주 쓰는 값들 정의
* */
export const COLOR_PRIMARY = '#00b870';
export const COLOR_SECOND = '#0000'; // 이것도 임시에여. 마음껏 수정부탁드립니다.

export default StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: '#CCCCCC',
		alignItems: 'center',
		justifyContent: 'center',
	},

	headerLogo: {
		width: 44,
		height: 24,
	},

	size24: {
		width: 24,
		height: 24,
	},

	// 정렬관련
	alignJustify: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	}

});
