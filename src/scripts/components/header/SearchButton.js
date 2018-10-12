import React, { Component } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import IcSearch from '../../../images/ic-search.png';
import Styles from '../../../styles/common';

export default class SearchButton extends Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false, queryString: '' };
  }

  componentWillMount() {
    this._isMount = true;
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  shouldComponentUpdate() {
    return this._isMount;
  }

  onSearch = () => {
    if (this.state.isExpanded) {
      this.props.navigation.navigate('SearchResultPage', {
        title: '검색 결과',
        queryString: this.state.queryString
      });
      // /api/v1.0/contents/contents/search
      // 1:1 문의 게시판 처럼 , 뷰를 만들고 . 키워드를 입력 , 리절트를 표현한다.
      //
      // 클래스 클릭시 클래스 상세 페이지 , 랜딩
      // 오디오북 클릭시 오디오북 상세 페이지 , 랜딩
    }
    this.setState(previousState => {
      return { isExpanded: !previousState.isExpanded, queryString: '' };
    });
  };

  onChangeText = text => {
    this.setState(previousState => {
      previousState.queryString = text;
      return previousState;
    });
  };

  renderSearchIcon() {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        activeOpacity={0.9}
        onPress={this.onSearch}
      >
        <Image
          source={IcSearch}
          style={[
            Styles.size24,
            {
              marginRight: 15
            }
          ]}
        />
      </TouchableOpacity>
    );
  }

  renderQueryTextInput() {
    return (
      <TextInput
        style={{
          width: 300,
          padding: 10,
          fontSize: 20,
          backgroundColor: '#ffffff',
          borderColor: Styles.COLOR_PRIMARY,
          borderWidth: 6,
          marginRight: 15
        }}
        multiline={false}
        numberOfLines={1}
        onChangeText={this.onChangeText}
        value={this.state.queryString}
        placeholder="Search"
      />
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row'
        }}
      >
        {this.state.isExpanded && this.renderQueryTextInput()}
        {this.renderSearchIcon()}
      </View>
    );
  }
}
