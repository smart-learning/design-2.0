import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ClassListItem from './ClassListItem';
import { observer } from 'mobx-react';
import Carousel from 'react-native-snap-carousel';

const styles = StyleSheet.create({
  classContainer: {
    marginTop: 20,
    marginBottom: 30
  },
  slide: {
    width: Dimensions.get('window').width * 0.84,
    paddingHorizontal: 10
  },
  slideInnerContainer: {
    flex: 1,
    width: Dimensions.get('window').width
  }
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

    return (
      <View style={styles.classContainer}>
        <Carousel
          data={this.props.itemData}
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
