import React from 'react';
import CommonStyles from '../../../styles/common';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView, withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import net from '../../commons/net';
import ClassList from '../../components/home/ClassList';
import createStore from '../../commons/createStore';
import _ from 'underscore';
import ClassListItem from '../../components/home/ClassListItem';
import Dummy from '../../../images/dummy-series.png';
import globalStore from '../../commons/store';

const styles = StyleSheet.create({
  contentContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#ffffff',
  },
  title: {
    paddingTop: 50,
    paddingBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#353A3C',
  },
  paragraph: {
    fontSize: 16,
    color: '#353A3C',
  },
  banner: {
    position: 'relative',
    width: '100%',
    height: 450,
  },
  thumbnail: {
    position: 'absolute',
    top: -12,
    width: '100%',
    paddingTop: '70%',
    paddingBottom: '70%',
  },
});

@observer
class HomeSeriesDetailPage extends React.Component {
  store = createStore({
    homeSeriesDetailData: {},
  });

  constructor(props) {
    super(props);
  }

  getData = async () => {
    this.store.homeSeriesDetailData = await net.getHomeSeriesDetail(
      this.props.navigation.state.params.itemData,
    );
  };

  componentDidMount() {
    this.getData();
    globalStore.seriesItemThumbnail = '';
  }

  render() {
    let itemData = {};
    let itemContent = '';
    let itemClipData = [];

    if (_.isObject(this.store.homeSeriesDetailData)) {
      itemData = this.store.homeSeriesDetailData;

      if (itemData.series) {
        if (itemData.series.description) {
          itemContent = itemData.series.description.split('<br>').join('\n');
        } else {
          itemContent = itemData.series.memo.split('<br>').join('\n');
        }
      } else {
        itemContent = '';
      }

      if (itemData.item) {
        itemClipData = itemData.item;
      } else {
        itemClipData = [];
      }
    }

    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.banner} removeClippedSubviews={true}>
              <ImageBackground
                source={{ uri: this.props.navigation.state.params.thumbnail }}
                style={styles.thumbnail}
                resizeMode={'contain'}
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>윌라 추천시리즈 소개</Text>
              <Text style={styles.paragraph}>{itemContent}</Text>
              <Text style={styles.title}>강의 클립</Text>
              {itemClipData.map((item, key) => {
                return (
                  <ClassListItem
                    key={key}
                    id={item.id}
                    itemData={item}
                    itemType={'series'}
                    style={{ marginBottom: 15 }}
                  />
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(HomeSeriesDetailPage);
