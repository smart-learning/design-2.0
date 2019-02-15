import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import _ from 'underscore';
import Carousel from 'react-native-snap-carousel';
import SeriesSwiperItem from './SeriesSwiperItem';
import { observer } from 'mobx-react';

const styles = StyleSheet.create({
  slide: {
    width: Dimensions.get('window').width * 0.8,
  },
  slideInnerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

@observer
class SeriesSwiper extends React.Component {
  _renderItem({ item }) {
    return (
      <View style={styles.slide}>
        <SeriesSwiperItem itemData={item} />
      </View>
    );
  }

  render() {
    let itemData = [];
    if (_.isObject(this.props.itemData)) {
      itemData = _.map(this.props.itemData, item => item);
    }

    let windowWidth = Dimensions.get('window').width;
    let itemWidth = windowWidth * 0.8;

    return (
      <View>
        <Carousel
          data={itemData}
          renderItem={this._renderItem}
          sliderWidth={windowWidth}
          itemWidth={itemWidth}
          layout={'stack'}
          inactiveSlideScal={0.8}
          inactiveSlideOpacity={0.8}
          firstItem={10}
          loopClonesPerSide={14}
          loop={true}
        />
      </View>
    );
  }
}

export default withNavigation(SeriesSwiper);
