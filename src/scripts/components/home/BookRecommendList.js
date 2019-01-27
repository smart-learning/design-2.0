import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text
} from 'react-native';
import { observer } from 'mobx-react';
import Carousel from 'react-native-snap-carousel';
import BookRecommendListItem from './BookRecommendListItem';

const styles = StyleSheet.create({
  classContainer: {
    marginTop: 20,
    marginBottom: 30
  },
  slide: {
    width: Dimensions.get('window').width * 0.8,
    paddingRight: 10
  },
  slideInnerContainer: {
    flex: 1,
    width: Dimensions.get('window').width
  }
});

@observer
class BookRecommendList extends React.Component {
  _renderItem({ item }) {
    return (
      <View style={styles.slide}>
        <BookRecommendListItem
          id={item.id}
          itemData={item}
          style={styles.slideInnerContainer}
        />
      </View>
    );
  }

  render() {
    this.props.itemData.forEach((element, n) => {
      element.rankNumber = n + 1;
    });
    let windowWidth = Dimensions.get('window').width;
    let itemWidth = windowWidth * 0.8;

    return (
      <View style={styles.classContainer}>
        {this.props.itemData > 0 ? (
          <Carousel
            data={this.props.itemData}
            renderItem={this._renderItem}
            sliderWidth={windowWidth}
            itemWidth={itemWidth}
            layout={'default'}
            activeSlideAlignment={'start'}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
          />
        ) : this.props.itemData === 0 ? (
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					height: 50
				}}
			>
				<Text>추천 오디오북이 없습니다.</Text>
			</View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 50
            }}
          >
            <Text>추천 오디오북이 없습니다.</Text>
          </View>
        )}
      </View>
    );
  }
}

export default BookRecommendList;
