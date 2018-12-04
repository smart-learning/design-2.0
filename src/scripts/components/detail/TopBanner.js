import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import CommonStyles from '../../../styles/common';
import IcPlay from '../../../images/ic-play-detail.png';
import { observer } from 'mobx-react';
import Native from '../../commons/native';

const styles = StyleSheet.create({
  banner: {
    position: 'relative',
    height: 350,
    paddingTop: 15
    // paddingLeft: 15,
    // paddingRight: 15,
  },
  titleLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  titleLabel: {
    marginRight: 7,
    paddingTop: 2,
    paddingRight: 7,
    paddingBottom: 2,
    paddingLeft: 7
  },
  titleLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  titleLabelAudioBook: {
    backgroundColor: '#ffb71b'
  },
  titleLabelClass: {
    backgroundColor: '#ff761b'
  },
  titleLabelTitle: {
    fontSize: 12,
    color: '#ff761b'
  },
  headline: {
    width: '65%',
    marginBottom: 7,
    paddingLeft: 15,
    fontSize: 15,
    color: CommonStyles.COLOR_PRIMARY
  },
  title: {
    width: '65%',
    marginBottom: 7,
    paddingLeft: 15,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  author: {
    width: '65%',
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 13,
    color: '#ffffff'
  },
  audioBookPlayButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '30%',
    right: 15,
    width: 140,
    height: 140
  },
  audioBookAuthorThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  classPlayButtonContainer: {
    position: 'absolute',
    top: '50%',
    right: 15,
    width: 50,
    height: 50
  },
  playButton: {
    width: 50,
    height: 50
  },
  bookLabels: {
    paddingLeft: 15,
    marginBottom: 15
  },
  bookLabel: {
    height: 22,
    marginTop: 9,
    marginRight: 3,
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 3,
    paddingLeft: 10
  },
  bookLabelText: {
    fontSize: 12,
    color: '#ffffff'
  },
  bookLabelBlank: {
    borderColor: 'transparent',
    opacity: 0
  },
  bookLabelNew: {
    backgroundColor: '#5f45b4'
  },
  bookLabelExclusive: {
    backgroundColor: '#ff761b'
  },
  bookLabelFree: {
    backgroundColor: '#00afba'
  },
  bookLabelDefault: {
    backgroundColor: CommonStyles.COLOR_PRIMARY
  },
  itemDownload: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 15,
    height: 40,
    width: '100%'
  },
  itemDownloadSize: {
    fontSize: 12,
    color: '#555555'
  },
  itemDownloadCount: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
    paddingRight: 15,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: CommonStyles.COLOR_PRIMARY
  },
  itemDownloadCountText: {
    fontSize: 12,
    color: CommonStyles.COLOR_PRIMARY
  },
  bannerDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 350,
    backgroundColor: 'rgba(0,0,0,0.8)'
  }
});

@observer
export default class TopBanner extends React.Component {
  constructor(props) {
    super(props);

    this.learnType = this.learnType.bind(this);
  }

  learnType() {
    if (this.props.learnType === 'audioBook') {
      return '오디오북';
    } else if (this.props.learnType === 'class') {
      return '클래스';
    } else {
      return '';
    }
  }

  tryNativePlayerCall() {
    if (Platform.OS === 'ios') {
      Native.play(this.props.store.itemData.cid)
    } else if (Platform.OS === 'android') {
      // [Android/IOS][이어듣기] 상세화면 상단 재생 버튼 클릭시 첫 클립 제외 이어듣기 불가 #562
      // '001' 로 고정 되어서 들어오는 케이스
      Native.play(this.props.store.itemData.cid)
    }
  }

  render() {
    return (
      <ImageBackground
        style={styles.banner}
        resizeMode="cover"
        source={{ uri: this.props.store.itemData.images.list }}
      >
        <View style={styles.bannerDim} />
        {1 === 2 && (
          <View style={styles.titleLabelContainer}>
            <View
              style={
                this.props.learnType === 'audioBook'
                  ? [styles.titleLabel, styles.titleLabelAudioBook]
                  : [styles.titleLabel, styles.titleLabelClass]
              }
              borderRadius={10}
            >
              <Text style={styles.titleLabelText}>
                인기
                {this.learnType()}
              </Text>
            </View>
            <Text style={styles.titleLabelText}>
              종합순위 30위! 비즈니스스킬 5위!
            </Text>
          </View>
        )}
        {this.props.learnType === 'class' && (
          <Text style={styles.headline}>
            {this.props.store.itemData.headline}
          </Text>
        )}
        {this.props.learnType === 'audioBook' && (
          <Text style={styles.headline}>
            {this.props.store.itemData.subtitle}
          </Text>
        )}
        <Text style={styles.title}>{this.props.store.itemData.title}</Text>
        <Text style={styles.author}>
          {/* {this.props.store.itemData.teacher.name} */}
        </Text>
        <View style={[styles.bookLabels, CommonStyles.alignJustifyFlex]}>
          {!this.props.store.itemData.is_new &&
            !this.props.store.itemData.is_exclusive &&
            !this.props.store.itemData.is_free &&
            !this.props.store.itemData.is_bookreview &&
            !this.props.store.itemData.is_botm &&
            !this.props.store.itemData.audiobook_type && (
              <View
                style={[styles.bookLabel, styles.bookLabelBlank]}
                borderRadius={10}
              >
                <Text
                  style={[styles.bookLabelText, styles.bookLabelExclusiveText]}
                />
              </View>
            )}
          {!!this.props.store.itemData.is_new && (
            <View
              style={[styles.bookLabel, styles.bookLabelNew]}
              borderRadius={10}
            >
              <Text style={[styles.bookLabelText]}>New</Text>
            </View>
          )}
          {!!this.props.store.itemData.is_exclusive && (
            <View
              style={[styles.bookLabel, styles.bookLabelExclusive]}
              borderRadius={10}
            >
              <Text style={[styles.bookLabelText]}>독점</Text>
            </View>
          )}
          {!!this.props.store.itemData.is_botm && (
            <View
              style={[styles.bookLabel, styles.bookLabelExclusive]}
              borderRadius={10}
            >
              <Text style={[styles.bookLabelText]}>이달의책</Text>
            </View>
          )}
          {!!this.props.store.itemData.is_free && (
            <View
              style={[styles.bookLabel, styles.bookLabelFree]}
              borderRadius={10}
            >
              <Text style={[styles.bookLabelText]}>무료</Text>
            </View>
          )}
          {!!this.props.store.itemData.is_bookreview && (
            <View
              style={[styles.bookLabel, styles.bookLabelFree]}
              borderRadius={10}
            >
              <Text style={[styles.bookLabelText]}>북리뷰</Text>
            </View>
          )}
          {this.props.store.itemData.audiobook_type === '완독' && (
            <View
              style={[styles.bookLabel, styles.bookLabelDefault]}
              borderRadius={10}
            >
              <Text style={[styles.bookLabelText]}>완독</Text>
            </View>
          )}
          {this.props.store.itemData.audiobook_type === '요약' && (
            <View
              style={[styles.bookLabel, styles.bookLabelDefault]}
              borderRadius={10}
            >
              <Text style={[styles.bookLabelText]}>요약</Text>
            </View>
          )}
        </View>
        {/*
			<View style={[CommonStyles.alignJustifyContentBetween, styles.itemDownload]}>
				<Text style={styles.itemDownloadSize}>
					전체 다운로드 {this.props.store.itemData.file_size}
				</Text>
				<View style={styles.itemDownloadCount} borderRadius={5}>
					<Text style={styles.itemDownloadCountText}>
						3/{this.props.store.itemData.clip_count} 다운로드 완료
					</Text>
				</View>
			</View>
			*/}
        {this.props.learnType === 'audioBook' && (
          <View style={styles.audioBookPlayButtonContainer}>
            <ImageBackground
              source={{ uri: this.props.store.itemData.images.cd }}
              resizeMode={'cover'}
              borderRadius={70}
              style={styles.audioBookAuthorThumbnail}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => Native.play(this.props.store.itemData.cid)}
              >
                <Image source={IcPlay} style={styles.playButton} />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        )}

        {this.props.learnType === 'class' && (
          <View style={styles.classPlayButtonContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                this.tryNativePlayerCall()
              }
            >
              <Image source={IcPlay} style={styles.playButton} />
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    );
  }
}
