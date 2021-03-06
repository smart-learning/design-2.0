import React from 'react';
import {
  Image,
  ImageBackground,
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Style, { COLOR_PRIMARY } from '../../../styles/common';
import CommonStyles from '../../../styles/common';
import IcFilm from '../../../images/icons/film.png';
import IcComment from '../../../images/icons/commenting.png';
import IcShare from '../../../images/ic-share-light.png';
import IcStar from '../../../images/icons/star.png';
import IcView from '../../../images/icons/eye.png';
import IcPlay from '../../../images/ic-play.png';
import Device from '../../commons/device';
import Native from '../../commons/native';
import numeral from 'numeral';
import _ from 'underscore';

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    position: 'relative'
  },
  thumbnail: {
    position: 'relative',
    width: '100%',
    paddingTop: '22%',
    paddingBottom: '22%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef'
  },
  thumbnailTitle: {
    position: 'absolute',
    top: 15,
    left: '5%',
    width: '70%',
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {
      width: 1,
      height: 2
    },
    textShadowRadius: 4
  },
  clipIcon: {
    position: 'absolute',
    bottom: '30%',
    left: '5%'
  },
  clipCount: {
    position: 'absolute',
    bottom: '30%',
    left: '11.5%',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  play: {
    position: 'absolute',
    right: 15,
    width: 42,
    height: 42
  },

  btnGroup: {
    width: '100%',
    height: 40,
    paddingRight: 12,
    paddingLeft: 12,
    backgroundColor: '#222222'
  },
  alignJustify: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnSetSmall: {
    width: 12,
    height: 12
  },
  btnSetLarge: {
    width: 24,
    height: 24
  },
  countText: {
    paddingLeft: 3,
    paddingRight: 7,
    fontSize: 12,
    color: '#ffffff'
  },
  playTimeText: {
    position: 'absolute',
    top: 25,
    right: 25,
    fontWeight: 'bold',
    fontSize: 25,
    color: '#ffffff'
  },
  playTimeTextInfo: {
    fontWeight: 'normal',
    fontSize: 13
  },
  detailClipView: {
    position: 'absolute',
    left: 15,
    bottom: 20,
    opacity: 0.8
  },
  detailClipPlay: {
    position: 'absolute',
    right: 15,
    bottom: 25,
    width: 50,
    height: 50
  },
  classLabel: {
    height: 22,
    marginRight: 3,
    marginBottom: 10,
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 3,
    paddingLeft: 10
  },
  classLabelText: {
    fontSize: 12,
    color: '#ffffff'
  },
  classLabelBlank: {
    borderColor: 'transparent',
    opacity: 0
  },
  classLabelNew: {
    backgroundColor: '#5f45b4'
  },
  classLabelExclusive: {
    backgroundColor: '#ff761b'
  },
  classLabelFree: {
    backgroundColor: '#00afba'
  }
});

export default class Summary extends React.Component {
  thumbnailUri = () => {
    if (this.props.classType === 'series') {
      return this.props.images.wide;
    } else if (this.props.type === 'detailClip') {
      return this.props.course.images.wide;
    } else {
      return this.props.thumbnail;
    }
  };

  render() {
    let starAvg = parseFloat(
      this.props.meta ? this.props.meta.star_average : this.props.star_avg
    ).toFixed(1);

    if (_.isNaN(starAvg)) {
      starAvg = 0;
    }

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity activeOpacity={0.9} onPress={this.props.onPress}>
          <View style={CommonStyles.alignJustifyFlex}>
            {!!this.props.is_new && (
              <View
                style={[styles.classLabel, styles.classLabelNew]}
                borderRadius={10}
              >
                <Text style={styles.classLabelText}>NEW</Text>
              </View>
            )}
            {!!this.props.is_featured && (
              <View
                style={[styles.classLabel, styles.classLabelFeatured]}
                borderRadius={10}
              >
                <Text style={styles.classLabelText}>추천</Text>
              </View>
            )}
            {!!this.props.is_exclusive && (
              <View
                style={[styles.classLabel, styles.classLabelExclusive]}
                borderRadius={10}
              >
                <Text style={styles.classLabelText}>독점</Text>
              </View>
            )}
            {!!this.props.is_free && (
              <View
                style={[styles.classLabel, styles.classLabelFree]}
                borderRadius={10}
              >
                <Text style={styles.classLabelText}>무료</Text>
              </View>
            )}
          </View>

          {this.props.type !== 'detailClip' &&
            this.props.type !== 'dailyBook' && (
              <ImageBackground
                source={{ uri: this.thumbnailUri() }}
                resizeMode="cover"
                style={styles.thumbnail}
              >
                <Text style={styles.thumbnailTitle}>{this.props.title}</Text>
                <Image
                  source={IcFilm}
                  style={[styles.btnSetSmall, styles.clipIcon]}
                />
                <Text style={styles.clipCount}>
                  {this.props.clip_count}개 강의
                </Text>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.play}
                  onPress={() => Native.play(`${this.props.cid}_001`)}
                >
                  <Image source={IcPlay} style={Style.fullImg} />
                </TouchableOpacity>
              </ImageBackground>
            )}
          {this.props.type === 'detailClip' && (
            <ImageBackground
              source={{ uri: this.props.itemData.images.wide }}
              resizeMode="cover"
              style={styles.thumbnail}
            >
              <Text style={styles.playTimeText}>
                {/*00<Text style={styles.playTimeTextInfo}>분</Text> 00<Text style={styles.playTimeTextInfo}>초</Text>*/}
                {this.props.itemData.play_time}
              </Text>
              <View style={[styles.alignJustify, styles.detailClipView]}>
                <Image source={IcView} style={styles.btnSetSmall} />
                <Text style={styles.countText}>
                  {numeral(
                    this.props.itemData.meta
                      ? this.props.itemData.meta.play_count
                      : this.props.itemData.hit_count
                  ).format('0a')}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.detailClipPlay}
                onPress={() => Native.play(this.props.itemData.cid)}
              >
                <Image source={IcPlay} style={Style.fullImg} />
              </TouchableOpacity>
            </ImageBackground>
          )}
          {this.props.type === 'dailyBook' && (
            <ImageBackground
              source={{
                uri:
                  this.props.thumbnail === 'bookDummy'
                    ? 'https://www.welaaa.com/static/images/web-ic-person.png'
                    : this.props.thumbnail
              }}
              resizeMode="cover"
              style={styles.thumbnail}
            >
              <View style={[styles.alignJustify, styles.detailClipView]}>
                <Image source={IcView} style={styles.btnSetSmall} />
                <Text style={styles.countText}>
                  {numeral(
                    this.props.itemData.meta
                      ? this.props.itemData.meta.play_count
                      : this.props.itemData.hit_count
                  ).format('0a')}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.play}
                onPress={() => Native.play(this.props.cid)}
              >
                <Image source={IcPlay} style={Style.fullImg} />
              </TouchableOpacity>
            </ImageBackground>
          )}
        </TouchableOpacity>
        {this.props.type !== 'detailClip' &&
          this.props.type !== 'dailyBook' && (
            <View style={styles.btnGroup}>
              <View style={styles.alignJustify}>
                <Image source={IcView} style={styles.btnSetSmall} />
                <Text style={styles.countText}>
                  {/* 재생수 */}
                  {numeral(
                    this.props.meta
                      ? this.props.meta.play_count
                      : this.props.hit_count
                  ).format('0a')}
                </Text>
                <Image source={IcStar} style={styles.btnSetSmall} />
                <Text style={styles.countText}>
                  {/* 별점 */}
                  {starAvg}
                </Text>
                <Image source={IcComment} style={styles.btnSetSmall} />
                <Text style={styles.countText}>
                  {/* 댓글수 */}
                  {numeral(
                    this.props.meta
                      ? this.props.meta.comment_count
                      : this.props.review_count
                  ).format('0a')}
                </Text>
                {1 === 2 && (
                  <View style={{ marginLeft: 'auto' }}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        Device.share(this.props.title, this.props.url);
                      }}
                    >
                      <Image source={IcShare} style={styles.btnSetLarge} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
      </View>
    );
  }
}
