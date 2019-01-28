import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import _ from 'underscore';
import CommonStyles from '../../../styles/common';

const styles = StyleSheet.create({});

@observer
class BookDaily extends React.Component {
  /* 카테고리 클릭시 클래스 리스트 페이지로 이동 with Params */
  premiumCategorySelect = () => {
    this.props.navigation.navigate(
      'AudioBookPage',
      { action: 'category', data: 81 }, // 전달할 데이터
    );
  };

  render() {
    const originData = this.props.itemData;
    const filtered = _.map(originData.category, day => originData[day][0]);
    const sorted = _.sortBy(filtered, 'open_date').reverse();
    const todayItem = sorted[0];

    return (
      <View>
        {sorted.length > 0 && (
          <View style={[CommonStyles.alignJustifyFlex, { marginTop: 20 }]}>
            <View style={{ marginRight: 45 }}>
              <ImageBackground
                source={{ uri: todayItem.image }}
                resizeMode="contain"
                style={{ width: 78, height: 125, backgroundColor: '#efefef' }}
              />
            </View>
            <View style={{ position: 'relative', width: 195, height: 125 }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ fontSize: 17, fontWeight: '400', color: '#363636' }}
              >
                {todayItem.title}
              </Text>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={2}
                style={{ fontSize: 13, fontWeight: '200', color: '#000000' }}
              >
                {todayItem.memo.split('<br>').join('\n')}
              </Text>
              <View style={{ position: 'absolute', bottom: 0 }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    this.props.navigation.navigate('AudioBookPage', {
                      title: '',
                      data: {
                        ccode: '050',
                        id: 81,
                        images: {
                          default:
                            'https://static.welaaa.co.kr/contentsUpImage/category/',
                          icon_large:
                            'https://static.welaaa.co.kr/static/categories/icon_lg_050.png',
                          icon_small:
                            'https://static.welaaa.co.kr/static/categories/icon_sm_050.png',
                          large:
                            'https://static.welaaa.co.kr/contentsUpImage/category/',
                        },
                        paragraph: '',
                        title: '북리뷰',
                        url: 'http://welaaa.co.kr/audiobook-list.php?ccode=050',
                      },
                    })
                  }
                >
                  <View
                    style={{
                      width: 195,
                      height: 28,
                      borderWidth: 1,
                      borderColor: CommonStyles.COLOR_PRIMARY,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 13,
                        color: CommonStyles.COLOR_PRIMARY,
                      }}
                    >
                      매일 책 한권 보러가기
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default withNavigation(BookDaily);
