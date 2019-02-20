import React from 'react';
import { observer } from 'mobx-react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import createStore from '../../commons/createStore';
import IcStarPrimary from '../../../images/ic-star-primary.png';
import IcStarGrey from '../../../images/ic-star-grey2.png';
import IcAngleDownGrey from '../../../images/ic-angle-down-grey2.png';
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
    width: 55,
    height: 36,
    marginTop: 20,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 12,
    color: '#888888',
  },
  viewMoreIcon: {
    position: 'relative',
    top: 1,
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

class ReviewInput extends React.Component {
  state = {
    reviewText: '',
    isSubmitStatus: false,
  };
  componentDidMount() {
    this.setState({ isSubmitStatus: false });
  }

  onChangeText = text => {
    this.setState({ reviewText: text });
    this.props.store.reviewText = text;
  };

  clearReviewText = () => {
    this.setState({ reviewText: '' });
  };

  reviewSubmit = async () => {
    this.setState({ isSubmitStatus: true });
    if (this.props.store.reviewText === '') {
      this.setState({ isSubmitStatus: false });
      Alert.alert('Error', this.props.talkText + '을 입력해주세요');
      return false;
    } else if (this.props.formType === 'create') {
      try {
        let result = await net.postReview(
          this.props.store.cid,
          this.props.store.reviewText,
        );
        await net.postStarCount(
          this.props.store.cid,
          this.props.store.reviewStar,
        );

        if (result) {
          // 코멘트 다시 로드
          const comments = await net.getReviewList(this.props.store.cid);
          this.props.store.itemReviewData = comments;
          // 별점 다시 로드
          const evaluation = await net.getItemEvaluation(this.props.store.cid);
          this.props.store.itemEvaluationData = evaluation;
          this.setState({ isSubmitStatus: false });
        } else {
          Alert.alert(
            '오류',
            this.props.talkText + '을 등록 중 오류가 발생하였습니다',
          );
          this.setState({ isSubmitStatus: false });
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', error.message);
      }
    } else if (this.props.formType === 'put') {
      if (this.props.store.reviewText === '') {
        Alert.alert('Error', this.props.talkText + '을 입력해주세요');
        return false;
      } else {
        try {
          this.setState({ isSubmitStatus: true });

          let result = await net.putReview(
            this.props.store.myReviewId,
            this.props.store.reviewText,
          );

          if (result) {
            Alert.alert('알림', this.props.talkText + '이 수정되었습니다');
            this.props.store.isReviewUpdate = false;
            this.setState({ isSubmitStatus: false });
            // 코멘트 다시 로드
            const comments = await net.getReviewList(this.props.store.cid);
            this.props.store.itemReviewData = comments;
          } else {
            Alert.alert(
              '오류',
              this.props.talkText + '을 수정 중 오류가 발생하였습니다',
            );
            Alert.alert('오류', '리뷰 등록 중 오류가 발생하였습니다');
            this.setState({ isSubmitStatus: false });
          }
        } catch (error) {
          console.log(error);
          Alert.alert('Error', error.message);
        }
      }
    }
  };
  render() {
    return (
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
            onChangeText={this.onChangeText}
            value={
              this.props.store.formType === 'create'
                ? this.state.reviewText
                : this.props.store.reviewText
            }
          />
        </View>
        {!!this.state.isSubmitStatus ? (
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
        ) : (
          <TouchableOpacity activeOpacity={0.9} onPress={this.reviewSubmit}>
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
        )}
      </View>
    );
  }
}

@observer
class ReviewForm extends React.Component {
  data = createStore({
    myReviewContent: '',
  });

  changeMyReviewStatus = item => {
    this.props.store.isReviewUpdate = true;
    this.props.store.myReviewId = item.id;
    this.props.store.reviewText = item.content ? item.content : '';
  };

  removeMyReview = async item => {
    this.data.myReviewId = item.id;
    Alert.alert(
      'Message',
      '삭제하시겠습니까',
      [
        {
          text: '취소',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              await net.deleteReview(this.data.myReviewId);
              // 코멘트 다시 로드
              const comments = await net.getReviewList(this.props.store.cid);
              this.props.store.itemReviewData = comments;
              this.props.store.reviewText = '';
              this.reviewInput.clearReviewText();
              Alert.alert('Message', '삭제되었습니다.');
            } catch (error) {
              console.log(error);
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  render() {
    let itemData = this.props.store.itemReviewData;

    return (
      <View>
        {itemData && (
          <View style={styles.contentContainer}>
            {itemData.my && itemData.my.length === 0 && (
              <ReviewInput
                {...this.props}
                formType={'create'}
                ref={ref => (this.reviewInput = ref)}
              />
            )}

            <View style={{ height: 30 }} />

            <Text
              style={{ fontSize: 17, fontWeight: 'bold', color: '#353A3C' }}
            >
              {this.props.talkText + ' 남기기'}
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
                                {
                                  color: CommonStyles.COLOR_PRIMARY,
                                },
                              ]}
                            >
                              {moment(item.created_at).format(
                                'YYYY. MM. DD HH:mm',
                              )}
                            </Text>
                            <View style={{ marginLeft: 'auto' }}>
                              {!this.props.store.isReviewUpdate ? (
                                <View style={CommonStyles.alignJustifyFlex}>
                                  <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                      this.changeMyReviewStatus(item);
                                    }}
                                  >
                                    <View
                                      style={{
                                        width: 40,
                                        height: 18,
                                        borderWidth: 1,
                                        borderColor: CommonStyles.COLOR_PRIMARY,
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
                                  <View style={{ width: 7 }} />
                                  <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => {
                                      this.removeMyReview(item);
                                    }}
                                  >
                                    <View
                                      style={{
                                        width: 40,
                                        height: 18,
                                        borderWidth: 1,
                                        borderColor: CommonStyles.COLOR_PRIMARY,
                                        backgroundColor: '#ffffff',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Text
                                        style={{
                                          fontSize: 11,
                                          fontWeight: '400',
                                          color: CommonStyles.COLOR_PRIMARY,
                                        }}
                                      >
                                        삭제
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <View />
                              )}
                            </View>
                          </View>
                        </View>

                        <View style={{ marginTop: 10 }}>
                          {!this.props.store.isReviewUpdate ? (
                            <Text
                              style={{
                                fontSize: 14,
                                color: '#353A3C',
                              }}
                            >
                              {item.content ? item.content : ''}
                            </Text>
                          ) : (
                            <ReviewInput {...this.props} formType={'put'} />
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {itemData.all && itemData.all.length > 0 && (
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
                                  'YYYY. MM. DD HH:mm',
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
              )}
              {itemData.all?.length === 0 && itemData.my?.length === 0 && (
                <View
                  style={{
                    height: 170,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14, color: '#353A3C' }}>
                    {this.props.talkText + '이 없습니다'}
                  </Text>
                </View>
              )}
              {itemData.all?.length !== 0 &&
                !!this.props.store.pagination['has-next'] &&
                !this.props.store.isReviewLoading && (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.viewMoreContainer}
                    onPress={() =>
                      this.props.store.loadReview(
                        this.props.store.pagination['next-page'],
                      )
                    }
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
              {this.props.store.isReviewLoading && <ActivityIndicator />}
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
        )}
      </View>
    );
  }
}

export default ReviewForm;
