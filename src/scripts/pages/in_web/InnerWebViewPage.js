import React from 'react';
import { StyleSheet, Text, View, WebView } from 'react-native';
const styles = StyleSheet.create({});

export default class InnerWebViewPage extends React.Component {
  constructor(props) {
    super(props);

    this.props.navigation.setParams({ title: 'WELAAA' });
  }

  onWebViewMessage = event => {
    let msgData;

    try {
      msgData = JSON.parse(event.nativeEvent.data);
      // console.log(msgData);
    } catch (err) {
      // console.warn(err);
      return;
    }

    switch (msgData.func) {
      case 'title':
        this.props.navigation.setParams({ title: msgData.param });
        break;
      case 'navigate':
        this.props.navigation.navigate(msgData.param.type, {
          id: msgData.param.id,
        });
        break;
      default:
    }
  };

  componentDidMount() {}

  render() {
    return (
      <WebView
        onMessage={this.onWebViewMessage}
        source={{
          uri: this.props.navigation.state.params.url,
        }}
      />
    );
  }
}
