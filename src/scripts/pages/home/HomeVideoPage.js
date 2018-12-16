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
  UIManager
} from 'react-native';
import PTRView from 'react-native-pull-to-refresh';
import Swiper from 'react-native-swiper';
import { withNavigation } from 'react-navigation';
import _ from 'underscore';
import IcAngleRightGrey from '../../../images/ic-angle-right-grey.png';
import IcMainWideBanner from '../../../images/main_wide_banner.png';
import CommonStyles from '../../../styles/common';
import globalStore from '../../commons/store';
import ClassContinueList from '../../components/home/ClassContinueList';
import ClassList from '../../components/home/ClassList';
import ClipRank from '../../components/home/ClipRank';
import HomeBanner from '../../components/home/HomeBanner';
import SeriesSwiper from '../../components/home/SeriesSwiper';
import PageCategory from '../../components/PageCategory';
import Native from '../../commons/native';

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: '100%',
    paddingTop: '17.3571428572%',
    paddingBottom: '17.3571428572%'
  },
  mainTitleCenter: {
    textAlign: 'center'
  },
  titleContainer: {
    marginBottom: 15
  },
  titleH2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353A3C'
  },
  titleH4: {
    paddingTop: 10,
    fontSize: 13,
    color: '#888888'
  },
  titleH3: {
    fontSize: 16,
    color: '#353A3C'
  },
  titleParagraph: {
    paddingLeft: 15,
    fontSize: 11,
    color: '#b7b7b7'
  },
  titleLink: {
    fontSize: 13,
    color: CommonStyles.COLOR_PRIMARY
  },
  titleHr: {
    height: 1,
    marginTop: 7,
    backgroundColor: '#cecece'
  },
  linkViewAll: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 36,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  classLinkViewAll: {
    marginTop: 15,
    marginBottom: 30
  },
  linkViewAllText: {
    fontSize: 14,
    color: '#888888'
  },
  linkViewAllIcon: {
    paddingLeft: 7,
    height: 13
  },
  continueContainer: {
    paddingTop: 30,
    paddingBottom: 30
  },
  seriesContainer: {
    paddingTop: 30,
    paddingBottom: 30
  },
  classContainer: {
    paddingTop: 30,
    paddingBottom: 30
  },
  clipRankContainer: {
    paddingTop: 30,
    paddingBottom: 30
  },
  classCategory: {
    marginBottom: 25
  },
  classCategoryHr: {
    height: 1,
    backgroundColor: '#cecece'
  },
  seriesComponent: {
    paddingTop: 30
  },
  showMoreWrapper: {
    marginBottom: 10,
    alignItems: 'flex-end'
  },
  showAllText: {
    color: CommonStyles.COLOR_PRIMARY,
    fontSize: 15
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
    alignItems: 'center'
  },
  showMoreText: {
    color: CommonStyles.COLOR_PRIMARY,
    fontSize: 12
  },
  imageMainBanner: {
    width: '100%',
    paddingTop: '12%',
    paddingBottom: '12%'
  }
});

@observer
class HomeVideoPage extends React.Component {
  ccContainer = null;
  ccContainerY = -1;

  constructor(props) {
    super(props);
    this.state = {
      forceScrollValue: null
    };
  }

  /* CircularCarousel이 확대될때 스크롤 위치를 top에 맞춰주기 */
  onFullScreenToggle = bool => {
    if (bool) {
      this.setState({
        forceScrollValue: 430 // 컨덴츠의 y값 + 헤더 영역뺀 값
      });
    }
  };

  /* 카테고리 클릭시 클래스 리스트 페이지로 이동 with Params */
  premiumCategorySelect = data => {
    this.props.navigation.navigate(
      'ClassListPage',
      { action: 'category', data: data } // 전달할 데이터
    );
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

    return (
      <PTRView
        forceScrollValue={this.state.forceScrollValue}
        onRefresh={() => this.props.onRefresh()}
      >
        <ScrollView style={{ flex: 1 }}>
          {/* 이미지 스와이퍼 */}
          <View
            style={{ height: this.props.store.slideHeight, background: '#ff0' }}
          >
            {homeBannerData.length > 0 && (
              <Swiper
                style={styles.wrapper}
                showsButtons={false}
                height={this.props.store.slideHeight}
                dotColor={'#888888'}
                activeDotColor={'#ffffff'}
                paginationStyle={{ left: '-65%', bottom: 10 }}
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
          </View>
          {/* /이미지 스와이퍼 */}

          <View>
            {globalStore.welaaaAuth && (
              <View>
                <View
                  style={[
                    CommonStyles.contentContainer,
                    styles.continueContainer
                  ]}
                >
                  {this.props.store.classUseData &&
                    this.props.store.classUseData.length > 0 && (
                      <View>
                        <View style={styles.titleContainer}>
                          <Text style={styles.titleH2}>최근재생클래스</Text>
                        </View>

                        <ClassContinueList
                          itemData={this.props.store.classUseData}
                        />
                      </View>
                    )}
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 8,
                    backgroundColor: '#F0F0F4'
                  }}
                />
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
                style={[CommonStyles.contentContainer, styles.seriesContainer]}
              >
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.titleContainer
                  ]}
                >
                  <View>
                    <Text style={styles.titleH2}>윌라 추천 시리즈</Text>
                  </View>
                  <View style={styles.showMoreWrapper}>
                    <TouchableOpacity
                      style={styles.showMore}
                      onPress={() => {
                        this.props.navigation.navigate('HomeSeriesPage', {
                          title: '윌라 추천 시리즈'
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
            >
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.titleContainer
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

              <View style={styles.classCategory}>
                <View style={styles.classCategoryHr} />
                <PageCategory
                  data={this.props.store.videoCategoryData}
                  selectedCategory={0}
                  onCategorySelect={this.premiumCategorySelect}
                />
                <View style={styles.classCategoryHr} />
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

              <View style={CommonStyles.alignJustifyContentBetween}>
                <Text style={styles.titleH3}>
                  회원들이 열심히 듣고 있는 클래스
                </Text>
              </View>

              <ClassList
                classType="hot"
                itemData={this.props.store.classHotData}
              />

              <View style={CommonStyles.alignJustifyContentBetween}>
                <Text style={styles.titleH3}>윌라 추천 클래스</Text>
              </View>

              <ClassList itemData={this.props.store.classRecommendData} />

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
        </ScrollView>
      </PTRView>
    );
  }
}

export default withNavigation(HomeVideoPage);
