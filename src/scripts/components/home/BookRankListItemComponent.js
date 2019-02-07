import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import IcPlay from '../../../images/ic-play-dark.png';
import numeral from 'numeral';
import { withNavigation } from 'react-navigation';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  rankGridItem: {
    marginBottom: 10,
  },
  rankNumber: {
    width: 25,
  },
  rankNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#353A3C',
  },
  thumbnail: {
    width: 60,
    height: 96,
    marginRight: 7,
    marginLeft: 7,
    borderRadius: 4,
  },
  rankIcon: {
    position: 'relative',
    top: 1,
    width: 14,
    height: 14,
    marginRight: 2,
  },
  rankTitle: {
    fontSize: 14,
    color: '#353A3C',
    paddingBottom: 7,
  },
  rankContentText: {
    paddingRight: 20,
    fontSize: 12,
    color: '#767B80',
  },
  contentHr: {
    height: 1,
    backgroundColor: '#E2E2E2',
    marginBottom: 10,
  },
  rankTeacherText: {
    fontSize: 12,
    color: '#767B80',
  },
  playButton: {
    width: 30,
    height: 30,
    marginLeft: 'auto',
  },
});

class BookRankListItemComponent extends React.Component {
  gotoAudioPage = () => {
    this.props.navigation.navigate('AudioBookDetailPage', {
      id: this.props.itemData.id,
      title: ' ',
    });
  };

  render() {
    return (
      <View style={styles.rankGridItem}>
        <View style={styles.contentHr} />
        <TouchableOpacity onPress={this.gotoAudioPage} activeOpacity={0.9}>
          <View style={CommonStyles.alignJustifyItemCenter}>
            <View style={styles.rankNumber}>
              <Text style={styles.rankNumberText}>
                {this.props.itemData?.rankNumber}
              </Text>
            </View>
            <FastImage
              source={{ uri: this.props.itemData?.images.list }}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.thumbnail}
            />
            <View style={{ width: '50%', alignItems: 'flex-start' }}>
              <Text
                style={styles.rankTitle}
                ellipsizeMode={'tail'}
                numberOfLines={2}
              >
                {this.props.itemData?.title}
              </Text>
              <Text
                style={styles.rankTeacherText}
                ellipsizeMode={'tail'}
                numberOfLines={1}
              >
                {this.props.itemData?.teacher?.name}
              </Text>

              <View
                style={[
                  CommonStyles.alignJustifyFlex,
                  { alignItems: 'flex-end' },
                ]}
              >
                <Image source={IcPlay} style={styles.rankIcon} />
                <Text style={styles.rankContentText}>
                  {numeral(
                    this.props.itemData?.meta
                      ? this.props.itemData?.meta.play_count
                      : this.props.itemData?.hit_count,
                  ).format('0a')}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(BookRankListItemComponent);
