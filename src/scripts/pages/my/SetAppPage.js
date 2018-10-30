import { observer } from 'mobx-react';
import React from 'react';
import {
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import globalStore from '../../../scripts/commons/store';
import CommonStyles from '../../../styles/common';
import Native from '../../commons/native';

const styles = StyleSheet.create({
  title: {
    paddingTop: 35,
    paddingBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
  },
  setBox: {
    width: '100%',
    alignItems: 'center',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#ffffff'
  },
  setContent: {
    width: '100%',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    color: '#000000'
  },
  logoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginTop: 25,
    marginBottom: 25,
    backgroundColor: '#dbdbdb'
  },
  logoutText: {
    fontSize: 16,
    color: '#000000'
  }
});

@observer
class SetAppPage extends React.Component {
  logout = () => {
    globalStore.clearTokens();
    this.props.navigation.navigate('Login');
    Native.doThingAfterLogout();
  };

  setIsAutoLoginChange = value => {
    AsyncStorage.setItem('config::isAutoLogin', value.toString());
    globalStore.appSettings.isAutoLogin = value;
  };

  setIsWifiPlayChange = value => {
    AsyncStorage.setItem('config::isWifiPlay', value.toString());
    globalStore.appSettings.isWifiPlay = value;
    Native.updateSettings();
  };
  setIsWifiDownloadChange = value => {
    AsyncStorage.setItem('config::isWifiDownload', value.toString());
    globalStore.appSettings.isWifiDownload = value;
    Native.updateSettings();
  };
  setIsAlertChange = value => {
    AsyncStorage.setItem('config::isAlert', value.toString());
    globalStore.appSettings.isAlert = value;
    Native.updateSetting('alert', value);
  };
  setIsEmailChange = value => {
    AsyncStorage.setItem('config::isEmail', value.toString());
    globalStore.appSettings.isEmail = value;
    Native.updateSetting('email', value);
  };

  render() {
    return (
      <View style={CommonStyles.container}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={CommonStyles.contentContainer}>
              {/* <Text style={styles.title}>로그인설정</Text>
						<View style={styles.setBox}>
							<View style={[CommonStyles.alignJustifyContentBetween, styles.setContent]}>
								<View>
									<Text style={styles.label}>자동로그인</Text>
								</View>
								<View style={styles.switch}>
									<Switch value={globalStore.appSettings.isAutoLogin}
											onValueChange={this.setIsAutoLoginChange}/>
								</View>
							</View>
						</View> */}
              <Text style={styles.title}>재생설정</Text>
              <View style={styles.setBox}>
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.setContent
                  ]}
                >
                  <View>
                    <Text style={styles.label}>Wifi에서만 재생</Text>
                  </View>
                  <View style={styles.switch}>
                    <Switch
                      value={globalStore.appSettings.isWifiPlay}
                      onValueChange={this.setIsWifiPlayChange}
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.title}>다운로드</Text>
              <View style={styles.setBox}>
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.setContent
                  ]}
                >
                  <View>
                    <Text style={styles.label}>Wifi에서만 다운</Text>
                  </View>
                  <View style={styles.switch}>
                    <Switch
                      value={globalStore.appSettings.isWifiDownload}
                      onValueChange={this.setIsWifiDownloadChange}
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.title}>알림</Text>
              <View style={styles.setBox}>
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.setContent
                  ]}
                >
                  <View>
                    <Text style={styles.label}>원격푸쉬알림허용</Text>
                  </View>
                  <View style={styles.switch}>
                    <Switch
                      value={globalStore.appSettings.isAlert}
                      onValueChange={this.setIsAlertChange}
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.title}>이메일수신동의</Text>
              <View style={styles.setBox}>
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.setContent
                  ]}
                >
                  <View>
                    <Text style={styles.label}>이메일수신동의</Text>
                  </View>
                  <View style={styles.switch}>
                    <Switch
                      value={globalStore.appSettings.isEmail}
                      onValueChange={this.setIsEmailChange}
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.title}>버전정보</Text>
              <View style={styles.setBox}>
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.setContent
                  ]}
                >
                  <View>
                    <Text style={styles.label}>
                      현재버전 {Native.getConstants().versionNumber}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={this.logout}>
                <View style={styles.logoutButton}>
                  <Text style={styles.logoutText}>로그아웃</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default SetAppPage;
