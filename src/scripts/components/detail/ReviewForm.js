import React from 'react';
import { observer } from 'mobx-react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import IcStarPrimary from '../../../images/ic-star-primary.png';
import IcStarGrey from '../../../images/ic-star-grey2.png';
import IcAngleDownGrey from '../../../images/ic-angle-down-grey.png';

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 30,
  },
  reviewText: {
    fontSize: 12,
    fontWeight: '200',
    color: '#A7A7A7',
  },
  viewMoreContainer: {
    alignItems: 'center',
  },
  viewMore: {
    width: 60,
    height: 36,
    marginTop: 10,
    marginBottom: 22,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 12,
    color: '#888888',
  },
  viewMoreIcon: {
    position: 'relative',
    top: 4,
  },
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
class ReviewForm extends React.Component {
  render() {
    return (
      <View style={styles.contentContainer}>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#353A3C' }}>
          리뷰 남기기
        </Text>
        <View
          style={{
            width: '100%',
            height: 1,
            marginVertical: 15,
            backgroundColor: '#E2E2E2',
          }}
        />

        <View>
          <View>
            <View>
              <View style={CommonStyles.alignJustifyFlex}>
                <Text
                  style={[
                    styles.reviewText,
                    { width: 80, color: CommonStyles.COLOR_PRIMARY },
                  ]}
                >
                  asdf
                </Text>
                <Text
                  style={[
                    styles.reviewText,
                    { color: CommonStyles.COLOR_PRIMARY },
                  ]}
                >
                  2019.01.21. 15:46
                </Text>
                {1 === 2 && (
                  <View style={{ marginLeft: 'auto' }}>
                    <TouchableOpacity>
                      <View
                        style={{
                          width: 40,
                          height: 18,
                          backgroundColor: CommonStyles.COLOR_PRIMARY,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '400',
                            color: '#ffffff',
                          }}
                        >
                          수정
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <Text style={{ marginTop: 10, fontsize: 14, color: '#353A3C' }}>
              4차 산업혁명이 우리와 얼마나 깊은 연관이 있는지 알게 되었습니다.
              좋은 강연 감사합니다!
            </Text>
          </View>

          <View
            style={{
              width: '100%',
              height: 1,
              marginVertical: 15,
              backgroundColor: '#E2E2E2',
            }}
          />

          <View>
            <View>
              <View style={CommonStyles.alignJustifyFlex}>
                <Text style={[styles.reviewText, { width: 80 }]}>asdf</Text>
                <Text style={styles.reviewText}>2019.01.21. 15:46</Text>
              </View>
            </View>
            <Text style={{ marginTop: 10, fontsize: 14, color: '#353A3C' }}>
              4차 산업혁명이 우리와 얼마나 깊은 연관이 있는지 알게 되었습니다.
              좋은 강연 감사합니다!
            </Text>

            <View
              style={{
                width: '100%',
                height: 1,
                marginVertical: 15,
                backgroundColor: '#E2E2E2',
              }}
            />
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.viewMoreContainer}>
          <View
            style={[styles.viewMore, CommonStyles.alignJustifyContentBetween]}
          >
            <Text style={styles.viewMoreText}>더보기</Text>
            <Image source={IcAngleDownGrey} style={[styles.viewMoreIcon]} />
          </View>
        </TouchableOpacity>

        <View>
          <View
            style={[
              CommonStyles.alignJustifyContentBetween,
              { height: 54, borderWidth: 1, borderColor: '#B9B9B9' },
            ]}
            borderRadius={4}
          >
            <View style={{ flex: 1 }}>
              <UselessTextInput
                multiline={true}
                numberOfLines={2}
                onChangeText={text => (this.props.store.reviewText = { text })}
                value={this.props.store.reviewText}
              />
            </View>
            <TouchableOpacity activeOpacity={0.9}>
              <View
                style={{
                  width: 50,
                  height: 54,
                  backgroundColor: CommonStyles.COLOR_PRIMARY,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 4,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: '400', color: '#ffffff' }}
                >
                  등록
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default ReviewForm;
