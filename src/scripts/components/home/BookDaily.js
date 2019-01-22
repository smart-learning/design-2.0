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
                borderRadius={4}
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
                    this.props.navigation.navigate('HomeBookDailyDetailPage', {
                      title: '매일 책 한권',
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
