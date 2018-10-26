import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CommonStyles from '../../../styles/common';
import Dummy from '../../../images/dummy-audioBookSimple.png';
import IcView from '../../../images/ic-detail-view.png';
import IcStar from '../../../images/ic-detail-star.png';
import IcComment from '../../../images/ic-detail-message.png';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import numeral from 'numeral';
import _ from 'underscore';

const styles = StyleSheet.create({
  alignJustify: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  bookList: {
    marginBottom: 20
  },
  bookItem: {
    position: 'relative',
    marginBottom: 15,
    marginRight: 5,
    marginLeft: 5,
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#dddddd'
  },
  bookRank: {
    marginBottom: 15,
    alignItems: 'center'
  },
  bookRankText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: CommonStyles.COLOR_PRIMARY
  },
  bookRankHr: {
    width: 20,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderColor: CommonStyles.COLOR_PRIMARY
  },
  bookTitle: {
    height: 34,
    marginBottom: 7,
    lineHeight: 16,
    fontSize: 14,
    color: CommonStyles.COLOR_PRIMARY
  },
  bookAuthor: {
    fontSize: 14,
    color: '#888888'
  },
  bookLabels: {
    marginBottom: 15
  },
  bookLabel: {
    height: 22,
    marginTop: 9,
    marginRight: 3,
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 3,
    paddingLeft: 10
  },
  bookLabelText: {
    fontSize: 12,
    color: '#ffffff'
  },
  bookLabelBlank: {
    borderColor: 'transparent',
    opacity: 0
  },
  bookLabelNew: {
    backgroundColor: '#5f45b4'
  },
  bookLabelExclusive: {
    backgroundColor: '#ff761b'
  },
  bookLabelFree: {
    backgroundColor: '#00afba'
  },
  bookLabelDefault: {
    backgroundColor: CommonStyles.COLOR_PRIMARY
  },
  thumbnail: {
    position: 'relative',
    width: '100%',
    paddingTop: '75.5%',
    paddingBottom: '75.5%',
    borderWidth: 1,
    borderColor: '#E3E3E3'
  },
  thumbnailDim: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    minHeight: 100,
    padding: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  thumbnailTitle: {
    fontSize: 12,
    color: '#ffffff'
  },
  btnSetSmall: {
    width: 20,
    height: 14
  },
  countText: {
    paddingLeft: 3,
    paddingRight: 7,
    fontSize: 12,
    color: '#444444'
  },
  bookLabelContainer: {
    flexDirection: 'row',
    marginLeft: 2,
    marginRight: 2,
    marginBottom: 4
  }
});

@observer
class BookListItem extends React.Component {
  render() {
    let starAvg = parseFloat(this.props.itemData.star_avg).toFixed(1);

    if (_.isNaN(starAvg)) {
      starAvg = 0;
    }

    return (
      <View style={styles.bookItem}>
        {this.props.itemType === 'hot' && (
          <View style={styles.bookRank}>
            <Text style={styles.bookRankText}>
              {this.props.itemData.itemNumber < 10 && <Text>0</Text>}
              {this.props.itemData.itemNumber}
            </Text>
            <View style={styles.bookRankHr} />
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            this.props.navigation.navigate('AudioBookDetailPage', {
              id: this.props.itemData.id,
              title: this.props.itemData.title
            })
          }
        >
        
        <Text style={styles.bookTitle} ellipsizeMode={'tail'} numberOfLines={2}>
          {this.props.itemData.subtitle}
        </Text>
        
          <View>
            <ImageBackground
              source={{ uri: this.props.itemData.images.list }}
              resizeMode={'cover'}
              style={styles.thumbnail}
            >
              <View style={styles.thumbnailDim}>
                <Text style={styles.thumbnailTitle}>
                  {this.props.itemData.title}
                </Text>
                <View style={styles.bookLabelContainer}>
                  {!!this.props.itemData.is_new && (
                    <View
                      style={[styles.bookLabel, styles.bookLabelNew]}
                      borderRadius={10}
                    >
                      <Text style={[styles.bookLabelText]}>New</Text>
                    </View>
                  )}
                  {!!this.props.itemData.is_exclusive && (
                    <View
                      style={[styles.bookLabel, styles.bookLabelExclusive]}
                      borderRadius={10}
                    >
                      <Text style={[styles.bookLabelText]}>독점</Text>
                    </View>
                  )}
                  {!!this.props.itemData.is_free && (
                    <View
                      style={[styles.bookLabel, styles.bookLabelFree]}
                      borderRadius={10}
                    >
                      <Text style={[styles.bookLabelText]}>무료</Text>
                    </View>
                  )}
                  {this.props.itemData.audiobook_type === '완독' && (
                    <View
                      style={[styles.bookLabel, styles.bookLabelDefault]}
                      borderRadius={10}
                    >
                      <Text style={[styles.bookLabelText]}>완독</Text>
                    </View>
                  )}
                  {this.props.itemData.audiobook_type === '요약' && (
                    <View
                      style={[styles.bookLabel, styles.bookLabelDefault]}
                      borderRadius={10}
                    >
                      <Text style={[styles.bookLabelText]}>요약</Text>
                    </View>
                  )}
                </View>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
        <View style={styles.alignJustify}>
          <Image source={IcView} style={styles.btnSetSmall} />
          <Text style={styles.countText}>
            {/* {this.props.itemData.hit_count} */}
            {numeral(this.props.itemData.hit_count).format('0 a')}
          </Text>
          {/* <Image source={IcStar} style={styles.btnSetSmall} />
          <Text style={styles.countText}>{starAvg}</Text> */}
          <Image source={IcComment} style={styles.btnSetSmall} />
          <Text style={styles.countText}>
            {numeral(this.props.itemData.review_count).format('0 a')}
            {/* {this.props.itemData.review_count} */}
          </Text>
        </View>
      </View>
    );
  }
}

export default withNavigation(BookListItem);
