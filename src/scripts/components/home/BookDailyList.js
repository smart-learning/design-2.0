import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import BookDailyListItem from './BookDailyListItem';
import CommonStyles from '../../../styles/common';
import IcAngleDownGrey from '../../../images/ic-angle-down-grey.png';
import createStore from '../../commons/createStore';
import _ from 'underscore';
import { observer } from 'mobx-react';

const styles = StyleSheet.create({
  bookContainer: {
    marginTop: 20,
    marginBottom: 50
  },
  viewMoreContainer: {
    alignItems: 'center'
  },
  viewMore: {
    width: 50,
    height: 36,
    justifyContent: 'center'
  },
  viewMoreText: {
    fontSize: 12,
    color: '#888888'
  },
  viewMoreIcon: {
    position: 'relative',
    top: 2
  },
  bookList: {
    flex: 1,
    marginBottom: 20
  }
});

@observer
class BookDailyList extends React.Component {
  data = createStore({
    isOpen: false
  });

  render() {
    let list;

    if (!_.isUndefined(this.props.itemData)) {
      if (this.props.itemData.length > 0) {
        if (!this.data.isOpen) {
          list = this.props.itemData.slice(0, 5);
        } else {
          list = this.props.itemData;
        }
      } else {
        list = [];
      }
    } else {
      list = [];
    }

    return (
      <View style={styles.bookContainer}>
        <View style={styles.bookList}>
          {list.map((item, key) => {
            return <View key={key}>
                {item !== undefined && (
                  <BookDailyListItem
                    today={this.props.today}
                    itemDay={this.props.itemDay}
                    itemData={item}
                  />
                )}
              </View>;
          })}
        </View>

        {!this.data.isOpen && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.viewMoreContainer}
            onPress={() => (this.data.isOpen = true)}
          >
            <View
              style={[styles.viewMore, CommonStyles.alignJustifyContentBetween]}
            >
              <Text style={styles.viewMoreText}>더보기</Text>
              <Image source={IcAngleDownGrey} style={styles.viewMoreIcon} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default BookDailyList;
