import React from 'react';
import CommonStyles from '../../../styles/common';
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
import { observer } from 'mobx-react';
import Swiper from 'react-native-swiper';
import IcAngleRightGrey from '../../../images/ic-angle-right-grey.png';
import BookMonthly from '../../components/home/BookMonthly';
import PageCategory from '../../components/PageCategory';
import BookFreeList from '../../components/home/BookFreeList';
import BookContinueList from '../../components/home/BookContinueList';
import PTRView from 'react-native-pull-to-refresh';
import moment from 'moment';
import BookDaily from '../../components/home/BookDaily';
import { withNavigation } from 'react-navigation';
import _ from 'underscore';
import HomeBanner from '../../components/home/HomeBanner';
import globalStore from '../../commons/store';
import BookNewList from '../../components/home/BookNewList';
import BookRankList from '../../components/home/BookRankList';
import BookRecommendList from '../../components/home/BookRecommendList';
import DailySwiper from '../../components/home/DailySwiper';
import BulletFree from '../../../images/badge-free.png';
import Native from '../../commons/native';
import IcMainWideBanner from '../../../images/main_wide_banner.png';
import BannerMembership from '../../../images/banner-membership.png';
import Footer from '../../components/home/Footer';

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
  titleH2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353A3C',
  },
  titleH4: {
    paddingTop: 10,
    fontSize: 13,
    color: '#888888',
  },
  titleH3: {
    fontSize: 16,
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
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#CDD0A4',
  },
  dailyContainer: {
    position: 'relative',
    paddingTop: 50,
    paddingBottom: 30,
  },
  audioBookContainer: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  showMoreWrapper: {
    marginBottom: 10,
    alignItems: 'flex-end',
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
    marginBottom: 25,
    marginTop: 0,
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
  /* 카테고리 클릭시 클래스 리스트 페이지로 이동 with Params */
  premiumCategorySelect = data => {
    this.props.navigation.navigate(
      'AudioBookPage',
      { action: 'category', data: data }, // 전달할 데이터
    );
  };

  render() {
    let homeBannerData = [];
    try {
      if (_.isObject(this.props.store.homeBannerData)) {
        homeBannerData = this.props.store.homeBannerData;
      }
    } catch (error) {
      console.log(error);
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
      <PTRView onRefresh={() => this.props.onRefresh()}>
        <ScrollView style={{ flex: 1 }}>
          {/* 이미지 스와이퍼 */}
          <View style={{ height: this.props.store.slideHeight }}>
            {homeBannerData.length > 0 && (
              <Swiper
                style={styles.wrapper}
                showsButtons={false}
                height={this.props.store.slideHeight}
                renderPagination={renderPagination}
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

          {globalStore.welaaaAuth && (
            <View>
              <View
                style={[
                  CommonStyles.contentContainer,
                  styles.continueContainer,
                ]}
              >
                {this.props.store.audioUseData &&
                  this.props.store.audioUseData.length > 0 && (
                    <View>
                      <View style={CommonStyles.alignJustifyItemCenter}>
                        <Text style={styles.titleH2}>최근재생 오디오북</Text>
                      </View>
                      <BookContinueList
                        itemData={this.props.store.audioUseData}
                      />
                    </View>
                  )}
              </View>

              <View
                style={{ width: '100%', height: 8, backgroundColor: '#F0F0F4' }}
              />
            </View>
          )}

          <View style={styles.monthContainer}>
            <BookMonthly itemData={this.props.store.audioMonth} />
          </View>

          <View
            style={{ width: '100%', height: 8, backgroundColor: '#F0F0F4' }}
          />

          {/*매일 책 한 권*/}
          <View>
            <View
              style={[CommonStyles.contentContainer, styles.dailyContainer]}
            >
              <View>
                <Image source={BulletFree} style={styles.dailyBullet} />
                <View style={CommonStyles.alignJustifyItemCenter}>
                  <Text style={styles.titleH2}>매일 책 한권</Text>
                </View>
                <DailySwiper itemData={this.props.store.audioDaily} />
              </View>
            </View>
          </View>

          <View
            style={{ width: '100%', height: 8, backgroundColor: '#F0F0F4' }}
          />

          <View
            style={[CommonStyles.contentContainer, styles.audioBookContainer]}
          >
            <View
              style={[
                CommonStyles.alignJustifyContentBetween,
                styles.titleContainer,
              ]}
            >
              <View>
                <Text style={styles.titleH2}>윌라 오디오북</Text>
              </View>
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
            <View style={styles.audioCategory}>
              <PageCategory
                data={this.props.store.audioBookCategoryData}
                selectedCategory={0}
                onCategorySelect={this.premiumCategorySelect}
              />
            </View>

            <View style={CommonStyles.alignJustifyContentBetween}>
              <Text style={styles.titleH3}>새로 나온 오디오북</Text>
            </View>

            <BookNewList
              itemData={
                this.props.store.audioNewData.items
                  ? this.props.store.audioNewData.items
                  : this.props.store.audioNewData
              }
            />

            <View style={CommonStyles.alignJustifyContentBetween}>
              <Text style={styles.titleH3}>오늘의 인기 오디오북</Text>
            </View>
            {/* {(this.props.store.audioHotData.items !== undefined) && ( */}
            <BookRankList
              itemData={
                this.props.store.audioHotData.items
                  ? this.props.store.audioHotData.items
                  : this.props.store.audioHotData
              }
            />
            {/* )} */}
          </View>
          <View style={{ marginBottom: 30, marginLeft: 10, marginRight: 10 }}>
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
              <ImageBackground
                source={IcMainWideBanner}
                resizeMode="contain"
                style={styles.imageMainBanner}
              />
            </TouchableOpacity>
          </View>

          <Footer />
        </ScrollView>
      </PTRView>
    );
  }
}

export default withNavigation(HomeAudioPage);
