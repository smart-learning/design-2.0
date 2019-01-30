import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import _ from 'underscore';
import DummyTeacher from '../../../images/dummy-my-profile-2.png';
import IcClip from '../../../images/ic-detail-label-clip.png';
import IcFile from '../../../images/ic-detail-label-file.png';
import IcTime from '../../../images/ic-detail-label-time.png';
import CommonStyles, { COLOR_PRIMARY } from '../../../styles/common';
import Evaluation from './Evaluation';
import createStore from '../../commons/createStore';
import IcAngleDownGrey from '../../../images/ic-angle-down-grey.png';
import numeral from 'numeral';
import StarGrade from './StarGrade';
import ReviewForm from './ReviewForm';

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    paddingTop: '42%',
    paddingBottom: '42%',
  },
  info: {
    paddingTop: 30,
    paddingRight: 20,
    paddingBottom: 30,
    paddingLeft: 20,
  },
  sectionTitle: {
    marginBottom: 20,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#34342C',
  },
  infoTextNormal: {
    fontSize: 12,
    lineHeight: 20,
    color: '#353a3c',
  },
  lectureMoreButton: {
    textAlign: 'right',
    fontSize: 13,
    color: CommonStyles.COLOR_PRIMARY,
  },
  contentHrWrap: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  contentHr: {
    width: '100%',
    height: 1,
    backgroundColor: '#dddddd',
  },
  labelInfo: {
    paddingTop: 20,
    paddingRight: 25,
    paddingBottom: 20,
    paddingLeft: 25,
  },
  labelInfoItem: {
    alignItems: 'center',
    marginBottom: 7,
  },
  labelInfoImage: {
    width: 12,
    height: 12,
    marginRight: 7,
  },
  labelInfoText: {
    fontSize: 12,
    color: '#353A3C',
  },
  labelInfoSpanText: {
    color: CommonStyles.COLOR_PRIMARY,
  },
  author: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
  },
  review: {
    paddingTop: 30,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 30,
  },
  teacherContainer: {
    width: '100%',
    padding: 25,
    backgroundColor: '#ffffff',
  },
  teacherThumbnail: {
    position: 'absolute',
    left: 0,
    width: 75,
    height: 75,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: CommonStyles.COLOR_PRIMARY,
  },
  teacherTitle: {
    fontSize: 14,
    fontWeight: '200',
    color: '#4a4a4a',
    marginBottom: 5,
  },
  teacherHeadline: {
    fontSize: 13,
    fontWeight: 'normal',
    color: '#353A3C',
  },
  teacherName: {
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#353A3C',
  },
  teacherMemo: {},
  teacherMemoText: {
    paddingTop: 20,
    paddingBottom: 25,
    lineHeight: 20,
    color: '#353A3C',
    fontWeight: '200',
    fontSize: 12,
  },
  showMemoButtonText: {
    textAlign: 'right',
    fontSize: 14,
    color: '#a1a1a1',
  },
  memoContainer: {
    width: '100%',
    padding: 25,
  },
  memoTitle: {
    width: '100%',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4a4a4a',
  },
  memoBody: {
    width: '100%',
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 25,
    color: '#4a4a4a',
  },
  memoButton: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 7,
  },
  memoButtonText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#ffffff',
  },
  viewMoreContainer: {
    alignItems: 'center',
  },
  viewMore: {
    width: 50,
    height: 36,
    justifyContent: 'center',
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

class Data {
  @observable
  isMemoShow = false;
  @observable
  buttonTextStatus = true;
}

@observer
class TabContentInfo extends React.Component {
  @observable
  isContentMemoOpen = false;
  @observable
  isTeacherMemoOpen = false;

  componentDidMount() {
    let windowWidth = Dimensions.get('window').width;

    this.props.store.slideHeight = windowWidth * 0.833;
  }

  changeContentMemoViewMoreStatus = () => {
    this.isContentMemoOpen = !this.isContentMemoOpen;
  };
  changeTeacherMemoViewMoreStatus = () => {
    this.isTeacherMemoOpen = !this.isTeacherMemoOpen;
  };

  render() {
    const playTime = moment.duration(this.props.store.itemData.play_time);
    let infoImageSet = [];
    let teacherMemo = '';
    try {
      if (this.props.store.itemData.info_img_set) {
        infoImageSet = this.props.store.itemData.info_img_set;
      }
    } catch (error) {
      console.log(error);
    }

    try {
      if (!_.isNull(this.props.store.itemData.teacher)) {
        if (!_.isNull(this.props.store.itemData.teacher.memo)) {
          teacherMemo = this.props.store.itemData.teacher.memo;
          teacherMemo = teacherMemo.split('<br>').join('\n');
        }
      }
    } catch (error) {
      console.log(error);
    }

    return (
      <View>
        {/* 이미지 스와이퍼 */}
        {this.props.store.itemData.info_img_set.length > 0 && (
          <View style={{ height: this.props.store.slideHeight }}>
            {this.props.store.itemData.info_img_set.length > 0 && (
              <Swiper
                style={styles.wrapper}
                showsButtons={false}
                height={window.width}
                dotColor={'rgba(255,255,255,.3)'}
                activeDotColor={'#ffffff'}
                paginationStyle={{ bottom: 10 }}
              >
                {infoImageSet.map((item, key) => {
                  return (
                    <TouchableOpacity activeOpacity={0.9} key={key}>
                      <ImageBackground
                        source={{ uri: item }}
                        resizeMode="cover"
                        style={styles.thumbnail}
                      />
                    </TouchableOpacity>
                  );
                })}
              </Swiper>
            )}
          </View>
        )}
        {/* /이미지 스와이퍼 */}

        <View style={styles.labelInfo}>
          {this.props.learnType === 'class' && (
            <View style={[CommonStyles.alignJustifyFlex, styles.labelInfoItem]}>
              <Image style={styles.labelInfoImage} source={IcClip} />
              <Text style={styles.labelInfoText}>
                <Text style={styles.labelInfoSpanText}>
                  {this.props.store.itemData.clip_count}개
                </Text>
                의 강의
              </Text>
            </View>
          )}
          <View style={[CommonStyles.alignJustifyFlex, styles.labelInfoItem]}>
            <Image style={styles.labelInfoImage} source={IcTime} />
            <Text style={styles.labelInfoText}>
              전체 재생시간
              <Text style={styles.labelInfoSpanText}>
                {' '}
                {`${playTime.hours()}시간 ${playTime.minutes()}분`}
              </Text>
            </Text>
          </View>
          <View style={[CommonStyles.alignJustifyFlex, styles.labelInfoItem]}>
            <Image style={styles.labelInfoImage} source={IcFile} />
            <Text style={styles.labelInfoText}>
              다운로드 시 용량
              <Text style={styles.labelInfoSpanText}>
                {this.props.store.itemData.file_size} MB
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.contentHrWrap}>
          <View style={styles.contentHr} />
        </View>

        <View style={[CommonStyles.contentContainer, styles.info]}>
          <Text
            style={[
              styles.infoTextNormal,
              {
                height: this.isContentMemoOpen ? 'auto' : 80,
              },
            ]}
          >
            {`${this.props.store.itemData.memo.split('<br>').join('\n')}`}
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.viewMoreContainer, { paddingTop: 20 }]}
            onPress={this.changeContentMemoViewMoreStatus}
          >
            <View
              style={[styles.viewMore, CommonStyles.alignJustifyContentBetween]}
            >
              <Text style={styles.viewMoreText}>더보기</Text>
              <Image
                source={IcAngleDownGrey}
                style={[
                  styles.viewMoreIcon,
                  {
                    transform: this.isContentMemoOpen
                      ? [{ rotate: '180deg' }]
                      : [{ rotate: '0deg' }],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.contentHrWrap}>
          <View style={styles.contentHr} />
        </View>

        <View style={styles.author}>
          <Text style={styles.sectionTitle}>저자 소개</Text>
          <View style={{ position: 'relative', justifyContent: 'center' }}>
            {this.props.store.itemData.teacher !== null && (
              <Image
                source={{
                  uri: this.props.store.itemData.teacher
                    ? this.props.store.itemData.teacher.images.default
                    : DummyTeacher,
                }}
                style={styles.teacherThumbnail}
              />
            )}

            <View style={{ width: '100%', paddingLeft: 100 }}>
              {this.props.store.itemData.teacher !== null && (
                <View>
                  <Text style={styles.teacherName}>
                    {this.props.store.itemData.teacher.name
                      ? this.props.store.itemData.teacher.name
                      : ''}
                  </Text>
                  <Text style={styles.teacherHeadline}>
                    {this.props.store.itemData.teacher.headline}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.teacherMemo}>
            <Text
              style={[
                styles.teacherMemoText,
                {
                  height: this.isTeacherMemoOpen ? 'auto' : 125,
                },
              ]}
            >
              {teacherMemo}
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.viewMoreContainer}
              onPress={this.changeTeacherMemoViewMoreStatus}
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
                  style={[
                    styles.viewMoreIcon,
                    {
                      transform: this.isTeacherMemoOpen
                        ? [{ rotate: '180deg' }]
                        : [{ rotate: '0deg' }],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentHrWrap}>
          <View style={styles.contentHr} />
        </View>

        <View style={styles.review}>
          <View style={[CommonStyles.alignJustifyFlex, { marginBottom: 20 }]}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
              윌라 회원님들의 평가
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '200',
                color: '#898989',
                paddingLeft: 13,
              }}
            >
              {/* 댓글수 */}
              {numeral(
                this.props.store.itemData.meta
                  ? this.props.store.itemData.meta.comment_count
                  : this.props.store.itemData.review_count,
              ).format('0a')}
              개의 리뷰
            </Text>
          </View>

          <Evaluation itemData={this.props.store.itemData} />

          <StarGrade store={this.props.store} />

          <ReviewForm store={this.props.store} />
        </View>
      </View>
    );
  }
}

export default TabContentInfo;
