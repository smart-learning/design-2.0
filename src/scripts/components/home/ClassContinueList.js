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
    paddingTop: '20%',
    paddingBottom: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
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
    width: 44,
    height: 44,
  },
});

export default class ClassContinueList extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderItem({ item }) {
    return (
      <View borderRadius={10}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => Native.play(item.data.cid)}
        >
          <ImageBackground
            source={{ uri: item.data.images ? item.data.images.wide : null }}
            resizeMode="cover"
            style={styles.thumbnail}
            borderRadius={10}
          >
            <Text
              style={styles.thumbnailTitle}
              ellipsizeMode={'tail'}
              numberOfLines={1}
            >
              {item.data.headline}
            </Text>
            <View style={styles.play}>
              <Image source={IcPlay} style={CommonStyles.fullImg} />
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let windowWidth = Dimensions.get('window').width;
    let itemWidth = 270;

    let originData = _.map(this.props.itemData, item => item);
    let itemData = originData.slice(0, 5);

    return (
      <View>
        {this.props.itemData && this.props.itemData.length > 0 && (
          <Carousel
            data={itemData}
            renderItem={this._renderItem}
            sliderWidth={windowWidth}
            itemWidth={itemWidth}
            layout={'default'}
            activeSlideAlignment={'start'}
            inactiveSlideOpacity={1}
            inactiveSlideScale={0.95}
          />
        )}
      </View>
    );
  }
}
