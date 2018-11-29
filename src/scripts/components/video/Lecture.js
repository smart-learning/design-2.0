import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLOR_PRIMARY } from '../../../styles/common';
import Summary from './Summary';

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    position: 'relative',
    backgroundColor: '#ffffff',
    marginBottom: 10
  },
  headline: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLOR_PRIMARY
  },
  subTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999999',
    marginBottom: 20
  }
});

export default class Lecture extends React.Component {
  changePage = () => {
    this.props.navigation.navigate('ClassDetailPage', {
      id: this.props.id,
      title: this.props.item.headline
    });
  };

  render() {
    return (
      <View style={styles.itemContainer}>
        {/*타이틀*/}
        <TouchableOpacity activeOpacity={0.9} onPress={this.changePage}>
          <Text style={styles.headline}>{this.props.item.headline}</Text>
          {/*서브타이틀*/}
          <Text style={styles.subTitle}>
            {this.props.item.teacher.headline} {this.props.item.teacher.name}
          </Text>
        </TouchableOpacity>
        {/*썸네일*/}
        <Summary
          type="lecture"
          {...this.props.item}
          onPress={this.changePage}
        />
      </View>
    );
  }
}
