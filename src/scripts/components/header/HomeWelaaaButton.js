import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import logo from '../../../images/welaaa_logo.png';
import CommonStyles from '../../../styles/common';
import nav from '../../commons/nav';

class HomeWelaaaButton extends Component {
  onBackPress = () => {
    nav.goBack();
  };

  onTitlePress = () => {
    nav.goHome();
  };

  render() {
    return (
      <View style={[CommonStyles.container]}>
        <TouchableOpacity activeOpacity={0.9} onPress={this.onTitlePress}>
          <Image source={logo} style={[CommonStyles.headerLogo]} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default HomeWelaaaButton;
