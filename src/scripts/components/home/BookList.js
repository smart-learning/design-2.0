import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommonStyles from '../../../styles/common';
import IcAngleDownGrey from '../../../images/ic-angle-down-grey.png';
import BookListItem from './BookListItem';
import { observer } from 'mobx-react';
import createStore from '../../commons/createStore';
import _ from 'underscore';

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
class BookList extends React.Component {
  store = createStore({
    isOpen: false
  });

  render() {
    let list;
    let itemLength;
    let BookList = [];

    if (this.props.itemType === 'hot') {
      itemLength = 14;
    } else if (this.props.itemType === 'new') {
      itemLength = 6;
    } else {
      itemLength = 4;
    }

    if (!this.store.isOpen) {
      let itemNumber = 1;
      this.props.itemData.forEach(element => {
        element.itemNumber = itemNumber++;
      });
      list = this.props.itemData.slice(0, itemLength);
    } else {
      list = this.props.itemData;
    }

    for (let i = 0; i < Math.ceil(list.length / 2); i++) {
      let listObject = [];

      listObject.push(list[i * 2]);
      listObject.push(list[i * 2 + 1]);

      BookList.push(listObject);
    }

    return (
      <View style={styles.bookContainer}>
        <View style={styles.bookList}>
          {BookList.map((items, key) => {
            return (
              <View
                key={key}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1
                }}
              >
                {items.map((item, innerKey) => {
                  return (
                    <View style={{ width: '50%' }} key={innerKey}>
                      {item !== undefined && (
                        <BookListItem
                          itemType={this.props.itemType}
                          key={innerKey}
                          itemData={item}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {!this.store.isOpen && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.viewMoreContainer}
            onPress={() => (this.store.isOpen = true)}
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

export default BookList;
