import React from 'react';
import Summary from '../../components/video/Summary';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import m from 'moment';
import { COLOR_PRIMARY } from '../../../styles/common';
import Native from '../../commons/native';

const styles = StyleSheet.create({
  bookListItemContainer: {
    padding: 13,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#dddddd'
  },
  bookListItemHeadline: {
    marginBottom: 13
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
    width: 50,
    textAlign: 'center',
    fontSize: 15,
    color: COLOR_PRIMARY
  },
  dateHr: {
    width: 50,
    height: 1,
    backgroundColor: COLOR_PRIMARY
  },
  listItemTitle: {
    fontSize: 16,
    color: '#333333',
    marginTop: 14
  }
});

class BookDailyListItem extends React.Component {
  render() {
    let itemData = {};
    let month;
    let day;
    try {
      itemData = this.props.itemData[0];

      month = m(itemData.open_date).format('M');
      day = m(itemData.open_date).format('D');
    } catch (error) {
      console.log(error);
    }

    console.log( 'dayily', itemData );

    return (
      <TouchableOpacity
        activeOpacity={0.9}
		onPress={() => Native.play(itemData.cid)}
      >
        <View style={styles.bookListItemContainer}>
          <View style={styles.bookListItemHeadline}>
            <View style={styles.dateBox}>
              <Text style={styles.date}>
                {month} / {day}
              </Text>
              <View style={styles.dateHr} />
            </View>
            <Text style={styles.listItemTitle}>
              {itemData ? itemData.title : ''}
            </Text>
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
        </View>
      </TouchableOpacity>
    );
  }
}

export default BookDailyListItem;
