import React from 'react';
import Summary from '../../components/video/Summary';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { COLOR_PRIMARY } from '../../../styles/common';
import Native from '../../commons/native';
import { observer } from 'mobx-react';

const styles = StyleSheet.create({
  bookListItemContainer: {
    position: 'relative',
    marginBottom: 15,
    padding: 13,

    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dddddd'
  },
  bookListItemHeadline: {
    marginBottom: 13
  },
  bookLabel: {
    height: 22,
    marginTop: 9,
    marginRight: 3,
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 3,
    paddingLeft: 10,
    alignSelf: 'flex-start'
  },
  bookLabels: {
    marginBottom: 15
  },
  bookLabelFree: {
    backgroundColor: '#00afba'
  },
  bookLabelText: {
    fontSize: 12,
    color: '#ffffff'
  },
  dateBox: {
    position: 'relative',
    flexDirection: 'column',
    marginTop: 0,
    marginBottom: 0,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  date: {
    textAlign: 'center',
    fontSize: 15,
    color: COLOR_PRIMARY
  },
  dateHr: {
    width: 50,
    height: 1,
    backgroundColor: COLOR_PRIMARY
  },
  dateHrActive: {
    width: 90,
    height: 1,
    backgroundColor: COLOR_PRIMARY
  },
  listItemTitle: {
    fontSize: 16,
    color: '#333333',
    marginTop: 14
  },
  summaryDim: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    width: '100%',
    paddingTop: '22%',
    paddingBottom: '22%',
    backgroundColor: 'rgba(255,255,255,0.1)'
  }
});

@observer
class BookDailyList extends React.Component {
  render() {
    let itemData = {};
    let month;
    let day;
    let mm;
    let dd;
    try {
      itemData = this.props.itemData;

      month = moment(itemData.open_date).format('M');
      day = moment(itemData.open_date).format('D');

      var today = new Date();
      dd = today.getDate();
      mm = today.getMonth() + 1; //January is 0!
    } catch (error) {
      console.log(error);
    }

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => Native.play(itemData.cid)}
      >
        <View style={styles.bookListItemContainer}>
          <View style={styles.bookListItemHeadline}>
            <View style={styles.dateBox}>
              <Text style={styles.date}>
                {mm == month && dd == day ? 'Today' : ''} {month} / {day}
              </Text>
              <View
                style={
                  this.props.today === this.props.itemDay
                    ? styles.dateHrActive
                    : styles.dateHr
                }
              />
            </View>
            <Text style={styles.listItemTitle}>
              {itemData ? itemData.title : ''}
            </Text>
          </View>
          <View style={styles.bookLabels}>
            <View
              style={[styles.bookLabel, styles.bookLabelFree]}
              borderRadius={10}
            >
              <Text style={[styles.bookLabelText]}>무료</Text>
            </View>
          </View>
          <View>
            <Summary
              type={'dailyBook'}
              itemData={itemData}
              thumbnail={itemData ? itemData.image : 'bookDummy'}
              cid={itemData ? itemData.cid : ''}
              hitCount={itemData ? itemData.hit_count : ''}
              starAvg={itemData ? itemData.star_avg : ''}
              reviewCount={itemData ? itemData.review_count : ''}
            />
          </View>
          <View style={styles.summaryDim} />
        </View>
      </TouchableOpacity>
    );
  }
}

export default BookDailyList;
