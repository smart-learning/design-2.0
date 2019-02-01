import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import IcPlay from '../../../images/ic-class-continue-play.png';
import Native from '../../commons/native';
import Carousel from 'react-native-snap-carousel';
import _ from 'underscore';
import ClassContinueListItem from './ClassContinueListItem';

const styles = StyleSheet.create({
  classContainer: {},
  slide: {
    width: Dimensions.get('window').width * 0.55,
    paddingRight: 10,
  },
  slideInnerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

export default class ClassContinueList extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderItem({ item }) {
    return (
      <View style={styles.slide}>
        <ClassContinueListItem
          itemData={item}
          style={styles.slideInnerContainer}
        />
      </View>
    );
  }

  render() {
    let originData = [];
    let itemData = [];
    if (_.isObject(this.props.itemData)) {
      originData = _.map(this.props.itemData, item => item);
      itemData = originData.slice(0, 5);
    }

    let windowWidth = Dimensions.get('window').width;
    let itemWidth = windowWidth * 0.55;

    return (
      <View style={styles.classContainer}>
        {this.props.itemData && this.props.itemData.length > 0 && (
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
        )}
      </View>
    );
  }
}
