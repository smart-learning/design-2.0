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
    return <View>
        <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
          <ImageBackground source={Dummy} resizeMode="contain" style={styles.thumbnail}>
            <View style={{ position: 'absolute', width: '100%', bottom: 75 }}>
              <Text style={{ width: '80%', marginLeft: '10%', marginBottom: 5, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#ffffff' }} ellipsizeMode={'tail'} numberOfLines={1}>
                수학이 필요한 순간
              </Text>
              <Text style={{ width: '80%', marginLeft: '10%', marginBottom: 12, textAlign: 'center', fontSize: 14, color: '#ffffff' }} ellipsizeMode={'tail'} numberOfLines={2}>
                인간은 얼마나 깊게 생각할 수 있는가 두줄까지 작성 가능
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                <Image source={IcPlay} style={styles.icon} />
                <Text style={[styles.countText, { paddingRight: 15 }]}>
                  00
                </Text>
                <Image source={IcHeart} style={styles.icon} />
                <Text style={[styles.countText, { paddingRight: 15 }]}>
                  00
                </Text>
                <Image source={IcCommenting} style={styles.icon} />
                <Text style={styles.countText}>00</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>;
  }
}

export default withNavigation(DailySwiperItem);
