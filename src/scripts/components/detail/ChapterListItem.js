import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CommonStyles from '../../../styles/common';
import IcPlayPreview from '../../../images/ic-play-preview.png';
import IcPlay from '../../../images/ic-audio-play.png';
import moment from 'moment';
import Native from '../../commons/native';
import globalStore from '../../commons/store';

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
  itemDepthOneText: {
    width: '75%',
    minHeight: 35,
    fontWeight: 'bold',
    fontSize: 18,
    color: CommonStyles.COLOR_PRIMARY
  },
  itemDepthTwoText: {
    width: '75%',
    minHeight: 35,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333333'
  },  
  itemTitleText: {
    width: '75%',
    minHeight: 30,
    fontSize: 13,
    paddingLeft: 10,
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

  renderChapterList() {
    var renderView = false;

    if ('class' === this.props.learnType) {
      if (globalStore && globalStore.currentMembership) {
        const { type } = globalStore.currentMembership;
        if (1 === type || 2 === type || 3 === type) {
          // 무제한 소장중(1, 2: type) 또는 프리패스(3) 경우.
          renderView = true;
        } else if (0 === this.props.itemData.orig_price) {
          // 무료(0: itemData.orig_price)일 경우.
          renderView = true;
        }
      }
    } else if ('audioBook' === this.props.learnType) {
      const { paymentType } = this.props;
      if (0 === paymentType || 3 === paymentType) {
        // 무료(0) 이거나 소장중(3)일 경우.
        renderView = true;
      } else if (globalStore && globalStore.currentMembership) {
        const { type } = globalStore.currentMembership;
        if (3 === type) {
          // 프리패스일 경우.
          renderView = true;
        }
      }
    }

    if (renderView) {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => Native.play(this.props.itemData.cid)}
        >
          <Image source={IcPlay} style={styles.playButton} />
        </TouchableOpacity>
      );
    } else {
      if (this.props.itemData.is_preview) {
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => Native.play(this.props.itemData.cid)}
          >
            <Image source={IcPlay} style={styles.playButton} />
          </TouchableOpacity>
        );
      } else {
        return <View />;
      }
    }
  }

  render() {
    const time = moment.duration(this.props.itemData.play_time);

    console.log('ChapterListItem audioBook'
      , this.props.itemData.align, this.props.itemData.title, this.props.itemData.a_depth, this.props.itemData.is_preview)

    // console.log('ChapterListItem audioBook',this.props.learnType)    

    // current_membership 상태를 확인한다 
    // audio_book 권한이 있는가 ? 
    // 어떻게 판단할 수 있을까   

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
              {this.props.itemData.a_depth === 1 ? (
                <Text style={styles.itemDepthOneText}>
                  {this.props.itemData.title}
                </Text>
              ) : this.props.itemData.a_depth === 2 ? (
                <Text style={styles.itemDepthTwoText}>
                  {this.props.itemData.title}
                </Text>
              ) : (
                    <Text style={styles.itemTitleText}>
                      > {this.props.itemData.title}
                    </Text>
                  )}

              {/* <Text style={styles.itemTitleText}>
                {this.props.itemData.title}
              </Text> */}
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

              {this.renderChapterList()}
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
              {this.props.itemData.a_depth === 1 ? (
                <Text style={styles.itemDepthOneText}>
                  {this.props.itemData.title}
                </Text>
              ) : this.props.itemData.a_depth === 2 ? (
                <Text style={styles.itemDepthTwoText}>
                  {this.props.itemData.title}
                </Text>
              ) : (
                    <Text style={styles.itemTitleText}>
                      > {this.props.itemData.title}
                    </Text>
                  )}
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
