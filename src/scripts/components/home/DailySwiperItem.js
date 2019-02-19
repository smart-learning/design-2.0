import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Dummy from '../../../images/dummy-today-1.png';
import { observer } from 'mobx-react';
import IcCommenting from '../../../images/ic-commenting-light2.png';
import IcHeart from '../../../images/ic-heart-light.png';
import IcPlay from '../../../images/ic-play-light2.png';
import numeral from 'numeral';
import Native from '../../commons/native';

const styles = StyleSheet.create({
  thumbnail: {
    position: 'relative',
    width: 300,
    height: 420,
  },
  icon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  countText: {
    fontSize: 14,
    color: '#ffffff',
  },
});

@observer
class DailySwiperItem extends React.Component {
  render() {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => Native.play(this.props.itemData.cid)}
        >
          <ImageBackground
            source={{ uri: this.props.itemData.mento_bg }}
            resizeMode="contain"
            style={styles.thumbnail}
          >
            <View style={{ position: 'absolute', width: '100%', bottom: 75 }}>
              <Text
                style={{
                  width: '80%',
                  marginLeft: '10%',
                  marginBottom: 5,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#ffffff',
                }}
                ellipsizeMode={'tail'}
                numberOfLines={1}
              >
                {this.props.itemData.title}
              </Text>
              <Text
                style={{
                  width: '80%',
                  marginLeft: '10%',
                  marginBottom: 12,
                  textAlign: 'center',
                  fontSize: 14,
                  color: '#ffffff',
                }}
                ellipsizeMode={'tail'}
                numberOfLines={2}
              >
                {`${this.props.itemData.memo.split('<br>').join('\n')}`}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <Image source={IcPlay} style={styles.icon} />
                <Text style={[styles.countText, { paddingRight: 15 }]}>
                  {/* 재생수 */}
                  {numeral(this.props.itemData.hit_count).format('0a')}
                </Text>
                <Image source={IcHeart} style={styles.icon} />
                <Text style={[styles.countText, { paddingRight: 15 }]}>
                  {/* 별점 */}
                  {parseFloat(this.props.itemData.star_avg).toFixed(1)}
                </Text>
                <Image source={IcCommenting} style={styles.icon} />
                <Text style={styles.countText}>
                  {/* 댓글수 */}
                  {numeral(this.props.itemData.review_count).format('0a')}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(DailySwiperItem);
