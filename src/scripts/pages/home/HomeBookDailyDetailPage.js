import React from 'react';
import CommonStyles from '../../../styles/common';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView, withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import _ from 'underscore';
import Dummy from '../../../images/dummy-teacher.jpg';
import BookList from '../../components/home/BookList';
import numeral from 'numeral';
import IcPlay from '../../../images/ic-play-dark.png';
import IcHeart from '../../../images/ic-heart-dark.png';
import IcComment from '../../../images/ic-commenting-dark.png';
import IcClip from '../../../images/ic-clip-dark.png';

const styles = StyleSheet.create({
  alignJustify: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnSetSmall: {
    width: 14,
    height: 14,
  },
  countText: {
    paddingLeft: 6,
    paddingRight: 20,
    fontSize: 12,
    color: '#353A3C',
  },
  countWrap: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 2,
  },
  bookLabel: {
    height: 22,
    marginBottom: 9,
    marginRight: 3,
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 3,
    paddingLeft: 10,
  },
  bookLabelText: {
    fontSize: 12,
    color: '#ffffff',
  },
  bookLabelBlank: {
    borderColor: 'transparent',
    opacity: 0,
  },
  bookLabelNew: {
    backgroundColor: '#FD7E14',
  },
  bookLabelExclusive: {
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  bookLabelFree: {
    backgroundColor: '#E8D815',
  },
  bookLabelDefault: {
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
});

@observer
class HomeBookDailyDetailPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const originData = this.props.navigation.state.params.itemData;
    const filtered = _.map(originData.category, day => originData[day][0]);
    const sorted = _.sortBy(filtered, 'open_date').reverse();

    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        {!!originData && (
          <SafeAreaView style={{ flex: 1, width: '100%' }}>
            <ScrollView style={{ flex: 1 }}>
              <ImageBackground
                style={{
                  position: 'relative',
                  paddingTop: '20.833333334%',
                  paddingBottom: '20.833333334%',
                  backgroundColor: '#efefef',
                }}
              >
                <View style={{ position: 'absolute', top: 30, left: 25 }}>
                  <Text style={{ fontSize: 17 }}>정신과 전문의 하지현의</Text>
                  <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                    마음을 치유하는 책
                  </Text>
                </View>
              </ImageBackground>
              <View
                style={{
                  paddingTop: 30,
                  paddingBottom: 30,
                  paddingLeft: 25,
                  paddingRight: 25,
                  backgroundColor: '#F4F4F4',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: CommonStyles.COLOR_PRIMARY,
                    lineHeight: 20,
                  }}
                >
                  정신건강의학과 전문의 하지현 교수가 험난한 오늘을 견뎌낸
                  당신에게 불확실한 인생을 건너는 길잡이가 되어줄 책을 안내
                  합니다.
                </Text>
                <View style={{ marginTop: 25, marginBottom: 20 }}>
                  <View style={CommonStyles.alignJustifyItemCenter}>
                    <View
                      style={{
                        width: 75,
                        height: 75,
                        marginRight: 15,
                        borderWidth: 1,
                        borderColor: CommonStyles.COLOR_PRIMARY,
                      }}
                      borderRadius={37}
                    >
                      <ImageBackground
                        source={{ Dummy }}
                        resizeMode="cover"
                        style={{
                          width: 75,
                          height: 75,
                        }}
                      />
                    </View>

                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        color: '#353A3C',
                      }}
                    >
                      건국대 하지현 교수
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ fontSize: 14, color: '#353A3C', lineHeight: 19 }}
                >
                  서울대학교 의과대학을 졸업하고 동 대학원에서 박사학위를
                  받았다. 서울대학교병원 신경정신과에서 전공의와 전임의 과정을
                  마쳤다. 용인정신병원 정신의학연구소에서 근무했고, 캐나다
                  토론토 정신분석연구소에서 연수했다. 2008년 한국정신분석학회
                  학술상을 수상했다. 현재 건국대학교 의학전문대학원 교수로
                  진료를 하며, 읽고 쓰고 가르치고 있다.
                </Text>
              </View>
              <View
                style={{
                  paddingTop: 30,
                  paddingBottom: 30,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
              >
                {sorted.map((item, key) => {
                  return (
                    <View key={key}>
                      <View style={CommonStyles.alignJustifyItemCenter}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: CommonStyles.COLOR_PRIMARY,
                          }}
                        >
                          {item.open_date}
                        </Text>
                        <ImageBackground
                          source={{ uri: item.image }}
                          resizeMode="contain"
                          style={{
                            width: 78,
                            height: 125,
                            marginRight: 12,
                            marginLeft: 12,
                            backgroundColor: '#efefef',
                          }}
                        />
                        <View>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '400',
                              color: '#353A3C',
                            }}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: '200',
                              color: '#767B80',
                            }}
                          >
                            {item.title}
                          </Text>
                          <View
                            style={[
                              styles.bookLabels,
                              CommonStyles.alignJustifyFlex,
                            ]}
                          >
                            <View
                              style={[styles.bookLabel, styles.bookLabelNew]}
                            >
                              <Text style={[styles.bookLabelText]}>Label</Text>
                            </View>
                          </View>
                          <View style={styles.alignJustify}>
                            <Image source={IcPlay} style={styles.btnSetSmall} />
                            <Text style={styles.countText}>
                              {/* 재생수 */}
                              {numeral(item.hit_count).format('0a')}
                            </Text>
                            <Image
                              source={IcHeart}
                              style={styles.btnSetSmall}
                            />
                            <Text style={styles.countText}>
                              {/* 별점 */}
                              {numeral(item.star_avg).format('0a')}
                            </Text>
                            <Image
                              source={IcComment}
                              style={styles.btnSetSmall}
                            />
                            <Text style={styles.countText}>
                              {/* 댓글수 */}
                              {numeral(item.review_count).format('0a')}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          height: 1,
                          backgroundColor: '#E2E2E2',
                          marginTop: 13,
                          marginBottom: 13,
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </View>
    );
  }
}

export default withNavigation(HomeBookDailyDetailPage);
