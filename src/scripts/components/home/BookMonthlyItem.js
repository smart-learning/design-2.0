import React from 'react';
import { ImageBackground, StyleSheet, Text, View, Image } from 'react-native';
import Dummy from '../../../images/dummy-audioBook.png';

const styles = StyleSheet.create({
  bookItem: {
    width: '100%',
  },
  title: {
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 12,
    textAlign: 'center',
    color: '#34342C',
  },
  author: {
    paddingTop: 7,
    paddingBottom: 10,
    fontSize: 11,
    textAlign: 'center',
    color: '#34342C',
  },
  detailButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    borderColor: '#34342C',
  },
  detailButtonText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#34342C',
  },
  thumbnail: {
    width: '100%',
    paddingTop: '80%',
    paddingBottom: '80%',
  },
  botm_201812_A: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 140,
    height: 80,
  },
});

export default class BookMonthlyItem extends React.Component {
  render() {
    return (
      <View style={styles.bookItem}>
        <ImageBackground
          source={
            this.props.itemData.audiobook.images
              ? { uri: this.props.itemData.audiobook.images.cover }
              : Dummy
          }
          resizeMode={'cover'}
          style={styles.thumbnail}
        />
        <Text style={styles.title}>{this.props.itemData.title}</Text>
        <View style={styles.detailButton} borderRadius={13}>
          <Text style={styles.detailButtonText}>리딩멘토</Text>
        </View>
        <Text style={styles.author}>{this.props.itemData.mentor.name}</Text>
        {/* 김소영 아나운서 이미지 출력 */}
        {/*{this.props.itemData.id === 22 && (*/}
        {/*<Image*/}
        {/*source={{*/}
        {/*uri:*/}
        {/*'https://static.welaaa.co.kr/static/botm/2018-12_botm_A_bg.png',*/}
        {/*}}*/}
        {/*style={styles.botm_201812_A}*/}
        {/*/>*/}
        {/*)}*/}
      </View>
    );
  }
}
