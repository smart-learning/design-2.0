import { observer } from 'mobx-react';
import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CommonStyles from '../../../styles/common';
import Native from '../../commons/native.js';
import globalStore from '../../commons/store';
import AudiobookPaymentStatus from './AudiobookPaymentStatus';
import TabContentInfo from './TabContentInfo';
import TabContentList from './TabContentList';
import TopBanner from './TopBanner';
import VideoPaymentStatus from './VideoPaymentStatus';

const styles = StyleSheet.create({
  tabContainer: {
    // width: '33.3%',
    width: '50%'
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: 60,
    backgroundColor: '#ffffff'
  },
  tabNormalText: {
    fontSize: 15,
    color: '#555555'
  },
  tabActiveText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333333'
  },
  tabNormalHr: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 3,
    backgroundColor: '#ffffff'
  },
  tabActiveHr: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: CommonStyles.COLOR_PRIMARY
  }
});

@observer
class DetailLayout extends React.Component {
  state = {
    permission: false
  };

  constructor(props) {
    super(props);
    console.log('DetailLayout.js::props', props);
  }

  downloadContentsView() {
    var renderView = false;

    if ('class' === this.props.learnType) {
      if (globalStore && globalStore.currentMembership) {
        const { type } = globalStore.currentMembership;
        if (1 === type || 2 === type || 3 === type) {
          // 무제한 소장중(1, 2: type) 또는 프리패스(3) 경우.
          renderView = true;
        } else if (0 === this.props.itemData.orig_price) {
          // 무료(0: itemData.orig_price)일 경우.
          renderView = true;
        }
      }
    } else if ('audioBook' === this.props.learnType) {
      const { paymentType } = this.props;
      if (0 === paymentType || 3 === paymentType) {
        // 무료(0) 이거나 소장중(3)일 경우.
        renderView = true;
      } else if (globalStore && globalStore.currentMembership) {
        const { type } = globalStore.currentMembership;
        if (3 === type) {
          // 프리패스일 경우.
          renderView = true;
        }
      }
    }

    if (renderView) {
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={this.onDownload}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
              backgroundColor: CommonStyles.COLOR_PRIMARY,
              height: 48
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
              다운로드
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return <View />;
    }
  }

  onDownload = () => {
    const { welaaaAuth } = globalStore;

    console.log('welaaaAuth:', welaaaAuth);

    /* TODO: id를 이용하여 api에서 필요 정보 받아오는 과정 필요 */
    if (
      welaaaAuth === undefined ||
      welaaaAuth.profile === undefined ||
      welaaaAuth.profile.id === undefined
    ) {
      Alert.alert('로그인 후 이용할 수 있습니다.');

      return true;
    }

    let userId = globalStore.welaaaAuth.profile.id;
    let accessToken = globalStore.welaaaAuth.access_token;

    const itemData = this.props.itemData;
    const itemClipData = this.props.store.itemClipData.toJS();
    if (itemData && itemClipData) {
      let params = [];
      if ('ios' === Platform.OS) {
        itemClipData.reduce((accumulator, item) => {
          accumulator.push({
            cid: item.cid,
            userId: userId.toString(),
            token: accessToken
          });
          return accumulator;
        }, params);
      } else if ('android' === Platform.OS) {
        if ('video-course' === itemData.type) {
          itemClipData.reduce((accumulator, item) => {
            accumulator.push({
              cid: item.cid,
              userId: userId.toString(),
              token: accessToken
            });
            return accumulator;
          }, params);
        } else if ('audiobook' === itemData.type) {
          params.push({
            cid: itemData.cid,
            userId: userId.toString(),
            token: accessToken
          });
        }
      }
      Native.download(params);
    }
  };

  render() {
    return (
      <View
        style={[
          CommonStyles.container,
          { backgroundColor: '#ffffff', width: '100%' }
        ]}
      >
        <ScrollView style={{ width: '100%' }}>
          <TopBanner
            learnType={this.props.learnType}
            store={this.props.store}
          />
          {/* 가격 및 구매버튼 등을 보여주는 라인(iOS 의 경우 오디오북일 때에만 노출) */}
          {this.props.learnType === 'audioBook' ? (
            <AudiobookPaymentStatus
              purchase={this.props.purchase}
              voucherStatus={this.props.voucherStatus}
              permissions={this.props.permissions}
              itemData={this.props.itemData}
              learnType={this.props.learnType}
              store={this.props.store}
              paymentType={this.props.paymentType}
              expire={this.props.expire}
              permissionLoading={this.props.permissionLoading}
            />
          ) : (Platform.OS === 'android' ? (
            <VideoPaymentStatus
              purchase={this.props.purchase}
              voucherStatus={this.props.voucherStatus}
              permissions={this.props.permissions}
              itemData={this.props.itemData}
              learnType={this.props.learnType}
              store={this.props.store}
              paymentType={this.props.paymentType}
              expire={this.props.expire}
              permissionLoading={this.props.permissionLoading}
            />
          ) : (<View />))}
          {/* Download contents */}
          {this.downloadContentsView()}

          {1 === 2 && <CountView store={this.props.store} />}
          <View style={CommonStyles.alignJustifyContentBetween}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  this.props.store.tabStatus = 'info';
                }}
              >
                <View style={styles.tabItem}>
                  <Text
                    style={
                      this.props.store.tabStatus === 'info'
                        ? styles.tabActiveText
                        : styles.tabNormalText
                    }
                  >
                    {this.props.learnType === 'audioBook' && (
                      <Text>도서정보</Text>
                    )}
                    {this.props.learnType === 'class' && (
                      <Text>클래스정보</Text>
                    )}
                  </Text>
                  <View
                    style={
                      this.props.store.tabStatus === 'info'
                        ? styles.tabActiveHr
                        : styles.tabNormalHr
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  this.props.store.tabStatus = 'list';
                }}
              >
                <View style={styles.tabItem}>
                  <Text
                    style={
                      this.props.store.tabStatus === 'list'
                        ? styles.tabActiveText
                        : styles.tabNormalText
                    }
                  >
                    {this.props.learnType === 'audioBook' && (
                      <Text>
                        목차(
                        {this.props.store.itemClipData.length})
                      </Text>
                    )}
                    {this.props.learnType === 'class' && (
                      <Text>
                        강의목차(
                        {this.props.store.itemClipData.length})
                      </Text>
                    )}
                  </Text>
                  <View
                    style={
                      this.props.store.tabStatus === 'list'
                        ? styles.tabActiveHr
                        : styles.tabNormalHr
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {this.props.store.tabStatus === 'info' && (
            <TabContentInfo
              store={this.props.store}
              learnType={this.props.learnType}
            />
          )}
          {this.props.store.tabStatus === 'list' && (
            <TabContentList
              store={this.props.store}
              learnType={this.props.learnType}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

export default DetailLayout;
