import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import IcPlay from '../../../images/ic-play-green.png';
import Native from '../../commons/native';
import Carousel from 'react-native-snap-carousel';
import _ from 'underscore';

const styles = StyleSheet.create({
  continueList: {
    marginTop: 20,
  },
  slide: {
    width: Dimensions.get('window').width * 0.84,
    paddingRight: 10,
  },
  slideInnerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  continueItem: {
    position: 'relative',
    width: '100%',
    height: 62,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  play: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  continueText: {
    width: '60%',
    paddingLeft: 12,
  },
  continueTitle: {
    marginBottom: 5,
    fontSize: 14,
    color: '#353A3C',
  },
  continueName: {
    fontSize: 13,
    color: '#767B80',
  },
});

export default class BookContinueList extends React.Component {
  _renderItem({ item }) {
    return (
      <View style={styles.slide}>
        <View style={[styles.continueItem, CommonStyles.alignJustifyFlex]}>
          <ImageBackground
            source={{
              uri: item.data?.images?.list,
            }}
            resizeMode={'cover'}
            style={styles.thumbnail}
          />
          <View style={styles.continueText}>
            <Text
              style={styles.continueTitle}
              ellipsizeMode={'tail'}
              numberOfLines={1}
            >
              {item.data.title}
            </Text>
            <Text
              style={styles.continueName}
              ellipsizeMode={'tail'}
              numberOfLines={1}
            >
              {item.data?.teacher?.name}
            </Text>
          </View>
          <View style={{ marginLeft: 'auto' }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => Native.play(item.data.cid)}
            >
              <Image source={IcPlay} style={styles.play} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    let windowWidth = Dimensions.get('window').width;
    let itemWidth = windowWidth * 0.84;

    let originData = _.map(this.props.itemData, item => item);
    let itemData = originData.slice(0, 5);

    return (
      <View style={styles.continueList}>
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
