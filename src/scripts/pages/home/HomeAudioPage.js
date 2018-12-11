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
  View
} from 'react-native';
import { observer } from 'mobx-react';
import Swiper from 'react-native-swiper';
import IcAngleRightGrey from '../../../images/ic-angle-right-grey.png';
import BookMonthly from '../../components/home/BookMonthly';
import PageCategory from '../../components/PageCategory';
import BookList from '../../components/home/BookList';
import BookFreeList from '../../components/home/BookFreeList';
import BookContinueList from '../../components/home/BookCoutinueList';
import PTRView from 'react-native-pull-to-refresh';
import moment from 'moment';
import ClassContinueList from '../../components/home/ClassContinueList';
import BookDaily from '../../components/home/BookDaily';
import { withNavigation } from 'react-navigation';
import _ from 'underscore';
import HomeBanner from '../../components/home/HomeBanner';

const styles = StyleSheet.create({
  wrapper: {},
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
  monthContainer: {
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: '#8cd8b1'
  },
  dailyContainer: {
    paddingTop: 50,
    paddingBottom: 50
  },
  audioBookContainer: {
    paddingTop: 50,
    paddingBottom: 50
  },
  audioCategory: {
    marginTop: 20,
    marginBottom: 20
  },
  audioCategoryHr: {
    height: 1,
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
  }
});

@observer
class HomeAudioPage extends React.Component {
  /* 카테고리 클릭시 클래스 리스트 페이지로 이동 with Params */
  premiumCategorySelect = data => {
    this.props.navigation.navigate(
      'AudioBookPage',
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
    return (
      <PTRView onRefresh={() => this.props.onRefresh()}>
        <ScrollView style={{ flex: 1 }}>
          {/* 이미지 스와이퍼 */}
          <View style={{ height: this.props.store.slideHeight }}>
            {homeBannerData.length > 0 && (
              <Swiper
                style={styles.wrapper}
                showsButtons={false}
                height={window.width}
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

          <View>
            {this.props.store.audioUseData &&
              this.props.store.audioUseData.length > 0 && (
                <View>
                  <View style={CommonStyles.alignJustifyItemCenter}>
                    <Text style={styles.titleH3}>최근재생 오디오북</Text>
                  </View>
                  <BookContinueList itemData={this.props.store.audioUseData} />
                </View>
              )}
          </View>

          {/*<View style={styles.monthContainer}>*/}
          {/*<BookMonthly itemData={this.props.store.audioMonth} />*/}
          {/*</View>*/}

          {/*매일 책 한 권*/}
          {/*<View style={[CommonStyles.contentContainer, styles.dailyContainer]}>*/}
          {/*<BookDaily itemData={this.props.store.audioDaily} />*/}
          {/*</View>*/}

          <View
            style={[CommonStyles.contentContainer, styles.audioBookContainer]}
          >
            <View
              style={[
                CommonStyles.alignJustifyContentBetween,
                styles.titleContainer
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
              <View style={styles.audioCategoryHr} />
              <PageCategory
                data={this.props.store.audioBookCategoryData}
                selectedCategory={0}
                onCategorySelect={this.premiumCategorySelect}
              />
              <View style={styles.audioCategoryHr} />
            </View>

            <View style={CommonStyles.alignJustifyContentBetween}>
              <Text style={styles.titleH3}>새로 나온 오디오북</Text>
            </View>

            {/* {(this.props.store.audioNewData.items !== undefined) && ( */}
            <BookList
              itemType={'new'}
              itemData={
                this.props.store.audioNewData.items
                  ? this.props.store.audioNewData.items
                  : this.props.store.audioNewData
              }
            />
            {/* )} */}

            <View style={CommonStyles.alignJustifyContentBetween}>
              <Text style={styles.titleH3}>오늘의 인기 오디오북</Text>
            </View>
            {/* {(this.props.store.audioHotData.items !== undefined) && ( */}
            <BookList
              itemType="hot"
              itemData={
                this.props.store.audioHotData.items
                  ? this.props.store.audioHotData.items
                  : this.props.store.audioHotData
              }
            />
            {/* )} */}

            <View>
              <View style={CommonStyles.alignJustifyContentBetween}>
                <Text style={styles.titleH3}>000님의 추천 오디오북</Text>
              </View>

              <BookList
                itemType={'new'}
                itemData={
                  this.props.store.audioRecommendData.items
                    ? this.props.store.audioRecommendData.items
                    : this.props.store.audioRecommendData
                }
              />
            </View>
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
        </ScrollView>
      </PTRView>
    );
  }
}

export default withNavigation(HomeAudioPage);
