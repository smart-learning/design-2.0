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
import LogoGreen from '../../images/welaaa_logo_green.png'
import AndroidExitPopup from '../../images/welaaa_android_exit_popup.png'

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
        flex: 1,
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
        height: this.data.windowHeight - 130,
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
        backgroundColor: '#293648',
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
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
      },

      footerframe: {
        // width: Dimensions.get('window').width - 30,
        // backgroundColor: '#293648',
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36
      },

      footerImage: {
        position: 'relative',
        alignItems: 'stretch',
        justifyContent: 'center',
      },
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

        {/* <View style={this.style.textFrame}>
          <Text style={this.style.PopupText}>
            뒤로가기를 한 번 더 누르면 앱이 종료됩니다
          </Text>
        </View> */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={this.style.hideOption}
          onPress={() => this.props.navigation.navigate('MembershipPage', {})}
        >
          <View style={this.style.frame}>
            <View style={[{ height: ad.img_height * img_ratio }]} />
            <Image
              source={AndroidExitPopup}
              width={device_size.width - 30}
              style={this.style.popupInfo}
              resizeMode={"cover"}
            />
          </View >
        </TouchableOpacity>

        {/* <View style={this.style.footerframe}>
          <Image
            source={LogoGreen}
            width={181}
            height={45}
          />
        </View> */}
      </View>
    );
  }
}
export default FullModalSection;
