import { observable, observe } from 'mobx';
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
import IcTrash from '../../../images/ic-my-trash-xs.png';
import globalStore from '../../../scripts/commons/store';
import CommonStyles, { COLOR_PRIMARY } from '../../../styles/common';
import Native from '../../commons/native';

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

  downloadItem: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3'
  },

  downloadItemImg: {
    width: 60,
    height: 60
  },

  downloadItemInfo: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingLeft: 20
  },

  downloadItemPlayButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto'
  }
});

@observer
export default class DownloadContentPage extends React.Component {
  @observable
  tabStatus = 'video';

  componentDidMount() {
    this.getDownloadList();

    this.disposer = observe(globalStore.downloadState, change => {
      if ('complete' === change.name && change.newValue) {
        this.getDownloadList();
        globalStore.downloadState.complete = false;
      }
    });
  }

  componentWillUnmount() {
    this.disposer();
  }

  getDownloadList() {
    Native.getDownloadList(
      result => {
        if ('null' !== result.trim()) {
          try {
            let jsonData = JSON.parse(result);
            globalStore.downloadItems = jsonData;
          } catch (e) {
            console.error(e);
          }
        }
      },
      error => console.error(error)
    );
  }

  play(item) {
    item.offline = true;
    Native.play(item);
  }

  makeListItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.downloadItem}
        onPress={() => this.play(item)}
      >
        <Image
          source={{ uri: item.thumbnailImg }}
          style={styles.downloadItemImg}
        />
        <View style={styles.downloadItemInfo}>
          <Text
            style={{ fontSize: 16, fontWeight: 'bold' }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.gTitle}
          </Text>
          <Text
            style={{ fontSize: 12, color: COLOR_PRIMARY }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.cTitle}
          </Text>
          <Text style={{ fontSize: 12, color: '#A6A6A6' }}>
            {item.groupTeacherName} | {item.cPlayTime}
          </Text>
          {item.view_limitdate !== 'null' && (
            <Text style={{ fontSize: 12, color: '#E10D38' }}>
              {item.view_limitdate}
            </Text>
          )}
        </View>
        <View>
          <TouchableOpacity
            activeOptacity={0.9}
            style={styles.downloadItemPlayButton}
            onPress={() => {
              Native.deleteDownload(
                [{ ...item }],
                result => {
                  var removedDownloadList = globalStore.downloadItems.filter(
                    item => item.cid !== result
                  );
                  globalStore.downloadItems.replace(removedDownloadList);
                },
                error => console.error(error)
              );
            }}
          >
            <Image source={IcTrash} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    let vcontent = (
      <Text style={styles.noContent}>다운받은 항목이 없습니다.</Text>
    );
    let acontent = (
      <Text style={styles.noContent}>다운받은 항목이 없습니다.</Text>
    );

    let video = [];
    let audio = [];
    // store의 downloadItems이 변경되면..
    const downloadItems = globalStore.downloadItems.toJS();
    if (downloadItems.length > 0) {
      downloadItems.reduce(
        (accumulator, item, index) => {
          if ('video-course' === item.audioVideoType) {
            accumulator.video.push({ ...item, key: index.toString() });
          } else if ('audiobook' === item.audioVideoType) {
            accumulator.audio.push({ ...item, key: index.toString() });
          }
          return accumulator;
        },
        { video: video, audio: audio }
      );

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
