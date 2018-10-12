import React, { Component } from 'react';
import { Image, View } from "react-native";
import Styles from "../../../styles/common";
import IcSearch from "../../../images/ic-search.png"

class SearchButton extends Component {

	onSearch = () => {
		// /api/v1.0/contents/contents/search
		// 1:1 문의 게시판 처럼 , 뷰를 만들고 . 키워드를 입력 , 리절트를 표현한다. 
		// 
		// 클래스 클릭시 클래스 상세 페이지 , 랜딩 
		// 오디오북 클릭시 오디오북 상세 페이지 , 랜딩 
	}

	render() {
		return

		<View>
			<TouchableOpacity activeOpacity={0.9}
				onPress={this.onSearch}
			>
				<Image source={IcSearch} style={[Styles.size24, { marginRight: 15 }]} />
			</TouchableOpacity>
		</View>;
	}
}

export default SearchButton;
