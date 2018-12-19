import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { DrawerActions } from 'react-navigation';
import Store from '../../commons/store';
import CommonStyles from '../../../styles/common';
import IcBars from '../../../images/ic-bars.png';

class HomeButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          Store.drawer.dispatch(DrawerActions.toggleDrawer());
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
