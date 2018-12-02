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
import Series from '../../components/home/Series';
import PageCategory from '../../components/PageCategory';
import Native from '../../commons/native';
import CircularCarousel from '../../components/CircularCarousel';

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
  titleH2: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333'
  },
  titleH4: {
    paddingTop: 10,
    fontSize: 13,
    color: '#888888'
  },
  titleH3: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333'
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
    marginRight: 'auto',
    backgroundColor: '#dddddd'
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
  seriesContainer: {
    paddingTop: 50,
    paddingBottom: 50
  },
  classContainer: {
    paddingTop: 50,
    paddingBottom: 50
  },
  classCategory: {
    marginTop: 20,
    marginBottom: 20
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
  showMore: {
    borderColor: CommonStyles.COLOR_PRIMARY,
    borderWidth: 1,
    borderRadius: 18,
    paddingTop: 2,
    paddingRight: 10,
    paddingBottom: 2,
    paddingLeft: 10
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
      <PTRView onRefresh={() => this.props.onRefresh()}>
        <ScrollView style={{ flex: 1 }}>
          {/* 이미지 스와이퍼 */}

          <View style={{ height: this.props.store.slideHeight, background: '#ff0' }}>
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

          {/* */}
          {
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
          }

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
                style={[CommonStyles.contentContainer, styles.seriesContainer]}
              >
                <View>
                  <View>
                    <Text style={[styles.mainTitleCenter, styles.titleH2]}>
                      윌라 추천 시리즈
                    </Text>
                    <Text style={[styles.mainTitleCenter, styles.titleH4]}>
                      당신이 배우고 싶은 모든 것
                    </Text>
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

				 <View style={{ flex:1, justifyContent: 'center', alignItems:'center' }}>
					  <CircularCarousel/>
				 </View>

                <View style={styles.seriesComponent}>
                  <Series itemData={this.props.store.homeSeriesData} />
                </View>
              </View>
            ))}

          {this.props.store.classHotData.length > 0 && (
            <View
              style={[CommonStyles.contentContainer, styles.classContainer]}
            >
              <View>
                <Text style={[styles.mainTitleCenter, styles.titleH2]}>
                  윌라 프리미엄 클래스
                </Text>
                <Text style={[styles.mainTitleCenter, styles.titleH4]}>
                  당신의 커리어 성공과 행복한 일상을 위한 교육
                </Text>
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
                <Text style={[styles.titleParagraph, { marginLeft: 0 }]}>
                  {updatedAt} 업데이트
                </Text>
              </View>

              <ClassList
                itemData={this.props.store.classNewData}
                classType="new"
              />

              <View style={CommonStyles.alignJustifyContentBetween}>
                <Text style={styles.titleH3}>
                  회원들이 열심히 듣고 있는 클래스
                </Text>
                <Text style={[styles.titleParagraph, { marginLeft: 0 }]}>
                  {updatedAt} 업데이트
                </Text>
              </View>

              <ClassList
                classType="hot"
                itemData={this.props.store.classHotData}
              />

              <View style={CommonStyles.alignJustifyContentBetween}>
                <Text style={styles.titleH3}>윌라 추천 클래스</Text>
                <Text style={[styles.titleParagraph, { marginLeft: 0 }]}>
                  {updatedAt} 업데이트
                </Text>
              </View>

              <ClassList itemData={this.props.store.classRecommendData} />

              {1 === 2 && (
                <View>
                  <View style={CommonStyles.alignJustifyContentBetween}>
                    <Text style={styles.titleH3}>
                      지금 많이 듣고 있는 강의클립
                    </Text>
                    <Text
                      style={[styles.titleParagraph, { marginLeft: 'auto' }]}
                    >
                      {updatedAt} 업데이트
                    </Text>
                  </View>
                  <View style={styles.titleHr} />

                  <ClipRank
                    itemData={this.props.store.clipRankData}
                    clipRankContentSize={this.props.store.clipRankContentSize}
                  />

                  {globalStore.welaaaAuth && (
                    <View>
                      <View style={CommonStyles.alignJustifyItemCenter}>
                        <Text style={styles.titleH3}>이어보기</Text>
                        <Text style={styles.titleParagraph}>
                          {updatedAt} 업데이트
                        </Text>
                      </View>
                      <View style={styles.titleHr} />

                      {this.props.store.classUseData &&
                        this.props.store.classUseData.length === 0 && (
                          <Text
                            style={{
                              paddingTop: 20,
                              paddingBottom: 20,
                              textAlign: 'center'
                            }}
                          >
                            재생 내역이 없습니다
                          </Text>
                        )}

                      {this.props.store.classUseData &&
                        this.props.store.classUseData.length > 0 && (
                          <ClassContinueList
                            itemData={this.props.store.classUseData}
                          />
                        )}
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </PTRView>
    );
  }
}

export default withNavigation(HomeVideoPage);
