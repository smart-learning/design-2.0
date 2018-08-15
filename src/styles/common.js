import React from "react";
import { StyleSheet } from "react-native";

/*
* '속성이름_구분값' 의 형태로 자주 쓰는 값들 정의
* */
export const COLOR_PRIMARY = '#00b870';
export const TEXT_PRIMARY = '#14C27A';
export const COLOR_SECOND = '#0000'; // 이것도 임시에여. 마음껏 수정부탁드립니다.

const commonStyle = StyleSheet.create( {
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},

	headerLogo: {
		width: 44,
		height: 24,
		marginLeft: 'auto',
		marginRight: 'auto',
	},

	size24: {
		width: 24,
		height: 24,
	},

	// 정렬관련
	alignJustifyFlex: {
		flex: 1,
		flexDirection: 'row',
	},
	alignJustifyContentBetween: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},

	alignJustifyItemCenter: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},

	// 좌우여백
	contentContainer: {
		marginLeft: 13,
		marginRight: 13,
	},

	// 가득찬 이미지용
	fullImg:{
		width:'100%',
		height:'100%'
	}
} );

// default export 만 import 한 상태에서도 속성을 사용할 수 있도록 하기 위해 한번 더 할당
commonStyle.COLOR_PRIMARY = COLOR_PRIMARY;
commonStyle.COLOR_SECOND = COLOR_SECOND;

export default commonStyle;