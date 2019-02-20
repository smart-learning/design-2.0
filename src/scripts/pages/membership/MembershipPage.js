import { observe } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppEventsLogger } from 'react-native-fbsdk';
import Swiper from 'react-native-swiper';
import { SafeAreaView } from 'react-navigation';
import IcClub from '../../../images/ic-m-audiobookclub.png';
import IcCampus from '../../../images/ic-m-campus.png';
import IcPremium from '../../../images/ic-m-premium.png';
import CommonStyles from '../../../styles/common';
import native from '../../commons/native';
import net from '../../commons/net';
import globalStore from '../../commons/store';

const styles = StyleSheet.create({
  membershipHeader: {
    width: '100%',
    height: 140,
  },
  membershipDescription: {
    width: '100%',
    height: 108,
  },
  membershipButton: {
    width: '100%',
    height: 34,
    marginBottom: 11,
  },
  membershipBody: {
    width: '100%',
    height: 403,
  },
  sectionTitle: {
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34342C',
  },
  sectionSubTitle: {
    paddingBottom: 7,
    fontSize: 14,
    color: '#34342C',
  },
  sectionList: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionListItem: {
    position: 'relative',
  },
  sectionListItemBullet: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 4,
    height: 4,
    backgroundColor: '#34342C',
  },
  sectionListItemText: {
    paddingLeft: 15,
    fontSize: 14,
    color: '#34342C',
  },
  sectionListItemTextImportant: {
    fontSize: 14,
    color: CommonStyles.COLOR_PRIMARY,
  },
  ruleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
    width: '100%',
    height: 40,
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  ruleButtonText: {
    fontSize: 14,
    color: '#ffffff',
  },
  pageTitle: {
    paddingTop: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 24,
    color: '#34342C',
  },
  paragraphBox: {
    marginBottom: 30,
  },
  paragraphText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff',
  },
  paragraphImportantText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ffffff',
  },
  membershipBox: {
    position: 'relative',
    paddingTop: 25,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: '#00C73C',
  },
  membershipCampusBox: {
    position: 'relative',
    paddingTop: 25,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: '#00C73C',
  },
  membershipAudioBookBox: {
    position: 'relative',
    paddingTop: 25,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: '#AEC90B',
  },
  membershipBackGroundBox: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#EDEDED',
  },
  membershipPremiumBox: {
    position: 'relative',
    paddingTop: 25,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: '#A98151',
  },
  membershipIcon: {
    alignItems: 'center',
    position: 'relative',
    width: 55,
    height: 55,
  },
  membershipTitle: {
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  membershipCampusTitle: {
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  membershipAudioBookClubTitle: {
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  membershipPremiumTitle: {
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  membershipParagraphBox: {
    marginBottom: 20,
  },
  membershipParagraphTitle: {
    marginTop: 10,
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  membershipParagraph: {
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
  },
  memberShipButton: {
    alignItems: 'center',
    height: 65,
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  memberShipCampusButton: {
    alignItems: 'center',
    height: 65,
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#49ac41',
  },
  memberShipAudioBookButton: {
    alignItems: 'center',
    height: 65,
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#afca0b',
  },
  memberShipPremiumButton: {
    alignItems: 'center',
    height: 65,
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#a88050',
  },
  memberShipButtonTitle: {
    fontSize: 18,
    color: '#ffffff',
  },
  memberShipButtonParagraph: {
    fontSize: 12,
    color: '#f0f0f0',
  },
  priceBox: {
    paddingLeft: 15,
  },
  membershipPrice: {
    fontSize: 16,
    color: '#34342C',
  },
  membershipSalePrice: {
    fontSize: 14,
    color: '#dddddd',
    textDecorationLine: 'line-through',
  },
  cancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#ffffff',
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#00C73C',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00C73C',
  },
  tripAroundButton: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

@observer
export default class MembershipPage extends React.Component {
  constructor(props) {
    super(props);

    this.props.navigation.setParams({ title: '나의 멤버십 현황' });

    this.state = {
      ads: [],
      bannerWidth: 0,
      bannerHeight: 0,
    };
  }

  componentDidMount = async () => {
    this.disposer = observe(globalStore.buyResult, change => {
      if ('success' === change.name && change.newValue) {
        globalStore.buyResult.success = false;
        // HomeScreen.js 로 이동 혹은 Back
        // -> 이전 화면으로 돌아갔을 때 멤버십 갱신되도록 아래와 같이 수정. 2018.11.22
        this.props.navigation.navigate('HomeScreen', {
          reload_mbs: true,
        });
      }
    });

    let data = await net.getMembershipBanner();
    if (data === null || data.length === 0) return;

    let ads = [];
    data.forEach((ad, idx) => {
      ads.push(ad);
    });
    this.setState({ ads: ads });
  };

  componentWillUnmount() {
    this.disposer();
  }

  //멤버십 해지
  cancelMembershipConfirm() {
    let _this = this;
    Alert.alert(
      '멤버십 구독 해지',
      '멤버십을 해지 하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '네',
          onPress: () => {
            if (Platform.OS === 'ios') native.unsubscribe();
            else this.cancelMembershipProc();
          },
        },
      ],
      { cancelable: false },
    );
  }

  cancelMembershipProc = async () => {
    const membership_info = await net.cancelMembership();

    if (membership_info.status === true) {
      globalStore.currentMembership.stop_payment = true;
      Alert.alert(
        '안내',
        '멤버십 정기 구독이 해지되었습니다. 남아있는 기간동안 해당 멤버십 사용이 가능합니다.',
        [
          {
            text: '확인',
            onPress: () => this.props.navigation.navigate('HomeScreen'),
          },
        ],
      );
    } else {
      Alert.alert('안내', '이미 멤버십 정기 구독이 해지되었습니다.', [
        {
          text: '확인',
          onPress: () => this.props.navigation.navigate('HomeScreen'),
        },
      ]);
    }
  };

  render() {
    // 멤버십 페이지 랜더 시점 호출
    AppEventsLogger.logEvent('WELAAARN_MEMBERSHIP_PAGE');
    // 멤버쉽이 존재할 경우
    if (
      globalStore.currentMembership &&
      globalStore.currentMembership.type_text
    ) {
      return this._renderMembership();
    } else {
      if ('android' === Platform.OS) {
        return this._renderNonMembershipAndroid();
      } else {
        return this._renderNonMembershipIOS();
      }
    }
  }

  _renderMembership() {
    const { paid_membership: paidMembership } = globalStore.currentMembership;

    return (
      <SafeAreaView
        style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}
      >
        <ScrollView style={{ width: '100%' }}>
          <View style={{ marginLeft: 0, marginRight: 0, marginTop: 0 }}>
            {globalStore.currentMembership.type === 1 ? (
              <View style={styles.membershipBackGroundBox}>
                <View style={styles.membershipCampusBox}>
                  <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image source={IcCampus} style={styles.membershipIcon} />
                  </View>

                  <Text style={styles.membershipCampusTitle}>
                    윌라 클래스 멤버십
                </Text>
                  <View style={styles.membershipParagraphBox}>
                    <Text style={styles.membershipParagraphTitle}>
                      클래스
                  </Text>
                    <Text style={styles.membershipParagraph}>
                      1,000여개의 동영상 강좌 무제한 이용
                  </Text>
                  </View>
                  {/* <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipCampusButton,
                    { height: 40 },
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonParagraph}>
                      가입일:{' '}
                      {moment(globalStore.currentMembership.start_at).format(
                        'YYYY-MM-DD',
                      )}
                    </Text>
                  </View>
                </View> */}
                </View>
              </View>
            ) : (
                undefined
              )}

            {globalStore.currentMembership.type === 2 ? (
              <View style={styles.membershipBackGroundBox}>
                <View style={styles.membershipPremiumBox}>

                  <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image source={IcPremium} style={styles.membershipIcon} />
                  </View>

                  <Text style={styles.membershipPremiumTitle}>
                    윌라 프리미엄 멤버십
                </Text>
                  <View style={styles.membershipParagraphBox}>
                    <Text style={styles.membershipParagraphTitle}>
                      클래스
                  </Text>

                    <Text style={styles.membershipParagraph}>
                      1,000여개의 동영상 강좌 무제한 이용
                  </Text>

                    <Text style={styles.membershipParagraphTitle}>
                      오디오북
                  </Text>

                    <Text style={styles.membershipParagraph}>
                      최신작 포함 전체 오디오북 중 2권 선택!
                    </Text>
                    <Text style={styles.membershipParagraph}>
                      이용권 미사용시 무한 이월 가능!
                    </Text>

                  </View>
                  {/* <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipPremiumButton,
                    { height: 40 },
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonParagraph}>
                      가입일:{' '}
                      {moment(globalStore.currentMembership.start_at).format(
                        'YYYY-MM-DD',
                      )}
                    </Text>
                  </View>
                </View> */}
                </View>
              </View>
            ) : (
                undefined
              )}

            {globalStore.currentMembership.type === 3 ? (
              <View style={styles.membershipBackGroundBox}>
                <View style={styles.membershipBox}>
                  <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image source={IcPremium} style={styles.membershipIcon} />
                  </View>

                  <Text style={styles.membershipTitle}>윌라 프리패스</Text>
                  <View style={styles.membershipParagraphBox}>
                    <View style={styles.membershipParagraphBox}>
                      <Text style={styles.membershipParagraph}>
                        윌라의 모든 콘텐츠를 이용하실 수 있습니다.
                    </Text>
                    </View>
                  </View>
                  {/* <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipButton,
                    { height: 40 },
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonParagraph}>
                      가입일:{' '}
                      {moment(globalStore.currentMembership.start_at).format(
                        'YYYY-MM-DD',
                      )}
                    </Text>
                  </View>
                </View> */}
                </View>
              </View>
            ) : (
                undefined
              )}

            {globalStore.currentMembership.type === 4 ? (
              <View style={styles.membershipBackGroundBox}>
                <View style={styles.membershipAudioBookBox}>
                  <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image source={IcClub} style={styles.membershipIcon} />
                  </View>

                  <Text style={styles.membershipAudioBookClubTitle}>
                    윌라 오디오북 멤버십
                </Text>
                  <View style={styles.membershipParagraphBox}>
                    <View style={styles.membershipParagraphBox}>
                      <Text style={styles.membershipParagraphTitle}>
                        오디오북
                  </Text>

                      <Text style={styles.membershipParagraph}>
                        최신작 포함 전체 오디오북 중 2권 선택!
                    </Text>
                      <Text style={styles.membershipParagraph}>
                        이용권 미사용시 무한 이월 가능!
                    </Text>
                    </View>
                  </View>
                  {/* <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipAudioBookButton,
                    { height: 40 },
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonParagraph}>
                      가입일:{' '}
                      {moment(globalStore.currentMembership.start_at).format(
                        'YYYY-MM-DD',
                      )}
                    </Text>
                  </View>
                </View> */}
                </View>
              </View>
            ) : (
                undefined
              )}

            {paidMembership
              ? this._renderUnsubscribe()
              : this._renderFreeMembershipInfo()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  buyMembership = args => {
    if (Platform.OS === 'android') {
      this.props.navigation.navigate('MembershipFormPage', args);
    } else if (Platform.OS === 'ios') {
      switch (args.type) {
        case 'campus':
          native.buy({
            title: args.title,
            type: 'membership',
            product_id: 'm_01',
            token: globalStore.accessToken,
          });
          break;
        case 'bookclub':
          native.buy({
            title: args.title,
            type: 'membership',
            product_id: 'm_04',
            token: globalStore.accessToken,
          });
          break;
        case 'premium':
          native.buy({
            title: args.title,
            type: 'membership',
            product_id: 'm_02',
            token: globalStore.accessToken,
          });
          break;
      }
    }
  };

  _renderNonMembershipAndroid() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const aspectRatio = windowWidth / 1440;

    // Image resources.
    // Background.
    const membership_bg_1 = require('../../../images/membership_bg_1.png');
    const membership_bg_1_source = Image.resolveAssetSource(membership_bg_1);

    const membership_bg_2 = require('../../../images/membership_bg_2.png');
    const membership_bg_2_source = Image.resolveAssetSource(membership_bg_2);

    const membership_bg_3 = require('../../../images/membership_bg_3.png');
    const membership_bg_3_source = Image.resolveAssetSource(membership_bg_3);

    // Membership.
    const membership_btn_1 = require('../../../images/membership_btn_1.png');
    const membership_btn_1_source = Image.resolveAssetSource(membership_btn_1);

    const membership_btn_2 = require('../../../images/membership_btn_2.png');
    const membership_btn_2_source = Image.resolveAssetSource(membership_btn_2);

    const membership_btn_3 = require('../../../images/membership_btn_3.png');
    const membership_btn_3_source = Image.resolveAssetSource(membership_btn_3);

    // Travel button.
    const membership_btn = require('../../../images/membership_btn.png');
    const membership_btn_source = Image.resolveAssetSource(membership_btn);

    // Reviews.
    const membership_review_array = [
      require('../../../images/mbs_review_1_ios.png'),
      require('../../../images/mbs_review_2_ios.png'),
      require('../../../images/mbs_review_3_ios.png'),
    ];

    return (
      <SafeAreaView
        style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}
      >
        <ScrollView style={{ width: '100%' }}>
          <View
            style={{
              backgroundColor: '#DDEEE2',
            }}
          >
            <Image
              style={{
                width: membership_bg_1_source.width * aspectRatio,
                height: membership_bg_1_source.height * aspectRatio,
              }}
              resizeMode="stretch"
              source={membership_bg_1}
            />

            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 686 * aspectRatio,
                left:
                  (windowWidth - membership_btn_1_source.width * aspectRatio) /
                  2,
              }}
              onActiveOpacity={0.9}
              onPress={() =>
                this.buyMembership({
                  title: '윌라 멤버십 가입하기',
                  type: 'bookclub',
                })
              }
            >
              <Image
                style={{
                  width: membership_btn_1_source.width * aspectRatio,
                  height: membership_btn_1_source.height * aspectRatio,
                }}
                resizeMode="stretch"
                source={membership_btn_1}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 1298 * aspectRatio,
                left:
                  (windowWidth - membership_btn_2_source.width * aspectRatio) /
                  2,
              }}
              onActiveOpacity={0.9}
              onPress={() =>
                this.buyMembership({
                  title: '윌라 멤버십 가입하기',
                  type: 'campus',
                })
              }
            >
              <Image
                style={{
                  width: membership_btn_2_source.width * aspectRatio,
                  height: membership_btn_2_source.height * aspectRatio,
                }}
                resizeMode="stretch"
                source={membership_btn_2}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 1910 * aspectRatio,
                left:
                  (windowWidth - membership_btn_2_source.width * aspectRatio) /
                  2,
              }}
              onActiveOpacity={0.9}
              onPress={() =>
                this.buyMembership({
                  title: '윌라 멤버십 가입하기',
                  type: 'premium',
                })
              }
            >
              <Image
                style={{
                  width: membership_btn_3_source.width * aspectRatio,
                  height: membership_btn_3_source.height * aspectRatio,
                }}
                resizeMode="stretch"
                source={membership_btn_3}
              />
            </TouchableOpacity>

            {/* 후기 영역 */}
            <ImageBackground
              style={{
                width: membership_bg_2_source.width * aspectRatio,
                height: membership_bg_2_source.height * aspectRatio,
              }}
              resizeMode="stretch"
              source={membership_bg_2}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 410 * aspectRatio,
                  left: 0,
                  width: '100%',
                  height: 510 * aspectRatio,
                }}
              >
                <Swiper
                  showsPagination={true}
                  dotColor={'#DDEEE2'}
                  activeDotColor={CommonStyles.COLOR_PRIMARY}
                  paginationStyle={{ bottom: 0 }}
                >
                  {membership_review_array.map((review, key) => {
                    return (
                      <Image
                        key={key}
                        style={{
                          width: 1440 * aspectRatio,
                          height: 480 * aspectRatio,
                        }}
                        source={review}
                      />
                    );
                  })}
                </Swiper>
              </View>
            </ImageBackground>

            {/* 공지 사항 영역 */}
            <Image
              onResponderRelease={e => {
                const x = e.nativeEvent.locationX;
                const y = e.nativeEvent.locationY;
                if (
                  x > 940 * aspectRatio &&
                  x < 1023 * aspectRatio &&
                  y > 240 * aspectRatio &&
                  y < 265 * aspectRatio
                ) {
                  this.props.navigation.navigate('InquireListScreen');
                }
              }}
              onStartShouldSetResponder={e => true}
              style={{
                width: membership_bg_3_source.width * aspectRatio,
                height: membership_bg_3_source.height * aspectRatio,
              }}
              resizeMode="stretch"
              source={membership_bg_3}
            />

            {/* 둘러보기 */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 130 * aspectRatio,
                left:
                  (windowWidth - membership_btn_source.width * aspectRatio) / 2,
              }}
              onActiveOpacity={0.9}
              onPress={() =>
                this.props.navigation.navigate('HomeScreen', {
                  show_popup: true,
                })
              }
            >
              <Image
                style={{
                  width: membership_btn_source.width * aspectRatio,
                  height: membership_btn_source.height * aspectRatio,
                }}
                resizeMode="stretch"
                source={membership_btn}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  _renderNonMembershipIOS() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const aspectRatio = windowWidth / 1125;

    // Back1
    const membership_bg_1 = require('../../../images/Back1.png');
    const membership_bg_1_source = Image.resolveAssetSource(membership_bg_1);

    // Back1 - Membership Buttons
    const membership_btn_1 = require('../../../images/Back1_1.png');
    const membership_btn_1_source = Image.resolveAssetSource(membership_btn_1);

    const membership_btn_2 = require('../../../images/Back1_2.png');
    const membership_btn_2_source = Image.resolveAssetSource(membership_btn_2);

    const membership_btn_3 = require('../../../images/Back1_3.png');
    const membership_btn_3_source = Image.resolveAssetSource(membership_btn_3);

    // Back2
    const membership_bg_2 = require('../../../images/Back2.png');
    const membership_bg_2_source = Image.resolveAssetSource(membership_bg_2);

    // Back2 - Review Images
    const membership_review_array = [
      require('../../../images/Back2_1.png'),
      require('../../../images/Back2_2.png'),
      require('../../../images/Back2_3.png'),
    ];

    // Back3
    const membership_bg_3 = require('../../../images/Back3.png');
    const membership_bg_3_source = Image.resolveAssetSource(membership_bg_3);

    // Back3 - Go Button
    const membership_btn = require('../../../images/Back3_1.png');
    const membership_btn_source = Image.resolveAssetSource(membership_btn);

    let banner_url; // 최상단 banner 에 들어갈 image url 을 저장
    const cnt = this.state.ads.length;
    if (cnt > 0) {
      banner_url = this.state.ads[0];
      Image.getSize(banner_url, (width, height) => {
        const bannerAspectRatio = windowWidth / width;
        this.setState({
          bannerWidth: width * bannerAspectRatio,
          bannerHeight: height * bannerAspectRatio,
        });
      });
    }

    return (
      <SafeAreaView
        style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}
      >
        <ScrollView style={{ width: '100%' }}>
          <View
            style={{
              backgroundColor: '#DDEEE2',
            }}
          >
            <Image
              style={{
                width: this.state.bannerWidth,
                height: this.state.bannerHeight,
              }}
              resizeMode="stretch"
              source={{
                uri: banner_url,
              }}
            />

            <View
              style={{
                width: membership_bg_1_source.width * aspectRatio,
                height: membership_bg_1_source.height * aspectRatio,
              }}
            >
              <Image
                style={{
                  width: membership_bg_1_source.width * aspectRatio,
                  height: membership_bg_1_source.height * aspectRatio,
                }}
                resizeMode="stretch"
                source={membership_bg_1}
              />

              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 490 * aspectRatio,
                  left:
                    (windowWidth -
                      membership_btn_1_source.width * aspectRatio) /
                    2,
                }}
                onActiveOpacity={0.9}
                onPress={() =>
                  this.buyMembership({
                    title: '윌라 멤버십 가입하기',
                    type: 'bookclub',
                  })
                }
              >
                <Image
                  style={{
                    width: membership_btn_1_source.width * aspectRatio,
                    height: membership_btn_1_source.height * aspectRatio,
                  }}
                  resizeMode="stretch"
                  source={membership_btn_1}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 964 * aspectRatio,
                  left:
                    (windowWidth -
                      membership_btn_2_source.width * aspectRatio) /
                    2,
                }}
                onActiveOpacity={0.9}
                onPress={() =>
                  this.buyMembership({
                    title: '윌라 멤버십 가입하기',
                    type: 'campus',
                  })
                }
              >
                <Image
                  style={{
                    width: membership_btn_2_source.width * aspectRatio,
                    height: membership_btn_2_source.height * aspectRatio,
                  }}
                  resizeMode="stretch"
                  source={membership_btn_2}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 1438 * aspectRatio,
                  left:
                    (windowWidth -
                      membership_btn_2_source.width * aspectRatio) /
                    2,
                }}
                onActiveOpacity={0.9}
                onPress={() =>
                  this.buyMembership({
                    title: '윌라 멤버십 가입하기',
                    type: 'premium',
                  })
                }
              >
                <Image
                  style={{
                    width: membership_btn_3_source.width * aspectRatio,
                    height: membership_btn_3_source.height * aspectRatio,
                  }}
                  resizeMode="stretch"
                  source={membership_btn_3}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: membership_bg_2_source.width * aspectRatio,
                height: membership_bg_2_source.height * aspectRatio,
              }}
            >
              <Image
                style={{
                  width: membership_bg_2_source.width * aspectRatio,
                  height: membership_bg_2_source.height * aspectRatio,
                }}
                resizeMode="stretch"
                source={membership_bg_2}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 320 * aspectRatio,
                  left: 0,
                  width: '100%',
                  height: 430 * aspectRatio,
                }}
              >
                <Swiper
                  showsPagination={true}
                  dotColor={'#DDEEE2'}
                  activeDotColor={CommonStyles.COLOR_PRIMARY}
                  paginationStyle={{ bottom: 0 }}
                >
                  {membership_review_array.map((review, key) => {
                    return (
                      <Image
                        key={key}
                        style={{
                          marginLeft: '5%',
                          marginRight: '5%',
                          width: '90%',
                          height: 345 * aspectRatio,
                        }}
                        resizeMode="stretch"
                        source={review}
                      />
                    );
                  })}
                </Swiper>
              </View>
            </View>

            <View
              onResponderRelease={e => {
                const x = e.nativeEvent.locationX;
                const y = e.nativeEvent.locationY;

                if (
                  x > 50 * aspectRatio &&
                  x < 600 * aspectRatio &&
                  y > 300 * aspectRatio &&
                  y < 400 * aspectRatio
                ) {
                  this.props.navigation.navigate('InquireListScreen');
                } else if (
                  x > 50 * aspectRatio &&
                  x < 340 * aspectRatio &&
                  y > 400 * aspectRatio &&
                  y < 470 * aspectRatio
                ) {
                  this.props.navigation.navigate('MembershipDetailPage');
                } else if (
                  x > 340 * aspectRatio &&
                  x < 640 * aspectRatio &&
                  y > 400 * aspectRatio &&
                  y < 470 * aspectRatio
                ) {
                  this.props.navigation.navigate('PolicyPage');
                } else if (
                  x > 640 * aspectRatio &&
                  x < 1000 * aspectRatio &&
                  y > 400 * aspectRatio &&
                  y < 470 * aspectRatio
                ) {
                  this.props.navigation.navigate('PrivacyPage');
                }
              }}
              onStartShouldSetResponder={e => true}
              style={{
                width: membership_bg_3_source.width * aspectRatio,
                height: membership_bg_3_source.height * aspectRatio,
              }}
            >
              <Image
                style={{
                  width: membership_bg_3_source.width * aspectRatio,
                  height: membership_bg_3_source.height * aspectRatio,
                }}
                resizeMode="stretch"
                source={membership_bg_3}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  left:
                    (windowWidth - membership_btn_source.width * aspectRatio) /
                    2,
                  bottom: 122 * aspectRatio,
                  width: '100%',
                  height: membership_btn_source.height * aspectRatio,
                }}
                onActiveOpacity={0.9}
                onPress={() =>
                  this.props.navigation.navigate('HomeScreen', {
                    show_popup: true,
                  })
                }
              >
                <Image
                  style={{
                    width: membership_btn_source.width * aspectRatio,
                    height: membership_btn_source.height * aspectRatio,
                  }}
                  resizeMode="stretch"
                  source={membership_btn}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  _renderUnsubscribe() {
    const { stop_payment: stopPayment } = globalStore.currentMembership;
    if (Platform.OS === 'android' && stopPayment === true) {
      return (
        <View>
          {this._renderMembershipRule()}
          <View style={styles.cancelButton} borderRadius={5}>
            <Text style={styles.cancelButtonText}>멤버십 구독 해지됨</Text>
          </View>
        </View>
      );
    }

    return (
      <View>
        {this._renderMembershipRule()}
        <TouchableOpacity onPress={() => this.cancelMembershipConfirm()}>
          <View style={styles.cancelButton} borderRadius={5}>
            {Platform.OS === 'ios' ? (
              <Text style={styles.cancelButtonText}>
                Apple 구독 취소 또는 변경
              </Text>
            ) : (
                <Text style={styles.cancelButtonText}>멤버십 구독 해지</Text>
              )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _renderFreeMembershipInfo() {
    const {
      type_memo: typeMemo,
      start_at: startAt,
      expire_at: expireAt,
    } = globalStore.currentMembership;

    return (
      <View>
        <View style={{ marginBottom: 16 }}>
          <Text>쿠폰 내용: {typeMemo}</Text>
          <Text>
            사용 기간: {moment(startAt).format('YYYY년 MM월 DD일')} ~{' '}
            {moment(expireAt).format('YYYY년 MM월 DD일')}
          </Text>
        </View>
        <View style={styles.sectionList}>
          <View style={styles.sectionListItem}>
            {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
            <Text style={styles.sectionListItemText}>
              현재 멤버십은 {moment(expireAt).format('YYYY년 MM월 DD일')} 까지
              유효하며, 자동연장 및 결제되지 않습니다.
            </Text>
          </View>
          <View style={styles.sectionListItem}>
            {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
            <Text style={styles.sectionListItemText}>
              멤버십 혜택은 사용기간 동안 이용 가능합니다.
            </Text>
          </View>
          <View style={styles.sectionListItem}>
            {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('InquireListScreen');
              }}
            >
              <Text style={styles.sectionListItemText}>
                도움이 필요하시면{' '}
                <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>
                를 이용해주세요.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  _renderMembershipRule() {
    return Platform.select({
      ios: this._renderRuleIOS(),
      android: this._renderRuleAndroid(),
    });
  }

  _renderRuleIOS() {
    return (
      <View style={styles.sectionList}>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            * 멤버십 구독 후 첫 달 무료체험(가입일 기준 ~ 한 달) 이후 자동결제가 진행됩니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            * 멤버십 변경 및 해지는 는 App store 앱에서 로그인 후 “계정 > 구독” 에서 또는 아래 버튼 클릭 후 가능합니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            * 멤버십 변경시 이미 무료체험 기간이 남아있다면, 기간이 끝난 후 새 멤버십으로 변경 됩니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            * 구매는 회원님의 iTunes 계정으로 비용이 청구됩니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            * 구매가격은 부가세와 결제수수료가 포함된 금액입니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            * 무약정으로 언제든 해지하실 수 있습니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            * 멤버십 변경 등 이용 문의는 1:1문의를 이용해 주세요.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            현 구독기간 종료시점으로부터 최소 24시간전에 자동 갱신을 해지하지
            않는 한, 현 구독기간 종료시 구독이 자동으로 갱신되고 회원님의
            iTunes계정으로 다시 청구가 이루어집니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            구매 후 언제든 Apple ID계정 설정에서 자동갱신을 관리 또는 해지 하실
            수 있습니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('InquireListScreen');
            }}
          >
            <Text style={styles.sectionListItemText}>
              도움이 필요하시면
              <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>를
              이용해주세요.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _renderRuleAndroid() {
    return (
      <View style={styles.sectionList}>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            * 첫 달 무료체험 (가입일 기준 ~ 한 달) 후 자동결제가 진행됩니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            * 이용권으로 오디오북 구매시 60일 동안 소장 가능합니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <Text style={styles.sectionListItemText}>
            * 무약정으로 언제든 해지하실 수 있습니다.
          </Text>
        </View>
        <View style={styles.sectionListItem}>
          {/* <View style={styles.sectionListItemBullet} borderRadius={3} /> */}
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('InquireListScreen');
            }}
          >
            <Text style={styles.sectionListItemText}>
              * 멤버십 변경 등 이용 문의는{' '}
              <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>를
              이용해 주세요.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

MembershipPage.defaultProps = {
  membership_price_prefix: '이후 매월 ',
  membership_price_suffix: ' 결제하기 / 해지는 언제든지 쉽게!',
};
