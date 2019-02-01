import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ClipRankItem from './ClipRankItem';
import Carousel from 'react-native-snap-carousel';
import _ from 'underscore';
import ClassListItem from './ClassListItem';
import { observer } from 'mobx-react';

const styles = StyleSheet.create({
  slide: {
    width: Dimensions.get('window').width * 0.84,
    paddingRight: 10,
  },
  slideInnerContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});

@observer
export default class ClipRank extends React.Component {
  _renderItem({ item }) {
    return (
      <View style={styles.slide}>
        <ClipRankItem
          id={item.id}
          itemData={item}
          style={styles.slideInnerContainer}
        />
      </View>
    );
  }

  render() {
    let originData = _.map(this.props.itemData, item => item);
    let itemData = originData.slice(0, 15);
    let list = [];
    let rankList = [];

    if (this.props.itemData && this.props.itemData.length > 0) {
      list = _.map(itemData, item => item);

      for (let i = 0; i < Math.ceil(list.length / 5); i++) {
        let rankObject = [];

        rankObject.push(list[i * 5]);
        rankObject.push(list[i * 5 + 1]);
        rankObject.push(list[i * 5 + 2]);
        rankObject.push(list[i * 5 + 3]);
        rankObject.push(list[i * 5 + 4]);

        rankList.push(rankObject);
      }
    }

    this.props.itemData.forEach((element, n) => {
      element.rankNumber = n + 1;
    });
    let windowWidth = Dimensions.get('window').width;
    let itemWidth = 300;

    return (
      <View style={{ marginTop: 20, marginBottom: 30, position: 'relative' }}>
        <Carousel
          data={rankList}
          renderItem={this._renderItem}
          sliderWidth={windowWidth}
          itemWidth={itemWidth}
          layout={'default'}
          activeSlideAlignment={'start'}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: 1,
            backgroundColor: '#ffffff',
          }}
        />
      </View>
    );
  }
}
