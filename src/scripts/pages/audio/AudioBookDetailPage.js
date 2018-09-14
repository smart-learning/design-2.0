import React from 'react';
import { observer } from 'mobx-react';
import { ActivityIndicator, Alert, Platform, Text, View } from 'react-native';
import net from '../../commons/net';
import CommonStyles from '../../../styles/common';
import createStore from '../../commons/createStore';
import globalStore from '../../commons/store';
import DetailLayout from '../../components/detail/DetailLayout';
import moment from 'moment';
import native from '../../commons/native';

@observer
class AudioBookDetailPage extends React.Component {
  data = createStore({
    isLoading: true,
    itemData: null,
    itemClipData: [],
    itemReviewData: [],
    tabStatus: 'info',
    lectureView: false,
    teacherView: false,
    slideHeight: null,
    reviewText: '',
    reviewStar: 0,

    permissions: {
      permission: false,
      expire_at: null
    },
    paymentType: 1,
    expire: null,
    voucherStatus: {}
  });

  state = {
    paymentType: 1,
    expire: null,
    permissionLoading: true
  };

  purchase = async paymentType => {
    if (paymentType === 1) {
      // 구매
      if (Platform.OS === 'ios') {
        native.buy({
          type: 'audio_book',
          product_id: this.data.itemData.pay_key_ios,
          token: globalStore.accessToken
        });
      } else {
        Alert.alert('알림', '오디오북 단품 결제는 준비중입니다.');
      }
    } else if (paymentType === 2) {
      // 이용권 사용
      const audiobook_id = this.props.navigation.state.params.id;
      const res = await net.voucherExchange(audiobook_id);
      console.log('purchase resp', res);
      if (res.status === 200) {
        Alert.alert('이용권을 이용한 오디오북 구매에 성공했습니다.');

        this.data.permissions = await this.getPermissions();

        return true;
      } else {
        Alert.alert('이용권을 이용한 오디오북 구매 중 오류가 발생하였습니다.');

        return false;
      }
    } else if (paymentType === 4) {
      Alert.alert('로그인 후 이용해 주세요.');
    }
  };

  getData = async () => {
    this.data.isLoading = true;
    const resultBookData = await net.getBookItem(
      this.props.navigation.state.params.id
    );
    const resultChapterData = await net.getBookChapterList(
      this.props.navigation.state.params.id
    );

    this.data.itemData = resultBookData;
    this.data.itemClipData = resultChapterData;
    if (resultBookData && resultBookData.cid) {
      try {
        const comments = await net.getBookReviewList(resultBookData.cid);
        this.data.itemReviewData = comments;
      } catch (error) {
        console.log(error);
      }
    }

    this.data.isLoading = false;

    await this.getPermissions();
  };

  async getPermissions() {
    let permissionLoading = true;

    let paymentType = 0;
    let expire = null;
    let { itemData, permissions, voucherStatus } = this.data;

    this.setState({ permissionLoading });

    let { sale_price } = this.data.itemData;

    if (sale_price === 0) {
      this.data.permissions = {
        is_free: true,
        permission: true,
        expire_at: null
      };
    } else {
      // not logged in

      const userLoggedIn = globalStore.welaaaAuth !== undefined;
      console.log('============= userLoggedIn', userLoggedIn);
      console.log('=----------------', globalStore.welaaaAuth);

      if (!userLoggedIn) {
        paymentType = 4;
        expire = null;
      } else {
        // logged in
        this.data.permissions = await net.getContentPermission(
          'audiobooks',
          this.props.navigation.state.params.id
        );
        if (!this.data.permissions.permission) {
          this.data.voucherStatus = await net.getVoucherStatus(true);
        }

        if (permissions.is_free) {
          // 무료
          paymentType = 0;
        } else {
          // 유료
          if (permissions.permission) {
            // 소장 중
            paymentType = 3;

            if (permissions.expire_at) {
              expire = `${moment(permissions.expire_at).format(
                'YYYY-MM-DD'
              )} 만료`;
            } else {
              expire = '영구소장';
            }
          } else {
            if (
              (itemData.is_botm && voucherStatus.botm > 0) ||
              (!itemData.is_botm && voucherStatus.total > 0)
            ) {
              paymentType = 2;
            } else {
              paymentType = 1;
            }
          }
        }
      }
    }

    this.data.paymentType = paymentType;
    this.data.expire = expire;
    permissionLoading = false;

    this.setState({
      paymentType,
      expire,
      permissionLoading
    });
  }

  async componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        {this.data.isLoading ? (
          <View style={{ marginTop: 12 }}>
            <ActivityIndicator
              size="large"
              color={CommonStyles.COLOR_PRIMARY}
            />
          </View>
        ) : this.data.itemData !== null ? (
          <DetailLayout
            purchase={this.purchase}
            voucherStatus={this.data.voucherStatus}
            permissions={this.data.permissions}
            itemData={this.data.itemData}
            learnType={'audioBook'}
            store={this.data}
            paymentType={this.state.paymentType}
            expire={this.state.expire}
            permissionLoading={this.state.permissionLoading}
          />
        ) : (
          <View>
            <Text>!!! </Text>
          </View>
        )}
      </View>
    );
  }
}

export default AudioBookDetailPage;
