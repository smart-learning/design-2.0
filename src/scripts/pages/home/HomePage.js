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

import {
  Sentry,
  SentrySeverity,
  SentryLog
} from 'react-native-sentry';

Sentry.config('https://4f360fd602b44af79e2f4ec8b44e6566@sentry.io/1279179').install();

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    alignSelf: 'flex-start',
    width: '100%',
    top: 0,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
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
    fontSize: 16,
    fontWeight: '400',
    color: '#a4a4a4',
  },
  tabTextActive: {
    fontSize: 16,
    fontWeight: '400',
    color: CommonStyles.COLOR_PRIMARY,
  },
  tabHr: {
    position: 'absolute',
    left: '7%',
    bottom: 0,
    width: '86%',
    height: 3,
    backgroundColor: '#ffffff',
  },
  tabHrActive: {
    position: 'absolute',
    left: '7%',
    bottom: 0,
    width: '86%',
    height: 3,
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  tabContentContainer: {
    // paddingTop: 40,
  },
});

@observer
class HomePage extends React.Component {
  TAB_MENU_MAX = 40;

  state = {
    show_popup: false,
    show_popup_mbs: false,
    scrollY: 0,
    tabMenuHeight: this.TAB_MENU_MAX,
    videoCCode: null,
    audioCCode: null,
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

  convertHomeContentsToVO = contents => {
    const hotVOs = contents.hot.map((element, n) => {
      const vo = new SummaryVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      vo.rankNumber = n + 1;
      if (!vo.thumbnail) {
        vo.thumbnail = vo.images.wide;
      }
      return vo;
    });
    const newVOs = contents.new.map(element => {
      const vo = new SummaryVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      if (!vo.thumbnail) {
        vo.thumbnail = vo.images.wide;
      }
      return vo;
    });
    const recommendVOs = contents.recommend.map(element => {
      const vo = new SummaryVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      if (!vo.thumbnail) {
        vo.thumbnail = vo.images.wide;
      }
      return vo;
    });

    return { hotVOs, newVOs, recommendVOs };
  };

  updateVideoCCode = async code => {
    this.setState({ videoCCode: code });
    const homeContents = await net.getHomeContents(false, code);
    // VO로 정리해서 사용
    const { hotVOs, newVOs, recommendVOs } = this.convertHomeContentsToVO(
      homeContents,
    );
    this.store.classHotData = hotVOs;
    this.store.classNewData = newVOs;
    if (!!recommendVOs && recommendVOs.length > 1) {
      this.store.classRecommendData = recommendVOs;
    }
  };

  updateAudioCCode = async code => {
    this.setState({ audioCCode: code });
    const homeAudioBookContents = await net.getHomeAudioBookContents(
      false,
      code,
    );
    this.store.audioHotData = homeAudioBookContents.hot;
    this.store.audioNewData = homeAudioBookContents.new;
    this.store.audioRecommendData = homeAudioBookContents.recommend;
  };

  getData = async (isRefresh = false) => {
    // Facebook AppEventLogger Test
    // AppEventsLogger.logEvent('welaaaRN_Main_getData');

    // 가급적 화면 표시 순서대로 로드를 진행한다

    // 시리즈
    this.store.homeSeriesData = await net.getHomeSeries();

    // 최근 재생 클래스
    try {
      this.store.classUseData = await net.getPlayRecentVideoCourses(isRefresh);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', '통신에 실패했습니다.');
    }

    // 데이터 가져와서
    const videoCategoryData = await net.getLectureCategory(isRefresh);
    const homeContents = await net.getHomeContents(
      isRefresh,
      this.state.videoCCode,
    );
    const homeAudioBookContents = await net.getHomeAudioBookContents(
      isRefresh,
      this.state.audioCCode,
    );
    // VO로 정리해서 사용
    const { hotVOs, newVOs, recommendVOs } = this.convertHomeContentsToVO(
      homeContents,
    );
    const categoryVOs = videoCategoryData.map(element => {
      const vo = new PageCategoryItemVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      vo.label = element.title;
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
      Alert.alert('Error', '통신에 실패했습니다.');
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
      Alert.alert('Error', '통신에 실패했습니다.');
    }
    try {
      this.store.homeBannerData = await net.getMainBanner(isRefresh);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', '통신에 실패했습니다.');
    }
    try {
      this.store.audioNewData = await net.getAudioBookList(isRefresh);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', '통신에 실패했습니다.');
    }
    try {
      this.store.audioMonth = await net.getHomeAudioBookMonth(isRefresh);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', '통신에 실패했습니다.');
    }
    this.store.clipRankData = await net.getHomeClipRank(isRefresh);
    this.store.audioNewData = await net.getAudioBookList(isRefresh);
    this.store.audioMonth = await net.getHomeAudioBookMonth(isRefresh);
    this.store.audioDaily = {};
    try {
      this.store.audioDaily = await net.getDailyBookList(isRefresh);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', '통신에 실패했습니다.');
    }

    this.store.audioHotData = homeAudioBookContents.hot;
    this.store.audioNewData = homeAudioBookContents.new;
    this.store.audioRecommendData = homeAudioBookContents.recommend;

    try {
      this.store.audioBuyData = await net.getPurchasedAudioBooks(isRefresh);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', '통신에 실패했습니다.');
    }
    try {
      this.store.audioUseData = await net.getPlayRecentAudioBook(isRefresh);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', '통신에 실패했습니다.');
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
    if (globalStore.welaaaAuth) {
      let windowWidth = Dimensions.get('window').width;
      let windowHeight = Dimensions.get('window').height;

      this.store.windowWidth = windowWidth;
      this.store.windowHeight = windowHeight;
      this.store.slideHeight = windowWidth * 0.44444;
      this.store.clipRankContentSize = windowWidth - 85;

      try {
        this.getData();
      } catch (error) {
        console.log(error);
        Alert.alert('Error', '통신에 실패했습니다.');
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
      if (
        globalStore.currentMembership !== undefined &&
        globalStore.currentMembership.type === undefined
      ) {
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
      this.setState({ tabMenuHeight: this.TAB_MENU_MAX });
    } else if (event.nativeEvent.position === 1) {
      this.tabStatus = 'audioBook';
      this.setState({ tabMenuHeight: this.TAB_MENU_MAX });
    }
  };

  onScroll = event => {
    let height = this.TAB_MENU_MAX - event.nativeEvent.contentOffset.y;
    if (height < 0) {
      height = 0;
    } else if (height > this.TAB_MENU_MAX) {
      height = this.TAB_MENU_MAX;
    }
    this.setState({ tabMenuHeight: height });
  };

  onScrollEndDrag = event => {
    // this.setState({ tabMenuHeight: height });
  };

  render() {
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ViewPager
            ref={'pager'}
            initialPage={0}
            style={{ flex: 1 }}
            onPageSelected={this.onPageSelected}
          >
            <View style={styles.tabContentContainer}>
              <HomeVideoPage
                ref={ref => (this.videoPage = ref)}
                store={this.store}
                onRefresh={() => this.getData(true)}
                onScroll={this.onScroll}
                onScrollEndDrag={this.onScrollEndDrag}
                updateCode={this.updateVideoCCode}
              />
            </View>
            <View style={styles.tabContentContainer}>
              <HomeAudioPage
                ref={ref => (this.audioPage = ref)}
                store={this.store}
                onRefresh={() => this.getData(true)}
                onScroll={this.onScroll}
                updateCode={this.updateAudioCCode}
              />
            </View>
          </ViewPager>

          {this.showPopup()}
          {this.showMbsPopup()}

          <View
            style={[styles.tabContainer, { height: this.state.tabMenuHeight }]}
          >
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

export default withNavigation(HomePage);
