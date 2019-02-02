import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import CommonStyles from '../../../styles/common';
import Summary from '../video/Summary';
import IcPlay1 from '../../../images/ic-play-dark.png';
import IcPlay2 from '../../../images/ic-duration.png';
import numeral from 'numeral';
import moment from 'moment';

const styles = StyleSheet.create({
  clipListItem: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  clipNumber: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 35,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  clipNumberText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: CommonStyles.COLOR_PRIMARY,
  },
  clipContent: {
    paddingTop: 10,
    paddingRight: 15,
    paddingBottom: 10,
    paddingLeft: 15,
  },
  clipContentHr: {
    width: '100%',
    height: 1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#E2E2E2',
  },
  clipTitle: {
    fontSize: 14,
    color: '#353A3C',
  },
  clipParagraph: {
    marginBottom: 15,
    fontSize: 13,
    color: '#555555',
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
});

export default class ClipListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const playTime = moment.duration(this.props.itemData.play_time);
    return (
      <View style={styles.clipListItem} borderRadius={4}>
        <Summary type={'detailClip'} itemData={this.props.itemData} />
        <View style={styles.clipNumber}>
          <Text style={styles.clipNumberText}>
            {this.props.itemData.clipNumber < 10 && <Text>0</Text>}
            {this.props.itemData.itemNumber}
          </Text>
        </View>
        <View style={styles.clipContent}>
          <Text style={styles.clipTitle}>{this.props.itemData.title}</Text>
          <View style={styles.clipContentHr} />
          <View style={[styles.alignJustify, styles.countWrap]}>
            <Image source={IcPlay1} style={styles.btnSetSmall} />
            <Text style={styles.countText}>
              {/* 재생수 */}
              {numeral(
                this.props.itemData.meta
                  ? this.props.itemData.meta.play_count
                  : this.props.itemData.hit_count,
              ).format('0a')}
            </Text>
            <Image source={IcPlay2} style={styles.btnSetSmall} />
            <Text style={styles.countText}>
              {`${playTime.hours()}시간 ${playTime.minutes()}분`}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
