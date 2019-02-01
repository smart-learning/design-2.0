import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ClassListItem from './ClassListItem';
import { observer } from 'mobx-react';
import Carousel from 'react-native-snap-carousel';
import _ from 'underscore';

const styles = StyleSheet.create({
  classContainer: {
    marginTop: 15,
  },
  slide: {
    width: Dimensions.get('window').width * 0.84,
    paddingRight: 10,
  },
  slideInnerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

@observer
class ClassList extends React.Component {
  _renderItem({ item }) {
    return (
      <View style={styles.slide}>
        <ClassListItem
          id={item.id}
          itemData={item}
          style={styles.slideInnerContainer}
        />
      </View>
    );
  }

  render() {
    let windowWidth = Dimensions.get('window').width;
    let itemWidth = windowWidth * 0.84;

    let originData = _.map(this.props.itemData, item => item);
    let itemData = [];

    if (this.props.itemType === 'recommend') {
      itemData = originData.slice(0, 5);
    } else {
      itemData = originData.slice(0, 10);
    }
    return (
      <View style={styles.classContainer}>
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
      </View>
    );
  }
}

export default ClassList;
