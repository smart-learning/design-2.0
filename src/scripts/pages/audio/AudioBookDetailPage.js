import React from 'react';
import { observer } from 'mobx-react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,
  Text,
  View
} from 'react-native';
import net from '../../commons/net';
import CommonStyles from '../../../styles/common';
import createStore from '../../commons/createStore';
import globalStore from '../../commons/store';
import DetailLayout from '../../components/detail/DetailLayout';
import moment from 'moment';
import native from '../../commons/native';
import nav from '../../commons/nav';
import { withNavigation } from 'react-navigation'
import utils from '../../commons/utils'

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
    voucherStatus: {}
  });

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.navigation.state.params.id,
      paymentType: 1,
      expire: null,
      permissionLoading: true
    };
  }

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
      const audiobook_id = this.state.id;
      const res = await net.voucherExchange(audiobook_id);
      console.log('purchase resp', res);
      if (res.status === 200) {
        Alert.alert('이용권을 이용한 오디오북 구매에 성공했습니다.');

        this.data.permissions = await this.getPermissions();
        // 이용권 사용 후 바우처 상태 갱신 
        globalStore.voucherStatus = await net.getVouchersStatus();

        return true;
      } else {
        Alert.alert('이용권을 이용한 오디오북 구매 중 오류가 발생하였습니다.');

        return false;
      }
    } else if (paymentType === 4) {
      Alert.alert('로그인 후 이용해 주세요.');
    }
  };

  addToCart = async () => {
    const itemId = this.state.id;
    const { navigation } = this.props;

    try {
      await net.addToCart('audiobook', itemId);
      await utils.updateCartStatus();
      Alert.alert(
        '장바구니',
        `${itemId} 아이템을 담았습니다. 장바구니로 이동하시겠습니까?`,
        [
          { text: '취소' },
          { text: '이동하기', onPress: () => navigation.navigate('CartScreen') }
        ]
      );
    } catch (e) {
      console.log(e);
      Alert.alert(`장바구니에 담는 중 오류 발생하였습니다. ${e.toString()}`);
    }
  };

  useVoucher = () => {
    const audiobook_id = this.state.id;
    Alert.alert(`이용권 사용하기 ${audiobook_id}`);
  };

  getData = async () => {
    this.data.isLoading = true;
    const resultBookData = await net.getBookItem(this.state.id);
    const resultChapterData = await net.getBookChapterList(this.state.id);

    this.props.navigation.setParams({
      title: resultBookData.title
    });

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

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    console.log(
      'audiobook detail hardware back button:',
      this.props.navigation.isFocused(),
      globalStore.prevLocations
    );
    // if (this.props.navigation.isFocused()) {
    nav.commonBack();
    // }

    return true;
  };

  async getPermissions() {
    let permissionLoading = true;
    let paymentType = 0;
    let expire = null;

    this.setState({ permissionLoading });

    let { sale_price } = this.data.itemData;

    if (sale_price === 0) {
      this.data.permissions = {
        is_free: true,
        permission: true,
        expire_at: null
      };
    } else {
      const userLoggedIn = globalStore.welaaaAuth !== undefined;

      if (!userLoggedIn) {
        paymentType = 4;
        expire = null;
      } else {
        // logged in
        this.data.permissions = await net.getContentPermission(
          'audiobooks',
          this.state.id
        );
        if (!this.data.permissions.permission) {
          this.data.voucherStatus = await net.getVouchersStatus(true);
        }
        if (this.data.permissions.is_free) {
          // 무료
          paymentType = 0;
        } else {
          // 유료
          if (this.data.permissions.permission) {
            // 소장 중
            paymentType = 3;

            if (this.data.permissions.expire_at) {
              expire = `${moment(this.data.permissions.expire_at).format(
                'YYYY-MM-DD'
              )} 만료`;
            } else {
              expire = '영구소장';
            }
          } else {
            if (
              (this.data.itemData.is_botm &&
                this.data.voucherStatus.botm > 0) ||
              (!this.data.itemData.is_botm && this.data.voucherStatus.total > 0)
            ) {
              paymentType = 2;
            } else {
              paymentType = 1;
            }
          }
        }
      }
    }

    this.setState({
      paymentType,
      expire,
      permissionLoading: false
    });
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
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
            addToCart={this.addToCart}
            useVoucher={this.useVoucher}
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
            <Text>데이터를 가져오는 중 오류가 발생하였습니다.</Text>
          </View>
        )}
      </View>
    );
  }
}

export default withNavigation(AudioBookDetailPage);
