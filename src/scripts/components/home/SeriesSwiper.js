import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native';
import { withNavigation } from 'react-navigation';
import _ from 'underscore';
import Carousel from 'react-native-snap-carousel';
import Dummy from '../../../images/dummy-series.png';

const styles = StyleSheet.create({
  slide: {
    width: Dimensions.get('window').width * 0.8,
    // paddingHorizontal: 10
  },
  slideInnerContainer: {
    flex: 1,
    width: Dimensions.get('window').width
  },
  thumbnail: {
    width: '100%',
    paddingTop: '70%',
    paddingBottom: '70%'
  }
});

class SeriesSwiper extends React.Component {
  _renderItem({ item }) {
    return (
      <View style={styles.slide}>
        <TouchableOpacity activeOpacity={0.9}>
          <ImageBackground
            source={Dummy}
            resizeMode="contain"
            style={styles.thumbnail}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    // let itemData = [];
    // if (_.isObject(this.props.itemData)) {
    //   itemData = this.props.itemData;
    // }

    let windowWidth = Dimensions.get('window').width;
    let itemWidth = windowWidth * 0.8;

    return (
      <View style={styles.classContainer}>
        <Carousel
          data={this.props.itemData}
          renderItem={this._renderItem}
          sliderWidth={windowWidth}
          itemWidth={itemWidth}
		  layout={'stack'}
		  inactiveSlideScal={0.8}
		  inactiveSlideOpacity={0.8}
		  loopClonesPerSide={5}
		  loop={true}
        />
      </View>
    );
  }
}

export default withNavigation(SeriesSwiper);
