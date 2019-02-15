import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CommonStyles from '../../../styles/common';
import IcPlay from '../../../images/ic-play-class-continue.png';
import Native from '../../commons/native';
import Carousel from 'react-native-snap-carousel';
import _ from 'underscore';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  continueGrid: {
    marginTop: 20,
  },
  continueItem: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  thumbnail: {
    position: 'relative',
    width: '100%',
    paddingTop: '20.416666666%',
    paddingBottom: '20.416666666%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 4,
  },
  thumbnailTitle: {
    position: 'absolute',
    top: 10,
    left: '8%',
    width: '84%',
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  play: {
    position: 'absolute',
    left: '50%',
    top: '45%',
    width: 40,
    height: 40,
    marginLeft: -20,
  },
});

export default class ClassContinueListItem extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View borderRadius={10}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => Native.play(this.props.itemData.data.cid)}
        >
          <FastImage
            source={{
              uri: this.props.itemData.data.images
                ? this.props.itemData.data.images.wide
                : null,
            }}
            resizeMode="cover"
            style={styles.thumbnail}
          >
            <Text
              style={styles.thumbnailTitle}
              ellipsizeMode={'tail'}
              numberOfLines={1}
            >
              {this.props.itemData.data.headline}
            </Text>
            <View style={styles.play}>
              <Image source={IcPlay} style={CommonStyles.fullImg} />
            </View>
          </FastImage>
        </TouchableOpacity>
      </View>
    );
  }
}
