import React from 'react';
import IAmPort from 'react-native-iamport';
import { observer } from 'mobx-react';
import _ from 'underscore';

@observer
class PurchaseView extends React.Component {
  onPaymentResultReceive = response => {
    if (response.result === 'success') {
      if (_.isFunction(this.props.onPurchaseSuccess)) {
        this.props.onPurchaseSuccess(response);
      }
    } else {
      if (_.isFunction(this.props.onPurchaseError)) {
        this.props.onPurchaseError(response);
      }
    }
  };

  render() {
    return (
      <IAmPort
        style={{ width: '100%', height: this.props.height || 550 }}
        onPaymentResultReceive={this.onPaymentResultReceive}
        params={{
          code: 'imp42972103',
          pg: 'nice',
          pay_method: 'card',
          app_scheme: 'welaaa',
          name: this.props.name,
          amount: this.props.amount,
          buyer_email: this.props.buyer_email,
          buyer_name: this.props.buyer_name,
          buyer_tel: this.props.buyer_tel,
          buyer_addr: this.props.buyer_addr,
          buyer_postcode: this.props.buyer_postcode,
          m_redirect_url: 'https://payment.welaaa.com/callback'
        }}
      />
    );
  }
}

export default PurchaseView;
