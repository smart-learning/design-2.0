import React from 'react';
import { TouchableOpacity, View, WebView, Text } from 'react-native';
import store from '../commons/store';
import CommonStyles from '../../styles/common';

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
          <TouchableOpacity onPress={() => (store.inAppWebViewUrl = null)}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: 40,
                backgroundColor: CommonStyles.COLOR_PRIMARY
              }}
            >
              <Text style={{ fontSize: 16, color: '#ffffff' }}>닫기</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default InAppWebView;
