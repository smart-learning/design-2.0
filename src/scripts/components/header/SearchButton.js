import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import IcSearch from '../../../images/ic-search.png';
import Styles from '../../../styles/common';

class SearchButton extends Component {
  constructor(props) {
    super(props);
    const isIos = Platform.OS === 'ios';
    this.state = {
      isIos: isIos,
      isExpanded: false,
      queryString: '',
    };
  }

  componentWillMount() {
    this._isMount = true;
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  onSearch = () => {
    if (this.state.isExpanded) {
      if (this.state.queryString) {
        this.props.navigation.navigate('SearchResultPage', {
          title: '검색 결과',
          queryString: this.state.queryString,
        });
      }
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
          justifyContent: 'center',
        }}
        activeOpacity={0.9}
        onPress={this.onSearch}
      >
        <Image
          source={IcSearch}
          style={[
            Styles.size24,
            {
              marginRight: 5,
              width: 30,
              height: 30,
            },
          ]}
        />
      </TouchableOpacity>
    );
  }

  renderQueryTextInput() {
    const { width } = Dimensions.get('window');
    const padding = this.state.isIos ? 115 : 152;
    const textInfoWidth = width - padding;

    return (
      <TextInput
        style={{
          width: textInfoWidth,
          paddingStart: 20,
          paddingEnd: 20,
          paddingTop: 10,
          paddingBottom: 10,
          fontSize: 16,
          backgroundColor: '#ffffff',
          borderColor: Styles.COLOR_PRIMARY,
          borderWidth: 6,
          marginRight: 8,
        }}
        underlineColorAndroid={'rgba(0,0,0,0)'}
        autoCapitalize={'none'}
        onSubmitEditing={this.onSearch}
        multiline={false}
        numberOfLines={1}
        onChangeText={this.onChangeText}
        value={this.state.queryString}
        placeholder="검색"
        autoFocus={true}
        ref={ref => {
          this.queryTextInputRef = ref;
        }}
      />
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
        }}
      >
        {this.state.isExpanded && this.renderQueryTextInput()}
        {this.renderSearchIcon()}
      </View>
    );
  }
}

export default SearchButton;
