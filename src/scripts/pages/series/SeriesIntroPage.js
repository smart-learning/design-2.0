import { observer } from 'mobx-react';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Alert,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import ScaledImage from '../../commons/ScaledImage';
import { withNavigation } from 'react-navigation';
import _ from 'underscore';
import createStore from '../../commons/createStore';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffff',
  },
  img_center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  img_size: {
    width: 700,
    height: 200,
    marginLeft: 5,
  },
});

@observer
class SeriesIntroPage extends React.Component {
  constructor(props) {
    super(props);

    this.windowWidth = Dimensions.get('window').width;
    this.state = {};
  }

  componentDidMount() {}

  componentWillUpdate() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  gotoDetail = (type, id) => {
    if (type === 'video') {
      this.props.navigation.navigate('ClassDetail', {
        id: id,
      });
    } else if (type === 'audiobook') {
      this.props.navigation.navigate('AudioBookDetail', {
        id: id,
      });
    } else {
      Alert.alert('Coming Soon', '곧 공개 될 예정이니 기대해주세요!');
    }
  };

  render() {
    contents_img_width = this.windowWidth * 0.9;
    console.log(contents_img_width);
    return (
      <ScrollView style={[styles.wrapper]}>
        <ScaledImage uri="https://static.welaaa.co.kr/static/series/181210_4gen/BG1.png" />
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video', 71)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/A-1.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>

        <ScaledImage uri="https://static.welaaa.co.kr/static/series/181210_4gen/BG2.png" />
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video', 247)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/B-1.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video-not-open', 0)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/B-2.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video', 244)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/B-3.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video', 245)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/B-4.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video-not-open', 0)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/B-5.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video', 65)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/B-6.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>

        <ScaledImage uri="https://static.welaaa.co.kr/static/series/181210_4gen/BG3.png" />
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video', 1083)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/C-1.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video', 1084)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/C-2.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video', 246)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/C-3.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video', 142)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/C-4.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('audiobook', 1026)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/C-5.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.img_center]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.gotoDetail('video-not-open', 0)}
          >
            <ScaledImage
              uri="https://static.welaaa.co.kr/static/series/181210_4gen/C-6.png"
              width={contents_img_width}
            />
          </TouchableOpacity>
        </View>
        <ScaledImage uri="https://static.welaaa.co.kr/static/series/181210_4gen/BG4.png" />
      </ScrollView>
    );
  }
}

export default withNavigation(SeriesIntroPage);
