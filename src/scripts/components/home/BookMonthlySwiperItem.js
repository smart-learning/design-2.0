import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Dummy from '../../../images/dummy-series.png';
import globalStore from '../../commons/store';
import CommonStyles from '../../../styles/common';
import { observer } from 'mobx-react';

const styles = StyleSheet.create({
  bookItem: {
    width: 109,
  },
  thumbnail: {
    width: 109,
    paddingTop: '70%',
    paddingBottom: '70%',
  },
  title: {
    height: 80,
    paddingTop: 15,
    paddingBottom: 20,
    fontSize: 13,
    fontWeight: '200',
    lineHeight: 15,
    textAlign: 'center',
    color: '#ffffff',
  },
  itemHr: {
    width: '100%',
    height: 1,
    backgroundColor: '#ffffff',
  },
  mentorInfo: {
    height: 70,
  },
  mentorLabel: {
    width: 50,
    height: 17,
    marginTop: 7,
    marginBottom: 7,
    borderWidth: 1,
    borderColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mentorLabelText: {
    width: 50,
    fontSize: 11,
    textAlign: 'center',
    color: '#ffffff',
  },
  mentorName: {
    width: 50,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    color: '#ffffff',
  },
  mentorImage: {
    width: 52,
    height: 69,
  },
  mentorMemo: {
    height: 65,
    paddingTop: 7,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '200',
    textAlign: 'center',
    color: '#ffffff',
  },
});

@observer
class BookMonthlySwiperItem extends React.Component {
  render() {
    let itemData = this.props.itemData;

    return (
      <View
        ref={ref => (this.view = ref)}
        borderRadius={12}
        style={{
          backgroundColor:
            itemData.bg_color === null ? '#77B6E3' : itemData.bg_color,
          height: 450,
        }}
      >
        <Text
          style={{
            width: '100%',
            paddingTop: 20,
            paddingBottom: 20,
            fontSize: 23,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#ffffff',
          }}
        >
          이달의 책
        </Text>
        <View
          style={[
            CommonStyles.alignJustifyContentBetween,
            { width: 255, marginLeft: 'auto', marginRight: 'auto' },
          ]}
        >
          <View style={styles.bookItem}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                this.props.navigation.navigate('HomeBookMonthlyDetailPage', {
                  title: '이달의 책',
                  itemData: itemData.book_a,
                })
              }
            >
              <ImageBackground
                source={{ uri: itemData.book_a.audiobook.images.cover }}
                style={styles.thumbnail}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <Text style={styles.title} ellipsizeMode={'tail'} numberOfLines={3}>
              {itemData.book_a.title}
            </Text>
            <View style={styles.mentorInfo}>
              <View style={CommonStyles.alignJustifyContentBetween}>
                <View>
                  <View style={styles.mentorLabel} borderRadius={8}>
                    <Text style={styles.mentorLabelText}>리딩멘토</Text>
                  </View>
                  <Text
                    style={styles.mentorName}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                  >
                    {itemData.book_a.mentor.name
                      ? itemData.book_a.mentor.name
                      : null}
                  </Text>
                </View>
                <ImageBackground
                  source={{
                    uri: itemData.book_a.mentor.images.profile
                      ? itemData.book_a.mentor.images.profile
                      : null,
                  }}
                  style={styles.mentorImage}
                  resizeMode={'contain'}
                />
              </View>
            </View>
            <View style={styles.itemHr} />
            <Text
              style={styles.mentorMemo}
              ellipsizeMode={'tail'}
              numberOfLines={2}
            >
              {itemData.book_a.mentor.memo ? itemData.book_a.mentor.memo : null}
            </Text>
          </View>

          <View style={styles.bookItem}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                this.props.navigation.navigate('HomeBookMonthlyDetailPage', {
                  title: '이달의 책',
                  itemData: itemData.book_b,
                })
              }
            >
              <ImageBackground
                source={{ uri: itemData.book_b.audiobook.images.cover }}
                style={styles.thumbnail}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <Text style={styles.title} ellipsizeMode={'tail'} numberOfLines={3}>
              {itemData.book_b.title}
            </Text>
            <View style={styles.mentorInfo}>
              <View style={CommonStyles.alignJustifyContentBetween}>
                <View>
                  <View style={styles.mentorLabel} borderRadius={8}>
                    <Text style={styles.mentorLabelText}>리딩멘토</Text>
                  </View>
                  <Text
                    style={styles.mentorName}
                    ellipsizeMode={'tail'}
                    numberOfLines={1}
                  >
                    {itemData.book_b.mentor.name
                      ? itemData.book_b.mentor.name
                      : null}
                  </Text>
                </View>
                <ImageBackground
                  source={{
                    uri: itemData.book_b.mentor.images.profile
                      ? itemData.book_b.mentor.images.profile
                      : null,
                  }}
                  style={styles.mentorImage}
                  resizeMode={'cover'}
                />
              </View>
            </View>
            <View style={styles.itemHr} />
            <Text
              style={styles.mentorMemo}
              ellipsizeMode={'tail'}
              numberOfLines={2}
            >
              {itemData.book_b.mentor.memo ? itemData.book_b.mentor.memo : null}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default withNavigation(BookMonthlySwiperItem);
