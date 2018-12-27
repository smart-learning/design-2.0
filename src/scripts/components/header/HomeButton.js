import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import CommonStyles from '../../../styles/common';
import IcBars from '../../../images/ic-bars.png';
import nav from '../../commons/nav';

class HomeButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          nav.toggleDrawer();
        }}
      >
        <Image
          source={IcBars}
          style={[
            CommonStyles.size24,
            {
              width: 30,
              height: 30,
              marginLeft: 15,
            },
          ]}
        />
      </TouchableOpacity>
    );
  }
}

export default HomeButton;
