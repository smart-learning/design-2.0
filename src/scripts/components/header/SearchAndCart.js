import React, { Component } from 'react'
import SearchButton from './SearchButton'
import CartButton from './CartButton'
import { View } from 'react-native'

export default class SearchAndCartButton extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',

          borderWidth: 1,
          borderColor: 'red'
        }}
      >
        <SearchButton navigation={this.props.navigation} />
        <CartButton />
      </View>
    );
  }
}
