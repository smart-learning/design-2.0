﻿import { Alert, NativeModules, Platform } from 'react-native';
import globalStore from '../commons/store';
import net from '../commons/net';

const { RNNativePlayer, RNNativeBase, RNProductPayment } = NativeModules;

export default {
  getPlayerManager() {
    return RNNativePlayer;
  },

  getPaymentManager() {
    return RNProductPayment;
  },

  getF_TOKEN(callback) {
    RNNativeBase.getF_TOKEN(callback);
  },

  doThingAfterLogout() {
    RNNativePlayer.stop();
  },

  play(item, oid = '') {
    const { welaaaAuth } = globalStore;

    console.log('welaaaAuth:', welaaaAuth);

    /* TODO: id를 이용하여 api에서 필요 정보 받아오는 과정 필요 */
    if (
      welaaaAuth === undefined ||
      welaaaAuth.profile === undefined ||
      welaaaAuth.profile.id === undefined
    ) {
      Alert.alert('로그인 후 이용할 수 있습니다.');

      // Works on both iOS and Android
      // Alert.alert(
      //   '로그인 후 이용할 수 있습니다.'
      //   [
      //     { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      //     { text: 'OK', onPress: () => console.log('OK Pressed') }
      //   ],
      //   { cancelable: false }
      // )

      return true;
    }

    let userId = globalStore.welaaaAuth.profile.id;
    let accessToken = globalStore.welaaaAuth.access_token;

    var args;
    if (String === item.constructor) {
      args = { cid: item, oid: oid, uri: '', name: '' };
    } else {
      args = { ...item };
    }
    args['drmSchemeUuid'] = 'widevine';
    args['drmLicenseUrl'] = 'http://tokyo.pallycon.com/ri/licenseManager.do';
    args['userId'] = userId.toString();
    args['token'] = accessToken;

    console.log('native.play()', args);

    setTimeout(() => {
      try {
        RNNativePlayer.play(args);
      } catch (e) {
        alert(e);
      }
    }, 100);
  },

  toggleMiniPlayer(bool) {
    globalStore.miniPlayerVisible = bool;
  },

  mainToggleMiniPlayer(bool, arg) {
    globalStore.miniPlayerArg = arg;
    globalStore.miniPlayerVisible = bool;
  },

  downloadState(arg) {
    console.log('native.js::downloadState(arg)', arg);
    globalStore.downloadState.complete = arg.complete;
    globalStore.downloadState.progress = arg.progress;
  },

  getDownloadList(success, failed) {
    console.log('native.js::getDownloadList');

    let userId = globalStore.welaaaAuth.profile.id;
    let config = {
      userId: userId.toString()
    };

    console.log('native.js::getDownloadList', config);

    if (Platform.OS === 'android') {
      RNNativePlayer.getDownloadList(config)
        .then(success)
        .catch(failed);
    } else {
      RNNativePlayer.getDownloadList()
        .then(success)
        .catch(failed);
    }
  },

  getDownloadListCid(cid, success, failed) {
    let userId = globalStore.welaaaAuth.profile.id;
    let config = {
      cid: cid,
      userId: userId.toString()
    };

    console.log('native.js::getDownloadList Cid');
    RNNativePlayer.getDownloadCidList(config)
      .then(success)
      .catch(failed);
  },

  getProgressDatabase(success, failed) {
    let userId = globalStore.welaaaAuth.profile.id;
    let config = {
      userId: userId.toString()
    };

    try {
      RNNativePlayer.selectProgressDatabase(config)
        .then(success)
        .catch(failed);
    } catch (error) {
      console.log(error);
    }
  },

  // receiveDownloadList(args) {
  // 	console.log('naive.receiveDownloadList:', args);
  // },

  download(args) {
    const { welaaaAuth } = globalStore;
    /* TODO: id를 이용하여 api에서 필요 정보 받아오는 과정 필요 */
    if (
      welaaaAuth === undefined ||
      welaaaAuth.profile === undefined ||
      welaaaAuth.profile.id === undefined
    ) {
      Alert.alert('로그인 후 이용할 수 있습니다.');

      return true;
    }

    console.log('download:', args);
    RNNativePlayer.download(args);
  },

  deleteDownload(arg, success, failed) {
    console.log('native.js::deleteDownload(arg)', arg);
    RNNativePlayer.deleteDownload(arg)
      .then(success)
      .catch(failed);
  },

  /* 내정보 > 설정 메뉴에서 호출 */
  /* Native 담당: cellularDataUsePlay: bool, cellularDataUseDownload: bool
	*  ReactN 담당: autologin: bool, notification: bool
	* */
  // isAutoLogin: false,
  // isWifiPlay: false,
  // isWifiDownload: false,
  // isAlert: false,
  // isEmail: false,
  updateSettings() {
    const { isWifiPlay, isWifiDownload } = globalStore.appSettings;
    let config = {
      token: globalStore.accessToken,
      cellularDataUsePlay: isWifiPlay,
      cellularDataUseDownload: isWifiDownload
    };

    console.log('updateSetting:', config);

    return RNNativePlayer.setting(config);
  },

  updateSetting(key, bool) {
    switch (key) {
      case 'alert':
        // this.setFirebase(bool);
        break;

      case 'email':
        Alert.alert('준비중입니다.');
        break;
    }
  },

  getConstants() {
    return RNNativeBase;
  },

  buy(args) {
    try {
      return RNProductPayment.buy(args);
    } catch (error) {
      console.log('native.buy > error', error);
      console.log('native.buy > args', args);
      return error;
    }
  },

  restore(args) {
    try {
      return RNProductPayment.restore(args);
    } catch (error) {
      console.log('native.restore > error', error);
      console.log('native.restore > args', args);
      return error;
    }
  },

  async buyResult(arg) {
    try {
      // 멤버십 정보
      const respMembership = await net.getMembershipCurrentFresh();
      console.log('buyResult > respMembership', respMembership);
      globalStore.currentMembership = respMembership.data;
      // 이용권 정보
      globalStore.voucherStatus = await net.getVouchersStatus();
      console.log('buyResult > voucherStatus', globalStore.voucherStatus);
    } catch (error) {
      console.log('buyResult > error', error);
      return false;
    }
    return true;
  },

  unsubscribe() {
    return RNProductPayment.unsubscribe();
  }
};
