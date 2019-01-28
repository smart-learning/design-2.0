import React from 'react';
import { View } from 'react-native';
import ClipRankItemComponent from './ClipRankItemCompnent';

export default class ClipRankItem extends React.Component {
  render() {
    return (
      <View>
        <ClipRankItemComponent itemData={this.props.itemData[0]} />
        <ClipRankItemComponent itemData={this.props.itemData[1]} />
        <ClipRankItemComponent itemData={this.props.itemData[2]} />
        <ClipRankItemComponent itemData={this.props.itemData[3]} />
        <ClipRankItemComponent itemData={this.props.itemData[4]} />
      </View>
    );
  }
}
