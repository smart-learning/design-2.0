import React from 'react';
import { View } from 'react-native';
import BookRankListItemComponent from './BookRankListItemComponent';

export default class BookRankListItem  extends React.Component {
  render() {
    return (
      <View>
        <BookRankListItemComponent itemData={this.props.itemData[0]} />
        <BookRankListItemComponent itemData={this.props.itemData[1]} />
        <BookRankListItemComponent itemData={this.props.itemData[2]} />
      </View>
    );
  }
}