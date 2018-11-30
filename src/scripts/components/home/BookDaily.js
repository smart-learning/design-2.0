import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import CommonStyles, { COLOR_PRIMARY } from '../../../styles/common';
import BookDailyList from '../../components/home/BookDailyList';
import { observer } from 'mobx-react';
import createStore from '../../commons/createStore';
import moment from 'moment';

const styles = StyleSheet.create({
  mainTitleCenter: {
    textAlign: 'center'
  },
  titleH2: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333'
  },
  titleH4: {
    paddingTop: 10,
    fontSize: 13,
    color: '#888888'
  },
  dailyCategory: {
    marginTop: 20,
    marginBottom: 20
  },
  categoryHr: {
    width: '100%',
    height: 1,
    backgroundColor: '#cecece'
  },
  categoryContainer: {
    width: '100%',
    height: 40
  },
  categoryItem: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryText: {
    color: '#555555',
    fontSize: 14,
    textAlign: 'center'
  },
  categoryButton: {
    position: 'relative',
    padding: 12
  },
  categoryButtonHr: {
    position: 'absolute',
    bottom: -10,
    left: -3,
    width: 20,
    height: 3,
    backgroundColor: '#ffffff'
  },
  categoryButtonHrActive: {
    position: 'absolute',
    bottom: -10,
    left: -3,
    width: 20,
    height: 3,
    backgroundColor: COLOR_PRIMARY
  },
  dailyBookHeadlineText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    color: '#333333'
  },
  dailyBookContentHeadline: {},
  showMoreWrapper: {
    marginBottom: 10,
    alignItems: 'flex-end'
  },
  showMore: {
    paddingTop: 2,
    paddingRight: 10,
    paddingBottom: 2,
    paddingLeft: 10,
    borderColor: CommonStyles.COLOR_PRIMARY,
    borderWidth: 1,
    borderRadius: 18,
    color: CommonStyles.COLOR_PRIMARY
  }
});

@observer
class BookDaily extends React.Component {
  data = createStore({
    today: '',
    dailyTabSelected: 'Mon',
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
  });

  componentDidMount() {
    if (this.props.itemData) {
      this.data.monday = this.props.itemData['월'];
      this.data.tuesday = this.props.itemData['화'];
      this.data.wednesday = this.props.itemData['수'];
      this.data.thursday = this.props.itemData['목'];
      this.data.friday = this.props.itemData['금'];
    }

    this.data.today = moment().format('ddd');
    this.data.dailyTabSelected = moment().format('ddd');
  }

  componentDidUpdate() {
    if (this.props.itemData) {
      this.data.monday = this.props.itemData['월'];
      this.data.tuesday = this.props.itemData['화'];
      this.data.wednesday = this.props.itemData['수'];
      this.data.thursday = this.props.itemData['목'];
      this.data.friday = this.props.itemData['금'];
    }
  }

  render() {
    return (
      <View>
        {/*헤더*/}
        <View>
          <Text style={[styles.mainTitleCenter, styles.titleH2]}>
            매일 책 한 권
          </Text>
          <Text style={[styles.mainTitleCenter, styles.titleH4]}>
            책 좀 아는 사람들이 요약해 주는 읽은 척 매뉴얼
          </Text>
        </View>
        <View style={styles.showMoreWrapper}>
          <TouchableOpacity
            style={styles.showMore}
            onPress={() => {
              this.props.navigation.navigate('AudioBookPage');
            }}
          >
            <Text>전체보기</Text>
          </TouchableOpacity>
        </View>

        {/*카테고리*/}
        <View style={styles.dailyCategory}>
          <View style={styles.categoryHr} />
          <View
            style={[CommonStyles.alignJustifyFlex, styles.categoryContainer]}
          >
            <View style={styles.categoryItem}>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => (this.data.dailyTabSelected = 'Mon')}
              >
                <View>
                  <Text style={styles.categoryText}>월</Text>
                  <View
                    style={
                      this.data.dailyTabSelected === 'Mon'
                        ? styles.categoryButtonHrActive
                        : styles.categoryButtonHr
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryItem}>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => (this.data.dailyTabSelected = 'Tue')}
              >
                <View>
                  <Text style={styles.categoryText}>화</Text>
                  <View
                    style={
                      this.data.dailyTabSelected === 'Tue'
                        ? styles.categoryButtonHrActive
                        : styles.categoryButtonHr
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryItem}>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => (this.data.dailyTabSelected = 'Wed')}
              >
                <View>
                  <Text style={styles.categoryText}>수</Text>
                  <View
                    style={
                      this.data.dailyTabSelected === 'Wed'
                        ? styles.categoryButtonHrActive
                        : styles.categoryButtonHr
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryItem}>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => (this.data.dailyTabSelected = 'Thu')}
              >
                <View>
                  <Text style={styles.categoryText}>목</Text>
                  <View
                    style={
                      this.data.dailyTabSelected === 'Thu'
                        ? styles.categoryButtonHrActive
                        : styles.categoryButtonHr
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryItem}>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => (this.data.dailyTabSelected = 'Fri')}
              >
                <View>
                  <Text style={styles.categoryText}>금</Text>
                  <View
                    style={
                      this.data.dailyTabSelected === 'Fri' ||
                      this.data.dailyTabSelected === 'Sat' ||
                      this.data.dailyTabSelected === 'Sun'
                        ? styles.categoryButtonHrActive
                        : styles.categoryButtonHr
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.categoryHr} />
        </View>

        {/*콘텐츠*/}
        <View>
          {this.data.dailyTabSelected === 'Mon' ? (
            <View style={styles.dailyBookContentHeadline}>
              <Text style={styles.dailyBookHeadlineText}>
                [월] 하지현의 마음을 치유하는 책
              </Text>
              <View>
                <BookDailyList
                  today={this.data.today}
                  itemDay={'Mon'}
                  itemData={this.data.monday}
                />
              </View>
            </View>
          ) : this.data.dailyTabSelected === 'Tue' ? (
            <View style={styles.dailyBookContentHeadline}>
              <Text style={styles.dailyBookHeadlineText}>
                [화] 권영설의 내일을 위한 책
              </Text>
              <View>
                <BookDailyList
                  today={this.data.today}
                  itemDay={'Tue'}
                  itemData={this.data.tuesday}
                />
              </View>
            </View>
          ) : this.data.dailyTabSelected === 'Wed' ? (
            <View style={styles.dailyBookContentHeadline}>
              <Text style={styles.dailyBookHeadlineText}>
                [수] 홍순철의 젠틀한 독서
              </Text>
              <View>
                <BookDailyList
                  today={this.data.today}
                  itemDay={'Wed'}
                  itemData={this.data.wednesday}
                />
              </View>
            </View>
          ) : this.data.dailyTabSelected === 'Thu' ? (
            <View style={styles.dailyBookContentHeadline}>
              <Text style={styles.dailyBookHeadlineText}>
                [목] 한미화의 인생책방
              </Text>
              <View>
                <BookDailyList
                  today={this.data.today}
                  itemDay={'Thu'}
                  itemData={this.data.thursday}
                />
              </View>
            </View>
          ) : this.data.dailyTabSelected === 'Fri' ||
            this.data.dailyTabSelected === 'Sat' ||
            this.data.dailyTabSelected === 'Sun' ? (
            <View style={styles.dailyBookContentHeadline}>
              <Text style={styles.dailyBookHeadlineText}>
                [금] 이영미의 밤 새워 읽고 싶은 책
              </Text>
              <View>
                <BookDailyList
                  today={this.data.today}
                  itemDay={'Fri'}
                  itemData={this.data.friday}
                />
              </View>
            </View>
          ) : (
            undefined
          )}
        </View>
      </View>
    );
  }
}

export default withNavigation(BookDaily);
