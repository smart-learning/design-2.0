import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  thumbnail: {
    position: 'relative',
    width: '100%',
    paddingTop: '70%',
    paddingBottom: '70%',
    borderRadius: 20,
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
      <View borderRadius={12}>
        <TouchableOpacity
          ref={ref => (this.view = ref)}
          activeOpacity={0.9}
          onPress={() => {
            this.props.navigation.navigate('HomeSeriesDetailPage', {
              itemData: itemData.category,
              thumbnail: itemData.image,
              title: ' ',
            });
          }}
        >
          <FastImage
            source={{ uri: itemData.image }}
            resizeMode={FastImage.resizeMode.contain}
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
              {itemData.title}
            </Text>
          </FastImage>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(SeriesSwiperItem);
