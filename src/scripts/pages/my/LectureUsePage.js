import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import CommonStyles from '../../../styles/common';
import { SafeAreaView } from 'react-navigation';
import SummaryListItem from '../../components/my/SummaryListItem';
import { observer } from 'mobx-react';
import createStore from '../../commons/createStore';
import net from '../../commons/net';

@observer
class LectureUsePage extends React.Component {
  store = createStore({
    isLoading: true,
    list: []
  });

  load = async () => {
    this.store.isLoading = true;
    this.store.list = await net.getPlayRecentVideoCourses();
    if (!this.store.list) {
      this.store.list = [];
    }
    this.store.isLoading = false;
  };

  componentDidMount() {
    this.load();
  }

  goLecture = item => {
    this.props.navigation.navigate('ClassDetail', {
      id: item.data.id,
      title: item.data.headline
    });
  };

  render() {
    // TODO: is_like 에 대한 정보가 필요할 듯. 매번 별개의 API를 호출하면 너무 느려진다.
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            {this.store.isLoading && (
              <View style={{ marginTop: 12 }}>
                <ActivityIndicator
                  size="large"
                  color={CommonStyles.COLOR_PRIMARY}
                />
              </View>
            )}
            {!this.store.isLoading &&
              this.store.list.length === 0 && (
                <View style={{ marginTop: 12 }}>
                  <Text style={{ textAlign: 'center' }}>
                    최근 재생 클래스가 없습니다.
                  </Text>
                </View>
              )}
            {this.store.list &&
              this.store.list.map((item, key) => {
                console.log('item', item);
                return (
                  <SummaryListItem
                    key={key}
                    thumbnail={item.data.images ? item.data.images.list : null}
                    title={item.data.headline}
                    author={item.data.teacher ? item.data.teacher.name : ''}
                    likeCount={item.data.meta?item.data.meta.like_count:item.data.like_count}
                    reviewCount={item.data.meta?item.data.meta.comment_count:item.data.review_count}
                    isLike={false}
                    navigation={this.props.navigation}
                    onPress={() => this.goLecture(item)}
                  />
                );
              })}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default LectureUsePage;
