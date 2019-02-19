import React from 'react';
import { observer } from 'mobx-react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import native from '../../commons/native';
import net from '../../commons/net';
import CommonStyles from '../../../styles/common';
import createStore from '../../commons/createStore';
import globalStore from '../../commons/store';
import DetailLayout from '../../components/detail/DetailLayout';
import utils from '../../commons/utils';
import { action, observable } from 'mobx';

class Data {
  @observable cid = null;
  @observable isLoading = true;
  @observable itemData = null;
  @observable itemClipData = [];
  @observable itemReviewData = { my: [], all: [] };
  @observable itemEvaluationData = [];
  @observable tabStatus = 'info';
  @observable lectureView = false;
  @observable teacherView = false;
  @observable slideHeight = null;
  @observable reviewText = '';
  @observable reviewStar = 5;
  @observable voucherStatus = {};
  @observable isSubmitStatus = false;
  @observable pagination = {
    'has-next': true,
  };
  @observable isReviewLoading = false;
  @observable myReviewId = null;
  @observable isReviewUpdate = false;
  @observable isStarEditMode = false;

  @action.bound
  loadReview(page = 1) {
    this.isReviewLoading = true;
    net
      .getReviewList(this.cid, page)
      .then(comments => {
        this.pagination = comments.pagination;
        this.itemReviewData.my = comments.my;
        comments.all.forEach(comment => {
          const exist = this.itemReviewData.all.find(
            element => element.id === comment.id,
          );
          if (!exist) {
            this.itemReviewData.all.push(comment);
          }
        });
        this.isReviewLoading = false;
      })
      .catch(error => {
        Alert.alert('Error', error.message);
        this.isReviewLoading = false;
      });
  }
}

@observer
class AudioBookDetailPage extends React.Component {
  data = new Data();

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.navigation.state.params.id,
      permission: { type: null },
      paymentType: 1,
      expire: null,
      permissionLoading: true,
    };
  }

  iosBuy = async () => {
    native.buy({
      title: this.data.itemData.title,
      type: 'audio_book',
      product_id: this.data.itemData.pay_key_ios,
      token: globalStore.accessToken,
    });
  };

  addToCart = async () => {
    const itemId = this.state.id;
    const { navigation } = this.props;
    let errorMessage = '장바구니에 담는 중 오류가 발생하였습니다.';

    try {
      await net.addToCart('audiobook', itemId);
      await utils.updateCartStatus();
      Alert.alert(
        '장바구니',
        `오디오북을 장바구니에 담았습니다. 장바구니로 이동하시겠습니까?`,
        [
          { text: '취소' },
          {
            text: '이동하기',
            onPress: () => navigation.navigate('CartScreen'),
          },
        ],
      );
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);

        if (error.response.data.msg) {
          errorMessage = error.response.data.msg;
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }

      Alert.alert('오류', errorMessage, [{ text: '확인' }]);
    }
  };

  useVoucher = async () => {
    const audiobook_id = this.state.id;
    const res = await net.voucherExchange(audiobook_id);
    if (res.status === 200) {
      Alert.alert('이용권을 이용한 오디오북 구매에 성공했습니다.');

      this.data.permissions = await this.getPlayPermissions();
      globalStore.voucherStatus = await net.getVouchersStatus();

      return true;
    } else {
      Alert.alert('이용권을 이용한 오디오북 구매 중 오류가 발생하였습니다.');

      return false;
    }
  };

  getData = async () => {
    this.data.isLoading = true;
    let resultBookData;
    try {
      resultBookData = await net.getBookItem(this.state.id);
    } catch (error) {
      Alert.alert('Error', error.message);
      // 기본 데이터를 로드하지 못했다면 더 이상의 진행이 불가하므로 getData 함수 종료.
      this.data.isLoading = false;
      return;
    }
    let resultChapterData;
    try {
      resultChapterData = await net.getBookChapterList(this.state.id);
    } catch (error) {
      Alert.alert('Error', error.message);
      // 기본 데이터를 로드하지 못했다면 더 이상의 진행이 불가하므로 getData 함수 종료.
      this.data.isLoading = false;
      return;
    }

    this.props.navigation.setParams({
      title: ' ',
    });

    if (!resultBookData.cid) {
      Alert.alert('Error', 'cid를 찾을 수 없습니다.');
      this.data.isLoading = false;
      return;
    }

    this.data.itemData = resultBookData;
    this.data.cid = resultBookData.cid;
    this.data.itemClipData = resultChapterData;
    if (resultBookData && resultBookData.cid) {
      try {
        const evaluation = await net.getItemEvaluation(resultBookData.cid);
        this.data.itemEvaluationData = evaluation;
        if( this.data.itemEvaluationData.my?.score > 0 ) {
          this.data.reviewStar = this.data.itemEvaluationData?.my?.score;
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
      try {
        await this.data.loadReview();
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
    this.data.isLoading = false;

    try {
      await this.getPlayPermissions();
    } catch (error) {
      Alert.alert('Error', error.message);
    }

    //조회수 증가
    try {
      await net.postAddContentViewCount(resultBookData.cid);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  componentWillUnmount() {}

  async getPlayPermissions() {
    let permissionLoading = true;
    let permission = null;

    let {
      cid,
      orig_price: origPrice,
      pay_money_ios: iosPrice,
    } = this.data.itemData;

    this.setState({ permissionLoading });

    const userLoggedIn = globalStore.welaaaAuth !== undefined;
    if (!userLoggedIn) {
      permission = {
        type: null,
        canPlay: false,
        origPrice: origPrice,
        userPrice: origPrice,
        iosPrice: iosPrice,
      };
      this.setState({
        permission,
        permissionLoading: false,
      });

      return;
    }

    const permissionData = await net.getPlayPermissionByCid(cid);
    this.setState({
      permission: permissionData,
      permissionLoading: false,
    });
  }

  async componentDidMount() {
    this.getData();
  }

  render() {
    console.log('this.data', this.data);
    const { permission } = this.state;
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
            iosBuy={this.iosBuy}
            useVoucher={this.useVoucher}
            voucherStatus={this.data.voucherStatus}
            itemData={this.data.itemData}
            learnType={'audioBook'}
            store={this.data}
            paymentType={this.state.paymentType}
            expire={this.state.expire}
            permission={permission}
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
