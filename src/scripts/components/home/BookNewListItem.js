import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  bookItem: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  thumbnail: {
    width: 85,
    height: 136,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bookTitle: {
    width: 113,
    height: 53,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '200',
    color: '#353A3C',
    textAlign: 'center',
  },
});

class BookNewListItem extends React.Component {
  gotoAudioPage = () => {
    this.props.navigation.navigate('AudioBookDetailPage', {
      id: this.props.itemData.id,
      title: this.props.itemData.title,
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
            {this.props.itemData.memo_top}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(BookNewListItem);
