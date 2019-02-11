import React from 'react';
import CommonStyles from '../../../styles/common';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { observer } from 'mobx-react';
import Swiper from 'react-native-swiper';
import PageCategory from '../../components/PageCategory';
import BookContinueList from '../../components/home/BookContinueList';
import PTRView from '../../libs/react-native-pull-to-refresh';
import BookDaily from '../../components/home/BookDaily';
import { withNavigation } from 'react-navigation';
import _ from 'underscore';
import HomeBanner from '../../components/home/HomeBanner';
import globalStore from '../../commons/store';
import BookNewList from '../../components/home/BookNewList';
import BookRankList from '../../components/home/BookRankList';
import BulletFree from '../../../images/badge-free.png';
import Native from '../../commons/native';
import IcMainWideBanner from '../../../images/main_wide_banner.png';
import Footer from '../../components/home/Footer';
import BookMonthlySwiper from '../../components/home/BookMonthlySwiper';
import FastImage from 'react-native-fast-image';

const CATEGORY_HEIGHT = 45;

const styles = StyleSheet.create({
  wrapper: {},
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
  classTitleContainer: {
    marginTop: 35,
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
    fontSize: 17.5,
    fontWeight: '500',
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
  continueContainer: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  monthContainer: {
    paddingTop: 50,
    paddingBottom: 50,
  },
  dailyContainer: {
    position: 'relative',
    paddingTop: 40,
    paddingBottom: 30,
  },
  audioBookContainer: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  showMoreWrapper: {
    marginTop: 2,
    justifyContent: 'center',
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
  audioCategory: {
    paddingHorizontal: 4,
    height: CATEGORY_HEIGHT,
  },
  audioCategoryHr: {
    height: 1,
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
  showAllText: {
    color: CommonStyles.COLOR_PRIMARY,
    fontSize: 15,
  },
  showMoreText: {
    color: CommonStyles.COLOR_PRIMARY,
    fontSize: 12,
  },
  dailyBullet: {
    position: 'absolute',
    top: -15,
    right: 15,
    width: 60,
    height: 60,
  },
  imageMainBanner: {
    width: '100%',
    paddingTop: '10.069444444%',
    paddingBottom: '10.069444444%',
  },
});

@observer
class HomeAudioPage extends React.Component {
  state = {
    categoryY: CATEGORY_HEIGHT,
    scrollTargetY: 0,
    selectedCategory: 0,
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
    let homeBannerData = [];
    try {
      if (_.isObject(this.props.store.homeBannerData)) {
        homeBannerData = this.props.store.homeBannerData;
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', '통신에 실패했습니다.');
    }

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
            styles.audioCategory,
            { transform: [{ translateY: this.state.categoryY }], zIndex: 2 },
          ]}
        >
          <PageCategory
            data={this.props.store.audioBookCategoryData}
            selectedCategory={this.state.selectedCategory}
            onCategorySelect={this.premiumCategorySelect}
          />
        </View>
        {/*카테고리 영역 끝*/}
        <PTRView
          ref={ref => (this.scrollContent = ref)}
          onScroll={this.onScroll}
          onRefresh={() => this.props.onRefresh()}
        >
          <View style={{ flex: 1 }}>
            {/* 이미지 스와이퍼 */}
            <View
              style={{
                height: this.props.store.slideHeight + CATEGORY_HEIGHT,
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
                <FastImage
                  source={IcMainWideBanner}
                  style={styles.imageMainBanner}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableOpacity>
            </View>

            {globalStore.welaaaAuth && (
              <View>
                {this.props.store.audioUseData &&
                  this.props.store.audioUseData.length > 0 && (
                    <View>
                      <View
                        style={[
                          CommonStyles.contentContainer,
                          styles.continueContainer,
                        ]}
                      >
                        <View>
                          <View style={CommonStyles.alignJustifyItemCenter}>
                            <Text style={styles.titleH3}>
                              최근 재생 오디오북
                            </Text>
                          </View>
                          <BookContinueList
                            itemData={this.props.store.audioUseData}
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

            {this.props.store.audioMonth.length > 0 && (
              <View style={styles.monthContainer}>
                <BookMonthlySwiper itemData={this.props.store.audioMonth} />
              </View>
            )}

            <View
              style={{ width: '100%', height: 8, backgroundColor: '#F0F0F4' }}
            />

            {/*매일 책 한 권*/}
            <View
              style={[CommonStyles.contentContainer, styles.dailyContainer]}
            >
              <View>
                <Image source={BulletFree} style={styles.dailyBullet} />
                <View style={CommonStyles.alignJustifyItemCenter}>
                  <Text style={styles.titleH2}>매일 책 한권</Text>
                </View>
                <BookDaily itemData={this.props.store.audioDaily} />
              </View>
            </View>

            <View
              style={{ width: '100%', height: 8, backgroundColor: '#F0F0F4' }}
            />

            <View
              style={[CommonStyles.contentContainer, styles.audioBookContainer]}
              onLayout={event => {
                const layout = event.nativeEvent.layout;
                this.setState({ scrollTargetY: layout.y });
              }}
            >
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.titleWithButtonContainer,
                ]}
              >
                <Text style={styles.titleH2}>윌라 오디오북</Text>
                <View style={styles.showMoreWrapper}>
                  <TouchableOpacity
                    style={styles.showMore}
                    onPress={() => {
                      this.props.navigation.navigate('AudioBookPage');
                    }}
                  >
                    <Text style={styles.showMoreText}>전체보기</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.classTitleContainer,
                ]}
              >
                <Text style={styles.titleH3}>새로 나온 오디오북</Text>
              </View>

              <BookNewList
                itemData={
                  this.props.store.audioNewData.items
                    ? this.props.store.audioNewData.items
                    : this.props.store.audioNewData
                }
              />

              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.classTitleContainer,
                ]}
              >
                <Text style={styles.titleH3}>오늘의 인기 오디오북</Text>
              </View>
              <BookRankList
                itemData={
                  this.props.store.audioHotData.items
                    ? this.props.store.audioHotData.items
                    : this.props.store.audioHotData
                }
              />
            </View>
            <View style={{ marginBottom: 50, marginLeft: 10, marginRight: 10 }}>
              <TouchableOpacity
                style={[styles.showMore, { height: 36 }]}
                onPress={() => {
                  this.props.navigation.navigate('AudioBookPage');
                }}
              >
                <Text style={styles.showAllText}>오디오북 전체보기</Text>
              </TouchableOpacity>
            </View>

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
                <FastImage
                  source={IcMainWideBanner}
                  resizeMode={FastImage.resizeMode.contain}
                  style={styles.imageMainBanner}
                />
              </TouchableOpacity>
            </View>

            <Footer />
          </View>
        </PTRView>
      </View>
    );
  }
}

export default withNavigation(HomeAudioPage);
