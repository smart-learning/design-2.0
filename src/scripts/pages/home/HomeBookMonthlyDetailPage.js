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
import { observable } from 'mobx';
import net from '../../commons/net';
import ClassList from '../../components/home/ClassList';
import createStore from '../../commons/createStore';
import _ from 'underscore';
import ClassListItem from '../../components/home/ClassListItem';
import Dummy from '../../../images/dummy-series.png';
import globalStore from '../../commons/store';
import moment from 'moment';
import Native from '../../commons/native';
import IcAngleDownGrey from '../../../images/ic-angle-down-grey.png';

const styles = StyleSheet.create({
  bannerButton: {
    width: 90,
    height: 30,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: CommonStyles.COLOR_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerButtonText: {
    fontSize: 13,
    fontWeight: '400',
  },
  title: {
    marginBottom: 17,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#353A3C',
  },
  contentText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#353A3C',
  },
  viewMoreContainer: {
    alignItems: 'center',
  },
  viewMore: {
    height: 36,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 12,
    color: '#888888',
  },
  viewMoreIcon: {
    position: 'relative',
    top: 4,
  },
});

@observer
class HomeBookMonthlyDetailPage extends React.Component {
  @observable
  isOpen = false;

  viewMoreStatus = () => {
    this.isOpen = !this.isOpen;
  };

  render() {
    let itemData = this.props.navigation.state.params.itemData;

    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        {!!itemData && (
          <SafeAreaView style={{ flex: 1, width: '100%' }}>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ paddingHorizontal: 25, paddingBottom: 50 }}>
                <View
                  style={[
                    CommonStyles.alignJustifyFlex,
                    { height: 168, marginTop: 15, marginBottom: 30 },
                  ]}
                >
                  <View style={{ width: '33%' }}>
                    <ImageBackground
                      source={{ uri: itemData.audiobook.images.cover }}
                      style={{ width: 120, height: 168 }}
                      resizeMode="cover"
                    />
                  </View>
                  <View
                    style={{
                      position: 'relative',
                      width: '67%',
                      paddingLeft: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: CommonStyles.COLOR_PRIMARY,
                      }}
                    >
                      {moment(itemData.month).format('YYYY년 MM월')}
                    </Text>
                    <Text
                      style={{
                        marginBottom: 13,
                        fontSize: 14,
                        color: CommonStyles.COLOR_PRIMARY,
                      }}
                    >
                      리딩멘토와 함께읽는 이달의 책
                    </Text>
                    <Text
                      style={{ fontSize: 15, lineHeight: 20, color: '#363636' }}
                      ellipsizeMode={'tail'}
                      numberOfLines={3}
                    >
                      {itemData.headline}
                    </Text>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                      }}
                    >
                      <View style={CommonStyles.alignJustifyFlex}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => Native.play(itemData.audiobook.cid)}
                        >
                          <View style={styles.bannerButton}>
                            <Text
                              style={[
                                styles.bannerButtonText,
                                { color: CommonStyles.COLOR_PRIMARY },
                              ]}
                            >
                              추천사 듣기
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => {
                            this.props.navigation.navigate(
                              'AudioBookDetailPage',
                              {
                                id: itemData.audiobook.id,
                                title: itemData.title,
                              },
                            );
                          }}
                        >
                          <View
                            style={[
                              styles.bannerButton,
                              { backgroundColor: CommonStyles.COLOR_PRIMARY },
                            ]}
                          >
                            <Text
                              style={[
                                styles.bannerButtonText,
                                {
                                  color: '#ffffff',
                                },
                              ]}
                            >
                              책 상세보기
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <Text style={styles.title}>리딩멘토소개</Text>
                  <View
                    style={[
                      CommonStyles.alignJustifyFlex,
                      {
                        alignItems: 'flex-end',
                        borderWidth: 1,
                        borderColor: '#E2E2E2',
                        backgroundColor: '#F8F8F8',
                      },
                    ]}
                  >
                    <ImageBackground
                      source={{
                        uri: itemData.mentor.images.profile,
                      }}
                      style={{
                        width: 90,
                        height: 98,
                        marginRight: 40,
                      }}
                      resizeMode={'cover'}
                    />
                    <View>
                      <Text
                        style={{
                          width: 125,
                          marginBottom: 7,
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: CommonStyles.COLOR_PRIMARY,
                        }}
                        ellipsizeMode={'tail'}
                        numberOfLines={1}
                      >
                        리딩멘토 {itemData.mentor.name}
                      </Text>
                      <Text
                        style={{
                          width: 125,
                          marginBottom: 10,
                          fontSize: 13,
                          color: '#353A3C',
                          lineHeight: 19,
                        }}
                        ellipsizeMode={'tail'}
                        numberOfLines={2}
                      >
                        {itemData.mentor.headline}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.contentText,
                        {
                          paddingVertical: 15,
                          height: this.isOpen ? 'auto' : 106,
                        },
                      ]}
                    >
                      {itemData.mentor.memo.split('<br>').join('\n')}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={styles.viewMoreContainer}
                      onPress={this.viewMoreStatus}
                    >
                      <View
                        style={[
                          styles.viewMore,
                          CommonStyles.alignJustifyContentBetween,
                        ]}
                      >
                        <Text style={styles.viewMoreText}>더보기</Text>
                        <Image
                          source={IcAngleDownGrey}
                          style={[
                            styles.viewMoreIcon,
                            {
                              transform: this.isOpen
                                ? [{ rotate: '180deg' }]
                                : [{ rotate: '0deg' }],
                            },
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        marginBottom: 25,
                        backgroundColor: '#E2E2E2',
                      }}
                    />
                  </View>
                  <Text style={styles.title}>{itemData.title}</Text>
                  <Text style={styles.contentText}>
                    {itemData.body.split('<br>').join('\n')}
                  </Text>
                </View>
                <View style={{ marginTop: 35, height: 35 }}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      this.props.navigation.navigate('AudioBookDetailPage', {
                        id: itemData.audiobook.id,
                        title: itemData.title,
                      });
                    }}
                  >
                    <View
                      style={{
                        width: '100%',
                        height: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: CommonStyles.COLOR_PRIMARY,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '400',
                          color: '#ffffff',
                        }}
                      >
                        책 상세보기
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </View>
    );
  }
}

export default withNavigation(HomeBookMonthlyDetailPage);
