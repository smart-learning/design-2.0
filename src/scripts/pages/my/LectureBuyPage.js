import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import CommonStyles from '../../../styles/common';
import { SafeAreaView } from 'react-navigation';
import SummaryListItem from '../../components/my/SummaryListItem';
import { observer } from 'mobx-react';
import createStore from '../../commons/createStore';
import net from '../../commons/net';

@observer
class LectureBuyPage extends React.Component {
  store = createStore({
    isLoading: true,
    list: []
  });

  load = async () => {
    this.store.isLoading = true;
    this.store.list = await net.getPurchasedVideoCourses();
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
      id: this.props.id,
      title: this.props.title
    });
  };

  render() {
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
                    구매한 클래스가 없습니다.
                  </Text>
                </View>
              )}
            {this.store.list &&
              this.store.list.map((item, key) => {
                return (
                  <SummaryListItem
                    key={key}
                    thumbnail={item.data.images ? item.data.images.list : null}
                    title={item.data.headline}
                    author={item.data.teacher ? item.data.teacher.name : ''}
                    likeCount={item.data.like_count}
                    reviewCount={item.data.review_count}
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

export default LectureBuyPage;
