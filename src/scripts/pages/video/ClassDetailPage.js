import React from 'react';
import { observer } from 'mobx-react';
import {
  Alert,
  ActivityIndicator,
  BackHandler,
  Text,
  View
} from 'react-native';
import net from '../../commons/net';
import CommonStyles from '../../../styles/common';
import createStore from '../../commons/createStore';
import DetailLayout from '../../components/detail/DetailLayout';
import Store from '../../commons/store';
import nav from '../../commons/nav';
import { withNavigation } from 'react-navigation';
import utils from '../../commons/utils';

@observer
class ClassDetailPage extends React.Component {
  store = createStore({
    isLoading: true,
    itemData: null,
    itemClipData: [],
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

  addToCart = async () => {
    const itemId = this.state.id;
    const { navigation } = this.props;

    try {
      await net.addToCart('video-course', itemId);
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
      Alert.alert(`장바구니에 담는 중 오류 발생 ${itemId} `);
    }
  };

  getData = async () => {
    const resultLectureData = await net.getLectureItem(
      this.props.navigation.state.params.id
    );
    const resultLectureClipData = await net.getLectureClipList(
      this.props.navigation.state.params.id
    );

    this.props.navigation.setParams({
      title: resultLectureData.title
    });

    this.store.itemData = resultLectureData;
    this.store.itemClipData = resultLectureClipData;

    this.store.isLoading = false;
  };

  componentDidMount() {
    this.getData();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    console.log(
      'cdp back button:',
      this.props.navigation.isFocused(),
      Store.prevLocations
    );
    // if (this.props.navigation.isFocused()) {
    nav.commonBack();
    // }
    return true;
  };

  render() {
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        {this.store.isLoading ? (
          <View style={{ marginTop: 12 }}>
            <ActivityIndicator
              size="large"
              color={CommonStyles.COLOR_PRIMARY}
            />
          </View>
        ) : this.store.itemData !== null ? (
          <DetailLayout
            learnType={'class'}
            addToCart={this.addToCart}
            itemData={this.store.itemData}
            store={this.store}
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

export default withNavigation(ClassDetailPage);
