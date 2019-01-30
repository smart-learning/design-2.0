import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PTRView from '../../libs/react-native-pull-to-refresh';
import Swiper from 'react-native-swiper';
import { withNavigation } from 'react-navigation';
import _ from 'underscore';
import IcAngleRightGrey from '../../../images/ic-angle-right-grey.png';
import IcMainWideBanner from '../../../images/main_wide_banner.png';
import BannerMembership from '../../../images/banner-membership.png';
import CommonStyles from '../../../styles/common';
import globalStore from '../../commons/store';
import ClassContinueList from '../../components/home/ClassContinueList';
import ClassList from '../../components/home/ClassList';
import ClipRank from '../../components/home/ClipRank';
import HomeBanner from '../../components/home/HomeBanner';
import SeriesSwiper from '../../components/home/SeriesSwiper';
import Series from '../../components/home/Series';
import PageCategory from '../../components/PageCategory';
import Native from '../../commons/native';
import Footer from '../../components/home/Footer';

const CATEGORY_HEIGHT = 40;

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    paddingTop: '17.3571428572%',
    paddingBottom: '17.3571428572%',
  },
  mainTitleCenter: {
    textAlign: 'center',
  },
  titleContainer: {
    marginBottom: 15,
  },
  titleWithButtonContainer: {
    height: 30,
  },
  titleH2: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#353A3C',
  },
  titleH4: {
    paddingTop: 10,
    fontSize: 13,
    color: '#888888',
  },
  titleH3: {
    fontSize: 17,
    fontWeight: '400',
    color: '#353A3C',
  },
  titleParagraph: {
    paddingLeft: 15,
    fontSize: 11,
    color: '#b7b7b7',
  },
  titleLink: {
    fontSize: 13,
    color: CommonStyles.COLOR_PRIMARY,
  },
  titleHr: {
    height: 1,
    marginTop: 7,
    backgroundColor: '#cecece',
  },
  linkViewAll: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 36,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#dddddd',
  },
  classLinkViewAll: {
    marginTop: 15,
    marginBottom: 30,
  },
  linkViewAllText: {
    fontSize: 14,
    color: '#888888',
  },
  linkViewAllIcon: {
    paddingLeft: 7,
    height: 13,
  },
  continueContainer: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  seriesContainer: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  classContainer: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  clipRankContainer: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  classCategory: {
    paddingHorizontal: 4,
    height: CATEGORY_HEIGHT,
  },
  classCategoryHr: {
    height: 1,
    backgroundColor: '#cecece',
  },
  seriesComponent: {
    paddingTop: 10,
  },
  showMoreWrapper: {
    marginTop: 2,
    justifyContent: 'center',
  },
  showAllText: {
    color: CommonStyles.COLOR_PRIMARY,
    fontSize: 15,
  },
  showMore: {
    borderColor: CommonStyles.COLOR_PRIMARY,
    borderWidth: 1,
    borderRadius: 18,
    paddingTop: 2,
    paddingRight: 10,
    paddingBottom: 2,
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showMoreText: {
    color: CommonStyles.COLOR_PRIMARY,
    fontSize: 12,
  },
  imageMainBanner: {
    width: '100%',
    paddingTop: '10.069444444%',
    paddingBottom: '10.069444444%',
  },
});

@observer
class HomeVideoPage extends React.Component {
  state = {
    categoryY: CATEGORY_HEIGHT,
    scrollTargetY: 0,
    selectedCategory: 0,
    forceScrollValue: null,
  };

  /* 카테고리 클릭시 클래스 리스트 페이지로 이동 with Params */
  premiumCategorySelect = data => {
    this.setState({ selectedCategory: data.id });
    this.scrollContent.scrollView.scrollTo({ y: this.state.scrollTargetY });
    if (_.isFunction(this.props.updateCode)) {
      this.props.updateCode(data.ccode);
    }
  };

  onScroll = event => {
    let y = CATEGORY_HEIGHT - event.nativeEvent.contentOffset.y;
    if (y < 0) {
      y = 0;
    } else if (y > CATEGORY_HEIGHT) {
      y = CATEGORY_HEIGHT;
    }
    this.setState({ categoryY: y });

    if (_.isFunction(this.props.onScroll)) {
      this.props.onScroll(event);
    }
  };

  render() {
    let updatedAt = moment().format('YYYY. MM. DD');
    let homeBannerData = [];
    try {
      if (_.isObject(this.props.store.homeBannerData)) {
        homeBannerData = this.props.store.homeBannerData;
      }
    } catch (error) {
      console.log(error);
    }

    const { homeSeriesData } = this.props.store;

    const renderPagination = (index, total, context) => {
      return (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            paddingTop: 2,
            paddingBottom: 2,
            paddingRight: 10,
            paddingLeft: 10,
            borderWidth: 1,
            borderColor: '#FFFFFF',
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
          borderRadius={10}
        >
          <Text style={{ color: 'white', fontSize: 10 }}>
            {index + 1}/{total}
          </Text>
        </View>
      );
    };

    return (
      <View>
        {/*카테고리 영역 시작*/}
        <View
          style={[
            styles.classCategory,
            { transform: [{ translateY: this.state.categoryY }], zIndex: 2 },
          ]}
        >
          <PageCategory
            ref={ref => (this.pageCategory = ref)}
            data={this.props.store.videoCategoryData}
            selectedCategory={this.state.selectedCategory}
            onCategorySelect={this.premiumCategorySelect}
          />
        </View>
        {/*/카테고리 영역 끝*/}

        <PTRView
          ref={ref => (this.scrollContent = ref)}
          forceScrollValue={this.state.forceScrollValue}
          onScroll={this.onScroll}
          onRefresh={() => this.props.onRefresh()}
        >
          <View style={{ flex: 1 }}>
            {/* 이미지 스와이퍼 */}

            <View
              style={{
                height: this.props.store.slideHeight + CATEGORY_HEIGHT,
                background: '#ff0',
                paddingTop: CATEGORY_HEIGHT,
              }}
            >
              {homeBannerData.length > 0 && (
                <Swiper
                  style={styles.wrapper}
                  showsButtons={false}
                  height={this.props.store.slideHeight + CATEGORY_HEIGHT}
                  renderPagination={renderPagination}
                  autoplay={true}
                  autoplayTimeout={3}
                >
                  {homeBannerData.map((item, key) => {
                    let bannerImageUrl = '';
                    const { action_type, action_param } = item;
                    try {
                      bannerImageUrl = item.images.default;
                    } catch (e) {}

                    return (
                      <HomeBanner
                        key={key}
                        action_type={action_type}
                        action_param={action_param}
                        bannerImageUrl={bannerImageUrl}
                        navigation={this.props.navigation}
                      />
                    );
                  })}
                </Swiper>
              )}
              {homeBannerData.length === 0 && (
                <View style={{ marginTop: '20%' }}>
                  <ActivityIndicator
                    size="large"
                    color={CommonStyles.COLOR_PRIMARY}
                  />
                </View>
              )}
            </View>
            {/* /이미지 스와이퍼 */}

            <View
              style={{ width: '100%', height: 8, backgroundColor: '#F0F0F4' }}
            />

            <View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  // this.props.navigation.navigate('VideoPack', {
                  //   title: '윌라 홍보 영상'
                  // })
                  // 윌라 소개 동영상을 임시로 강좌로 구성했습니다.
                  // VideoPack 쓰려면 HomeScreen 에 추가 해서 사용하시면 됩니다.
                  Native.play('v300001_001')
                }
              >
                <ImageBackground
                  source={IcMainWideBanner}
                  resizeMode="contain"
                  style={styles.imageMainBanner}
                />
              </TouchableOpacity>
            </View>

            <View>
              {globalStore.welaaaAuth && (
                <View>
                  {this.props.store.classUseData &&
                    this.props.store.classUseData.length > 0 && (
                      <View>
                        <View
                          style={[
                            CommonStyles.contentContainer,
                            styles.continueContainer,
                          ]}
                        >
                          <View>
                            <View style={styles.titleContainer}>
                              <Text style={styles.titleH3}>
                                최근 재생 클래스
                              </Text>
                            </View>

                            <ClassContinueList
                              itemData={this.props.store.classUseData}
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            width: '100%',
                            height: 8,
                            backgroundColor: '#F0F0F4',
                          }}
                        />
                      </View>
                    )}
                </View>
              )}
            </View>

            {homeSeriesData &&
              homeSeriesData.length &&
              (homeSeriesData.length <= 6 ? (
                <View style={{ marginTop: 12 }}>
                  <ActivityIndicator
                    size="large"
                    color={CommonStyles.COLOR_PRIMARY}
                  />
                </View>
              ) : (
                <View
                  ref={ref => (this.ccContainer = ref)}
                  style={[
                    CommonStyles.contentContainer,
                    styles.seriesContainer,
                  ]}
                >
                  <View
                    style={[
                      CommonStyles.alignJustifyContentBetween,
                      styles.titleContainer,
                      styles.titleWithButtonContainer,
                    ]}
                  >
                    <Text style={styles.titleH2}>윌라 추천시리즈</Text>
                    <View style={styles.showMoreWrapper}>
                      <TouchableOpacity
                        style={styles.showMore}
                        onPress={() => {
                          this.props.navigation.navigate('HomeSeriesListPage', {
                            title: '윌라 추천시리즈',
                          });
                        }}
                      >
                        <Text style={styles.showMoreText}>전체보기</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.seriesComponent}>
                    <SeriesSwiper itemData={this.props.store.homeSeriesData} />
                  </View>
                </View>
              ))}

            <View
              style={{ width: '100%', height: 8, backgroundColor: '#F0F0F4' }}
            />

            {homeBannerData.length === 0 && (
              <View style={{ marginTop: '20%' }}>
                <ActivityIndicator
                  size="large"
                  color={CommonStyles.COLOR_PRIMARY}
                />
              </View>
            )}

            {this.props.store.classHotData.length > 0 && (
              <View
                style={[CommonStyles.contentContainer, styles.classContainer]}
                onLayout={event => {
                  const layout = event.nativeEvent.layout;
                  this.setState({ scrollTargetY: layout.y });
                }}
              >
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.titleContainer,
                    styles.titleWithButtonContainer,
                  ]}
                >
                  <View>
                    <Text style={styles.titleH2}>윌라 프리미엄 클래스</Text>
                  </View>
                  <View style={styles.showMoreWrapper}>
                    <TouchableOpacity
                      style={styles.showMore}
                      onPress={() => {
                        this.props.navigation.navigate('ClassListPage');
                      }}
                    >
                      <Text style={styles.showMoreText}>전체보기</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={CommonStyles.alignJustifyContentBetween}>
                  <Text style={styles.titleH3}>새로 나온 클래스</Text>
                </View>

                <ClassList
                  itemData={this.props.store.classNewData}
                  classType="new"
                />

                <View style={CommonStyles.alignJustifyContentBetween}>
                  <Text style={styles.titleH3}>오늘의 인기 클래스</Text>
                </View>

                <ClipRank itemData={this.props.store.clipRankData} />

                <View
                  style={{
                    marginBottom: 22,
                    marginLeft: -13,
                    marginRight: -13,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      // this.props.navigation.navigate('VideoPack', {
                      //   title: '윌라 홍보 영상'
                      // })
                      // 윌라 소개 동영상을 임시로 강좌로 구성했습니다.
                      // VideoPack 쓰려면 HomeScreen 에 추가 해서 사용하시면 됩니다.
                      Native.play('v300001_001')
                    }
                  >
                    <ImageBackground
                      source={IcMainWideBanner}
                      resizeMode="contain"
                      style={styles.imageMainBanner}
                    />
                  </TouchableOpacity>
                </View>

                <View style={CommonStyles.alignJustifyContentBetween}>
                  <Text style={styles.titleH3}>
                    {globalStore.welaaaAuth.profile
                      ? globalStore.welaaaAuth.profile.name || '<윌라회원님>'
                      : '<윌라회원님>'}
                    님을 위한 추천 클래스
                  </Text>
                </View>

                <ClassList
                  itemData={this.props.store.classRecommendData}
                  itemType={'recommend'}
                />

                <View
                  style={{ marginBottom: 30, marginLeft: 10, marginRight: 10 }}
                >
                  <TouchableOpacity
                    style={[styles.showMore, { height: 36 }]}
                    onPress={() => {
                      this.props.navigation.navigate('ClassListPage');
                    }}
                  >
                    <Text style={styles.showAllText}>클래스 전체보기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Footer />
          </View>
        </PTRView>
      </View>
    );
  }
}

export default withNavigation(HomeVideoPage);
