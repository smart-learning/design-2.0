import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CommonStyles from '../../../styles/common';
import IcPlayPreview from '../../../images/ic-play-preview.png';
import IcPlay from '../../../images/ic-audio-play.png';
import moment from 'moment';
import Native from '../../commons/native';

const styles = StyleSheet.create({
  chapterItem: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  previewTitleText: {
    width: '100%',
    minHeight: 30,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333333'
  },
  itemTitleText: {
    width: '75%',
    minHeight: 30,
    fontSize: 13,
    color: '#333333'
  },
  itemTime: {
    fontSize: 11,
    color: '#555555'
  },
  playButtonPreview: {
    width: 80,
    height: 25
  },
  playButton: {
    width: 30,
    height: 30
  }
});

export default class ChapterListItem extends React.Component {
  render() {
    const time = moment.duration(this.props.itemData.play_time);

    return (
      <View>
        <View>
          {this.props.itemData.play_time !== '00:00:00' && (
            <View
              style={[
                CommonStyles.alignJustifyContentBetween,
                styles.chapterItem
              ]}
            >
              <Text style={styles.itemTitleText}>
                {this.props.itemData.title}
              </Text>
              <Text style={styles.itemTime}>
                {time.hours() === 0 && (
                  <Text style={styles.playTime}>
                    {time.minutes()}분 {time.seconds()}초
                  </Text>
                )}
                {time.hours() > 0 && (
                  <Text style={styles.playTime}>
                    {time.hours()}
                    시간 {time.minutes()}분
                  </Text>
                )}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => Native.play(this.props.itemData.cid)}
              >
                <Image source={IcPlay} style={styles.playButton} />
              </TouchableOpacity>
            </View>
          )}
          {this.props.itemData.play_time === '00:00:00' && (
            <View>
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.chapterItem
                ]}
              >
                <Text style={styles.previewTitleText}>
                  {this.props.itemData.title}
                </Text>
                {1 === 2 && (
                  <TouchableOpacity activeOpacity={0.9}>
                    <Image
                      source={IcPlayPreview}
                      style={styles.playButtonPreview}
                    />
                  </TouchableOpacity>
                )}
                <View style={styles.chapterHr} />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}
