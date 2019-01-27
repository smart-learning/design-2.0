import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { observer } from 'mobx-react';
import Carousel from 'react-native-snap-carousel';
import BookRankListItem from './BookRankListItem';
import _ from 'underscore';

const styles = StyleSheet.create({
  classContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  slide: {
    width: Dimensions.get('window').width * 0.55,
    paddingRight: 10,
  },
  slideInnerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

@observer
class BookRankList extends React.Component {
  _renderItem({ item }) {
    return (
      <View style={styles.slide}>
        <BookRankListItem
          id={item.id}
          itemData={item}
          style={styles.slideInnerContainer}
        />
      </View>
    );
  }

  render() {
    let originData = _.map(this.props.itemData, item => item);
    let itemData = originData.slice(0, 15);
    let list = [];
    let rankList = [];

    if (this.props.itemData && this.props.itemData.length > 0) {
      list = _.map(itemData, item => item);

      for (let i = 0; i < Math.ceil(list.length / 3); i++) {
        let rankObject = [];

        rankObject.push(list[i * 3]);
        rankObject.push(list[i * 3 + 1]);
        rankObject.push(list[i * 3 + 2]);

        rankList.push(rankObject);
      }
    }

    this.props.itemData.forEach((element, n) => {
      element.rankNumber = n + 1;
    });
    let windowWidth = Dimensions.get('window').width;
    let itemWidth = 200;

    return (
      <View style={styles.classContainer}>
        <Carousel
          data={rankList}
          renderItem={this._renderItem}
          sliderWidth={windowWidth}
          itemWidth={itemWidth}
          layout={'default'}
          activeSlideAlignment={'start'}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
        />
      </View>
    );
  }
}

export default BookRankList;
