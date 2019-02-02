import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import ClipListItem from './ClipListItem';
import ChapterListItem from './ChapterListItem';
import moment from 'moment';
import IcPlay from '../../../images/ic-play-dark.png';

const styles = StyleSheet.create({
  clipListContainer: {
    paddingBottom: 30,
    backgroundColor: '#ffffff',
  },
  clipInfoText: {
    paddingLeft: 5,
    fontSize: 13,
    color: '#353A3C',
  },
  clipInfoTextImportant: {
    fontWeight: 'bold',
    color: CommonStyles.COLOR_PRIMARY,
  },
  chapterListContainer: {
    paddingBottom: 30,
  },
  chapterInfoText: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 13,
    color: '#34342C',
  },
  notReadyText: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 13,
    color: '#34342C',
    borderWidth: 1,
    borderColor: '#bbbbbe',
    padding: 15,
  },
  chapterInfoTextImportant: {
    fontWeight: 'bold',
    color: CommonStyles.COLOR_PRIMARY,
  },
  chapterTitleText: {
    paddingTop: 40,
    paddingBottom: 15,
    fontWeight: 'bold',
    fontSize: 18,
    color: CommonStyles.COLOR_PRIMARY,
  },
  chapterHr: {
    width: '100%',
    height: 1,
    backgroundColor: '#dddddd',
  },
  btnSetSmall: {
    width: 14,
    height: 14,
  },
});

export default class TabContentList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const playTime = moment.duration(this.props.store.itemData.play_time);
    const itemClipData = this.props.store.itemClipData.toJS();
    let realLength = 0;

    itemClipData.forEach((ad, idx) => {
      if (itemClipData[idx].play_time !== '00:00:00') {
        realLength++;
      }
    });

    return (
      <View>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.clipListContainer}>
            <View style={CommonStyles.contentContainer}>
              <View
                style={[
                  CommonStyles.alignJustifyFlex,
                  { marginTop: 30, marginBottom: 15 },
                ]}
              >
                <Image source={IcPlay} style={styles.btnSetSmall} />
                <Text style={styles.clipInfoText}>
                  전체 재생시간{' '}
                  <Text
                    style={styles.clipInfoTextImportant}
                  >{`${playTime.hours()}시간 ${playTime.minutes()}분`}</Text>
                </Text>
              </View>

              {this.props.learnType === 'class' && (
                <FlatList
                  style={{ width: '100%' }}
                  data={this.props.store.itemClipData}
                  renderItem={({ item }) => (
                    <ClipListItem type={'detailClip'} itemData={item} />
                  )}
                />
              )}

              {this.props.learnType === 'audioBook' && (
                <FlatList
                  style={{ width: '100%' }}
                  data={this.props.store.itemClipData}
                  renderItem={({ item }) => (
                    <ChapterListItem
                      itemData={item}
                      store={this.props.store}
                      paymentType={this.props.paymentType}
                      learnType={this.props.learnType}
                    />
                  )}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
