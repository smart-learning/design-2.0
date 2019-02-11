import React from 'react';
import CommonStyles from '../../../styles/common';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
} from 'react-native';
import IcPlay from '../../../images/ic-play-dark.png';
import numeral from 'numeral';
import IcHeart from '../../../images/ic-heart-dark.png';
import IcComment from '../../../images/ic-commenting-dark.png';

const styles = StyleSheet.create({
  btnSetSmall: {
    width: 14,
    height: 14,
  },
  countText: {
    paddingLeft: 6,
    paddingRight: 15,
    fontSize: 12,
    color: '#353A3C',
  },
  alignJustify: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  badge: {
    height: 19,
    marginRight: 3,
    paddingRight: 7,
    paddingLeft: 7,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: '#ffffff',
  },
  badgeBlank: {
    borderColor: 'transparent',
    opacity: 0,
  },
  badgeFree: {
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  badgeFeatured: {
    backgroundColor: '#FD424C',
  },
  badgeRead: {
    backgroundColor: '#0099CC',
  },
  badgeSummary: {
    backgroundColor: '#FF9933',
  },
  badgeBookReview: {
    backgroundColor: '#B47B58',
  },
  badgeNew: {
    backgroundColor: '#FD7E14',
  },
  badgeExclusive: {
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
});
export default class AudioBookListItem extends React.Component {
  changePage = () => {
    this.props.navigation.navigate('AudioBookDetailPage', {
      id: this.props.id,
      title: ' ',
    });
  };

  render() {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.9} onPress={this.changePage}>
          <View style={[CommonStyles.alignJustifyFlex, { height: 115 }]}>
            {this.props.tabStatus === 'hot' && (
              <View
                style={{
                  width: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: 'bold', color: '#353A3C' }}
                >
                  {this.props.itemData.rankNumber}
                </Text>
              </View>
            )}
            <View style={{ width: 94 }}>
              <ImageBackground
                source={{ uri: this.props.itemData.images.list }}
                resizeMode="cover"
                style={{ width: 82, height: 115 }}
              />
            </View>
            <View style={{ flex: 1, position: 'relative', height: 115 }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ fontSize: 15, fontWeight: '500', color: '#353A3C' }}
              >
                {this.props.itemData.title ? this.props.itemData.title : ''}
              </Text>
              <View style={{ paddingVertical: 3 }}>
                <Text
                  ellipsizeMode={'tail'}
                  numberOfLines={1}
                  style={{ fontSize: 11, fontWeight: '200', color: '#767B80' }}
                >
                  {this.props.itemData.teacher?.name}
                </Text>
              </View>
              <View style={{ height: 30, marginBottom: 3 }}>
                <Text
                  ellipsizeMode={'tail'}
                  numberOfLines={2}
                  style={{
                    fontSize: 12,
                    fontWeight: '200',
                    lineHeight: 15,
                    height: 30,
                    color: '#353A3C',
                  }}
                >
                  {this.props.itemData.subtitle
                    ? this.props.itemData.subtitle
                    : ''}
                </Text>
              </View>
              <View style={[styles.bookLabels, CommonStyles.alignJustifyFlex]}>
                {!this.props.itemData.is_free &&
                  !this.props.itemData.is_featured &&
                  this.props.itemData.audiobook_type !== '완독' &&
                  this.props.itemData.audiobook_type !== '요약' &&
                  this.props.itemData.audiobook_type !== '북리뷰' &&
                  !this.props.itemData.audiobook_type && (
                    <View style={[styles.bookLabel, styles.bookLabelBlank]}>
                      <Text
                        style={[
                          styles.bookLabelText,
                          styles.bookLabelExclusiveText,
                        ]}
                      />
                    </View>
                  )}
                {!!this.props.itemData.is_new && (
                  <View style={[styles.badge, styles.badgeNew]}>
                    <Text style={[styles.badgeText]}>NEW</Text>
                  </View>
                )}
                {!!this.props.itemData.is_exclusive && (
                  <View style={[styles.badge, styles.badgeExclusive]}>
                    <Text style={[styles.badgeText]}>오리지널</Text>
                  </View>
                )}
                {!!this.props.itemData.is_free && (
                  <View style={[styles.badge, styles.badgeFree]}>
                    <Text style={[styles.badgeText]}>무료</Text>
                  </View>
                )}
                {!!this.props.itemData.is_featured && (
                  <View style={[styles.badge, styles.badgeFeatured]}>
                    <Text style={[styles.badgeText]}>추천</Text>
                  </View>
                )}
                {this.props.itemData.audiobook_type === '완독' && (
                  <View style={[styles.badge, styles.badgeRead]}>
                    <Text style={[styles.badgeText]}>완독</Text>
                  </View>
                )}
                {this.props.itemData.audiobook_type === '요약' && (
                  <View style={[styles.badge, styles.badgeSummary]}>
                    <Text style={[styles.badgeText]}>요약</Text>
                  </View>
                )}
                {this.props.itemData.audiobook_type === '북리뷰' && (
                  <View style={[styles.badge, styles.badgeBookReview]}>
                    <Text style={[styles.badgeText]}>북리뷰</Text>
                  </View>
                )}
              </View>

              <View style={[styles.alignJustify, styles.countWrap]}>
                <Image source={IcPlay} style={styles.btnSetSmall} />
                <Text style={styles.countText}>
                  {/* 재생수 */}
                  {numeral(
                    this.props.itemData.meta
                      ? this.props.itemData.meta.play_count
                      : this.props.itemData.hit_count,
                  ).format('0a')}
                </Text>
                <Image source={IcHeart} style={styles.btnSetSmall} />
                <Text style={styles.countText}>
                  {/* 별점 */}
                  {numeral(
                    this.props.itemData.meta
                      ? this.props.itemData.meta.like_count
                      : this.props.itemData.like_count,
                  ).format('0a')}
                </Text>
                <Image source={IcComment} style={styles.btnSetSmall} />
                <Text style={styles.countText}>
                  {/* 댓글수 */}
                  {numeral(
                    this.props.itemData.meta
                      ? this.props.itemData.meta.comment_count
                      : this.props.itemData.review_count,
                  ).format('0a')}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#E2E2E2',
            marginVertical: 15,
          }}
        />
      </View>
    );
  }
}
