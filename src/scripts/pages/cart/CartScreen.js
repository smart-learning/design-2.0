import numeral from 'numeral';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import { Header, SafeAreaView, withNavigation } from 'react-navigation';
import CommonStyles from '../../../styles/common';
import net from '../../commons/net';
import globalStore from '../../commons/store';
import utils from '../../commons/utils';
import { CartItem } from '../../components/cart/CartItem';
import PurchaseView from '../../components/PurchaseView';

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  summaryWrapper: {
    backgroundColor: '#f6f6f6',
    borderTopWidth: 2,
    borderTopColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  totalPriceWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    marginBottom: 8,
    paddingVertical: 8,
  },
  totalPrice: {
    fontSize: 18,
    color: '#FF4F72',
  },
  priceUnitText: {
    fontSize: 14,
  },
  buttonPay: {
    backgroundColor: CommonStyles.COLOR_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    width: '100%',
    height: 50,
  },
  buttonPayText: {
    fontSize: 15,
    color: '#ffffff',
  },
  cartEmptyWrapper: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cartEmptyText: {
    color: '#333',
  },
  summaryHighlight: {
    color: '#43c57d',
    fontSize: 18,
  },
  summaryHighlightSmall: {
    fontSize: 14,
  },
});

class CartScreen extends React.Component {
  static navigationOptions = {
    title: '구매예정 목록',
  };

  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      totalPrice: 0,
      loadingData: false,
      confirmRemoveCartItem: false,
      orderTitle: '주문',
      removeCartItemProgress: false,
      removeCartItemId: null,
      showPurchaseView: false,
      totalClassCount: 0,
      totalAudiobookCount: 0,
    };
  }

  async componentDidMount() {
    await this.loadData();
  }

  loadData = async () => {
    let orderTitle = '';
    let totalClassCount = 0;
    let totalAudiobookCount = 0;

    try {
      this.setState({
        loadingData: true,
      });
      const resp = await net.getCartItems();

      resp.data.items.forEach(item => {
        if (item.type === 'video-course') {
          ++totalClassCount;
        }
        if (item.type === 'audiobook') {
          ++totalAudiobookCount;
        }
      });

      orderTitle = `클래스 ${totalClassCount} 편 / 오디오북 ${totalAudiobookCount} 권 구매`;

      this.setState({
        cartItems: resp.data.items,
        totalPrice: resp.data.total_price,
        orderTitle,
        totalAudiobookCount,
        totalClassCount,
      });
    } catch (e) {
      Alert.alert('오류', '데이터를 가져오는 중 오류가 발생하였습니다.');
    } finally {
      this.setState({
        loadingData: false,
      });
    }
  };

  onPurchaseSuccess = async response => {
    // 결제 성공시
    const { imp_uid, merchant_uid } = response;

    try {
      const resp = await net.postPurchaseCallback(imp_uid, merchant_uid);
      console.log('결제 완료', resp);
      await utils.updateCartStatus();
      Alert.alert(
        '구매 완료',
        `${this.state.orderTitle} 결제가 완료되었습니다.`,
        [
          {
            text: '확인',
            onPress: () => {
              const { totalAudiobookCount, totalClassCount } = this.state;
              const { navigation } = this.props;

              if (totalAudiobookCount > 0 && totalClassCount > 0) {
                navigation.navigate('MyInfoHome', {
                  title: '마이 윌라',
                });
              } else if (totalAudiobookCount > 0) {
                navigation.navigate('AudioBookBuyPage', {
                  title: '구매한 오디오북',
                });
              } else if (totalClassCount > 0) {
                navigation.navigate('LectureBuyPage', {
                  title: '구매한 클래스',
                });
              } else {
                navigation.navigate('HomeScreen');
              }
            },
          },
        ],
      );

      /* 2018.12.26
       * appsFlyer 마케팅 요청
       * 개별구매(장바구니)
       */
      this.state.cartItems.map(item => {
        let eventValues = {
          af_price: item.user_price,
          af_currency: 'KRW',
          af_content_id: item.id,
          af_class: item.type,
          af_customer_user_id: globalStore.welaaaAuth.profile.id,
          os_type: Platform.OS,
        };

        appsFlyer.trackEvent(
          'af_purchase',
          eventValues,
          result => console.log('appsFlyer.trackEvent', result),
          error => console.error('appsFlyer.trackEvent error', error),
        );
      });
    } catch (e) {
      console.log('결제 실패', e);
      Alert.alert('결제 실패', JSON.stringify(resp.data));
    }
  };

  onPurchaseError = response => {
    // 결제 실패/취소시
    console.log('결제 실패 또는 취소');
    console.log(response);
    Alert.alert('결제 실패', '결제가 실패하였습니다.');
  };

  showPurchaseView = () => {
    if (this.state.totalPrice > 0) {
      this.setState({
        showPurchaseView: true,
      });
    }
  };

  showRemoveCartItemAlert = async cartItemId => {
    Alert.alert('장바구니', '장바구니에서 항목을 삭제하시겠습니까?', [
      { text: '취소' },
      {
        text: '삭제',
        onPress: () => {
          this._removeFromCart(cartItemId);
        },
      },
    ]);
  };

  _removeFromCart = async cartItemId => {
    try {
      await net.removeCartItem(cartItemId);
      await this.loadData();
      await utils.updateCartStatus();
    } catch (e) {
      console.log('장바구니 항목 삭제 중 오류', e);
      Alert.alert(`장바구니 항목 삭제 중 오류가 발생했습니다`);
    }
  };

  _renderCartItems() {
    const { cartItems } = this.state;

    if (cartItems.length === 0) {
      return this._renderCartItemEmpty();
    }

    return (
      <View>
        {cartItems.map((item, idx) => {
          const {
            id: cartItemId,
            orig_price: origPrice,
            user_price: userPrice,
            data: {
              title,
              type,
              images: { list: thumbnail },
              clip_count: clipCount,
              teacher: { name: teacherName },
            },
            rent_period: rentPeriod,
          } = item;

          const params = {
            clipCount,
            origPrice,
            rentPeriod,
            teacherName,
            thumbnail,
            type,
            title,
            userPrice,
            cartItemId,
          };

          return (
            <CartItem
              key={item.id}
              {...params}
              removeFromCart={this.showRemoveCartItemAlert}
            />
          );
        })}
      </View>
    );
  }

  _renderTotalPrice() {
    const { totalAudiobookCount, totalClassCount } = this.state;

    return (
      <View>
        <View style={styles.summaryWrapper}>
          <Text>
            클래스{' '}
            <Text style={styles.summaryHighlight}>
              {totalClassCount}
              <Text>편</Text>
            </Text>{' '}
            오디오북{' '}
            <Text style={styles.summaryHighlight}>
              {totalAudiobookCount}
              <Text>권</Text>
            </Text>{' '}
            구매
          </Text>
        </View>

        <View style={styles.totalPriceWrapper}>
          <Text>
            총 결제 예정금액{' '}
            <Text style={styles.totalPrice}>
              {numeral(this.state.totalPrice).format(0.0)}
              <Text style={styles.priceUnitText}>원</Text>
            </Text>
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={this.showPurchaseView}>
            <View style={styles.buttonPay} borderRadius={5}>
              <Text style={styles.buttonPayText}>구매하기</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _renderLoadingData() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY} />
      </View>
    );
  }

  _renderCartItemEmpty() {
    return (
      <View borderRadius={5} style={styles.cartEmptyWrapper}>
        <Text style={styles.cartEmptyText}>
          장바구니에 담긴 항목이 없습니다.
        </Text>
      </View>
    );
  }

  _renderPurchaseView() {
    const { height } = Dimensions.get('window');
    return (
      <SafeAreaView
        style={[CommonStyles.container, { backgroundColor: '#fff' }]}
      >
        <ScrollView style={{ width: '100%' }}>
          <PurchaseView
            name={this.state.orderTitle}
            amount={this.state.totalPrice}
            buyer_email={globalStore.profile.email}
            buyer_name={globalStore.profile.name}
            buyer_tel={''}
            buyer_addr={''}
            buyer_postcode={''}
            height={height - Header.HEIGHT}
            onPurchaseSuccess={this.onPurchaseSuccess}
            onPurchaseError={this.onPurchaseError}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  render() {
    const { loadingData, showPurchaseView } = this.state;

    if (loadingData) {
      return this._renderLoadingData();
    }

    if (showPurchaseView) {
      return this._renderPurchaseView();
    }

    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              {this._renderCartItems()}
              {this._renderTotalPrice()}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(CartScreen);
