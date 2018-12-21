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

const styles = StyleSheet.create({
  contentWrap: {
    width: '84%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  thumbnail: {
    width: '100%',
    marginBottom: 20,
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

    console.log( itemData, 'itemData' );
    
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
                      <TouchableOpacity
                        activeOpacity={0.9}
                        key={key}
                        }
                      >
                        <ImageBackground
                          source={{ uri: item.image }}
                          resizeMode="cover"
                          style={styles.thumbnail}
                          borderRadius={12}
                        />
                      </TouchableOpacity>
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
