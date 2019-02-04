import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image
} from 'react-native';
import { withNavigation } from 'react-navigation';
import CommonStyles from '../../../styles/common';
import IcPlay from '../../../images/ic-play-dark.png';
import IcHeart from '../../../images/ic-heart-dark.png';
import IcComment from '../../../images/ic-commenting-dark.png';
import numeral from 'numeral';
import IcClip from '../../../images/ic-clip-dark.png';

const styles = StyleSheet.create({
  recommendGridItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2'
  },
  recommendNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#353A3C'
  },
  thumbnail: {
    width: 105,
    height: 168,
    marginRight: 15
  },
  recommendIcon: {
    position: 'relative',
    top: 1,
    width: 14,
    height: 14,
    marginRight: 2
  },
  recommendTitle: {
    fontSize: 14,
    color: '#353A3C',
    paddingBottom: 7
  },
  recommendSubTitle: {
    fontSize: 12,
    color: '#353A3C',
    paddingTop: 10
  },
  recommendContentText: {
    paddingRight: 15,
    fontSize: 12,
    color: '#353A3C'
  },
  contentHr: {
    height: 1,
    backgroundColor: '#E2E2E2',
    marginTop: 7,
    marginBottom: 7
  },
  recommendTeacherText: {
    fontSize: 12,
    color: '#767B80'
  },
  label: {
    height: 22,
    marginRight: 3,
    marginBottom: 10,
    paddingTop: 3,
    paddingRight: 10,
    paddingLeft: 10
  },
  labelText: {
    fontSize: 12,
    color: '#ffffff'
  },
  labelBlank: {
    borderColor: 'transparent',
    opacity: 0
  },
  labelNew: {
    backgroundColor: '#FD7E14'
  },
  labelFeatured: {
    backgroundColor: CommonStyles.COLOR_PRIMARY
  },
  labelExclusive: {
    backgroundColor: CommonStyles.COLOR_PRIMARY
  },
  labelFree: {
    backgroundColor: '#E8D815'
  }
});

class BookRecommendListItem extends React.Component {
  gotoAudioPage = () => {
    this.props.navigation.navigate('AudioBookDetailPage', {
      id: this.props.itemData.id,
      title: ' '
    });
  };

  render() {
    return (
      <TouchableOpacity onPress={this.gotoAudioPage}>
        <View style={styles.recommendGridItem} borderRadius={4}>
          <View style={CommonStyles.alignJustifyItemCenter}>
            <ImageBackground
              source={{ uri: this.props.itemData.images.list }}
              resizeMode="cover"
              style={styles.thumbnail}
              borderRadius={4}
            />
            <View style={{ width: '50%', alignItems: 'flex-start' }}>
              <Text
                style={styles.recommendTitle}
                ellipsizeMode={'tail'}
                numberOfLines={1}
              >
                {this.props.itemData.title}
              </Text>
              <Text
                style={styles.recommendTeacherText}
                ellipsizeMode={'tail'}
                numberOfLines={1}
              >
                {this.props.itemData.teacher.name
                  ? this.props.itemData.teacher.name
                  : ''}
              </Text>
              <Text
                style={styles.recommendSubTitle}
                ellipsizeMode={'tail'}
                numberOfLines={1}
              >
                {this.props.itemData.subtitle}
              </Text>
              <View style={[CommonStyles.alignJustifyFlex, styles.labels]}>
                {!!this.props.itemData.is_new && (
                  <View style={[styles.label, styles.labelNew]}>
                    <Text style={styles.labelText}>NEW</Text>
                  </View>
                )}
                {!!this.props.itemData.is_featured && (
                  <View style={[styles.label, styles.labelFeatured]}>
                    <Text style={styles.labelText}>추천</Text>
                  </View>
                )}
                {!!this.props.itemData.is_exclusive && (
                  <View style={[styles.label, styles.labelExclusive]}>
                    <Text style={styles.labelText}>오리지널</Text>
                  </View>
                )}
                {!!this.props.itemData.is_free && (
                  <View style={[styles.label, styles.labelFree]}>
                    <Text style={styles.labelText}>무료</Text>
                  </View>
                )}
                <View style={[styles.label, styles.labelBlank]}>
                  <Text style={styles.labelText} />
                </View>
              </View>

              <View
                style={[
                  CommonStyles.alignJustifyFlex,
                  { alignItems: 'flex-end' }
                ]}
              >
                <View style={styles.contentHr} />
                <Image source={IcPlay} style={styles.recommendIcon} />
                <Text style={styles.recommendContentText}>
                  {numeral(
                    this.props.itemData.meta
                      ? this.props.itemData.meta.play_count
                      : this.props.itemData.hit_count
                  ).format('0a')}
                </Text>
                <Image source={IcHeart} style={styles.recommendIcon} />
                <Text style={styles.countText}>
                  {/* 별점 */}
                  {numeral(
                    this.props.itemData.meta
                      ? this.props.itemData.meta.like_count
                      : this.props.itemData.like_count
                  ).format('0a')}
                </Text>
                <Image source={IcComment} style={styles.btnSetSmall} />
                <Text style={styles.countText}>
                  {/* 댓글수 */}
                  {numeral(
                    this.props.itemData.meta
                      ? this.props.itemData.meta.comment_count
                      : this.props.itemData.review_count
                  ).format('0a')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(BookRecommendListItem);
