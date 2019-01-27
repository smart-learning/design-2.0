import React from 'react';
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
import { SafeAreaView } from 'react-navigation';
import CommonStyles from '../../../styles/common';
import Lecture from '../../components/video/Lecture';
import net from '../../commons/net';
import PageCategory from '../../components/PageCategory';
import PageCategoryItemVO from '../../vo/PageCategoryItemVO';
import SummaryVO from '../../vo/SummaryVO';
import _ from 'underscore';
import createStore from '../../commons/createStore';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

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
  clipButton: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#CBCBCB',
  },
  clipButtonText: {
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
class ClassListPage extends React.Component {
  store = createStore({
    isLoading: true,
    displayData: null,
    categories: [],
    selectedCategory: null,
    ccode: null,
    pagination: {},
    has_next: false,
  });

  // 인기 , 신규 조회 조건 , 'hot' , 'new'
  @observable
  tabSortStatus = 'hot';

  loadClassList = async (ccode = null, page = 1, sort) => {
    this.store.isLoading = true;
    if (page === 1) {
      this.store.displayData = null;
    }
    if (sort) {
      this.tabSortStatus = sort;
    }

    const data = await net.getClassList(ccode, page, this.tabSortStatus);
    let list = data;
    if (!_.isArray(list)) {
      list = [];
    }
    const VOs = data.items.map(element => {
      const vo = new SummaryVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      if (!vo.thumbnail) {
        vo.thumbnail = vo.images.wide;
      }
      return vo;
    });

    if (page === 1) {
      this.store.displayData = VOs;
    } else {
      _.each(VOs, e => this.store.displayData.push(e));
    }
    this.store.ccode = ccode;
    // TODO: V1.1 대응 페이지네이션 처리 추가.
    this.store.pagination = data.pagination;
    this.store.isLoading = false;
  };

  loadMore = () => {
    if (this.store.pagination['has-next']) {
      this.loadClassList(this.store.ccode, this.store.pagination.page + 1);
    }
  };

  async componentDidMount() {
    this.props.navigation.setParams({ title: '클래스 전체목록' });

    const currCategory = this.props.navigation.getParam('data', {});
    const ccode = currCategory.ccode ? currCategory.ccode : null;
    this.store.ccode = ccode;
    this.store.selectedCategory = currCategory.id ? currCategory.id : 0;

    await this.loadClassList();
    let categories = await net.getLectureCategory();
    if (!_.isArray(categories)) {
      categories = [];
    }
    this.store.categories = categories.map(element => {
      const vo = new PageCategoryItemVO();
      _.each(element, (value, key) => (vo[key] = value));
      vo.key = element.id.toString();
      vo.label = element.title;
      return vo;
    });

    // // action으로 정해둔 네임에 따라 초기 행동을 결정
    // const action = this.props.navigation.getParam('action');
    // const actionData = this.props.navigation.getParam('data');
    //
    // // console.log( 'navigate params:', action, actionData );
    //
    // switch( action ){
    // 	case 'category': // from HomeVideoPage
    // 		this.onCategorySelect( actionData );
    // 		break;
    //
    // 	// case 'item': // from ClassListPage
    // 	// 	// TODO: 들어온 actionData로 뭔가 해주셔야할듯...
    // 	// 	break;
    // }
    this.loadClassList(ccode);
  }

  onCategorySelect = item => {
    this.store.selectedCategory = item.id;
    this.loadClassList(item.ccode);
  };

  _renderHeader() {
    return (
      <View style={{ position: 'absolute', top: 0, width: '100%' }}>
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
            marginHorizontal: 15,
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
                    this.loadClassList(this.store.ccode, 1, 'hot');
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
                    this.loadClassList(this.store.ccode, 1, 'new');
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
            {/* <TouchableOpacity activeOpacity={0.9}
										  style={{marginLeft: 'auto'}}
										  onPress={() => {
											  this.props.navigation.navigate('ClipPage')
										  }}
						>
							<View style={styles.clipButton} borderRadius={3}>
								<Text style={styles.clipButtonText}>강의클립 전체보기</Text>
							</View>
						</TouchableOpacity> */}
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView
        style={[CommonStyles.container, { justifyContent: 'flex-start' }]}
      >
        <ScrollView style={{ flex: 1 }}>
          <View style={{ width: '100%', paddingTop: 82 }}>
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
                  <Lecture
                    id={item.id}
                    navigation={this.props.navigation}
                    item={item}
                  />
                )}
              />
            ) : (
              undefined
            )}

            <View style={CommonStyles.contentContainer}>
              {this.store.isLoading ? (
                <View style={{ marginTop: 12 }}>
                  <ActivityIndicator
                    size="large"
                    color={CommonStyles.COLOR_PRIMARY}
                  />
                </View>
              ) : (
                undefined
              )}
            </View>
          </View>

          {this._renderHeader()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default ClassListPage;
