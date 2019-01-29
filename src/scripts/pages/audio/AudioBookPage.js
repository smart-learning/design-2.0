import React from 'react';
import CommonStyles from '../../../styles/common';
import { observable } from 'mobx';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, withNavigation } from 'react-navigation';
import PageCategory from '../../components/PageCategory';
import net from '../../commons/net';
import Book from '../../components/audio/Book';
import _ from 'underscore';
import { observer } from 'mobx-react';
import PageCategoryItemVO from '../../vo/PageCategoryItemVO';
import BookVO from '../../vo/BookVO';
import createStore from '../../commons/createStore';
import AudioBookInfoPage from './AudioBookInfoPage';
import AudioBookListItem from '../../components/audio/AudioBookListItem';

const styles = StyleSheet.create({
  toggleGroup: {
    width: '100%',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  alignJustify: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortWrap: {
    width: 100,
  },
  sortButton: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  sortText: {
    fontSize: 12,
    color: '#4A4A4A',
  },
  sortTextActive: {
    fontSize: 12,
    color: CommonStyles.COLOR_PRIMARY,
    fontWeight: 'bold',
  },
  sortBar: {
    width: 1,
    height: 10,
    marginRight: 8,
    backgroundColor: '#E2E2E2',
  },
  myButton: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#CBCBCB',
  },
  myButtonText: {
    fontSize: 12,
    color: '#585858',
  },
  linkViewAll: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 36,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  classLinkViewAll: {
    marginTop: 15,
    marginBottom: 30,
  },
  linkViewAllText: {
    fontSize: 14,
    color: '#ffffff',
  },
  linkViewAllIcon: {
    paddingLeft: 7,
    height: 13,
  },
});

@observer
class AudioBookPage extends React.Component {
  store = createStore({
    isLoading: true,
    categories: [],
    displayData: null,
    selectedCategory: null,
    ccode: null,
    pagination: {},
  });

  // 인기 , 신규 조회 조건 , 'hot' , 'new'
  @observable
  tabSortStatus = 'hot';

  loadAudioList = async (ccode = null, page = 1, sort) => {
    this.store.isLoading = true;
    if (page === 1) {
      this.store.displayData = null;
    }
    if (sort) {
      this.tabSortStatus = sort;
    }
    const data = await net.getAudioBookList(ccode, page, this.tabSortStatus);
    const VOs = data.items.map((element, n) => {
      const vo = new BookVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      if (!vo.thumbnail) {
        vo.thumbnail = vo.images.book;
      }
      if (!vo.banner_color) {
        vo.banner_color = 'transparent';
      }
      vo.rankNumber = (page - 1) * 10 + (n + 1);
      return vo;
    });
    if (page === 1) {
      this.store.displayData = VOs;
    } else {
      _.each(VOs, e => this.store.displayData.push(e));
    }
    this.store.ccode = ccode;
    this.store.pagination = data.pagination;
    this.store.isLoading = false;
  };

  loadMore = () => {
    if (this.store.pagination['has-next']) {
      this.loadAudioList(this.store.ccode, this.store.pagination.page + 1);
    }
  };

  async componentDidMount() {
    this.props.navigation.setParams({ title: '오디오북 전체목록' });

    const currCategory = this.props.navigation.getParam('data', {});
    const ccode = currCategory.ccode ? currCategory.ccode : null;
    this.store.ccode = ccode;
    this.store.selectedCategory = currCategory.id ? currCategory.id : 0;

    const loadedCategories = await net.getAudioBookCategory();
    this.store.categories = loadedCategories.map(element => {
      const vo = new PageCategoryItemVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      vo.label = element.title;
      return vo;
    });
    this.loadAudioList(ccode);
  }

  onCategorySelect = item => {
    this.store.selectedCategory = item.id;
    this.loadAudioList(item.ccode).catch(e => {
      console.log(e);
    });
  };

  _renderHeader() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          alignSelf: 'flex-start',
          backgroundColor: '#FFFFFF',
        }}
      >
        <View
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <PageCategory
            selectedCategory={this.store.selectedCategory}
            data={this.store.categories}
            onCategorySelect={this.onCategorySelect}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: 1,
            marginTop: 12,
            backgroundColor: '#E2E2E2',
          }}
        />

        <View style={styles.toggleGroup}>
          <View style={styles.alignJustify}>
            <View style={styles.sortWrap}>
              <View style={styles.alignJustify}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    this.loadAudioList(this.store.ccode, 1, 'hot');
                  }}
                  style={[styles.alignJustify, styles.sortButton]}
                >
                  <Text
                    style={
                      this.tabSortStatus === 'hot'
                        ? styles.sortTextActive
                        : styles.sortText
                    }
                  >
                    인기
                  </Text>
                </TouchableOpacity>
                <View style={styles.sortBar} />
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    this.loadAudioList(this.store.ccode, 1, 'new');
                  }}
                  style={[styles.alignJustify, styles.sortButton]}
                >
                  <Text
                    style={
                      this.tabSortStatus === 'new'
                        ? styles.sortTextActive
                        : styles.sortText
                    }
                  >
                    신규
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* <TouchableOpacity
                  activeOpacity={0.9}
                  style={{ marginLeft: 'auto' }}
                  onPress={() => {
                    this.props.navigation.navigate('AudioBookBuyPage');
                  }}
                >
                  <View style={styles.myButton} borderRadius={3}>
                    <Text style={styles.myButtonText}>내 오디오북 보기</Text>
                  </View>
                </TouchableOpacity> */}
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <View
              style={{ width: '100%', paddingTop: 82, paddingHorizontal: 15 }}
            >
              {this.store.displayData !== null ? (
                <FlatList
                  data={this.store.displayData}
                  ListFooterComponent={() => {
                    return !this.store.isLoading &&
                      this.store.pagination['has-next'] ? (
                      <TouchableOpacity
                        style={{ width: '100%', paddingHorizontal: 10 }}
                        activeOpacity={0.9}
                        onPress={this.loadMore}
                      >
                        <View
                          style={[styles.linkViewAll, styles.classLinkViewAll]}
                          borderRadius={5}
                        >
                          <Text style={styles.linkViewAllText}>더보기</Text>
                        </View>
                      </TouchableOpacity>
                    ) : null;
                  }}
                  renderItem={({ item }) => (
                    <AudioBookListItem
                      id={item.id}
                      navigation={this.props.navigation}
                      itemData={item}
                    />
                  )}
                />
              ) : (
                undefined
              )}
            </View>

            <View style={[CommonStyles.contentContainer, { width: '100%' }]}>
              {this.store.isLoading && (
                <View style={{ marginTop: 12 }}>
                  <ActivityIndicator
                    size="large"
                    color={CommonStyles.COLOR_PRIMARY}
                  />
                </View>
              )}
            </View>
          </ScrollView>
          {this._renderHeader()}
        </SafeAreaView>
      </View>
    );
  }
}
export default withNavigation(AudioBookPage);
