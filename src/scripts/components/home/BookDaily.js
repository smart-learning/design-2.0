import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import _ from 'underscore';
import CommonStyles from '../../../styles/common';
import FastImage from 'react-native-fast-image';

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

    const regExp = /(<.+?>)/gi;
    let title = '< >';
    let subTitle = '';
    if (sorted.length > 0) {
      // 타이틀, 서브타이틀 추출
      title = todayItem.title.match(regExp)[0] || '< >';
      subTitle = todayItem.title.substr(title.length).trim();
      title = title.substr(1, title.length - 2);
    }

    return (
      <View>
        {sorted.length > 0 && (
          <View
            style={[
              CommonStyles.alignJustifyFlex,
              {
                width: 295,
                marginTop: 20,
                marginLeft: 'auto',
                marginRight: 'auto',
              },
            ]}
          >
            <View style={{ marginRight: 30 }}>
              <FastImage
                source={{ uri: todayItem.image }}
                style={{ width: 80, height: 125, backgroundColor: '#efefef' }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            <View style={{ position: 'relative', width: 185, height: 125 }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={2}
                style={{ fontSize: 17, fontWeight: '500', color: '#363636' }}
              >
                {title}
              </Text>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={2}
                style={{ fontSize: 13, fontWeight: '300', color: '#000000' }}
              >
                {subTitle}
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
                        categoryScrollToEnd: true,
                      },
                    })
                  }
                >
                  <View
                    style={{
                      width: 185,
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
