import React from 'react';
import { View, ImageBackground, Dimensions, Animated } from 'react-native';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import globalStore from '../commons/store';
import createStore from '../commons/createStore';
import Dummy from '../../images/dummy-series.png';

@observer
class SeriesTransition extends React.Component {
  y = new Animated.Value(400);
  componentDidMount() {
    this.animate();
  }

  animate = () => {
    Animated.parallel([
      // after decay, in parallel:
      // Animated.spring(globalStore.seriesItemMeasurements.pageX, {
      //   toValue: new Animated.Value(10), // return to start
      // }),
      Animated.spring(this.y, {
        toValue: new Animated.Value(0), // return to start
        duration: 10000,
      }),
      // Animated.spring(globalStore.seriesItemMeasurements.width, {
      //   toValue: new Animated.Value(Dimensions.get('window').width),
      // }),
      // Animated.spring(globalStore.seriesItemMeasurements.height, {
      //   toValue: new Animated.Value(Dimensions.get('window').height),
      // }),
    ]).start(); // start the sequence group
  };

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: this.y,
          width: '100%',
          height: '100%',
        }}
      >
        <ImageBackground
          source={{
            uri:
              globalStore.seriesItemThumbnail === ''
                ? Dummy
                : globalStore.seriesItemThumbnail,
          }}
          resizeMode={'contain'}
          style={{
            // position: 'absolute',
            // top: globalStore.seriesItemMeasurements.pageY,
            // left: globalStore.seriesItemMeasurements.pageX,
            width: '100%',
            height: '100%',
            backgroundColor: '#999',
            opacity: 0.5,
          }}
        />
      </Animated.View>
    );
  }
}

export default withNavigation(SeriesTransition);
