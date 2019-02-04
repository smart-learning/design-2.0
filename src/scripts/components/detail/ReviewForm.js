import React from 'react';
import { observer } from 'mobx-react';
import {
  Alert,
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
import moment from 'moment';
import net from '../../commons/net';

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 20,
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
  reviewSubmit = async () => {
    if (this.props.store.reviewText === '') {
      Alert.alert('Error', '리뷰를 입력 해주세요.');
      return false;
    } else {
      try {
        await net.postReview(this.props.store.cid, this.props.store.reviewText);
        await net.postStarCount(
          this.props.store.cid,
          this.props.store.reviewStar,
        );
        // 코멘트 다시 로드
        const comments = await net.getReviewList(this.props.store.cid);
        this.props.store.itemReviewData = comments;
        // 별점 다시 로드
        const evaluation = await net.getItemEvaluation(
          this.props.store.cid.cid,
        );
        this.data.itemEvaluationData = evaluation;
      } catch (error) {
        console.log(error);
        Alert.alert('Error', error.message);
      }
    }
  };

  render() {
    let itemData = this.props.store.itemReviewData;

    return (
      <View>
        {itemData && (
          <View style={styles.contentContainer}>
            <Text
              style={{ fontSize: 17, fontWeight: 'bold', color: '#353A3C' }}
            >
              리뷰 남기기
            </Text>

            <View>
              {/*내가 쓴 댓글*/}
              {itemData.my && itemData.my.length > 0 && (
                <View>
                  {itemData.my.map((item, key) => {
                    return (
                      <View key={key}>
                        <View
                          style={{
                            width: '100%',
                            height: 1,
                            marginVertical: 15,
                            backgroundColor: '#E2E2E2',
                          }}
                        />
                        <View>
                          <View style={CommonStyles.alignJustifyFlex}>
                            <Text
                              style={[
                                styles.reviewText,
                                {
                                  width: 80,
                                  color: CommonStyles.COLOR_PRIMARY,
                                },
                              ]}
                            >
                              {item.member?.name}
                            </Text>
                            <Text
                              style={[
                                styles.reviewText,
                                { color: CommonStyles.COLOR_PRIMARY },
                              ]}
                            >
                              {moment(item.created_at).format(
                                'YYYY. MM. DD hh:mm',
                              )}
                            </Text>
                            {1 === 2 && (
                              <View style={{ marginLeft: 'auto' }}>
                                <TouchableOpacity>
                                  <View
                                    style={{
                                      width: 40,
                                      height: 18,
                                      backgroundColor:
                                        CommonStyles.COLOR_PRIMARY,
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

                        <View style={{ marginTop: 10 }}>
                          <Text style={{ fontSize: 14, color: '#353A3C' }}>
                            {item.content ? item.content : ''}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {itemData.all && itemData.all.length > 0 ? (
                <View>
                  {itemData.all.map((item, key) => {
                    return (
                      <View key={key}>
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
                              <Text style={[styles.reviewText, { width: 80 }]}>
                                {item.member !== null
                                  ? item.member?.name
                                  : '익명'}
                              </Text>
                              <Text style={styles.reviewText}>
                                {moment(item.created_at).format(
                                  'YYYY. MM. DD hh:mm',
                                )}
                              </Text>
                            </View>
                          </View>
                          <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 14, color: '#353A3C' }}>
                              {item.content ? item.content : ''}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View
                  style={{
                    height: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14, color: '#353A3C' }}>
                    리뷰가 없습니다.
                  </Text>
                </View>
              )}
              <View
                style={{
                  width: '100%',
                  height: 1,
                  marginVertical: 15,
                  backgroundColor: '#E2E2E2',
                }}
              />
            </View>

            {1 === 2 && (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.viewMoreContainer}
              >
                <View
                  style={[
                    styles.viewMore,
                    CommonStyles.alignJustifyContentBetween,
                  ]}
                >
                  <Text style={styles.viewMoreText}>더보기</Text>
                  <Image
                    source={IcAngleDownGrey}
                    style={[styles.viewMoreIcon]}
                  />
                </View>
              </TouchableOpacity>
            )}

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
                    onChangeText={text =>
                      (this.props.store.reviewText = { text })
                    }
                    value={this.props.store.reviewText}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={this.reviewSubmit}
                >
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
                      style={{
                        fontSize: 12,
                        fontWeight: '400',
                        color: '#ffffff',
                      }}
                    >
                      등록
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default ReviewForm;
