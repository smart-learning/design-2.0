import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Dummy from '../../../images/dummy-audioBook.png';

const styles = StyleSheet.create({
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: 250,
    width: '100%',
    height: 160,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333'
  },
  author: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 12,
    color: '#555555'
  },
  detailButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: '#555555'
  },
  detailButtonText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555555'
  },

  bookThumbnailWrap: {
    width: '40%',
    height: 150
  },

  bookThumbnailContainer: {
    width: 98,
    height: 143
  },
  thumbnail: {
    width: '100%',
    paddingTop: '80%',
    paddingBottom: '80%'
  }
});

export default class BookMonthlyItem extends React.Component {
  render() {
    return (
      <View style={styles.bookItem}>
        <View style={styles.bookThumbnailWrap}>
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: 150
            }}
          >
            <View style={styles.bookThumbnailContainer}>
              <ImageBackground
                style={{
                  width: 98,
                  height: 143,
                  paddingTop: '80%',
                  paddingBottom: '80%'
                }}
                source={
                  this.props.itemData.audiobook.images
                    ? { uri: this.props.itemData.audiobook.images.cover }
                    : Dummy
                }
                resizeMode={'cover'}
                // style={styles.thumbnail}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            width: '60%',
            paddingLeft: 16,
            paddingRight: 40
          }}
        >
          <Text style={styles.title}>{this.props.itemData.title}</Text>
          <Text style={styles.author}>{this.props.itemData.mentor.name}</Text>

          <View
            style={[
              styles.detailButton,
              {
                width: 120
              }
            ]}
            borderRadius={13}
          >
            <Text style={styles.detailButtonText}>자세히보기</Text>
          </View>
        </View>
      </View>
    );
  }
}
