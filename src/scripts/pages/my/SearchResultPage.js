import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import CommonStyles, { COLOR_PRIMARY } from '../../../styles/common';
import net from '../../commons/net';

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    alignSelf: 'flex-start',
    top: 0,
    left: 0,
    width: '100%',
    height: 40,
    backgroundColor: '#ffffff'
  },
  tabFlex: {
    flexDirection: 'row'
  },
  tabItemContainer: {
    width: '50%'
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 40
  },
  tabText: {
    fontSize: 14,
    color: '#a4a4a4'
  },
  tabTextActive: {
    fontSize: 14,
    color: '#000000'
  },
  tabHr: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#ffffff'
  },
  tabHrActive: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: CommonStyles.COLOR_PRIMARY
  },
  tabContentContainer: {
    paddingTop: 40
  },
  noContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    textAlign: 'center'
  },

  flatList: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20
  },

  searchResultItem: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3'
  },

  searchResultItemImg: {
    width: 60,
    height: 60
  },

  searchResultItemInfo: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingLeft: 20
  }
});

@observer
export default class SearchResultPage extends React.Component {
  @observable
  tabStatus = 'video';

  @observable
  searchResult = [];

  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this._isMount = true;
  }

  componentDidMount() {
    this.searchQuery(this.props.navigation.state.params.queryString);
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  searchQuery = async query => {
    result = await net.searchQuery(query);
    this.searchResult = result.items;
    console.log('SearchResultPage.js::', this.searchResult);
  };

  makeListItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.searchResultItem}
        onPress={() => this.goDetailPage(item)}
      >
        <Image
          source={{ uri: item.images.list }}
          style={styles.searchResultItemImg}
        />
        <View style={styles.searchResultItemInfo}>
          <Text
            style={{ fontSize: 16, fontWeight: 'bold' }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.headline}
          </Text>
          <Text
            style={{ fontSize: 12, color: COLOR_PRIMARY }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <Text style={{ fontSize: 12, color: '#A6A6A6' }}>
            {item.teacher.name} | {item.play_time}
          </Text>
        </View>
        <View />
      </TouchableOpacity>
    );
  };

  goDetailPage() {
    console.log('SearchResultPage.js::goDetailPage');
  }

  render() {
    let vcontent = <Text style={styles.noContent}>{this.props.no_result}</Text>;
    let acontent = <Text style={styles.noContent}>{this.props.no_result}</Text>;

    let video = [];
    let audio = [];
    const items = this.searchResult.toJS();
    if (items.length > 0) {
      // items.reduce(
      //   (accumulator, item, index) => {
      //     if ('video-course' === item.audioVideoType) {
      //       accumulator.video.push({ ...item, key: index.toString() });
      //     } else if ('audiobook' === item.audioVideoType) {
      //       accumulator.audio.push({ ...item, key: index.toString() });
      //     }
      //     return accumulator;
      //   },
      //   { video: video, audio: audio }
      // );
      video = items;

      // 데이터를 가지고 리스트를 생성
      if (video.length > 0) {
        vcontent = (
          <FlatList
            style={styles.flatList}
            data={video}
            renderItem={this.makeListItem}
          />
        );
      }

      if (audio.length > 0) {
        acontent = (
          <FlatList
            style={styles.flatList}
            data={audio}
            renderItem={this.makeListItem}
          />
        );
      }
    }

    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.tabContentContainer}>
              {this.tabStatus === 'video' && vcontent}
              {this.tabStatus === 'audioBook' && acontent}
            </View>
          </ScrollView>
          <View style={styles.tabContainer}>
            <View style={styles.tabFlex}>
              <View style={styles.tabItemContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => (this.tabStatus = 'video')}
                >
                  <View style={styles.tabItem}>
                    <Text
                      style={
                        this.tabStatus === 'video'
                          ? styles.tabTextActive
                          : styles.tabText
                      }
                    >
                      클래스
                    </Text>
                    <View
                      style={
                        this.tabStatus === 'video'
                          ? styles.tabHrActive
                          : styles.tabHr
                      }
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.tabItemContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => (this.tabStatus = 'audioBook')}
                >
                  <View style={styles.tabItem}>
                    <Text
                      style={
                        this.tabStatus === 'audioBook'
                          ? styles.tabTextActive
                          : styles.tabText
                      }
                    >
                      오디오북
                    </Text>
                    <View
                      style={
                        this.tabStatus === 'audioBook'
                          ? styles.tabHrActive
                          : styles.tabHr
                      }
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

SearchResultPage.defaultProps = {
  no_result: '검색 결과가 없습니다.'
};
