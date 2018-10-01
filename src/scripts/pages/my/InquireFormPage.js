import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CommonStyles from '../../../styles/common';
import net from '../../commons/net';
import { SafeAreaView } from 'react-navigation';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

const styles = StyleSheet.create({
  info: {
    padding: 15
  },
  infoText: {
    marginTop: 15,
    fontSize: 14,
    color: '#BBBBBE'
  },
  titleInput: {
    height: 40,
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bbbbbe'
  },
  contentInput: {
    height: 180,
    marginTop: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bbbbbe'
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
    marginTop: 20,
    backgroundColor: CommonStyles.COLOR_PRIMARY
  },
  submitButtonText: {
    fontSize: 15,
    color: '#ffffff'
  }
});

class UselessTextInput extends React.Component {
  render() {
    return (
      <TextInput
        {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable={true}
        underlineColorAndroid={'rgba(0,0,0,0)'}
      />
    );
  }
}

@observer
export default class InquireFormPage extends React.Component {
  @observable
  title = null;
  @observable
  content = null;
  @observable
  isSubmitStatus = false;

  submitContent = async (title, message) => {
    if (!this.title.text || !this.content.text) {
      Alert.alert('오류', '제목과 내용을 입력해주세요.');
    }

    let result = await net.postInqueryItem(this.title.text, this.content.text);
    this.isSubmitStatus = true;

    if (result) {
      Alert.alert('알림', '1:1 문의가 등록되었습니다');
      this.props.navigation.state.params.fetchInquiries();
    } else {
      Alert.alert('오류', '1:1 문의 등록 중 오류가 발생하였습니다');
      this.isSubmitStatus = false;
    }

    this.props.navigation.navigate('InquireListPage');
  };

  componentDidMount() {
    this.isSubmitStatus = false;
  }

  render() {
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.info}>
              <Text style={styles.infoText}>
                윌라를 이용하시면서 불편하신 점이 있으신가요? 아니면 새로운
                기능이 있었으면 좋겠다구요?
              </Text>
              <Text style={styles.infoText}>
                그렇다면 1:1문의를 이용해 주세요. 고객님의 의견을 토대로 더 나은
                윌라를 만들어 가겠습니다.
              </Text>
            </View>
            <View style={CommonStyles.contentContainer}>
              <Text style={styles.label}>제목</Text>
              <View style={styles.titleInput} borderRadius={5}>
                <TextInput
                  style={styles.input}
                  value={this.title}
                  underlineColorAndroid={'rgba(0,0,0,0)'}
                  onChangeText={text => (this.title = { text })}
                />
              </View>
              <Text style={styles.label}>내용</Text>
              <View style={styles.contentInput} borderRadius={5}>
                <UselessTextInput
                  multiline={true}
                  numberOfLines={8}
                  onChangeText={text => (this.content = { text })}
                  value={this.content}
                />
              </View>
              {!!this.isSubmitStatus ? (
                <View style={styles.submitButton} borderRadius={5}>
                  <Text style={styles.submitButtonText}>등록중입니다</Text>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={this.submitContent}
                >
                  <View style={styles.submitButton} borderRadius={5}>
                    <Text style={styles.submitButtonText}>등록</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
