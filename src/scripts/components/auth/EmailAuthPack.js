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
  View
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { COLOR_PRIMARY } from '../../../styles/common';
import createStore from '../../commons/createStore';
import globalStore from '../../commons/store';

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%'
  },
  inputWrap: {
    backgroundColor: '#ffffff'
  },
  inputBr: {
    width: '100%',
    height: 1,
    backgroundColor: '#d8d8d8'
  },
  input: {
    width: '100%',
    height: 40,
    paddingLeft: 15
  },
  btnSubmit: {
    width: '100%',
    height: 48,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: COLOR_PRIMARY
  },
  textSubmit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    lineHeight: 48,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  linkWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnLinkText: {
    fontSize: 14,
    color: COLOR_PRIMARY
  }
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
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
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

  @observable loading = false

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

    // 로딩 보이기
    this.loading = true

    // 시간 한계 주기
    setTimeout(() => {
      // 10초 후에 로딩이 아직도 떠 있다면
      if (this.loading) {
        // TODO: 확인이 필요 합니다. 
        // Alert.alert('오류', '관리자에게 문의 하거나 잠시 후 다시 시도해 주세요.')
        this.loading = false
      }
    }, 10000)
    this.props.onAccess(this.data.email, this.data.password, () => {
      this.loading = false
    });
  };

  render() {
    return (
      <View style={styles.contentContainer}>
        <Spinner // 로딩 인디케이터
          visible={this.loading}
        />
        <View borderRadius={4} style={styles.inputWrap}>
          <TextInput
            ref={this.login_id}
            style={styles.input}
            keyboardType="email-address"
            underlineColorAndroid={'rgba(0,0,0,0)'}
            value={this.data.email}
            placeholder="이메일"
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
            underlineColorAndroid={'rgba(0,0,0,0)'}
            secureTextEntry={true}
            value={this.data.password}
            placeholder="비밀번호"
            autoCapitalize={'none'}
            onSubmitEditing={() => { this.handleLogin() }}
            onChangeText={text => {
              this.data.password = text;
            }}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this.handleLogin}
        >
          <View borderRadius={4} style={styles.btnSubmit}>
            <Text style={styles.textSubmit}>
              이메일로 로그인
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.linkWrap}>
          {1 === 2 && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.props.onNavigate('FindPassword')}
            >
              <Text style={styles.btnLinkText}>비밀번호 찾기</Text>
            </TouchableOpacity>
          )}

          <View style={{ marginLeft: 'auto', marginTop: 14 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.props.onNavigate('SignUpPage')}
            >
              <Text style={styles.btnLinkText}>무료 계정만들기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default observer(EmailAuthPack);
