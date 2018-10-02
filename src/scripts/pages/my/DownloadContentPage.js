import React from 'react';
import {
  AsyncStorage,
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CommonStyles, { COLOR_PRIMARY } from '../../../styles/common';
import globalStore from '../../../scripts/commons/store';
import { SafeAreaView } from 'react-navigation';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Native from '../../commons/native';
import IcPlay from '../../../images/ic-play.png';

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
    paddingLeft: 20
  },

  downloadItemPlayButton: {
    marginLeft: 'auto'
  }
});

@observer
export default class DownloadContentPage extends React.Component {
  @observable
  tabStatus = 'video';
  @observable
  videos = [];
  @observable
  audios = [];

  componentDidMount() {
    Native.getDownloadList(
      result => {
        console.log('DownloadContentPage.js::result-', result);
        if ('null' !== result.trim()) {
          try {
            let jsonData = JSON.parse(result);
            console.log('DownloadContentPage.js::result-', jsonData);
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
    Native.play(item.cid);
  }

  makeListItem = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.downloadItem}>
        <Image
          source={{ uri: item.thumbnailImg }}
          style={styles.downloadItemImg}
        />
        <View style={styles.downloadItemInfo}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {item.gTitle}
          </Text>
          <Text style={{ fontSize: 12, color: COLOR_PRIMARY }}>
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
        <TouchableOpacity
          activeOptacity={0.9}
          style={styles.downloadItemPlayButton}
          onPress={() => {
            this.play(item);
          }}
        >
          <Image source={IcPlay} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
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
    if (globalStore.downloadItems.length > 0) {
      const items = globalStore.downloadItems.toJS();
      items
        .filter(item => 'video-course' == item.audioVideoType)
        .reduce(
          (accumulator, item, index) =>
            accumulator.push({ ...item, key: index.toString() }),
          video
        );
      items
        .filter(item => 'audiobook' == item.audioVideoType)
        .reduce(
          (accumulator, item, index) =>
            accumulator.push({ ...item, key: index.toString() }),
          audio
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
