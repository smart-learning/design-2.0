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
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(SeriesSwiperItem);
