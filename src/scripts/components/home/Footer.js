import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import CommonStyles from '../../../styles/common';

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#F2F2F2',
    paddingTop: 30,
    paddingBottom: 80,
    paddingLeft: 15,
    paddingRight: 15,
  },
  footerTextImportant: {
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#878788',
  },
  footerLinkText: {
    marginRight: 7,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#878788',
  },
});

class Footer extends React.Component {
  render() {
    return (
      <View style={styles.footerContainer}>
        <View>
          <Text style={[styles.footerText, styles.footerTextImportant]}>
            ㈜ 인플루엔셜 | 대표이사: 문태진
          </Text>
          <Text style={styles.footerText}>
            주소: (06040)서울특별시 강남구 도산대로 156 제이콘텐트리빌딩 7층
          </Text>
          <Text style={styles.footerText}>
            고객센터 : 02-6206-3237 | FAX: 02-720-1043
          </Text>
          <Text style={styles.footerText}>사업자등록번호 220-87-65006</Text>
          <Text style={styles.footerText}>
            통신판매업 신고번호 제 2015-서울종로-0405호
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={CommonStyles.alignJustifyFlex}>
            <View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.props.navigation.navigate('InquireFormPage')
                }
              >
                <Text style={styles.footerLinkText}>콘텐츠 제안</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.footerLinkText}>|</Text>
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.navigation.navigate('PolicyPage')}
              >
                <Text style={styles.footerLinkText}>이용약관</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.footerLinkText}>|</Text>
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this.props.navigation.navigate('PrivacyPage')}
              >
                <Text style={styles.footerLinkText}>개인정보 취급방침</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Footer;
