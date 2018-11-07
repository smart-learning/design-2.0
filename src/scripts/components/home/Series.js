import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { withNavigation } from 'react-navigation';
import _ from 'underscore';

const styles = StyleSheet.create({
  seriesItemSm: {
    width: '48%',
    marginBottom: 13,
    backgroundColor: '#efefef'
  },
  seriesItemLg: {
    width: '100%',
    marginBottom: 13,
    backgroundColor: '#dddddd'
  },
  thumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    paddingTop: '29.8245614035%',
    paddingBottom: '29.8245614035%',
    backgroundColor: '#efefef'
  },
  title: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center'
  }
});

class Series extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let itemData = [];
    if (_.isObject(this.props.itemData)) {
      itemData = this.props.itemData;
    }
    return (
      <View>
        {itemData.map((item, key) => {
          return (
            <View style={styles.seriesItemLg} key={key}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.props.navigation.navigate('HomeSeriesPage', {
					title: '윌라 추천 시리즈',
					focus: item.category
                  })
                }
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  borderRadius={5}
                  style={styles.thumbnail}
                >
                  <Text style={styles.title}>{item.title}</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
}

export default withNavigation(Series);
