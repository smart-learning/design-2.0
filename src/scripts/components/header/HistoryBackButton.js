import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import IcBack from '../../../images/ic-back.png';
import CommonStyles from '../../../styles/common';
import nav from '../../commons/nav';

class HistoryBackButton extends Component {
  historyBack = event => {
    nav.goBack();
  };

  render() {
    return (
      <TouchableOpacity onPress={this.historyBack}>
        <Image
          source={IcBack}
          style={[CommonStyles.size24, { marginLeft: 15 }]}
        />
      </TouchableOpacity>
    );
  }
}

export default withNavigation(HistoryBackButton);
