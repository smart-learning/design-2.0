import { observer } from 'mobx-react'
import React from 'react'
import CommonStyles, { COLOR_PRIMARY } from '../../../styles/common'
import {
	AsyncStorage,
	Image,
	ImageBackground,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import BgMy from '../../../images/bg-my.png'
import DummyProfile from '../../../images/dummy-my-profile.png'
import IcAngleRight from '../../../images/ic-my-angle-right.png'
import IcCog from '../../../images/ic-my-cog.png'
import IcDownload from '../../../images/ic-my-download.png'
import IcMusic from '../../../images/ic-my-music.png'
import IcPlay from '../../../images/ic-my-play.png'
import IcProfile from '../../../images/ic-my-profile.png'
import IcTag from '../../../images/ic-my-tag.png'
import globalStore from '../../../scripts/commons/store'
import native from '../../commons/native'
import HomeButton from '../../components/header/HomeButton'

const styles = StyleSheet.create({
  myHeader: {
    alignItems: 'center',
    width: '100%',
    height: 50
  },
  myHeaderTitle: {
    fontSize: 16,
    color: '#ffffff'
  },
  myHeaderIcon: {
    width: 18,
    height: 18,
    marginRight: 15
  },
  sectionLayout: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingRight: 15,
    paddingBottom: 20,
    paddingLeft: 15
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A'
  },
  listItem: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItemIcon: {
    width: 36,
    height: 36,
    marginRight: 10
  },
  listItemTitle: {
    fontSize: 15,
    color: '#4a4a4a'
  },
  listItemBullet: {
    width: 7,
    height: 13
  },
  listItemBarContainer: {
    position: 'relative'
  },
  listItemBar: {
    width: '100%',
    height: 1,
    backgroundColor: '#eeeeee'
  },
  listItemBarBullet: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 46,
    height: 1,
    backgroundColor: '#ffffff'
  },
  friendParagraph: {
    marginBottom: 10,
    fontSize: 15,
    color: '#999999'
  },
  friendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#32C183'
  },
  friendButtonText: {
    fontSize: 15,
    color: '#ffffff'
  },
  guideItem: {
    height: 40,
    justifyContent: 'center'
  },
  guideTitle: {
    fontSize: 15,
    color: '#4a4a4a'
  },
  guideHr: {
    width: '100%',
    height: 1,
    backgroundColor: '#eeeeee'
  },
  myInfo: {
    // height: 165,
    position: 'relative'
  },
  myInfoContent: {
    marginLeft: 40,
    marginRight: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  myInfoContentItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  myInfoProfile: {
    width: 60,
    height: 60,
    marginRight: 10
  },
  myInfoName: {
    fontSize: 16,
    color: '#efefef'
  },
  myInfoParagraphContainer: {
    marginTop: 7,
    marginBottom: 4
  },
  myInfoParagraph: {
    fontSize: 12,
    color: '#cccccc'
  },
  myInfoParagraphButton: {
    marginLeft: 10,
    fontSize: 12,
    color: '#cccccc'
  },
  myInfoEmail: {
    fontSize: 12,
    color: '#9A9A9A'
  },
  buttonRestore: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 40,
    backgroundColor: '#4a4a4a'
  },
  buttonRestoreText: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#ffffff'
  },
  buttonSmall: {
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 8,
    marginLeft: 8,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6
  },
  buttonSmallText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#ffffff'
  }
});
/*
* 로그인 후 보여지는 화면
* */
@observer
export default class MyInfoHome extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!globalStore.welaaaAuth) this.props.navigation.navigate('Login');

    if (globalStore.welaaaAuth) {
      AsyncStorage.setItem('isAppFirstLoad', 'false');
    }
  }

  componentWillUnmount() {}

  render() {
    const navigation = this.props.navigation;

    return (
      <View
        style={[
          CommonStyles.container,
          { backgroundColor: '#F5F5F5', flex: 1 }
        ]}
      >
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <ImageBackground source={BgMy} style={styles.myInfo}>
              <View
                style={[
                  CommonStyles.alignJustifyContentBetween,
                  styles.myHeader
                ]}
              >
                <HomeButton />

                <Text style={styles.myHeaderTitle}>마이윌라</Text>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate('SetAppPage', { title: '설정' })
                  }
                >
                  <Image source={IcCog} style={styles.myHeaderIcon} />
                </TouchableOpacity>
              </View>

              <View style={[styles.myInfoContent, { height: 105 }]}>
                {1 === 2 && (
                  <Image
                    source={DummyProfile}
                    style={styles.myInfoProfile}
                    borderRadius={30}
                  />
                )}
                <View>
                  <View style={styles.myInfoContentItem}>
                    <Text style={styles.myInfoName}>
                      {globalStore.profile ? globalStore.profile.name : ''}
                    </Text>

                    {/*<Text>{globalStore.currentMembership.type_text}</Text>*/}
                    {
                      <View>
                        {globalStore.currentMembership &&
                        globalStore.currentMembership.type_text ? null : (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('MembershipScreen')
                            }
                          >
                            <View style={styles.buttonSmall}>
                              <Text style={styles.buttonSmallText}>
                                윌라 멤버십 안내
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    }
                  </View>
                  {/*고객사 요청으로 화면에서 감춤 처리*/}
                  {1 === 2 && (
                    <View
                      style={[
                        styles.myInfoContentItem,
                        styles.myInfoParagraphContainer
                      ]}
                    >
                      <Text style={styles.myInfoParagraph}>
                        한줄 메세지를 작성해주세요~
                      </Text>
                      <TouchableOpacity activeOpacity={0.9}>
                        <Text style={styles.myInfoParagraphButton}>쓰기</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  <Text style={styles.myInfoEmail}>
                    {globalStore.profile ? globalStore.profile.email : ''}
                  </Text>
                </View>
              </View>
            </ImageBackground>

            <View style={styles.sectionLayout}>
              <Text style={styles.sectionTitle}>콘텐츠 이용 현황</Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('LectureUsePage', {
                    title: '최근 재생 클래스'
                  })
                }
              >
                <View style={styles.listItem}>
                  <Image source={IcPlay} style={styles.listItemIcon} />
                  <Text style={styles.listItemTitle}>최근 재생 클래스</Text>
                  <Image
                    source={IcAngleRight}
                    style={[styles.listItemBullet, { marginLeft: 'auto' }]}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.listItemBarContainer}>
                <View style={styles.listItemBar} />
                <View style={styles.listItemBarBullet} />
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('LectureBuyPage', {
                    title: '구매한 클래스'
                  })
                }
              >
                <View style={styles.listItem}>
                  <Image source={IcPlay} style={styles.listItemIcon} />
                  <Text style={styles.listItemTitle}>구매한 클래스</Text>
                  <Image
                    source={IcAngleRight}
                    style={[styles.listItemBullet, { marginLeft: 'auto' }]}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.listItemBarContainer}>
                <View style={styles.listItemBar} />
                <View style={styles.listItemBarBullet} />
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('AudioBookUsePage', {
                    title: '최근 재생 오디오북'
                  })
                }
              >
                <View style={styles.listItem}>
                  <Image source={IcMusic} style={styles.listItemIcon} />
                  <Text style={styles.listItemTitle}>최근 재생 오디오북</Text>
                  <Image
                    source={IcAngleRight}
                    style={[styles.listItemBullet, { marginLeft: 'auto' }]}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.listItemBarContainer}>
                <View style={styles.listItemBar} />
                <View style={styles.listItemBarBullet} />
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('AudioBookBuyPage', {
                    title: '구매한 오디오북'
                  })
                }
              >
                <View style={styles.listItem}>
                  <Image source={IcMusic} style={styles.listItemIcon} />
                  <Text style={styles.listItemTitle}>구매한 오디오북</Text>
                  <Image
                    source={IcAngleRight}
                    style={[styles.listItemBullet, { marginLeft: 'auto' }]}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.listItemBarContainer}>
                <View style={styles.listItemBar} />
                <View style={styles.listItemBarBullet} />
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('AudioBookTicketPage', {
                    title: '나의 오디오북 이용권'
                  })
                }
              >
                <View style={styles.listItem}>
                  <Image source={IcMusic} style={styles.listItemIcon} />
                  <Text style={styles.listItemTitle}>나의 오디오북 이용권</Text>
                  <Image
                    source={IcAngleRight}
                    style={[styles.listItemBullet, { marginLeft: 'auto' }]}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.listItemBarContainer}>
                <View style={styles.listItemBar} />
                <View style={styles.listItemBarBullet} />
              </View>

              {/*
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('UserHeartContentsPage', {
                    title: '좋아요한 콘텐츠'
                  })
                }
              >
                <View style={styles.listItem}>
                  <Image source={IcMusic} style={styles.listItemIcon} />
                  <Text style={styles.listItemTitle}>좋아요한 콘텐츠</Text>
                  <Image
                    source={IcAngleRight}
                    style={[styles.listItemBullet, { marginLeft: 'auto' }]}
                  />
                </View>
              </TouchableOpacity>
				*/}

              <View style={styles.listItemBarContainer}>
                <View style={styles.listItemBar} />
                <View style={styles.listItemBarBullet} />
              </View>

              <View style={styles.listItemBarContainer}>
                <View style={styles.listItemBar} />
                <View style={styles.listItemBarBullet} />
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('DownloadContentPage', {
                    title: '다운로드 콘텐츠'
                  })
                }
              >
                <View style={styles.listItem}>
                  <Image source={IcDownload} style={styles.listItemIcon} />
                  <Text style={styles.listItemTitle}>다운로드 콘텐츠</Text>
                  <Image
                    source={IcAngleRight}
                    style={[styles.listItemBullet, { marginLeft: 'auto' }]}
                  />
                </View>
              </TouchableOpacity>

              {/*고객사 요청으로 화면에서 감춤 처리*/}
              {1 === 2 && (
                <View>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('SetTagPage', {
                        title: '관심태그 설정하기'
                      })
                    }
                  >
                    <View style={styles.listItem}>
                      <Image source={IcTag} style={styles.listItemIcon} />
                      <Text style={styles.listItemTitle}>
                        관심태그 설정하기
                      </Text>
                      <Image
                        source={IcAngleRight}
                        style={[styles.listItemBullet, { marginLeft: 'auto' }]}
                      />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.listItemBarContainer}>
                    <View style={styles.listItemBar} />
                    <View style={styles.listItemBarBullet} />
                  </View>
                </View>
              )}
              {/*
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => navigation.navigate('ClipPlayListPage', {title: '최근 재생 강의클립'})}>
							<View style={styles.listItem}>
								<Image source={IcPlay} style={styles.listItemIcon}/>
								<Text style={styles.listItemTitle}>최근 재생 강의클립</Text>
								<Image source={IcAngleRight} style={[styles.listItemBullet, {marginLeft: 'auto'}]}/>
							</View>
						</TouchableOpacity>
						*/}
              {/*고객사 요청으로 화면에서 감춤 처리*/}
              {1 === 2 && (
                <View>
                  <View style={styles.listItemBarContainer}>
                    <View style={styles.listItemBar} />
                    <View style={styles.listItemBarBullet} />
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('MyLogPage', {
                        title: '활동로그 보기'
                      })
                    }
                  >
                    <View style={styles.listItem}>
                      <Image source={IcProfile} style={styles.listItemIcon} />
                      <Text style={styles.listItemTitle}>활동로그 보기</Text>
                      <Image
                        source={IcAngleRight}
                        style={[styles.listItemBullet, { marginLeft: 'auto' }]}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {/*고객사 요청으로 화면에서 감춤 처리*/}
            {1 === 2 && (
              <View>
                <View style={{ height: 8 }} />
                <View style={styles.sectionLayout}>
                  <Text style={styles.sectionTitle}>윌라친구</Text>
                  <Text style={styles.friendParagraph}>
                    친구와 함께하면 스마트러닝이 더 즐겁습니다!
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('FriendPage', { title: '친구보기' })
                    }
                  >
                    <View style={styles.friendButton} borderRadius={5}>
                      <Text style={styles.friendButtonText}>친구보기</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View>
              <View style={{ height: 8 }} />
              <View style={styles.sectionLayout}>
                <Text style={styles.sectionTitle}>알림 문의</Text>
                {/*
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() =>
                      navigation.navigate('GuideListPage', {
                        title: '윌라소개 & 이용가이드'
                      })
                    }
                  >
                    <View style={styles.guideItem}>
                      <Text style={styles.guideTitle}>
                        윌라소개 & 이용가이드
                      </Text>
                    </View>
                  </TouchableOpacity>
                */}
                <View style={styles.guideHr} />
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate('EventListPage', {
                      title: '이벤트'
                    })
                  }
                >
                  <View style={styles.guideItem}>
                    <Text style={styles.guideTitle}>이벤트</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.guideHr} />
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    navigation.navigate('InquireListPage', {
                      title: '1:1 문의'
                    })
                  }
                >
                  <View style={styles.guideItem}>
                    <Text style={styles.guideTitle}>1:1 문의</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.guideHr} />
              </View>

              <View style={{ height: 8 }} />
            </View>

            {/* /* 아이폰 구매내역 복원 */}

            {Platform.OS === 'ios' && (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1
                }}
              >
                <View style={{ height: 8 }} />
                <TouchableOpacity
                  onPress={() => {
                    try {
                      native.restore({ token: globalStore.accessToken });
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <View
                    style={[styles.buttonRestore, { width: 200 }]}
                    borderRadius={5}
                  >
                    <Text style={styles.buttonRestoreText}>
                      {'아이폰 구매내역 복원'}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={{ height: 16 }} />
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
