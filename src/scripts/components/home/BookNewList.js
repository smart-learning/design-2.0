import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { observer } from 'mobx-react';
import Carousel from 'react-native-snap-carousel';
import BookNewListItem from './BookNewListItem';
import _ from 'underscore';

const styles = StyleSheet.create({
  classContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  slide: {
    width: Dimensions.get('window').width * 0.37,
    paddingHorizontal: 10,
  },
  slideInnerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

@observer
class BookNewList extends React.Component {
  _renderItem({ item }) {
    return (
      <View style={styles.slide}>
        <BookNewListItem
          id={item.id}
          itemData={item}
          style={styles.slideInnerContainer}
        />
      </View>
    );
  }

  render() {
    let windowWidth = Dimensions.get('window').width;
    let itemWidth = windowWidth * 0.37;

    let itemData = _.map(this.props.itemData, item => item);

    return (
      <View style={styles.classContainer}>
        {/*{this.props.itemData > 0 && (*/}
        <Carousel
          data={itemData}
          renderItem={this._renderItem}
          sliderWidth={windowWidth}
          itemWidth={itemWidth}
          layout={'default'}
          activeSlideAlignment={'start'}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
        />
        {/*)}*/}
      </View>
    );
  }
}

export default BookNewList;
