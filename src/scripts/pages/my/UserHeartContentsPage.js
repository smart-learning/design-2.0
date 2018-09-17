import React from 'react';
import ViewPager from 'react-native-view-pager';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CommonStyles from '../../../styles/common';
import { SafeAreaView } from 'react-navigation';
import SummaryListItem from '../../components/my/SummaryListItem';
import { observer } from 'mobx-react';
import createStore from '../../commons/createStore';
import net from '../../commons/net';
import { observable } from 'mobx';
import _ from 'underscore';

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
  linkViewAll: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 36,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: CommonStyles.COLOR_PRIMARY
  },
  classLinkViewAll: {
    marginTop: 15,
    marginBottom: 30
  },
  linkViewAllText: {
    fontSize: 14,
    color: '#ffffff'
  },
  linkViewAllIcon: {
    paddingLeft: 7,
    height: 13
  }
});

@observer
class UserHeartContentsPage extends React.Component {
  @observable
  tabStatus = 'video';

  store = createStore({});

  state = {
    audiobooks: {
      isLoading: true,
      items: [],
      pagination: {}
    },
    videoCourses: {
      isLoading: true,
      items: [],
      pagination: {}
    }
  };

  load = async contentType => {
    if (!['audiobooks', 'videoCourses'].includes(contentType)) {
      return;
    }

    let data = { ...this.state[contentType] };
    data.isLoading = true;

    this.setState({
      [contentType]: data
    });

    try {
      const res = await net.getUserHeartContent(contentType);

      data.isLoading = false;
      data.items = res.items;
      data.pagination = res.pagination;

      this.setState({
        [contentType]: data
      });
    } catch (e) {}
  };

  loadMore = async contentType => {
    if (!['audiobooks', 'videoCourses'].includes(contentType)) {
      return;
    }

    let data = { ...this.state[contentType] };
    data.isLoading = true;

    this.setState({
      [contentType]: data
    });

    try {
      let nextPage = this.state[contentType].pagination.page + 1;
      const res = await net.getUserHeartContent(contentType, nextPage);

      data.isLoading = false;
      data.items = [...data.items, ...res.items];
      data.pagination = res.pagination;

      this.setState({
        [contentType]: data
      });
    } catch (e) {}
  };

  async componentDidMount() {
    await this.load('audiobooks');
    await this.load('videoCourses');
  }

  goLecture = item => {
    this.props.navigation.navigate('ClassDetailPage', {
      id: item.id,
      title: item.title
    });
  };

  goAudiobook = item => {
    this.props.navigation.navigate('AudioBookDetailPage', {
      id: item.id,
      title: item.title
    });
  };
  goPage = pageName => {
    if (pageName === 'video') {
      this.tabStatus = 'video';
      this.refs.pager.setPage(0);
    } else if (pageName === 'audioBook') {
      this.tabStatus = 'audioBook';
      this.refs.pager.setPage(1);
    }
  };

  onPageSelected = event => {
    if (event.nativeEvent.position === 0) {
      this.tabStatus = 'video';
    } else if (event.nativeEvent.position === 1) {
      this.tabStatus = 'audioBook';
    }
  };

  render() {
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ViewPager
            ref={'pager'}
            initialPage={0}
            style={{
              flex: 1,
              marginTop: 40,
              height: this.store.windowHeight - 40
            }}
            onPageSelected={this.onPageSelected}
          >
            <View>
              <ScrollView style={{ flex: 1 }}>
                {this.state.videoCourses.items.length === 0 ? (
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ textAlign: 'center' }}>
                      좋아요한 클래스가 없습니다.
                    </Text>
                  </View>
                ) : (
                  this.state.videoCourses.items.map((item, key) => {
                    return (
                      <SummaryListItem
                        key={key}
                        thumbnail={item.images ? item.images.list : null}
                        title={item.headline}
                        author={item.teacher ? item.teacher.name : ''}
                        likeCount={item.like_count}
                        reviewCount={item.review_count}
                        isLike={true}
                        navigation={this.props.navigation}
                        onPress={() => this.goLecture(item)}
                      />
                    );
                  })
                )}

                <View style={CommonStyles.contentContainer}>
                  {this.state.videoCourses.isLoading && (
                    <View style={{ marginTop: 12 }}>
                      <ActivityIndicator
                        size="large"
                        color={CommonStyles.COLOR_PRIMARY}
                      />
                    </View>
                  )}
                  {!this.state.videoCourses.isLoading &&
                    this.state.videoCourses.pagination['has-next'] && (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this.loadMore('videoCourses')}
                      >
                        <View
                          style={[styles.linkViewAll, styles.classLinkViewAll]}
                          borderRadius={5}
                        >
                          <Text style={styles.linkViewAllText}>더보기</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                </View>
              </ScrollView>
            </View>

            <View>
              <ScrollView style={{ flex: 1 }}>
                {this.state.audiobooks.items.length === 0 ? (
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ textAlign: 'center' }}>
                      좋아요한 오디오북이 없습니다.
                    </Text>
                  </View>
                ) : (
                  this.state.audiobooks.items.map((item, key) => {
                    return (
                      <SummaryListItem
                        key={key}
                        thumbnail={
                          item.images && item.images.list
                            ? item.images.list
                            : null
                        }
                        title={item.title}
                        author={item.teacher ? item.teacher.name : ''}
                        likeCount={item.like_count}
                        reviewCount={item.review_count}
                        isLike={true}
                        navigation={this.props.navigation}
                        onPress={() => this.goAudiobook(item)}
                      />
                    );
                  })
                )}

                <View style={CommonStyles.contentContainer}>
                  {this.state.audiobooks.isLoading && (
                    <View style={{ marginTop: 12 }}>
                      <ActivityIndicator
                        size="large"
                        color={CommonStyles.COLOR_PRIMARY}
                      />
                    </View>
                  )}
                  {!this.state.audiobooks.isLoading &&
                    this.state.audiobooks.pagination['has-next'] && (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this.loadMore('audiobooks')}
                      >
                        <View
                          style={[styles.linkViewAll, styles.classLinkViewAll]}
                          borderRadius={5}
                        >
                          <Text style={styles.linkViewAllText}>더보기</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                </View>
              </ScrollView>
            </View>
          </ViewPager>
          <View style={styles.tabContainer}>
            <View style={styles.tabFlex}>
              <View style={styles.tabItemContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.goPage('video')}
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
                  onPress={() => this.goPage('audioBook')}
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

export default UserHeartContentsPage;
