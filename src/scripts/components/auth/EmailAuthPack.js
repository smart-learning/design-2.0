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
    fontSize: 12,
    color: COLOR_PRIMARY
  }
});

@observer
class EmailAuthPack extends Component {
  data = createStore({
    email: '',
    password: '',
    loginButtonDisabled: false
  });

  handleLogin = () => {
    if (this.data.email === '') {
      Alert.alert('오류', '이메일은 필수 입력항목입니다.');
      return;
    }
    if (this.data.password === '') {
      Alert.alert('오류', '비밀번호는 필수 입력항목입니다.');
      return;
    }

    this.setState({ loginButtonDisabled: true });
    this.props.onAccess(this.data.email, this.data.password, () => {
      this.data.loginButtonDisabled = false;
    });
  };

  render() {
    return (
      <View style={styles.contentContainer}>
        <View borderRadius={4} style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            underlineColorAndroid={'rgba(0,0,0,0)'}
            value={this.data.email}
            placeholder="이메일"
            autoCapitalize={'none'}
            onSubmitEditing={Keyboard.dismiss}
            onChangeText={text => {
              this.data.email = text;
            }}
          />
          <View style={styles.inputBr} />
          <TextInput
            style={styles.input}
            underlineColorAndroid={'rgba(0,0,0,0)'}
            secureTextEntry={true}
            value={this.data.password}
            placeholder="패스워드"
            autoCapitalize={'none'}
            onSubmitEditing={Keyboard.dismiss}
            onChangeText={text => {
              this.data.password = text;
            }}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          disabled={this.data.loginButtonDisabled}
          onPress={this.handleLogin}
        >
          <View borderRadius={4} style={styles.btnSubmit}>
            <Text style={styles.textSubmit}>
              {this.data.loginButtonDisabled ? '로그인 중' : '이메일로  로그인'}
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

          <View style={{ marginLeft: 'auto' }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.props.onNavigate('SignUpPage')}
            >
              <Text style={styles.btnLinkText}>무료 계정만들기</Text>
            </TouchableOpacity>
          </View>
        </View>
        {!!globalStore.isKeyboardOn && <View style={{ height: 200 }} />}
      </View>
    );
  }
}

export default EmailAuthPack;
