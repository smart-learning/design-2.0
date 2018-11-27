import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import withNavigation from 'react-navigation/src/views/withNavigation';
import globalStore from '../../commons/store';
import IconBadge from 'react-native-icon-badge';
import { observer } from 'mobx-react';

@observer
class CartButton extends Component {
  onPress = () => {
    this.props.navigation.navigate('CartScreen');
  };

  renderIcon() {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={this.onPress}>
        <View
          style={{
            backgroundColor: '#489EFE',
            width: 36,
            height: 36,
            margin: 6
          }}
        />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <IconBadge
          MainElement={this.renderIcon()}
          BadgeElement={
            <Text style={{ color: '#FFFFFF' }}>
              {globalStore.cartItemCount}
            </Text>
          }
          IconBadgeStyle={{
            width: 20,
            height: 20,
            backgroundColor: '#FF00EE'
          }}
          Hidden={globalStore.cartItemCount === 0}
        />
      </View>
    );
  }
}

export default withNavigation(CartButton);
