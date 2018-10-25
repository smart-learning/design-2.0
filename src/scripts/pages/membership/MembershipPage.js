import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import CommonStyles from '../../../styles/common';
import IcClub from '../../../images/ic-m-audiobookclub.png';
import IcCampus from '../../../images/ic-m-campus.png';
import IcPremium from '../../../images/ic-m-premium.png';
import IcAngleRight from '../../../images/ic-my-angle-right-white.png';
import globalStore from '../../commons/store';
import { observer } from 'mobx-react';
import { observable, observe } from 'mobx';
import moment from 'moment';
import native from '../../commons/native';
import {AppEventsLogger} from 'react-native-fbsdk';

const styles = StyleSheet.create({
  sectionTitle: {
    paddingTop: 20,
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333'
  },
  sectionSubTitle: {
    paddingBottom: 7,
    fontSize: 14,
    color: '#333333'
  },
  sectionList: {
    paddingBottom: 10
  },
  sectionListItem: {
    position: 'relative'
  },
  sectionListItemBullet: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 4,
    height: 4,
    backgroundColor: '#333333'
  },
  sectionListItemText: {
    paddingLeft: 15,
    fontSize: 14,
    color: '#333333'
  },
  sectionListItemTextImportant: {
    fontSize: 14,
    color: CommonStyles.COLOR_PRIMARY
  },
  ruleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    width: '100%',
    height: 40,
    backgroundColor: CommonStyles.COLOR_PRIMARY
  },
  ruleButtonText: {
    fontSize: 14,
    color: '#ffffff'
  },
  pageTitle: {
    paddingTop: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 24,
    color: '#333333'
  },
  paragraphBox: {
    marginBottom: 30
  },
  paragraphText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333333'
  },
  paragraphImportantText: {
    textAlign: 'center',
    fontSize: 18,
    color: CommonStyles.COLOR_PRIMARY
  },
  membershipBox: {
    position: 'relative',
    paddingTop: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: CommonStyles.COLOR_PRIMARY
  },
  membershipCampusBox: {
    position: 'relative',
    paddingTop: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#49ac41'
  },
  membershipAudioBookBox: {
    position: 'relative',
    paddingTop: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#afca0b'
  },
  membershipPremiumBox: {
    position: 'relative',
    paddingTop: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#a88050'
  },      
  membershipIcon: {
    position: 'absolute',
    top: 18,
    right: 20,
    width: 65,
    height: 50
  },
  membershipTitle: {
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 20,
    color: CommonStyles.COLOR_PRIMARY
  },
  membershipCampusTitle: {
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 20,
    color: '#49ac41'
  },
  membershipAudioBookClubTitle: {
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 20,
    color: '#afca0b'
  },
  membershipPremiumTitle: {
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 20,
    color: '#a88050'
  },
  membershipParagraphBox: {
    marginBottom: 20,
    paddingLeft: 15
  },
  membershipParagraph: {
    fontSize: 15,
    color: '#666666'
  },
  memberShipButton: {
    alignItems: 'center',
    height: 65,
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: CommonStyles.COLOR_PRIMARY
  },
  memberShipCampusButton: {
    alignItems: 'center',
    height: 65,
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#49ac41'
  },
  memberShipAudioBookButton: {
    alignItems: 'center',
    height: 65,
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#afca0b'
  },
  memberShipPremiumButton: {
    alignItems: 'center',
    height: 65,
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#a88050'
  },      
  memberShipButtonTitle: {
    fontSize: 18,
    color: '#ffffff'
  },
  memberShipButtonParagraph: {
    fontSize: 12,
    color: '#f0f0f0'
  },
  priceBox: {
    paddingLeft: 15
  },
  membershipPrice: {
    fontSize: 16,
    color: '#333333'
  },
  membershipSalePrice: {
    fontSize: 14,
    color: '#dddddd',
    textDecorationLine: 'line-through'
  }
});

const renderRuleIOS = () => {
  return (
    <View style={styles.sectionList}>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          유료 멤버십 구독 후 1개월은 무료로 이용 하실 수 있습니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          유료 멤버십 구매 시 이미 무료 멤버십 기간이 남아 있다면 무료 멤버십
          기간이 끝난 후 구매하실 수 있습니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          구매는 회원님의 iTunes 계정으로 비용이 청구됩니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          구매가격에는 부가세와 결제수수료가 포함되어 있습니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          각 멤버십은 1개월마다 자동으로 결제됩니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          이용권 관리는 App Store 앱에서 로그인 후 "계정 > 구독" 에서 관리하실
          수 있습니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          현 구독기간 종료시점으로부터 최소 24시간전에 자동 갱신을 해지하지 않는
          한, 현 구독기간 종료시 구독이 자동으로 갱신되고 회원님의
          iTunes계정으로 다시 청구가 이루어집니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          구매 후 언제든 Apple ID계정 설정에서 자동갱신을 관리 또는 해지 하실 수
          있습니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          도움이 필요하시면
          <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>를
          이용해주세요.
        </Text>
      </View>
    </View>
  );
};
const renderRuleAndroid = () => {
  return (
    <View style={styles.sectionList}>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          멤버십 비용은 매월 자동결제 됩니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          무약정으로 언제든지 해지하실 수 있습니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          해당 금액은 세금 포함 금액입니다.
        </Text>
      </View>
      <View style={styles.sectionListItem}>
        <View style={styles.sectionListItemBullet} borderRadius={3} />
        <Text style={styles.sectionListItemText}>
          도움이 필요하시면
          <Text style={styles.sectionListItemTextImportant}>1:1문의</Text>를
          이용해주세요.
        </Text>
      </View>
    </View>
  );
};

const MembershipRule = Platform.select({
  ios: renderRuleIOS(),
  android: renderRuleAndroid()
});

@observer
export default class MembershipPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.disposer = observe(globalStore.buyResult, change => {
      if ('success' === change.name && change.newValue) {        
        globalStore.buyResult.success = false;
        // HomeScreen.js 로 이동 혹은 Back
        this.props.navigation.navigate('HomeScreen');
      }
    });
  }

  componentWillUnmount() {
    this.disposer();
  }

  render() {

    // 멤버십 페이지 랜더 시점 호출  
    AppEventsLogger.logEvent('WELAAARN_MEMBERSHIP_PAGE'); 
      
    // 멤버쉽이 존재할 경우
    if (
      globalStore.currentMembership &&
      globalStore.currentMembership.type_text
    )
      return this.renderMembership();
    else return this.renderNonMembership();
  }

  renderMembership() {
    return (
      <SafeAreaView
        style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}
      >
        <ScrollView style={{ width: '100%' }}>
          <View style={{ marginLeft: 20, marginRight: 20, marginTop: 30 }}>
            {globalStore.currentMembership.type === 1 ? (
              <View style={styles.membershipCampusBox}>
                <Image source={IcCampus} style={styles.membershipIcon} />
                <Text style={styles.membershipCampusTitle}>윌라 캠퍼스 멤버십</Text>
                <View style={styles.membershipParagraphBox}>
                  <Text style={styles.membershipParagraph}>
                    1천개의 동영상강좌 무제한 이용
                  </Text>
                </View>
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipCampusButton,
                    { height: 40 }
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonParagraph}>
                      가입일:{' '}
                      {moment(globalStore.currentMembership.start_at).format(
                        'YYYY-MM-DD'
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              undefined
            )}

            {globalStore.currentMembership.type === 2 ? (
              <View style={styles.membershipPremiumBox}>
                <Image source={IcPremium} style={styles.membershipIcon} />
                <Text style={styles.membershipPremiumTitle}>윌라 프리미엄 멤버십</Text>
                <View style={styles.membershipParagraphBox}>
                  <Text style={styles.membershipParagraph}>
                    1천개의 동영상강좌 무제한 이용
                  </Text>
                  <View style={styles.membershipParagraphBox}>
                    <Text style={styles.membershipParagraph}>
                      이달의 책 1권 + 인기 오디오북 1권
                    </Text>
                    <Text style={styles.membershipParagraph}>
                      총 2권의 오디오북 이용
                    </Text>
                    <Text style={styles.membershipParagraph}>
                      (원하는 오디오북이 없을 경우 이월 가능)
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipPremiumButton,
                    { height: 40 }
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonParagraph}>
                      가입일:{' '}
                      {moment(globalStore.currentMembership.start_at).format(
                        'YYYY-MM-DD'
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              undefined
            )}

            {globalStore.currentMembership.type === 3 ? (
              <View style={styles.membershipBox}>
                <Image source={IcPremium} style={styles.membershipIcon} />
                <Text style={styles.membershipTitle}>윌라 프리패스</Text>
                <View style={styles.membershipParagraphBox}>
                  <View style={styles.membershipParagraphBox}>
                    <Text style={styles.membershipParagraph}>
                      윌라의 모든 콘텐츠를 이용하실 수 있습니다.
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipButton,
                    { height: 40 }
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonParagraph}>
                      가입일:{' '}
                      {moment(globalStore.currentMembership.start_at).format(
                        'YYYY-MM-DD'
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              undefined
            )}

            {globalStore.currentMembership.type === 4 ? (
              <View style={styles.membershipAudioBookBox}>
                <Image source={IcClub} style={styles.membershipIcon} />
                <Text style={styles.membershipAudioBookClubTitle}>
                  윌라 오디오북클럽 멤버십
                </Text>
                <View style={styles.membershipParagraphBox}>
                  <View style={styles.membershipParagraphBox}>
                    <Text style={styles.membershipParagraph}>
                      이달의 책 1권 + 인기 오디오북 1권
                    </Text>
                    <Text style={styles.membershipParagraph}>
                      총 2권의 오디오북 이용
                    </Text>
                    <Text style={styles.membershipParagraph}>
                      (원하는 오디오북이 없을 경우 이월 가능)
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipAudioBookButton,
                    { height: 40 }
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonParagraph}>
                      가입일:{' '}
                      {moment(globalStore.currentMembership.start_at).format(
                        'YYYY-MM-DD'
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              undefined
            )}

            <Text style={styles.membershipParagraph}>
              멤버십 비용은 매월 자동결제 됩니다.
            </Text>
            <Text style={styles.membershipParagraph}>
              무약정으로 언제든지 해지하실 수 있습니다.
            </Text>
            <Text style={styles.membershipParagraph}>
              해당 금액은 세금 포함 금액입니다.
            </Text>
            <Text style={styles.membershipParagraph}>
              도움이 필요하시면 1:1 문의를 이용해 주세요.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  buyMembershop = args => {
    if (Platform.OS === 'android') {
      this.props.navigation.navigate('MembershipFormPage', args);
    } else if (Platform.OS === 'ios') {
      switch (args.type) {
        case 'campus':
          native.buy({
            type: 'membership',
            product_id: 'campus',
            token: globalStore.accessToken
          });
          break;
        case 'bookclub':
          native.buy({
            type: 'membership',
            product_id: 'bookclu',
            token: globalStore.accessToken
          });
          break;
        case 'premium':
          native.buy({
            type: 'membership',
            product_id: 'premium',
            token: globalStore.accessToken
          });
          break;
      }
    }
  };

  renderNonMembership() {
    return (
      <SafeAreaView
        style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}
      >
        <ScrollView style={{ width: '100%' }}>
          <View style={CommonStyles.contentContainer}>
            <Text style={styles.pageTitle}>
              런칭 기념 멤버십 한정 할인 이벤트
            </Text>
            <View style={styles.paragraphBox}>
              <Text style={styles.paragraphText}>
                당신의 가능성을 믿기에 윌라가 지원합니다.
              </Text>
              <Text style={styles.paragraphText}>
                파격적으로 할인된 멤버십으로
              </Text>
              <Text style={styles.paragraphText}>
                프리미엄 지식 콘텐츠를 마음껏 이용하세요!
              </Text>
            </View>
            <View style={styles.paragraphBox}>
              <Text style={styles.paragraphImportantText}>
                심지어 첫달은 무료!
              </Text>
              <Text style={styles.paragraphImportantText}>
                해지는 클릭한번으로 언제든지 가능!
              </Text>
            </View>

            <View style={styles.membershipCampusBox}>
              <Image source={IcCampus} style={styles.membershipIcon} />
              <Text style={styles.membershipCampusTitle}>윌라 캠퍼스 멤버십</Text>
              <View style={styles.membershipParagraphBox}>
                <Text style={styles.membershipParagraph}>
                  1천개의 동영상강좌 무제한 이용
                </Text>
              </View>
              <View style={styles.priceBox}>
                {Platform.select({
                  ios: <Text style={styles.membershipPrice}>월 11,000원</Text>,
                  android: (
                    <View>
                      <Text style={styles.membershipSalePrice}>
                        월 30,000원
                      </Text>
                      <Text style={styles.membershipPrice}>월 7,700원</Text>
                    </View>
                  )
                })}
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.buyMembershop({
                    title: '캠퍼스 멤버십 결제',
                    type: 'campus'
                  })
                }
              >
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipCampusButton
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonTitle}>
                      첫 1개월 무료
                    </Text>
                    <Text style={styles.memberShipButtonParagraph}>
                      {this.props.membership_price_prefix}
                      {Platform.select({
                        ios: <Text>11,000원</Text>,
                        android: <Text>7,700원</Text>
                      })}
                      {this.props.membership_price_suffix}
                    </Text>
                  </View>
                  <Image source={IcAngleRight} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.membershipAudioBookBox}>
              <Image source={IcClub} style={styles.membershipIcon} />
              <Text style={styles.membershipAudioBookClubTitle}>
                윌라 오디오북클럽 멤버십
              </Text>
              <View style={styles.membershipParagraphBox}>
                <Text style={styles.membershipParagraph}>
                  이달의 책 1권 + 인기 오디오북 1권
                </Text>
                <Text style={styles.membershipParagraph}>
                  총 2권의 오디오북 이용
                </Text>
                <Text style={styles.membershipParagraph}>
                  (원하는 오디오북이 없을 경우 이월 가능)
                </Text>
              </View>
              <View style={styles.priceBox}>
                {Platform.select({
                  ios: <Text style={styles.membershipPrice}>월 9,500원</Text>,
                  android: (
                    <View>
                      <Text style={styles.membershipSalePrice}>
                        월 15,000원
                      </Text>
                      <Text style={styles.membershipPrice}>월 6,600원</Text>
                    </View>
                  )
                })}
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.buyMembershop({
                    title: '오디오북클럽 멤버십 결제',
                    type: 'bookclub'
                  })
                }
              >
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipAudioBookButton
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonTitle}>
                      첫 1개월 무료
                    </Text>
                    <Text style={styles.memberShipButtonParagraph}>
                      {this.props.membership_price_prefix}
                      {Platform.select({
                        ios: <Text>9,500원</Text>,
                        android: <Text>6,600원</Text>
                      })}
                      {this.props.membership_price_suffix}
                    </Text>
                  </View>
                  <Image source={IcAngleRight} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.membershipPremiumBox}>
              <Image source={IcPremium} style={styles.membershipIcon} />
              <Text style={styles.membershipPremiumTitle}>윌라 프리미엄 멤버십</Text>
              <View style={styles.membershipParagraphBox}>
                <Text style={styles.membershipParagraph}>
                  윌라 캠퍼스 멤버십 + 윌라 오디오북 멤버십
                </Text>
              </View>
              <View style={styles.priceBox}>
                {Platform.select({
                  ios: <Text style={styles.membershipPrice}>월 20,500원</Text>,
                  android: (
                    <View>
                      <Text style={styles.membershipSalePrice}>
                        월 40,000원
                      </Text>
                      <Text style={styles.membershipPrice}>월 14,300원</Text>
                    </View>
                  )
                })}
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  this.buyMembershop({
                    title: '프리미엄 멤버십 결제',
                    type: 'premium'
                  })
                }
              >
                <View
                  style={[
                    CommonStyles.alignJustifyContentBetween,
                    styles.memberShipPremiumButton
                  ]}
                >
                  <View>
                    <Text style={styles.memberShipButtonTitle}>
                      첫 1개월 무료
                    </Text>
                    <Text style={styles.memberShipButtonParagraph}>
                      {this.props.membership_price_prefix}
                      {Platform.select({
                        ios: <Text>20,500원</Text>,
                        android: <Text>14,300원</Text>
                      })}
                      {this.props.membership_price_suffix}
                    </Text>
                  </View>
                  <Image source={IcAngleRight} />
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>멤버십 결제 유의사항</Text>
            <View>{MembershipRule}</View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                this.props.navigation.navigate('MembershipDetailPage', {
                  title: '윌라 멤버십'
                })
              }
            >
              <View style={styles.ruleButton} borderRadius={5}>
                <Text style={styles.ruleButtonText}>멤버십 정책 상세보기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

MembershipPage.defaultProps = {
  membership_price_prefix: '이후 매월 ',
  membership_price_suffix: ' 결제하기 / 해지는 언제든지 쉽게!'
}
