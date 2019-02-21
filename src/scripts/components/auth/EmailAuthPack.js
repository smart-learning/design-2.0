import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLOR_PRIMARY } from '../../../styles/common';
import createStore from '../../commons/createStore';
import globalStore from '../../commons/store';

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
  },
  inputWrap: {
    backgroundColor: '#00C73C',
  },
  inputBr: {
    width: '100%',
    height: 1,
  },
  input: {
    width: '100%',
    height: 40,
    color: 'white',
    paddingLeft: 15,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
  },
  btnSubmit: {
    width: '100%',
    height: 48,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  textSubmit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    lineHeight: 48,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#00C73C',
  },
  linkWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnLinkText: {
    fontSize: 14,
    color: '#ffffff',
  },
  ruleButton: {
    position: 'relative',
    top: 1,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  ruleWrap: {
    marginTop: 15,
    alignItems: 'center',
  },
  ruleTextContainer: {
    flexDirection: 'row',
  },
  ruleText: {
    fontSize: 17,
    color: '#ffffff',
    textAlign: 'center',
  },
  ruleTextBottom: {
    marginTop: 60,
    fontSize: 14,
    color: '#ffffff',
  },
  ruleButtonBottom: {
    marginTop: 60,
    position: 'relative',
    top: 1,
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
});

class EmailAuthPack extends Component {
  constructor(props) {
    super(props);

    this.login_id = React.createRef();
    this.login_pw = React.createRef();
  }

  data = createStore({
    email: '',
    password: '',
  });

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    console.log('_keyboardDidShow');
    this.props.onKeyboardStatus(true);
  };

  _keyboardDidHide = () => {
    console.log('_keyboardDidHide');
    this.props.onKeyboardStatus(false);
  };

  handleLogin = () => {
    // 밸리데이션
    if (this.data.email === '') {
      Alert.alert('오류', '이메일은 필수 입력항목입니다.');
      return;
    }
    if (this.data.password === '') {
      Alert.alert('오류', '비밀번호는 필수 입력항목입니다.');
      return;
    }

    this.props.onAccess(this.data.email, this.data.password, () => {});
  };

  render() {
    return (
      <View style={styles.contentContainer}>
        <View borderRadius={4} style={styles.inputWrap}>
          <TextInput
            ref={this.login_id}
            style={styles.input}
            selectionColor="#fff"
            keyboardType="email-address"
            underlineColorAndroid={'rgba(0,0,0,0)'}
            value={this.data.email}
            placeholder="이메일"
            placeholderTextColor="#ffffff"
            autoCapitalize={'none'}
            onSubmitEditing={() => this.login_pw.current.focus()}
            onChangeText={text => {
              this.data.email = text;
            }}
          />
          <View style={styles.inputBr} />
          <TextInput
            ref={this.login_pw}
            style={styles.input}
            selectionColor="#fff"
            underlineColorAndroid={'rgba(0,0,0,0)'}
            secureTextEntry={true}
            value={this.data.password}
            placeholder="비밀번호"
            placeholderTextColor="#ffffff"
            autoCapitalize={'none'}
            onSubmitEditing={() => {
              this.handleLogin();
            }}
            onChangeText={text => {
              this.data.password = text;
            }}
          />
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={this.handleLogin}>
          <View borderRadius={30} style={styles.btnSubmit}>
            <Text style={styles.textSubmit}>이메일로 로그인</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.ruleWrap}>
          <View style={styles.linkWrap}>
            {1 === 2 && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.onNavigate('FindPassword')}
              >
                <Text style={styles.btnLinkText}>비밀번호 찾기</Text>
              </TouchableOpacity>
            )}

            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleText}>윌라가 처음이신가요? </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.onNavigate('SignUpPage')}
              >
                <Text
                  style={styles.ruleButton}
                  textDecorationLine={'underline'}
                >
                  회원가입
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2019.02.21 김중온 기능 미구현 임시 삭제 */}
        {1 === 2 && (
          <View style={styles.ruleWrap}>
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTextBottom}>
                윌라 서비스 이용/제휴문의{' '}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                // onPress={() => this.props.navigation.navigate('PrivacyPage')}
              >
                <Text
                  style={styles.ruleButtonBottom}
                  textDecorationLine={'underline'}
                >
                  문의하기 >
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default observer(EmailAuthPack);
