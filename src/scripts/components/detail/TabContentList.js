import React from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView } from 'react-native';
import CommonStyles from '../../../styles/common';
import ClipListItem from './ClipListItem';
import ChapterListItem from './ChapterListItem';
import moment from 'moment';

const styles = StyleSheet.create({
  clipListContainer: {
    paddingBottom: 30,
    backgroundColor: '#2a2c31'
  },
  clipInfoText: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 13,
    color: '#ffffff'
  },
  clipInfoTextImportant: {
    fontWeight: 'bold',
    color: CommonStyles.COLOR_PRIMARY
  },
  chapterListContainer: {
    paddingBottom: 30
  },
  chapterInfoText: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 13,
    color: '#34342C'
  },
  notReadyText: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 13,
    color: '#34342C',
    borderWidth: 1,
    borderColor: '#bbbbbe',
    padding: 15
  },
  chapterInfoTextImportant: {
    fontWeight: 'bold',
    color: CommonStyles.COLOR_PRIMARY
  },
  chapterTitleText: {
    paddingTop: 40,
    paddingBottom: 15,
    fontWeight: 'bold',
    fontSize: 18,
    color: CommonStyles.COLOR_PRIMARY
  },
  chapterHr: {
    width: '100%',
    height: 1,
    backgroundColor: '#dddddd'
  }
});

export default class TabContentList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const playTime = moment.duration(this.props.store.itemData.play_time);

    return (
      <View>
        <ScrollView style={{ flex: 1 }}>
          {this.props.learnType === 'class' && (
            <View style={styles.clipListContainer}>
              <View style={CommonStyles.contentContainer}>
                <Text style={styles.clipInfoText}>
                  <Text style={styles.clipInfoTextImportant}>
                    {this.props.store.itemClipData.length}개
                  </Text>
                  강의클립, 전체 재생시간
                  <Text
                    style={styles.clipInfoTextImportant}
                  >{`${playTime.hours()}시간 ${playTime.minutes()}분`}</Text>
                </Text>

                <FlatList
                  style={{ width: '100%' }}
                  data={this.props.store.itemClipData}
                  renderItem={({ item }) => (
                    <ClipListItem type={'detailClip'} itemData={item} />
                  )}
                />
              </View>
            </View>
          )}

          {this.props.learnType === 'audioBook' && (
            <View style={styles.chapterListContainer}>
              <View style={CommonStyles.contentContainer}>
                <Text style={styles.chapterInfoText}>
                  <Text style={styles.clipInfoTextImportant}>
                    {this.props.store.itemClipData.length}개
                  </Text>
                  챕터, 전체 재생시간
                  <Text
                    style={styles.clipInfoTextImportant}
                  >{`${playTime.hours()}시간 ${playTime.minutes()}분`}</Text>
                </Text>

                <View>
                  <Text style={styles.chapterTitleText}>목차</Text>
                  <View style={styles.chapterHr} />
                </View>

                <FlatList
                  style={{ width: '100%' }}
                  data={this.props.store.itemClipData}
                  renderItem={({ item }) =>
                    <ChapterListItem
                      itemData={item}
                      store={this.props.store}
                      paymentType={this.props.paymentType}
                      learnType={this.props.learnType} />}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
