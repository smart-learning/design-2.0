import React from 'react';
import CommonStyles from '../../../styles/common';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView, withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import createStore from '../../commons/createStore';
import net from '../../commons/net';
import _ from 'underscore';
import Dummy from '../../../images/dummy-series.png';

const styles = StyleSheet.create({
  contentWrap: {
    width: '98%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  thumbnail: {
    position: 'relative',
    width: '100%',
    marginBottom: 30,
    paddingTop: '70.9302713709%',
    paddingBottom: '70.9302713709%',
  },
});

@observer
class HomeSeriesListPage extends React.Component {
  store = createStore({
    homeSeriesData: {},
  });

  getData = async () => {
    this.store.homeSeriesData = await net.getHomeSeries();
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    let itemData = [];
    if (_.isObject(this.store.homeSeriesData)) {
      itemData = this.store.homeSeriesData;
    }
    
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            {itemData &&
              itemData.length &&
              (itemData.length <= 6 ? (
                <View style={{ marginTop: 12 }}>
                  <ActivityIndicator
                    size="large"
                    color={CommonStyles.COLOR_PRIMARY}
                  />
                </View>
              ) : (
                <View style={styles.contentWrap}>
                  {itemData.map((item, key) => {
                    return (
                      <View
                        key={key}
                        style={{
                          width: '50%',
                          paddingLeft: 10,
                          paddingRight: 10,
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() =>
                            this.props.navigation.navigate(
                              'HomeSeriesDetailPage',
                              {
                                itemData: item.category,
                                thumbnail: item.image,
                                title: '윌라 추천시리즈',
                              },
                            )
                          }
                        >
                          <ImageBackground
                            source={{ uri: item.image }}
                            resizeMode="cover"
                            style={styles.thumbnail}
                            borderRadius={12}
                          >
                            <Text
                              ellipsizeMode={'tail'}
                              numberOfLines={2}
                              style={{
                                position: 'absolute',
                                bottom: 15,
                                width: '80%',
                                marginLeft: '10%',
                                fontSize: 12,
                                color: '#ffffff',
                                textAlign: 'center',
                              }}
                            >
                              {item.description}
                            </Text>
                          </ImageBackground>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(HomeSeriesListPage);
