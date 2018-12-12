import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import IcHeadphone from '../../../images/ic-headphones.png';
import Dummy from '../../../images/dummy-audioBook.png';
import Swiper from 'react-native-swiper';
import _ from 'underscore';
import { withNavigation } from 'react-navigation';
import CommonStyles from '../../../styles/common';
import moment from 'moment';
import globalStore from '../../commons/store';
import nav from '../../commons/nav';
import BookMonthlyItem from './BookMonthlyItem';

const styles = StyleSheet.create({
  bookMonthly: {},
  botm_top_title: {},
  bookMonthlyItem: {
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 50,
    paddingBottom: 80,
    backgroundColor: '#8cd8b1',
  },
  couponContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  coupon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: 30,
    paddingLeft: 25,
    paddingRight: 35,
    backgroundColor: '#1c9165',
  },
  couponIcon: {
    width: 19,
    height: 19,
    marginRight: 7,
  },
  couponText: {
    fontSize: 13,
    color: '#ffffff',
  },
  couponCountText: {
    color: '#fff1b2',
  },
  wrapper: {
    width: '100%',
    paddingBottom: 20,
  },
  bookItemContainer: {
    marginTop: 10,
  },
  bullet: {
    position: 'absolute',
    zIndex: -9,
    left: 0,
    bottom: 40,
    width: '100%',
    height: 200,
  },
  mainTitleCenter: {
    textAlign: 'center',
  },
  titleH2: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
  },
  titleH4: {
    paddingTop: 10,
    fontSize: 13,
    color: '#888888',
  },
});

class BookMonthly extends React.Component {
  render() {
    let itemData = [];
    if (_.isObject(this.props.itemData)) {
      itemData = this.props.itemData;
    }
    return (
      <View style={styles.bookMonthly}>
        {this.props.itemData.length > 0 && (
          <Swiper
            showsButtons={false}
            height={560}
            dotColor={'#9bcdba'}
            activeDotColor={CommonStyles.COLOR_PRIMARY}
            paginationStyle={{ bottom: 10 }}
          >
            {itemData.map((item, key) => {
              const MonthData = moment(item.month).format('M');
              let bg_color = [styles.bookMonthlyItem];
              if (item.month == '2018-12-01') {
                bg_color = [
                  styles.bookMonthlyItem,
                  { backgroundColor: '#cdd0a4' },
                ];
              }
              return (
                <View style={(styles.swiper, styles.swiper_margin)}>
                  <View style={bg_color} key={key}>
                    <View style={styles.botm_top_title}>
                      <Text style={[styles.mainTitleCenter, styles.titleH2]}>
                        {MonthData}월 이달의 책
                      </Text>
                      <Text style={[styles.mainTitleCenter, styles.titleH4]}>
                        이 정도는 읽어주자! 리딩멘토가 추천하는 『좋은 책』
                      </Text>
                    </View>

                    {globalStore.currentMembership !== undefined &&
                      ((globalStore.currentMembership.type === 2 ||
                        globalStore.currentMembership.type === 4) && (
                        <View>
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                              this.props.navigation.navigate('AuthCheck', {
                                requestScreenName: 'AudioBookTicketPage',
                                title: '내 오디오북 이용권',
                              })
                            }
                          >
                            <View style={styles.couponContainer}>
                              <View style={styles.coupon} borderRadius={20}>
                                <Image
                                  source={IcHeadphone}
                                  style={styles.couponIcon}
                                />
                                <Text style={styles.couponText}>
                                  보유한 오디오북 이용권
                                  <Text style={styles.couponCountText}>
                                    {globalStore.voucherStatus !== null
                                      ? globalStore.voucherStatus.total
                                      : '0'}
                                    개
                                  </Text>
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ))}

                    <View style={styles.bookItemContainer}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() =>
                          this.props.navigation.navigate(
                            'HomeMonthlyReviewPage',
                            {
                              itemData: item.book_a,
                              title: '이달의 책 북리뷰',
                            },
                          )
                        }
                      >
                        <BookMonthlyItem itemData={item.book_a} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() =>
                          this.props.navigation.navigate(
                            'HomeMonthlyReviewPage',
                            {
                              itemData: item.book_b,
                              title: '이달의 책 북리뷰',
                            },
                          )
                        }
                      >
                        <BookMonthlyItem itemData={item.book_b} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </Swiper>
        )}
      </View>
    );
  }
}

export default withNavigation(BookMonthly);
