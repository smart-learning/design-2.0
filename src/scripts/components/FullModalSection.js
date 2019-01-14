import { observable } from 'mobx';
import { observer } from 'mobx-react';
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

class Data {
  @observable
  windowHeight = null;
}

class FullModalSection extends Component {
  data = new Data();

  constructor() {
    super();

    this.data.windowHeight = Dimensions.get('window').height;

    this.style = StyleSheet.create({
      container: {

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#293648',
      },

      textFrame: {
        width: Dimensions.get('window').width - 30,
        marginTop: 52,
        paddingLeft: 93,
        paddingRight: 93,
        backgroundColor: '#293648',
      },

      frame: {
        width: Dimensions.get('window').width - 30,

        backgroundColor: '#293648',
        height: this.data.windowHeight,
        marginTop: 15,
      },

      popupInfo: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
      },

      img: {
        // borderTopRightRadius: 20,
        // borderTopLeftRadius: 20,
        // overflow: 'hidden',
      },

      footer: {
        backgroundColor: COLOR_PRIMARY,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
      },

      hideOption: {
        padding: 10,
        alignItems: 'flex-start',
      },

      PopupText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
      }
    });

    this.state = {
      ads: [],
    };
  }

  componentDidMount = async () => {

    let data = await net.getMainPopup(this.props.navigation.state.params.popup_type);

    let ads = [];
    data.forEach((ad, idx) => {
      ads.push(ad);
    });

    this.setState({ ads: ads });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    if (this.props.navigation.isFocused()) {
      BackHandler.exitApp();
    }
  };

  render() {
    let ad = {};
    let img_ratio = 1.0;
    const cnt = this.state.ads.length;
    const device_size = Dimensions.get('window');

    if (cnt > 0) {
      ad = this.state.ads[cnt - 1];
      img_ratio = (device_size.width - 50) / ad.img_width;
    }

    return (

      <View style={this.style.container}>

        <View style={this.style.textFrame}>
          <Text style={this.style.PopupText}>
            뒤로가기를 한 번 더 누르면 앱이 종료됩니다
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          style={this.style.hideOption}
          onPress={() => this.props.navigation.navigate('MembershipPage', {})}
        >
          <View style={this.style.frame}>
            <View style={[{ height: ad.img_height * img_ratio }]} />
            <Image
              source={{ uri: ad.img_url }}
              width={device_size.width - 30}
              height={device_size.height}
              style={this.style.popupInfo}
              resizeMode={"contain"}
            />
          </View >
        </TouchableOpacity>
      </View>
    );
  }
}
export default FullModalSection;
