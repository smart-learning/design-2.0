import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import SearchButton from './SearchButton';
import CartButton from './CartButton';

export default class SearchAndCartButton extends Component {
  render() {
    const isIos = Platform.OS === 'ios';

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginRight: 12,
        }}
      >
        <SearchButton navigation={this.props.navigation} />
        {!isIos && <CartButton />}
      </View>
    );
  }
}
