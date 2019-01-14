import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import ViewPager from 'react-native-view-pager';
import { SafeAreaView, withNavigation } from 'react-navigation';
import _ from 'underscore';
import CommonStyles from '../../../styles/common';
import createStore from '../../commons/createStore';
import net from '../../commons/net';
import globalStore from '../../commons/store';
import AdvertisingSection from '../../components/AdvertisingSection';
import PageCategoryItemVO from '../../vo/PageCategoryItemVO';
import SummaryVO from '../../vo/SummaryVO';
import HomeAudioPage from './HomeAudioPage';
import HomeVideoPage from './HomeVideoPage';
import Native from '../../commons/native';

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    alignSelf: 'flex-start',
    top: 0,
    left: 0,
    width: '100%',
    height: 40,
    backgroundColor: '#ffffff',
  },
  tabFlex: {
    flexDirection: 'row',
  },
  tabItemContainer: {
    width: '50%',
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 40,
  },
  tabText: {
    fontSize: 14,
    color: '#a4a4a4',
  },
  tabTextActive: {
    fontSize: 14,
    color: '#000000',
  },
  tabHr: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: '#ffffff',
  },
  tabHrActive: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  tabContentContainer: {
    paddingTop: 40,
  },
});

@observer
class HomePage extends React.Component {
  state = {
    show_popup: false,
    show_popup_mbs: false,
  };

  @observable
  tabStatus = 'video';

  store = createStore({
    slideHeight: null,
    windowWidth: null,
    clipRankContentSize: null,
    homeSeriesData: {},
    videoCategoryData: [],
    classHotData: {},
    classNewData: {},
    classRecommendData: {},
    clipRankData: [],
    homeBannerData: [],
    audioHotData: [],
    audioNewData: [],
    audioRecommendData: [],
    audioMonth: [],
    audioDaily: [],
    classUseData: [],
    audioBuyData: [],
    audioUseData: [],
    test: {
      hot: [],
      new: [],
      recommend: [],
    },
    contentDataInfo: [],

    // audioPlayRecentData: [],
  });

  getData = async (isRefresh = false) => {
    // Facebook AppEventLogger Test
    // AppEventsLogger.logEvent('welaaaRN_Main_getData');

    // 시리즈는 제일 먼저 읽어온다
    this.store.homeSeriesData = await net.getHomeSeries();

    // 데이터 가져와서
    const videoCategoryData = await net.getLectureCategory(isRefresh);
    const homeContents = await net.getHomeContents(isRefresh);
    const homeAudioBookContents = await net.getHomeAudioBookContents(isRefresh);
    // VO로 정리해서 사용
    const categoryVOs = videoCategoryData.map(element => {
      const vo = new PageCategoryItemVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      vo.label = element.title;
      return vo;
    });
    const hotVOs = homeContents.hot.map((element, n) => {
      const vo = new SummaryVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      vo.rankNumber = n + 1;
      if (!vo.thumbnail) {
        vo.thumbnail = vo.images.wide;
      }
      return vo;
    });
    const newVOs = homeContents.new.map(element => {
      const vo = new SummaryVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      if (!vo.thumbnail) {
        vo.thumbnail = vo.images.wide;
      }
      return vo;
    });
    const recommendVOs = homeContents.recommend.map(element => {
      const vo = new SummaryVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      if (!vo.thumbnail) {
        vo.thumbnail = vo.images.wide;
      }
      return vo;
    });

    // 오디오 카테고리 로드
    try {
      const audioCategoryData = await net.getAudioBookCategory(isRefresh);
      // VO로 정리해서 사용
      this.store.audioBookCategoryData = audioCategoryData.map(element => {
        const vo = new PageCategoryItemVO();
        _.each(element, (value, key) => (vo[key] = value));
        vo.key = element.id.toString();
        vo.label = element.title;
        return vo;
      });
    } catch (error) {
      console.log(error);
    }

    // mobx 바인딩
    this.store.videoCategoryData = categoryVOs;
    this.store.classHotData = hotVOs;
    this.store.classNewData = newVOs;
    this.store.classRecommendData = recommendVOs;
    try {
      this.store.clipRankData = await net.getHomeClipRank(isRefresh);
    } catch (error) {
      console.log(error);
    }
    try {
      this.store.homeBannerData = await net.getMainBanner(isRefresh);
    } catch (error) {
      console.log(error);
    }
    try {
      this.store.audioNewData = await net.getAudioBookList(isRefresh);
    } catch (error) {
      console.log(error);
    }
    try {
      this.store.audioMonth = await net.getHomeAudioBookMonth(isRefresh);
    } catch (error) {
      console.log(error);
    }
    this.store.clipRankData = await net.getHomeClipRank(isRefresh);
    this.store.audioNewData = await net.getAudioBookList(isRefresh);
    this.store.audioMonth = await net.getHomeAudioBookMonth(isRefresh);
    this.store.audioDaily = {};
    try {
      this.store.audioDaily = await net.getDailyBookList(isRefresh);
    } catch (error) {
      console.log(error);
    }

    this.store.audioHotData = homeAudioBookContents.hot;
    this.store.audioNewData = homeAudioBookContents.new;
    this.store.audioRecommendData = homeAudioBookContents.recommend;
    // this.store.audioPlayRecentData = await net.getPlayRecentAudioBook( isRefresh );

    try {
      this.store.classUseData = await net.getPlayRecentVideoCourses(isRefresh);
    } catch (error) {
      console.log(error);
    }
    try {
      this.store.audioBuyData = await net.getPurchasedAudioBooks(isRefresh);
    } catch (error) {
      console.log(error);
    }
    try {
      this.store.audioUseData = await net.getPlayRecentAudioBook(isRefresh);
    } catch (error) {
      console.log(error);
    }
  };

  async setMiniPlayer(cid, duration) {
    try {
      const contentDataInfo = await net.getContentInfo(cid);

      let videoClips = [];
      let audioChapters = [];
      let miniPlayerCid = cid;
      let miniPlayerTitle = '';
      let miniPlayerGroupTitle = contentDataInfo.data.data.title;
      let miniPlayerTotalPlayTime = '';
      let miniPlayercurrentPlayTime = duration;

      if (contentDataInfo.data.type === 'video-course') {
        videoClips = contentDataInfo.data.data.clips;
        videoClips.map((item, key) => {
          if (item.cid === miniPlayerCid) {
            miniPlayerCid = item.cid;
            miniPlayerTitle = item.title;
            miniPlayerTotalPlayTime = item.play_time;
          }
        });
      } else if (contentDataInfo.data.type === 'audiobook') {
        audioChapters = contentDataInfo.data.data.chapters;
        audioChapters.map((item, key) => {
          if (item.cid === miniPlayerCid) {
            miniPlayerCid = item.cid;
            miniPlayerTitle = item.title;
            miniPlayerTotalPlayTime = item.play_time;
          }
        });
      }

      let userId = globalStore.welaaaAuth.profile.id;
      let accessToken = globalStore.welaaaAuth.access_token;

      let config = {
        miniPlayerCid: miniPlayerCid,
        miniPlayerTitle: miniPlayerTitle,
        miniPlayerTotalPlayTime: miniPlayerTotalPlayTime,
        miniPlayerGroupTitle: miniPlayerGroupTitle,
        miniPlayercurrentPlayTime: miniPlayercurrentPlayTime,
        userId: userId.toString(),
        accessToken: accessToken,
      };

      Native.mainToggleMiniPlayer(true, config);
    } catch (error) {
      console.error(error);
    }
  }

  getProgressList = async () => {
    if (Platform.OS === 'android') {
      // SQLite 저장된 정보 베이스로 마지막 재생 콘텐츠 첫번째를 로드합니다. (desc)
      // 미니 플레이어 셋팅에 필요한 정보는 다시 /contents-info/cid 로 받고
      // 재생을 클릭하거나 , 플레이어로 진입하려고 할때 Native.play(cid)
      // 프로세스로 진행됩니다 ... 플레이어 진입 없이 처리하고 싶은데 그렇게 하기가
      // 쉽지가 않네요 ...

      Native.getProgressDatabase(
        result => {
          if ('null' !== result.trim()) {
            try {
              let jsonData = JSON.parse(result);
              jsonData.map((item, key) => {
                if (key === 0) {
                  this.setMiniPlayer(item.cid, item.duration);
                }
              });
            } catch (e) {
              console.error(e);
            }
          }
        },
        error => console.error(e),
      );
    }
  };

  showPopup() {
    if (globalStore.welaaaAuth) {
      return (
        <AdvertisingSection show_popup={this.state.show_popup} popup_type="" />
      );
    }
  }

  showMbsPopup() {
    if (globalStore.welaaaAuth) {
      return (
        <AdvertisingSection
          show_popup={this.state.show_popup_mbs}
          popup_type="membership"
        />
      );
    }
  }

  showFullModal() {
    this.props.navigation.navigate('FullModalView', {
      popup_type: 'AndroidMainExit',
      preview_page: 'HomePage',
    });
  }

  componentDidMount = async () => {
    this.getProgressList();

    if (globalStore.welaaaAuth) {
      let windowWidth = Dimensions.get('window').width;
      let windowHeight = Dimensions.get('window').height;

      this.store.windowWidth = windowWidth;
      this.store.windowHeight = windowHeight;
      this.store.slideHeight = windowWidth * 0.347;
      this.store.clipRankContentSize = windowWidth - 85;

      try {
        this.getData();
      } catch (error) {
        console.log(error);
      }
    }
    if (this.props.navigation.isFocused()) {
      this.setState({ show_popup: true });
    }

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  };

  componentWillUpdate() {
    const params = this.props.navigation.state.params;
    if (params && true === params.reload_mbs) {
      // 멤버쉽 가져오기
      globalStore.currentMembership = async () =>
        await net.getMembershipCurrent();
      // 이용권 가져오기
      globalStore.voucherStatus = async () => await net.getVouchersStatus();
    }
  }

  componentDidUpdate() {
    const params = this.props.navigation.state.params;

    if (params && 'audioBook' === params.page) {
      this.props.navigation.state.params.page = undefined;
      this.goPage('audioBook');
    } else if (params && true === params.reload_mbs) {
      this.props.navigation.state.params.reload_mbs = undefined;
      // 멤버쉽 가져오기
      globalStore.currentMembership = async () =>
        await net.getMembershipCurrent();
      // 이용권 가져오기
      globalStore.voucherStatus = async () => await net.getVouchersStatus();
    } else if (params && true === params.show_popup) {
      // 멤버십 화면에서 돌아왔을 경우에 팝업 띄워주도록 state변경
      this.props.navigation.state.params.show_popup = undefined;
      this.setState({ show_popup: true });
    }

    if (params && true === params.popup_mbs) {
      this.props.navigation.state.params.popup_mbs = undefined;
      // 멤버십 구매한 직후의 사용자 대상으로 별도 팝업(프로모션 등)을 띄워주고자 할 때 여기에서.
      // TODO: 팝업이 있는 경우와 없는 경우 혹은 네트워크 실패시의 예외처리.
      this.setState({ show_popup_mbs: true });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    console.log('back press:');
    // if (this.props.navigation.isFocused()) {
    //   BackHandler.exitApp();
    // }

    if (this.props.navigation.isFocused()) {
      if (globalStore.currentMembership !== undefined
        && globalStore.currentMembership.type === undefined) {
        this.showFullModal();
        return true;
      } else {
        BackHandler.exitApp();
      }
    }
  };

  checkMemberShip = () => {
    // Alert.alert('CurrentMemberShip Type ','TEST');
    // {globalStore.welaaaAuth && <AdvertisingSection />}

    if (globalStore && globalStore.currentMembership) {
      const { type } = globalStore.currentMembership;
    }
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
            style={{ flex: 1, height: this.store.windowHeight - 40 }}
            onPageSelected={this.onPageSelected}
          >
            <View style={styles.tabContentContainer}>
              <HomeVideoPage
                store={this.store}
                onRefresh={() => this.getData(true)}
              />
            </View>
            <View style={styles.tabContentContainer}>
              <HomeAudioPage
                store={this.store}
                onRefresh={() => this.getData(true)}
              />
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
          {this.showPopup()}
          {this.showMbsPopup()}
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(HomePage);
