import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import IcPlay from '../../../images/ic-play-dark2.png';
import IcPlayBtn from '../../../images/ic-play-green.png';
import numeral from 'numeral';
import { withNavigation } from 'react-navigation';
import Native from '../../commons/native';

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
    height: 60,
    marginRight: 10,
    marginLeft: 10,
  },
  rankTitle: {
    fontSize: 14,
    lineHeight: 18,
    color: '#353A3C',
  },
  rankIcon: {
    position: 'relative',
    top: 1,
    width: 14,
    height: 14,
    marginRight: 2,
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
    width: 95,
    paddingRight: 20,
    fontSize: 12,
    color: '#767B80',
  },
  playButton: {
    width: 30,
    height: 30,
  },
});

class ClipRankItemComponent extends React.Component {
  gotoClassPage = () => {
    this.props.navigation.navigate('ClassDetail', {
      id: this.props.itemData.id,
      title: ' ',
    });
  };

  render() {
    return (
      <View style={styles.rankGridItem}>
        <View style={styles.contentHr} />
        <TouchableOpacity
          ActiveOpacity={0.9}
          onPress={() => Native.play(this.props.itemData.cid)}
        >
          <View style={CommonStyles.alignJustifyItemCenter}>
            <View style={styles.rankNumber}>
              <Text style={styles.rankNumberText}>
                {this.props.itemData?.rankNumber}
              </Text>
            </View>
            <ImageBackground
              source={{ uri: this.props.itemData?.images?.wide }}
              resizeMode="cover"
              style={styles.thumbnail}
              borderRadius={4}
            />
            <View style={{ width: 155 }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={2}
                style={styles.rankTitle}
              >
                {this.props.itemData?.title}
              </Text>
              <View style={{ marginTop: 5 }}>
                <View style={CommonStyles.alignJustifyFlex}>
                  <Image source={IcPlay} style={styles.rankIcon} />
                  <Text style={styles.rankContentText}>
                    {numeral(this.props.itemData?.meta?.play_count).format(
                      '0a',
                    )}
                  </Text>
                  <Text
                    style={styles.rankTeacherText}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                  >
                    {this.props.itemData?.teacher?.name}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ width: 30 }}>
              <Image source={IcPlayBtn} style={styles.playButton} />
            </View>
            <View style={{ width: 10 }} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(ClipRankItemComponent);
