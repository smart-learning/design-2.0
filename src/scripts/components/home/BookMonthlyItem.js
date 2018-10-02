import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Dummy from '../../../images/dummy-audioBook.png';

const styles = StyleSheet.create({
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 250,
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
  bookThumbnailContainer: {
    width: 100,
    marginRight: 20
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
        <View style={styles.bookThumbnailContainer}>
          <ImageBackground
          source={
          this.props.itemData.audiobook.images
          ? { uri: this.props.itemData.audiobook.images.cover }
          : Dummy
          }
          resizeMode={'cover'}
          style={styles.thumbnail}
          />
        </View>
        <View style={{ width: '48%' }}>
          <Text style={styles.title}>{this.props.itemData.title}</Text>
          <Text style={styles.author}>{this.props.itemData.mentor.name}</Text>
          <View style={styles.detailButton} borderRadius={13}>
            <Text style={styles.detailButtonText}>자세히보기</Text>
          </View>
        </View>
      </View>
    );
  }
}
