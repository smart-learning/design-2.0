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
import IcHeart from '../../../images/ic-star-grey-line.png';
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
    height: 17.5,
    marginRight: 6,
    marginBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
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
                  width: 30,
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
                resizeMode="contain"
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
                {this.props.itemData.badge?.map((item, key) => {
                  return (
                    <View
                      key={key}
                      style={[styles.badge, { backgroundColor: item.color }]}
                    >
                      <Text style={styles.badgeText}>{item.title}</Text>
                    </View>
                  );
                })}
                {(!this.props.itemData.badge ||
                  this.props.itemData.badge === null ||
                  this.props.itemData.badge?.length === 0) && (
                  <View style={[styles.badge, styles.badgeBlank]}>
                    <Text style={styles.badgeText} />
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
                      ? this.props.itemData.meta.star_average
                      : this.props.itemData.star_avg,
                  ).format('0.0')}
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
