import React, { Component } from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AccessToken, AppEventsLogger, LoginManager } from 'react-native-fbsdk';
import icFbBox from '../../../images/ic-fb-box.png';
import icFb from '../../../images/ic-fb.png';
import Native from '../../commons/native';
import firebase from 'react-native-firebase';

const styles = StyleSheet.create({
  FbButtonWrap: {
    width: '100%'
  }
});

const loginStyles = StyleSheet.create({
  FbButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 48,
    marginTop: 10,
    backgroundColor: '#25479b'
  },
  FbImage: {
    width: 22,
    height: 20,
    marginRight: 5
  },
  FbText: {
    lineHeight: 48,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  }
});

const landingStyles = StyleSheet.create({
  FbButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
    marginTop: 10
  },
  FbImage: {
    width: 22,
    height: 20,
    marginRight: 25
  },
  FbText: {
    lineHeight: 40,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff'
  }
});
class FBLoginButton extends Component {
  state = {
    loginButtonDisabled: false
  };

  handleFacebookLogin = () => {
    this.setState({ loginButtonDisabled: true });
    LoginManager.logOut();
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then(result => {
        console.log(result);
        if (result.isCancelled) {
          this.setState({ loginButtonDisabled: false });
          Alert.alert('알림', '로그인이 취소 되었습니다.');
        } else {
          console.log('Login Passsed form Facebook');
          AccessToken.getCurrentAccessToken().then(data => {
            //alert( data.accessToken.toString() )
            // 페이스북 가입 완료된 상태
            // if (Platform.OS === 'android') {
            //   // 2018.10.29 facebook event: 마케팅 요청.
            //   const NativeConstants = Native.getConstants();
            //   const EVENT_NAME_COMPLETED_REGISTRATION =
            //     NativeConstants.EVENT_NAME_COMPLETED_REGISTRATION;
            //   const EVENT_PARAM_REGISTRATION_METHOD =
            //     NativeConstants.EVENT_PARAM_REGISTRATION_METHOD;
            //   AppEventsLogger.logEvent(EVENT_NAME_COMPLETED_REGISTRATION, {
            //     [EVENT_PARAM_REGISTRATION_METHOD]: 'facebook'
            //   });
            // }

            // firebase.analytics().logEvent('EVENT_NAME_COMPLETED_REGISTRATION', {
            //   'EVENT_PARAM_REGISTRATION_METHOD': 'facebook',
            //   'OS_TYPE':Platform.OS
            // });

            // AppEventsLogger.logEvent('WELAAARN_FACEBOOK_SIGN_UP');
            this.props.onAccess(data.accessToken.toString(), () => {
              this.setState({ loginButtonDisabled: false });
            });
          });
        }
      })
      .catch(error => {
        LoginManager.logOut();
        this.setState({ loginButtonDisabled: false });
        console.log(error);
        console.log('Login fail with error: ' + error.message);
        this.handleFacebookLogin(); // 성공할 때까지 시도
      });
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={this.handleFacebookLogin}
        disabled={this.state.loginButtonDisabled}
        style={styles.FbButtonWrap}
      >
        {this.props.type === 'login' && (
          <View style={loginStyles.FbButton} borderRadius={4}>
            <Image source={icFb} style={loginStyles.FbImage} />
            <Text style={loginStyles.FbText}>
              {this.state.loginButtonDisabled
                ? '로그인 중'
                : 'Facebook 계정으로'}
            </Text>
          </View>
        )}
        {this.props.type === 'landing' && (
          <View
            style={landingStyles.FbButton}
            borderWidth={1}
            borderStyle={'solid'}
            borderColor={'#ffffff'}
            borderRadius={4}
          >
            <Image source={icFbBox} style={landingStyles.FbImage} />
            <Text style={landingStyles.FbText}>
              {this.state.loginButtonDisabled
                ? '로그인 중'
                : '페이스북 계정으로'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

export default FBLoginButton;
