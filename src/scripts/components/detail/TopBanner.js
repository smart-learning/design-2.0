import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import IcPlay from '../../../images/ic-class-continue-play.png';
import IcPlayAudio from '../../../images/ic-play-audio-detail.png';
import { observer } from 'mobx-react';
import Native from '../../commons/native';
import numeral from 'numeral';
import IcPlay2 from '../../../images/ic-play-dark.png';
import IcStar from '../../../images/ic-star-grey-line.png';
import IcComment from '../../../images/ic-commenting-dark.png';
import IcClip from '../../../images/ic-clip-dark.png';

const styles = StyleSheet.create({
  banner: {
    position: 'relative',
  },
  classThumbnail: {
    position: 'relative',
    width: '100%',
    paddingTop: '21.875%',
    paddingBottom: '21.875%',
  },
  audioBookThumbnail: {
    width: 120,
    height: 192,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    paddingTop: 10,
    paddingRight: 20,
    marginBottom: 7,
    fontSize: 14,
    color: '#363636',
  },
  title: {
    paddingRight: 20,
    marginBottom: 7,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#363636',
  },
  audioBookPlayButton: {
    width: 40,
    height: 40,
  },
  audioBookAuthorThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  classPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: 25,
    width: 50,
    height: 50,
  },
  badge: {
    height: 22,
    marginBottom: 9,
    marginRight: 3,
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 3,
    paddingLeft: 10,
    borderRadius: 3,
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
  btnSetSmall: {
    width: 14,
    height: 14,
  },
  countText: {
    paddingLeft: 4,
    paddingRight: 15,
    fontSize: 13,
    color: '#353A3C',
  },
  alignJustify: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countWrap: {
    paddingTop: 10,
    paddingBottom: 20,
  },
});

@observer
export default class TopBanner extends React.Component {
  constructor(props) {
    super(props);

    this.learnType = this.learnType.bind(this);
  }

  learnType() {
    if (this.props.learnType === 'audioBook') {
      return '오디오북';
    } else if (this.props.learnType === 'class') {
      return '클래스';
    } else {
      return '';
    }
  }

  tryNativePlayerCall() {
    if (Platform.OS === 'ios') {
      Native.play(this.props.store.itemData.cid);
    } else if (Platform.OS === 'android') {
      // [Android/IOS][이어듣기] 상세화면 상단 재생 버튼 클릭시 첫 클립 제외 이어듣기 불가 #562
      // '001' 로 고정 되어서 들어오는 케이스
      Native.play(this.props.store.itemData.cid);
    }
  }

  content() {
    return (
      <View>
        <View style={[styles.bookLabels, CommonStyles.alignJustifyFlex]}>
          {!this.props.store.itemData.is_free &&
            !this.props.store.itemData.is_featured &&
            this.props.store.itemData.audiobook_type !== '완독' &&
            this.props.store.itemData.audiobook_type !== '요약' &&
            this.props.store.itemData.audiobook_type !== '북리뷰' &&
            !this.props.store.itemData.audiobook_type && (
              <View style={[styles.bookLabel, styles.bookLabelBlank]}>
                <Text
                  style={[styles.bookLabelText, styles.bookLabelExclusiveText]}
                />
              </View>
            )}
          {!!this.props.store.itemData.is_new && (
            <View style={[styles.badge, styles.badgeNew]}>
              <Text style={[styles.badgeText]}>NEW</Text>
            </View>
          )}
          {!!this.props.store.itemData.is_exclusive && (
            <View style={[styles.badge, styles.badgeExclusive]}>
              <Text style={[styles.badgeText]}>오리지널</Text>
            </View>
          )}
          {!!this.props.store.itemData.is_free && (
            <View style={[styles.badge, styles.badgeFree]}>
              <Text style={[styles.badgeText]}>무료</Text>
            </View>
          )}
          {!!this.props.store.itemData.is_featured && (
            <View style={[styles.badge, styles.badgeFeatured]}>
              <Text style={[styles.badgeText]}>추천</Text>
            </View>
          )}
          {this.props.store.itemData.audiobook_type === '완독' && (
            <View style={[styles.badge, styles.badgeRead]}>
              <Text style={[styles.badgeText]}>완독</Text>
            </View>
          )}
          {this.props.store.itemData.audiobook_type === '요약' && (
            <View style={[styles.badge, styles.badgeSummary]}>
              <Text style={[styles.badgeText]}>요약</Text>
            </View>
          )}
          {this.props.store.itemData.audiobook_type === '북리뷰' && (
            <View style={[styles.badge, styles.badgeBookReview]}>
              <Text style={[styles.badgeText]}>북리뷰</Text>
            </View>
          )}
        </View>
        {this.props.learnType === 'class' && (
          <Text
            style={styles.headline}
            ellipsizeMode={'tail'}
            numberOfLines={2}
          >
            {this.props.store.itemData.headline}
          </Text>
        )}
        {this.props.learnType === 'audioBook' && (
          <Text
            style={styles.headline}
            ellipsizeMode={'tail'}
            numberOfLines={2}
          >
            {this.props.store.itemData.subtitle}
          </Text>
        )}
        <Text style={styles.title} ellipsizeMode={'tail'} numberOfLines={2}>
          {this.props.store.itemData.title}
        </Text>

        <View style={[styles.alignJustify, styles.countWrap]}>
          <Image source={IcPlay2} style={styles.btnSetSmall} />
          <Text style={styles.countText}>
            {/* 재생수 */}
            {numeral(
              this.props.store.itemData.meta
                ? this.props.store.itemData.meta.play_count
                : this.props.store.itemData.hit_count,
            ).format('0a')}
          </Text>
          <Image source={IcStar} style={styles.btnSetSmall} />
          <Text style={styles.countText}>
            {/* 별점 */}
            {numeral(
              this.props.store.itemData.meta
                ? this.props.store.itemData.meta.like_count
                : this.props.store.itemData.star_avg,
            ).format('0a')}
          </Text>
          <Image source={IcComment} style={styles.btnSetSmall} />
          <Text style={styles.countText}>
            {/* 댓글수 */}
            {numeral(
              this.props.store.itemData.meta
                ? this.props.store.itemData.meta.comment_count
                : this.props.store.itemData.review_count,
            ).format('0a')}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.banner}>
        <View>
          {this.props.learnType === 'audioBook' && (
            <View style={CommonStyles.alignJustifyContentBetween}>
              <View style={{ width: 120, marginLeft: 20, marginRight: 25 }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => Native.play(this.props.store.itemData?.cid)}
                >
                  <ImageBackground
                    source={{ uri: this.props.store.itemData?.images?.list }}
                    resizeMode={'contain'}
                    style={styles.audioBookThumbnail}
                  >
                    <Image
                      source={IcPlayAudio}
                      style={styles.audioBookPlayButton}
                    />
                  </ImageBackground>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, paddingRight: 20 }}>
                {this.content()}
              </View>
            </View>
          )}

          {this.props.learnType === 'class' && (
            <View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.tryNativePlayerCall()}
              >
                <ImageBackground
                  source={{ uri: this.props.store.itemData?.images?.wide }}
                  resizeMode="cover"
                  style={styles.classThumbnail}
                >
                  <Image source={IcPlay} style={styles.classPlayButton} />
                </ImageBackground>
              </TouchableOpacity>
              <View
                style={{ paddingTop: 15, paddingRight: 20, paddingLeft: 20 }}
              >
                {this.content()}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}
