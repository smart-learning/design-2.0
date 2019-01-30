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
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 2,
  },
  bookLabels: {
    marginBottom: 5,
  },
  bookLabel: {
    height: 22,
    marginBottom: 9,
    marginRight: 3,
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 3,
    paddingLeft: 10,
  },
  bookLabelText: {
    fontSize: 12,
    color: '#ffffff',
  },
  bookLabelBlank: {
    borderColor: 'transparent',
    opacity: 0,
  },
  bookLabelNew: {
    backgroundColor: '#FD7E14',
  },
  bookLabelExclusive: {
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  bookLabelFree: {
    backgroundColor: '#E8D815',
  },
  bookLabelDefault: {
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
});
export default class AudioBookListItem extends React.Component {
  changePage = () => {
    this.props.navigation.navigate('AudioBookDetailPage', {
      id: this.props.id,
      title: this.props.itemData.title,
    });
  };

  render() {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.9} onPress={this.changePage}>
          <View style={[CommonStyles.alignJustifyFlex, { height: 115 }]}>
            <View>
              <ImageBackground
                source={{ uri: this.props.itemData.images.list }}
                resizeMode="contain"
                style={{ width: 82, height: 115 }}
              />
            </View>
            <View
              style={{ width: '80%', marginLeft: 13 }}
            >
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ fontSize: 15, fontWeight: '400' }}
              >
                {this.props.itemData.title ? this.props.itemData.title : ''}
              </Text>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ fontSize: 11, fontWeight: '200' }}
              >
                {this.props.itemData.teacher?.name}
              </Text>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={2}
                style={{
                  fontSize: 12,
                  fontWeight: '200',
                  lineHeight: 15,
                  height: 30,
                }}
              >
                {this.props.itemData.subtitle
                  ? this.props.itemData.subtitle
                  : ''}
              </Text>

              <View style={[styles.bookLabels, CommonStyles.alignJustifyFlex]}>
                {!this.props.itemData.is_new &&
                  !this.props.itemData.is_exclusive &&
                  !this.props.itemData.is_free &&
                  !this.props.itemData.is_bookreview &&
                  !this.props.itemData.is_botm &&
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
                  <View style={[styles.bookLabel, styles.bookLabelNew]}>
                    <Text style={[styles.bookLabelText]}>New</Text>
                  </View>
                )}
                {!!this.props.itemData.is_exclusive && (
                  <View style={[styles.bookLabel, styles.bookLabelExclusive]}>
                    <Text style={[styles.bookLabelText]}>오리지널</Text>
                  </View>
                )}
                {!!this.props.itemData.is_botm && (
                  <View style={[styles.bookLabel, styles.bookLabelExclusive]}>
                    <Text style={[styles.bookLabelText]}>이달의책</Text>
                  </View>
                )}
                {!!this.props.itemData.is_free && (
                  <View style={[styles.bookLabel, styles.bookLabelFree]}>
                    <Text style={[styles.bookLabelText]}>무료</Text>
                  </View>
                )}
                {!!this.props.itemData.is_bookreview && (
                  <View style={[styles.bookLabel, styles.bookLabelFree]}>
                    <Text style={[styles.bookLabelText]}>북리뷰</Text>
                  </View>
                )}
                {this.props.itemData.audiobook_type === '완독' && (
                  <View style={[styles.bookLabel, styles.bookLabelDefault]}>
                    <Text style={[styles.bookLabelText]}>완독</Text>
                  </View>
                )}
                {this.props.itemData.audiobook_type === '요약' && (
                  <View style={[styles.bookLabel, styles.bookLabelDefault]}>
                    <Text style={[styles.bookLabelText]}>요약</Text>
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
