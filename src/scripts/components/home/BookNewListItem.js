import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image
} from 'react-native';
import { withNavigation } from 'react-navigation';
import CommonStyles from '../../../styles/common';
import IcPlay from '../../../images/ic-play-dark.png';
import numeral from 'numeral';
import IcHeart from '../../../images/ic-heart-dark.png';
import IcComment from '../../../images/ic-commenting-dark.png';
import IcClip from '../../../images/ic-clip-dark.png';

const styles = StyleSheet.create({
  bookItem: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: 85,
    height: 130,
    marginTop: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bookTitle: {
  	height: 40,
    margin: 15,
    fontSize: 12,
    color: '#353A3C',
    textAlign: 'center'
  }
});

class BookNewListItem extends React.Component {
  gotoAudioPage = () => {
    this.props.navigation.navigate('AudioBookDetailPage', {
      id: this.props.itemData.id,
      title: this.props.itemData.title
    });
  };

  render() {
    return (
      <View style={styles.bookItem} borderRadius={8}>
        <TouchableOpacity activeOpacity={0.9} onPress={this.gotoAudioPage}>
          <ImageBackground
            source={{ uri: this.props.itemData.images.list }}
            resizeMode="contain"
            style={styles.thumbnail}
          />
          <Text
            style={styles.bookTitle}
            ellipsizeMode={'tail'}
            numberOfLines={3}
          >
            {this.props.itemData.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(BookNewListItem);
