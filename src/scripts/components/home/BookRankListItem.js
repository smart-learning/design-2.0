import React from 'react';
import { View } from 'react-native';
import BookRankListItemComponent from './BookRankListItemComponent';

export default class BookRankListItem extends React.Component {
  render() {
    return (
      <View>
        {this.props.itemData.map((item, key) => {
          if (item === undefined) {
            return null;
          } else {
            return <BookRankListItemComponent itemData={item} key={key} />;
          }
        })}
      </View>
    );
  }
}
