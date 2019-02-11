import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import globalStore from '../../../scripts/commons/store';
import CommonStyles from '../../../styles/common';
import _ from 'underscore';
import numeral from 'numeral';
import moment from './AudiobookPaymentStatus';

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  originPriceText: {
    textDecorationLine: 'line-through',
    fontSize: 17,
    color: '#919191',
  },
  labelText: {
    fontSize: 14,
    color: '#919191',
  },
  paymentText: {
    fontSize: 21,
    fontWeight: '400',
    color: '#000000',
  },
  durationText: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#767B80',
  },
  infoText: {
    fontSize: 14,
    color: CommonStyles.COLOR_PRIMARY,
  },
  buttonItem: {
    width: 80,
    height: 25,
    marginTop: 28,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonItemDisabled: {
    borderColor: '#C7C7C7',
  },
  buttonItemActive: {
    borderColor: CommonStyles.COLOR_PRIMARY,
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '400',
  },
  buttonTextDisabled: {
    color: '#ACACAC',
  },
  buttonTextActive: {
    color: '#ffffff',
  },
});

class DownloadButton extends React.Component {
  onPress = () => {
    if (this.props.active && _.isFunction(this.props.onDownload)) {
      this.props.onDownload();
    }
  };
  render() {
    // 다운로드 상태 메시지 조건 분기
    const downloadItems = globalStore.downloadItems.toJS();
    const itemClipData = this.props.store.itemClipData.toJS();
    let realLength = 0;

    itemClipData.forEach((ad, idx) => {
      if (itemClipData[idx].play_time !== '00:00:00') {
        realLength++;
      }
    });

    let downloadLabel = '다운로드';

    if (downloadItems.length > 0) {
      downloadLabel = `${downloadItems.length}/${realLength}`;
    } else {
      downloadLabel = '다운로드';
    }
    if (downloadItems.length === realLength) {
      downloadLabel = '다운로드 완료';
    }

    return (
      <TouchableOpacity activeOpacity={0.9} onPress={this.onPress}>
        <View
          style={[
            styles.buttonItem,
            this.props.active
              ? styles.buttonItemActive
              : styles.buttonItemDisabled,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              this.props.active
                ? styles.buttonTextActive
                : styles.buttonTextDisabled,
            ]}
          >
            {downloadLabel}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class PurchaseButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={
          Platform.OS === 'ios' ? this.props.iosBuy : this.props.addToCart
        }
      >
        <View
          style={[
            styles.buttonItem,
            this.props.active
              ? styles.buttonItemActive
              : styles.buttonItemDisabled,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              this.props.active
                ? styles.buttonTextActive
                : styles.buttonTextDisabled,
            ]}
          >
            구매
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class VoucherButton extends React.Component {
  render() {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={this.props.useVoucher}>
        <View style={[styles.buttonItem, styles.buttonItemActive]}>
          <Text style={[styles.buttonText, styles.buttonTextActive]}>
            이용권 사용
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
export default class PaymentPolicy extends React.Component {
  renderPermissionLoading() {
    return (
      <View style={[CommonStyles.alignJustifyFlex, styles.contentContainer]}>
        <Text style={styles.paymentText}>구매 정보를 불러오는 중입니다.</Text>
      </View>
    );
  }

  render() {
    if (Platform.OS !== 'android' && this.props.learnType !== 'audioBook') {
      // 렌더 안함
      return <View />;
    }
    if (this.props.permissionLoading) {
      return this.renderPermissionLoading();
    } else {
      return (
        <View
          style={[
            CommonStyles.alignJustifyContentBetween,
            styles.contentContainer,
          ]}
        >
          <View style={{ flex: 1 }}>
            <View style={{ height: 22 }}>
              {Platform.OS === 'android' &&
              this.props.permission.orig_price !==
                this.props.permission.user_price
                ? (this.props.permission.user_price > 0 ||
                    this.props.permission.user_price !==
                      this.props.permission.orig_price) && (
                    <Text style={styles.originPriceText}>
                      ₩{numeral(this.props.permission.orig_price).format('0,0')}
                    </Text>
                  )
                : undefined}
              {this.props.permission.type === 'rental' && (
                <Text style={styles.labelText}>이용 가능 기간</Text>
              )}
              {this.props.learnType === 'class' &&
              this.props.permission.type === 'membership' && (
                <Text style={styles.labelText}>이용 가능 기간</Text>
              )}
            </View>
            <View>
              {this.props.permission.type !== 'free' &&
                Platform.select({
                  ios: (
                    <Text style={styles.paymentText}>
                      ₩{numeral(this.props.permission.ios_price).format('0,0')}
                      {this.props.permission.type === 'can_buy' && (
                        <Text style={styles.durationText}>
                          /{this.props.permission.rental_period}일
                        </Text>
                      )}
                    </Text>
                  ),
                  android: (
                    <Text style={styles.paymentText}>
                      ₩{numeral(this.props.permission.user_price).format('0,0')}
                      {this.props.permission.type === 'can_buy' && (
                        <Text style={styles.durationText}>
                          /{this.props.permission.rental_period}일
                        </Text>
                      )}
                    </Text>
                  ),
                })}
              {this.props.permission.type === 'free' && (
                <Text style={styles.paymentText}>무료! 마음껏 이용 :)</Text>
              )}
              {this.props.learnType === 'audioBook' &&
                this.props.permission.type === 'membership' && (
                  <Text style={styles.paymentText}>마음껏 이용 :)</Text>
                )}
              {this.props.learnType === 'class' &&
              this.props.permission.type === 'membership' && (
                <Text style={styles.paymentText}>무제한 이용 가능</Text>
              )}
              {this.props.permission.type === 'rental' && (
                <Text style={styles.paymentText}>
                  {moment(this.props.permission.expire_at).format(
                    'YYYY년 MM월 DD일',
                  )}
                </Text>
              )}
              {this.props.learnType === 'audioBook' &&
                this.props.permission.type === 'owned' && (
                  <Text style={styles.paymentText}>소장중</Text>
                )}
              {this.props.learnType === 'class' &&
                this.props.permission.type === 'membership' && (
                  <Text style={styles.paymentText}>클래스 멤버십 전용</Text>
                )}
            </View>
            <View>
              {this.props.permission.type === 'can_buy' && 1 === 2 && (
                <Text style={styles.infoText}>별도 구매가 필요합니다</Text>
              )}
            </View>
          </View>
          <View>
            <View style={CommonStyles.alignJustifyFlex}>
              {this.props.permission.can_play && (
                <DownloadButton {...this.props} active={true} />
              )}
              {!this.props.permission.can_play && (
                <DownloadButton {...this.props} active={false} />
              )}

              {this.props.permission.type !== 'can_use_voucher' &&
                this.props.permission.type === 'can_buy' && (
                  <PurchaseButton {...this.props} active={true} />
                )}
              {this.props.permission.type !== 'can_use_voucher' &&
                this.props.permission.type !== 'can_buy' && (
                  <PurchaseButton {...this.props} active={false} />
                )}

              {this.props.permission.type === 'can_use_voucher' && (
                <VoucherButton {...this.props} />
              )}
            </View>
          </View>
        </View>
      );
    }
  }
}
