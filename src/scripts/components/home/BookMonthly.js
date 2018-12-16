import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  BackHandler
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
  bookMonthlyItem: {
    justifyContent: 'center',
    position: 'relative'
  },
  couponContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  coupon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: 30,
    paddingLeft: 25,
    paddingRight: 35,
    backgroundColor: '#A6AC53'
  },
  couponIcon: {
    width: 19,
    height: 19,
    marginRight: 7
  },
  couponText: {
    fontSize: 13,
    color: '#ffffff'
  },
  couponCountText: {
    color: '#fff1b2'
  },
  wrapper: {
    width: '100%',
    paddingBottom: 20
  },
  bookItemContainer: {
    marginTop: 20
  },
  bookItem: {
    width: '42%'
  },
  bullet: {
    position: 'absolute',
    zIndex: -9,
    left: 0,
    bottom: 40,
    width: '100%',
    height: 200
  },
  mainTitleCenter: {
    textAlign: 'center'
  },
  titleH2: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#34342C'
  },
  titleH4: {
    paddingTop: 10,
    fontSize: 13,
    color: '#888888'
  }
});

class BookMonthly extends React.Component {
  render() {
    let itemData = [];
    if (_.isObject(this.props.itemData)) {
      itemData = this.props.itemData.slice(0, 3);
    }

    return (
      <View style={styles.bookMonthly}>
        <View style={styles.swiper}>
          {this.props.itemData.length > 0 && (
            <Swiper
              showsButtons={false}
              height={520}
              dotColor={'#ADB08B'}
              activeDotColor={'#34342C'}
              paginationStyle={{ bottom: 10 }}
            >
              {itemData.map((item, key) => {
                const MonthData = moment(item.month).format('M');
                return (
                  <View style={styles.bookMonthlyItem} key={key}>
                    <View>
                      <Text style={[styles.mainTitleCenter, styles.titleH2]}>
                        {MonthData}월 이달의 책
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
                                title: '내 오디오북 이용권'
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
                                    {' '}
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
                      <View
                        style={[
                          CommonStyles.alignJustifyContentBetween,
                          {
                            width: '75%',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                          }
                        ]}
                      >
                        <View style={styles.bookItem}>
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                              this.props.navigation.navigate(
                                'HomeMonthlyReviewPage',
                                {
                                  itemData: item.book_a,
                                  title: '이달의 책 북리뷰'
                                }
                              )
                            }
                          >
                            <BookMonthlyItem itemData={item.book_a} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.bookItem}>
                          <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                              this.props.navigation.navigate(
                                'HomeMonthlyReviewPage',
                                {
                                  itemData: item.book_b,
                                  title: '이달의 책 북리뷰'
                                }
                              )
                            }
                          >
                            <BookMonthlyItem itemData={item.book_b} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </Swiper>
          )}
        </View>
      </View>
    );
  }
}

export default withNavigation(BookMonthly);
