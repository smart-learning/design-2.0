import React from 'react';
import { observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import net from '../../commons/net';
import CommonStyles from '../../../styles/common';
import createStore from '../../commons/createStore';
import DetailLayout from '../../components/detail/DetailLayout';
import globalStore from '../../commons/store';
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
class ClassDetailPage extends React.Component {
  data = new Data();

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.navigation.state.params.id,
      cid: this.props.navigation.state.params.cid,
      paymentType: 1,
      expire: null,
      permissionLoading: true,
      permission: {
        type: null,
      },
    };
  }

  addToCart = async () => {
    const itemId = this.state.id;
    const { navigation } = this.props;
    let errorMessage = '장바구니에 담는 중 오류가 발생하였습니다.';

    try {
      await net.addToCart('video-course', itemId);
      await utils.updateCartStatus();
      Alert.alert(
        '장바구니',
        `클래스를 장바구니에 담았습니다. 장바구니로 이동하시겠습니까?`,
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

  getData = async () => {
    let resultLectureData;
    try {
      resultLectureData = await net.getLectureItem(this.state.id);
    } catch (error) {
      Alert.alert('Error', error.message);
      // 기본 데이터를 로드하지 못했다면 더 이상의 진행이 불가하므로 getData 함수 종료.
      this.data.isLoading = false;
      return;
    }
    let resultLectureClipData;
    try {
      resultLectureClipData = await net.getLectureClipList(this.state.id);
    } catch (error) {
      Alert.alert('Error', error.message);
      // 기본 데이터를 로드하지 못했다면 더 이상의 진행이 불가하므로 getData 함수 종료.
      this.data.isLoading = false;
      return;
    }
    this.props.navigation.setParams({
      title: ' ',
    });

    if (!resultLectureData.cid) {
      Alert.alert('Error', 'cid를 찾을 수 없습니다.');
      this.data.isLoading = false;
      return;
    }

    this.data.itemData = resultLectureData;
    this.data.cid = resultLectureData.cid;
    this.data.itemClipData = resultLectureClipData;
    this.data.isLoading = false;
    if (resultLectureData && resultLectureData.cid) {
      try {
        const evaluation = await net.getItemEvaluation(resultLectureData.cid);
        this.data.itemEvaluationData = evaluation;
        if (this.data.itemEvaluationData.my?.score > 0) {
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

    try {
      await this.getPlayPermissions();
    } catch (error) {
      Alert.alert('Error', error.message);
    }

    //조회수 증가
    if (resultLectureData.cid) {
      try {
        await net.postAddContentViewCount(resultLectureData.cid);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {}

  async getPlayPermissions() {
    const userLoggedIn = globalStore.welaaaAuth !== undefined;
    let permissionLoading = true;
    let permission = null;
    let { cid, orig_price: origPrice } = this.data.itemData;

    this.setState({ permissionLoading });

    if (!userLoggedIn) {
      permission = {
        type: null,
        canPlay: false,
        origPrice: origPrice,
        userPrice: origPrice,
      };
      this.setState({
        permission,
        permissionLoading: false,
      });

      return;
    }

    if (cid) {
      const permissionData = await net.getPlayPermissionByCid(cid);
      this.setState({
        permission: permissionData,
        permissionLoading: false,
      });
    }
  }

  render() {
    console.log('this.data', this.data);
    const { permission, permissionLoading } = this.state;
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <KeyboardAvoidingView
          enabled={Platform.OS === 'ios'}
          behavior="position"
        >
        {this.data.isLoading ? (
          <View style={{ marginTop: 12 }}>
            <ActivityIndicator
              size="large"
              color={CommonStyles.COLOR_PRIMARY}
            />
          </View>
        ) : this.data.itemData !== null ? (
          <DetailLayout
            learnType={'class'}
            addToCart={this.addToCart}
            itemData={this.data.itemData}
            store={this.data}
            permissionLoading={permissionLoading}
            permission={permission}
          />
        ) : (
          <View>
            <Text>데이터를 가져오는 중 오류가 발생하였습니다.</Text>
          </View>
        )}
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default withNavigation(ClassDetailPage);
