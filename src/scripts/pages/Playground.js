import React, { Component } from 'react';
import { Button, ScrollView, Text } from 'react-native';
import CommonStyles from '../../styles/common';
import { SafeAreaView } from 'react-navigation';
import PurchaseView from '../components/PurchaseView';

class Playground extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoCourseData: null,
      videoClipData: null
    };
  }

  onPurchaseSuccess = response => {
    // 결제 성공시
    console.log(response);
  };

  onPurchaseError = response => {
    // 결제 실패/취소시
    console.log(response);
    alert( JSON.stringify(response));
  };

  render() {
    return (
      <SafeAreaView
        style={[CommonStyles.container, { backgroundColor: '#ecf0f1' }]}
      >
        <ScrollView style={{ width: '100%' }}>
          <Text>PLAYGROUND</Text>
          <Button
            title="Home screen"
            onPress={() => this.props.navigation.navigate('HomeScreen')}
          />

          {/*결제가 필요한 시점에 PurchaseView 컴포넌트를 화면에 붙이면 결제 창이 나타난다.*/}
          {/*결제가 완료된 후에는 화면에서 제거하면 된다.*/}
          <PurchaseView
            name={'주문명: 결제테스트'}
            amount={1000}
            buyer_email={'mbs@a.a'}
            buyer_name={'사용자'}
            buyer_tel={'010-1234-5678'}
            buyer_addr={'서울특별시 강남구 삼성동'}
            buyer_postcode={'12345'}
            height={550}
            onSuccess={this.onPurchaseSuccess}
            onError={this.onPurchaseError}
          />
          {/*컴포넌트 height 크기를 반드시 지정해야한다. 기본값은 550픽셀이나 기본값으로 잘 표현되는 환경은 극히 적을 것이다.*/}
          {/*화면을 가득 채운다면 Dimension.get( 'window' ).height 를 이용해도 무방하다.*/}

          {/*<VideoPack/>*/}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Playground;
