import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions
} from 'react-native';
import CommonStyles from '../../../styles/common';
import net from '../../commons/net';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import nav from '../../commons/nav';

const styles = StyleSheet.create({
  title: {
    backgroundColor: '#F6F6F6',
    padding: 15
  },
  titleText: {
    fontSize: 15,
    color: '#4a4a4a'
  },
  content: {
    padding: 15
  },
  contentText: {
    fontSize: 14,
    color: '#4a4a4a'
  },
  answerBox: {
    marginTop: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E4E6',
    backgroundColor: '#F6F6F6'
  },
  answerText: {
    fontSize: 14,
    color: '#777777'
  },
  dateText: {
    fontSize: 12,
    color: '#999999'
  },
  image: {
    width: 100,
    height: 100
  }
});

export default class EventDetailPage extends React.Component {
  windowWidth = null;
  constructor(props) {
    super(props);
    let id = null;

    try {
      id = props.navigation.state.params.id;
    } catch (e) {}

    this.state = {
      id: id,
      eventDetail: null
    };

    this.windowWidth = Dimensions.get('window').width;
    this.initialize();
  }

  async initialize() {
    const { id } = this.state;
    if (id) {
      this.setState({
        eventDetail: await net.getEventDetail(id)
      });
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { eventDetail } = this.state;
    if (!eventDetail) {
      return (
        <View>
          <Text>로딩 중입니다.</Text>
        </View>
      );
    }

    let { image_width, image_height } = eventDetail;
    if (!image_height) {
      image_height = 100;
    }
    if (!image_width) {
      image_width = 100;
    }

    const imageWidth = this.windowWidth;
    const imageHeight = this.windowWidth * (image_height / image_width);

    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <View>
              <Image
                source={{ uri: eventDetail.image_url }}
                style={[
                  styles.image,
                  {
                    width: imageWidth,
                    height: imageHeight
                  }
                ]}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}
