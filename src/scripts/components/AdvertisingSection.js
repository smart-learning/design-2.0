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
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import { COLOR_PRIMARY } from '../../styles/common';
import moment from 'moment';
import net from '../commons/net';
import nav from '../commons/nav';
import globalStore from '../commons/store';

class AdvertisingSection extends Component {
  constructor() {
    super();

    this.style = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000099',
      },

      frame: {
        width: Dimensions.get('window').width - 30,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      },

      popupInfo: {
        flex: 1,
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

      footerText: {
        width: '100%',
        padding: 15,
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
      },
    });

    this.state = {
      ads: [],
      show_popup: true,
      three_days_checked: false,
    };

    this.now = moment();
  }

  componentDidMount = async () => {
    let data = await net.getMainPopup(this.props.popup_type);
    if (data.length === 0) return;

    // 안보기로 한 팝업은 아닌지 날짜 확인
    const adsIds = data.map(item => `pop-${item.id}`);
    const adKeyDateMaps = await AsyncStorage.multiGet(adsIds);

    // 설정된적이 없거나 날짜가 남았다면 ad리스트에 추가
    let ads = [];
    data.forEach((ad, idx) => {
      let expireDate = adKeyDateMaps[idx][1];
      if (expireDate === null) {
        ads.push(ad);
      } else {
        let fromNowDays = this.now.diff(moment(expireDate), 'days');
        if (fromNowDays > 0) ads.push(ad);
      }
    });

    this.setState({ ads: ads });
  };

  onConfirm = () => {
    let ads = [...this.state.ads];
    let closedAd = ads.shift();
    this.setState({ ads: ads });

    if (this.state.three_days_checked) {
      this.hide3Days(closedAd);
    }
    return closedAd;
  };

  hide3Days = closedAd => {
    const after3Days = moment()
      .add(3, 'd')
      .format()
      .toString();
    AsyncStorage.setItem(`pop-${closedAd.id}`, after3Days);
  };

  onCancel = () => {
    // this.setState({ modalId:null });
  };

  goEvent = info => {
    this.setState({ show_popup: false });
    nav.parseDeepLink('welaaa://' + info.action_type + '/' + info.action_param);
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={cnt > 0 && this.props.show_popup && this.state.show_popup}
        onRequestClose={() => {}}
      >
        <View style={this.style.container}>
          <View style={this.style.frame}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={this.style.hideOption}
              onPress={() => this.goEvent(ad)}
            >
              <View style={[{ height: ad.img_height * img_ratio }]} />
              <Image
                source={{ uri: ad.img_url }}
                width={device_size.width - 30}
                style={this.style.popupInfo}
                resizeMode={'cover'}
              />
            </TouchableOpacity>

            <CheckBox
              title="3일동안 보지 않기"
              checked={this.state.three_days_checked}
              onPress={() =>
                this.setState(previousState => ({
                  three_days_checked: !previousState.three_days_checked,
                }))
              }
              containerStyle={{
                backgroundColor: 'transparent',
                borderWidth: 0,
              }}
            />

            <TouchableOpacity
              activeOpacity={0.9}
              style={this.style.footer}
              onPress={this.onConfirm}
            >
              <Text style={this.style.footerText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default AdvertisingSection;
