import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import net from '../../commons/net';
import { SafeAreaView } from 'react-navigation';
import { CartItem } from '../../components/cart/CartItem';
import CommonStyles from '../../../styles/common';
import utils from '../../commons/utils';
import numeral from 'numeral';

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
    backgroundColor: '#fff'
  },
  summaryWrapper: {
    backgroundColor: '#f6f6f6',
    borderTopWidth: 2,
    borderTopColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12
  },
  totalPriceWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    marginBottom: 8,
    paddingVertical: 8
  },
  totalPrice: {
    fontSize: 18,
    color: '#FF4F72'
  },
  priceUnitText: {
    fontSize: 14
  },
  buttonPay: {
    backgroundColor: CommonStyles.COLOR_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    width: '100%',
    height: 50
  },
  buttonPayText: {
    fontSize: 15,
    color: '#ffffff'
  },
  cartEmptyWrapper: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  cartEmptyText: {
    color: '#333'
  },
  summaryHighlight: {
    color: '#43c57d',
    fontSize: 18
  },
  summaryHighlightSmall: {
    fontSize: 14
  }
});

export default class CartScreen extends React.Component {
  static navigationOptions = {
    title: '구매예정 목록'
  };

  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      totalPrice: 0,
      loadingData: false,
      confirmRemoveCartItem: false,
      removeCartItemProgress: false,
      removeCartItemId: null
    };
  }

  async componentDidMount() {
    await this.loadData();
  }

  loadData = async () => {
    try {
      this.setState({
        loadingData: true
      });
      const resp = await net.getCartItems();
      this.setState({
        cartItems: resp.data.items,
        totalPrice: resp.data.total_price
      });
    } catch (e) {
      Alert.alert(e.toString());
    } finally {
      this.setState({
        loadingData: false
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
        }
      }
    ]);
  };

  _removeFromCart = async cartItemId => {
    try {
      await net.removeCartItem(cartItemId);
      await this.loadData();
      await utils.updateCartStatus();
    } catch (e) {
      Alert.alert(`장바구니 항목 삭제 중 오류가 발생했습니다: ${e.toString()}`);
    }
  };

  _renderCartItems() {
    const { cartItems, totalPrice } = this.state;

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
              teacher: { name: teacherName }
            },
            rent_period: rentPeriod
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
            cartItemId
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
    let totalClassCount = 0;
    let totalAudiobookCount = 0;

    this.state.cartItems.forEach(item => {
      if (item.type === 'video-course') {
        ++totalClassCount;
      }
      if (item.type === 'audiobook') {
        ++totalAudiobookCount;
      }
    });

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
          <TouchableOpacity>
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

  render() {
    const { loadingData } = this.state;

    if (loadingData) {
      return this._renderLoadingData();
    }

    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 16
            }}
          >
            {this._renderCartItems()}
            {this._renderTotalPrice()}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
