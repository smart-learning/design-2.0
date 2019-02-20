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
import moment from 'moment';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'flex-end',
    marginTop: 16,
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
    marginTop: 6,
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
      <View>
        {this.props.active ? (
          <TouchableOpacity activeOpacity={0.9} onPress={this.onPress}>
            <View style={[styles.buttonItem, styles.buttonItemActive]}>
              <Text style={[styles.buttonText, styles.buttonTextActive]}>
                {downloadLabel}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.buttonItem, styles.buttonItemDisabled]}>
            <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
              {downloadLabel}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

class PurchaseButton extends React.Component {
  render() {
    return (
      <View>
        {this.props.active ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (!!this.props.active) {
                Platform.OS === 'ios'
                  ? this.props.iosBuy()
                  : this.props.addToCart();
              }
            }}
          >
            <View style={[styles.buttonItem, styles.buttonItemActive]}>
              <Text style={[styles.buttonText, styles.buttonTextActive]}>
                구매
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={[styles.buttonItem, styles.buttonItemDisabled]}>
            <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
              구매
            </Text>
          </View>
        )}
      </View>
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

class MembershipButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.props.navigation.navigate('MembershipScreen')}
      >
        <View style={[styles.buttonItem, styles.buttonItemActive]}>
          <Text style={[styles.buttonText, styles.buttonTextActive]}>
            멤버십 구매
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class MembershipChangeButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.props.navigation.navigate('MembershipScreen')}
      >
        <View style={[styles.buttonItem, styles.buttonItemActive]}>
          <Text style={[styles.buttonText, styles.buttonTextActive]}>
            멤버십 변경
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class Origin extends React.Component {
  render() {
    if (this.props.permission.type === 'rental') {
      return (
        <View style={{ height: 22 }}>
          <Text style={styles.labelText}>이용 가능 기간</Text>
        </View>
      );
    } else if (
      this.props.learnType === 'class' &&
      this.props.permission.type === 'membership'
    ) {
      return (
        <View style={{ height: 22 }}>
          <Text style={styles.labelText}>이용 가능 기간</Text>
        </View>
      );
    } else {
      if (
        this.props.permission.orig_price !== this.props.permission.user_price
      ) {
        if (
          this.props.permission.user_price > 0 ||
          this.props.permission.user_price !== this.props.permission.orig_price
        ) {
          return (
            <Text style={styles.originPriceText}>
              ₩{numeral(this.props.permission.orig_price).format('0,0')}
            </Text>
          );
        }
      }
    }

    return <View />;
  }
}
class Amount extends React.Component {
  render() {
    if (this.props.permission.type === 'free') {
      return <Text style={styles.paymentText}>무료! 마음껏 이용 :)</Text>;
    } else if (Platform.OS === 'ios' && this.props.learnType === 'class') {
      if (this.props.permission.type !== 'membership') {
        return <Text style={styles.paymentText}>멤버십 구매 필요</Text>;
      } else if (this.props.permission.type === '오디오북 멤버쉽') {
        return <Text style={styles.paymentText}>멤버십 변경 필요</Text>;
      } else if (this.props.permission.type === 'membership') {
        return <Text style={styles.paymentText}>무제한 이용 가능</Text>;
      }
    } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
      if (
        this.props.learnType === 'audioBook' &&
        this.props.permission.type === 'membership'
      ) {
        return <Text style={styles.paymentText}>마음껏 이용 :)</Text>;
      } else if (
        this.props.learnType === 'class' &&
        this.props.permission.type === 'membership'
      ) {
        return <Text style={styles.paymentText}>무제한 이용 가능</Text>;
      } else if (this.props.permission.type === 'rental') {
        return (
          <Text style={styles.paymentText}>
            {moment(this.props.permission.expire_at).format('YYYY년 MM월 DD일')}
          </Text>
        );
      } else if (
        this.props.learnType === 'audioBook' &&
        this.props.permission.type === 'owned'
      ) {
        return <Text style={styles.paymentText}>소장중</Text>;
      } else if (this.props.permission.type !== 'free') {
        return Platform.select({
          ios: (
            <Text style={styles.paymentText}>
              ₩{numeral(this.props.permission.ios_price).format('0,0')}
              {this.props.permission.type === 'can_buy' && (
                <Text style={styles.durationText} />
              )}
            </Text>
          ),
          android: (
            <Text style={styles.paymentText}>
              ₩{numeral(this.props.permission.user_price).format('0,0')}
              {this.props.permission.type === 'can_buy' && (
                <Text style={styles.durationText} />
              )}
            </Text>
          ),
        });
      }
    }
    return <View />;
  }
}
class Button1st extends React.Component {
  render() {
    if (Platform.OS === 'ios' && this.props.learnType === 'class') {
      if (this.props.permission.type === 'free') {
        return <DownloadButton {...this.props} active={true} />;
      } else if (this.props.permission.type !== 'membership') {
        return <MembershipButton {...this.props} />;
      } else if (this.props.permission.type === '오디오북 멤버쉽') {
        return <MembershipChangeButton {...this.props} />;
      } else if (this.props.permission.type === 'membership') {
        return <DownloadButton {...this.props} active={true} />;
      }
    } else if (this.props.permission.can_play) {
      return <DownloadButton {...this.props} active={true} />;
    } else if (!this.props.permission.can_play) {
      return <DownloadButton {...this.props} active={false} />;
    }

    return <View />;
  }
}
class Button2nd extends React.Component {
  render() {
    if (Platform.OS === 'ios' && this.props.learnType === 'class') {
      if (this.props.permission.type === 'free') {
        return <PurchaseButton {...this.props} active={false} />;
      } else if (this.props.permission.type !== 'membership') {
        return <DownloadButton {...this.props} active={false} />;
      } else if (this.props.permission.type === '오디오북 멤버쉽') {
        return <DownloadButton {...this.props} active={false} />;
      }
    } else if (
      this.props.permission.type !== 'can_use_voucher' &&
      this.props.permission.type === 'can_buy'
    ) {
      return <PurchaseButton {...this.props} active={true} />;
    } else if (
      this.props.permission.type !== 'can_use_voucher' &&
      this.props.permission.type !== 'can_buy'
    ) {
      return <PurchaseButton {...this.props} active={false} />;
    } else if (this.props.permission.type === 'can_use_voucher') {
      return <VoucherButton {...this.props} />;
    }

    return <View />;
  }
}

class PaymentPolicy extends React.Component {
  renderPermissionLoading() {
    return (
      <View style={[CommonStyles.alignJustifyFlex, styles.contentContainer]}>
        <Text style={styles.paymentText}>구매 정보를 불러오는 중입니다.</Text>
      </View>
    );
  }

  /*
    금액 및 구매 영역
  +----------------------------------+--------------------------------------+
  | ~11,700~ (Origin)                |                                      |
  +----------------------------------+                                      +
  | 8,189 (Amount)                   |      [Button1st]    [Button2nd]      |
  +----------------------------------+--------------------------------------+
   */
  //   if(platform.iOS && class-type){
  //   if (permission.type !== membership){
  //   if (currentMembership == null) {
  //   1번 경우
  //   } else if (currentMembership == ‘오디오북 멤버쉽’){
  //   2번 경우
  //   }
  //   }
  //   }
  render() {
    if (this.props.permissionLoading) {
      return this.renderPermissionLoading();
    } else {
      return (
        <View style={styles.contentContainer}>
          <View>
            {Platform.OS === 'android' && <Origin {...this.props} />}
            <View style={CommonStyles.alignJustifyContentBetween}>
              <View style={{ flex: 1 }}>
                <View>
                  <Amount {...this.props} />
                </View>
                <View>
                  {this.props.permission.type === 'can_buy' && 1 === 2 && (
                    <Text style={styles.infoText}>별도 구매가 필요합니다</Text>
                  )}
                </View>
              </View>
              <View>
                <View style={CommonStyles.alignJustifyFlex}>
                  <Button1st {...this.props} />
                  <Button2nd {...this.props} />
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
  }
}

export default withNavigation(PaymentPolicy);
