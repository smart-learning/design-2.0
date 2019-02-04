import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import CommonStyles from '../../../styles/common';
import IcPlay from '../../../images/ic-play-dark.png';
import numeral from 'numeral';
import IcHeart from '../../../images/ic-star-grey-line.png';
import IcComment from '../../../images/ic-commenting-dark.png';
import IcClip from '../../../images/ic-clip-dark.png';

const styles = StyleSheet.create({
  classList: {
    marginBottom: 20,
  },
  classItem: {
    position: 'relative',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
  },
  classTitle: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    fontSize: 14,
    lineHeight: 19,
    color: '#353A3C',
  },
  classAuthor: {
    fontSize: 13,
    color: '#767B80',
    fontWeight: '200',
    paddingTop: 10,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  badges: {
    paddingLeft: 12,
  },
  badge: {
    height: 22,
    marginRight: 6,
    marginBottom: 10,
    paddingTop: 3,
    paddingRight: 10,
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
  badgeNew: {
    backgroundColor: '#FD7E14',
  },
  badgeFeatured: {
    backgroundColor: '#FD424C',
  },
  badgeExclusive: {
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  badgeFree: {
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  thumbnail: {
    position: 'relative',
    width: '100%',
    paddingTop: '20.75%',
    paddingBottom: '20.75%',
  },
  thumbnailTitle: {
    position: 'absolute',
    top: 10,
    left: '5%',
    width: '90%',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    color: '#ffffff',
  },
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
  countHr: {
    height: 1,
    marginTop: 7,
    marginLeft: 12,
    marginRight: 12,
    backgroundColor: '#E2E2E2',
  },
  countWrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 2,
  },
});

class ClassListItem extends React.Component {
  gotoClassPage = () => {
    this.props.navigation.navigate('ClassDetail', {
      id: this.props.itemData.id,
      title: ' ',
    });
  };

  render() {
    return (
      <View style={styles.classItem}>
        <TouchableOpacity activeOpacity={0.9} onPress={this.gotoClassPage}>
          <ImageBackground
            source={{
              uri:
                this.props.itemType === 'series'
                  ? this.props.itemData.images.wide
                  : this.props.itemData.thumbnail,
            }}
            resizeMode="cover"
            style={styles.thumbnail}
            imageStyle={{
              borderRadius: 4,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Text style={styles.thumbnailTitle}>
              {this.props.itemData.title}
            </Text>
          </ImageBackground>
          <View style={{ height: 90 }}>
            <Text
              style={styles.classTitle}
              ellipsizeMode={'tail'}
              numberOfLines={2}
            >
              {this.props.itemData.headline}
            </Text>
            <Text
              style={styles.classAuthor}
              ellipsizeMode={'tail'}
              numberOfLines={1}
            >
              {this.props.itemData.teacher.headline}{' '}
              {this.props.itemData.teacher.name
                ? this.props.itemData.teacher.name
                : ''}
            </Text>
          </View>
          <View style={[CommonStyles.alignJustifyFlex, styles.badges]}>
            {!!this.props.itemData.is_new && (
              <View style={[styles.badge, styles.badgeNew]}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            {!!this.props.itemData.is_featured && (
              <View style={[styles.badge, styles.badgeFeatured]}>
                <Text style={styles.badgeText}>추천</Text>
              </View>
            )}
            {!!this.props.itemData.is_exclusive && (
              <View style={[styles.badge, styles.badgeExclusive]}>
                <Text style={styles.badgeText}>오리지널</Text>
              </View>
            )}
            {!!this.props.itemData.is_free && (
              <View style={[styles.badge, styles.badgeFree]}>
                <Text style={styles.badgeText}>무료</Text>
              </View>
            )}
            <View style={[styles.badge, styles.badgeBlank]}>
              <Text style={styles.badgeText} />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.countHr} />
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
          <Image
            source={IcClip}
            style={[styles.btnSetSmall, { marginLeft: 'auto' }]}
          />
          <Text style={styles.countText}>
            {this.props.itemData.clip_count}개 강의
          </Text>
        </View>
      </View>
    );
  }
}

export default withNavigation(ClassListItem);
