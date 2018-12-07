import React from 'react';
import { Dimensions, View } from 'react-native';
import ClipRankItem from './ClipRankItem';
import Carousel from 'react-native-snap-carousel';

export default class ClipRank extends React.Component {
  _renderItem({ item }) {
    return <ClipRankItem id={item.id} itemData={item} />;
  }

  render() {
    let list = [];
    let rankList = [];

    if (this.props.itemData && this.props.itemData.length > 0) {
      list = this.props.itemData;

      for (let i = 0; i < Math.ceil(list.length / 10); i++) {
        let rankObject = [];

        rankObject.push(list[i * 10]);
        rankObject.push(list[i * 10 + 1]);
        rankObject.push(list[i * 10 + 2]);
        rankObject.push(list[i * 10 + 3]);
        rankObject.push(list[i * 10 + 4]);
        rankObject.push(list[i * 10 + 5]);
        rankObject.push(list[i * 10 + 6]);
        rankObject.push(list[i * 10 + 7]);
        rankObject.push(list[i * 10 + 8]);
        rankObject.push(list[i * 10 + 9]);

        rankList.push(rankObject);
      }
    }

    this.props.itemData.forEach((element, n) => {
      element.rankNumber = n + 1;
    });
    let windowWidth = Dimensions.get('window').width;
    let itemWidth = 300;

    return (
      <View style={{ marginTop: 20, marginBottom: 30 }}>
        <Carousel
          data={list}
          renderItem={this._renderItem}
          sliderWidth={windowWidth}
          itemWidth={itemWidth}
          layout={'default'}
          activeSlideAlignment={'start'}
          inactiveSlideOpacity={1}
          inactiveSlideScale={0.95}
        />
      </View>
    );
  }
}
