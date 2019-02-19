import React from 'react';
import { View } from 'react-native';
import ClipRankItemComponent from './ClipRankItemCompnent';
export default class ClipRankItem extends React.Component {
  render() {
    return (
      <View>
        {this.props.itemData.map((item, key) => {
          if (item === undefined) {
            return null;
          } else {
            return <ClipRankItemComponent itemData={item} key={key} />;
          }
        })}
      </View>
    );
  }
}
