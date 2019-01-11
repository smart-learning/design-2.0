import React, { Component } from 'react';
import {
  AsyncStorage,
  Button,
  Alert,
  Modal,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import { COLOR_PRIMARY } from '../../styles/common';
import moment from 'moment';
import net from '../commons/net';
import nav from '../commons/nav';
import globalStore from '../commons/store';

class FullModalSection extends Component {

  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    console.log('back press:');
    if (this.props.navigation.isFocused()) {
      BackHandler.exitApp();
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="여러분 안녕 ~ "
        />
      </View>
    );
  }
}
export default FullModalSection;
