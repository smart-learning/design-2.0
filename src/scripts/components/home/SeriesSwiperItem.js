import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Dummy from '../../../images/dummy-series.png';
import globalStore from '../../commons/store';
import { observer } from 'mobx-react';

const styles = StyleSheet.create({
  thumbnail: {
    position: 'relative',
    width: '100%',
    paddingTop: '70%',
    paddingBottom: '70%',
  },
});

@observer
class SeriesSwiperItem extends React.Component {
  render() {
    let itemData = this.props.itemData;
    if (itemData.length) {
      itemData = itemData[0];
    }
    return (
      <View>
        <TouchableOpacity
          ref={ref => (this.view = ref)}
          activeOpacity={0.9}
          onPress={() => {
            this.props.navigation.navigate('HomeSeriesDetailPage', {
              itemData: itemData,
              title: '윌라 추천시리즈',
            });
          }}
        >
          <ImageBackground
            source={Dummy}
            resizeMode="contain"
            style={styles.thumbnail}
          >
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={2}
              style={{
                position: 'absolute',
                bottom: 15,
                width: '80%',
                marginLeft: '10%',
                fontSize: 13,
                color: '#ffffff',
                textAlign: 'center',
              }}
            >
              두줄의 문구가 추가될 경우 이러한 위치에 들어갑니다
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(SeriesSwiperItem);
