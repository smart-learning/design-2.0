import React from 'react';
import { Button, View, WebView } from 'react-native';
import store from '../commons/store';

class InAppWebView extends React.Component {
  render() {
    const url = decodeURIComponent(this.props.url);
    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0
        }}
      >
        <WebView
          style={{
            flex: 1,
            width: '100%',
            height: '100%'
          }}
          source={{ uri: url }}
        />
        <View>
          <Button
            title={'닫기'}
            onPress={() => (store.inAppWebViewUrl = null)}
          />
        </View>
      </View>
    );
  }
}

export default InAppWebView;
