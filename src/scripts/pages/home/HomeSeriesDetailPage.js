import React from 'react';
import CommonStyles from '../../../styles/common';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView, withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import net from '../../commons/net';
import ClassList from '../../components/home/ClassList';
import createStore from '../../commons/createStore';
import _ from 'underscore';
import ClassListItem from '../../components/home/ClassListItem';
import Dummy from '../../../images/dummy-series.png';
import globalStore from '../../commons/store';

const styles = StyleSheet.create({
  contentContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#ffffff'
  },
  title: {
    paddingTop: 50,
    paddingBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#353A3C',
  },
  paragraph: {
    fontSize: 16,
    color: '#353A3C',
  },
  banner: {
    position: 'relative',
    width: '100%',
    height: 450,
  },
  thumbnail: {
    position: 'absolute',
    top: -12,
    width: '100%',
    paddingTop: '70%',
    paddingBottom: '70%',
  },
});

@observer
class HomeSeriesDetailPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
	  globalStore.isSeriesTransition = false;
	  globalStore.seriesItemThumbnail = '';
  }

  render() {
    const itemData = this.props.navigation.state.params.itemData.item;
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.banner} removeClippedSubviews={true}>
              <ImageBackground
                source={Dummy}
                style={styles.thumbnail}
                resizeMode={'contain'}
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>윌라 추천시리즈 소개</Text>
              {/*<Text style={styles.paragraph}>{itemData.title}</Text>*/}
              <Text style={styles.paragraph}>
                강연은 오프라인 강의를 들었던 청중들이 감동을 못이기고
                자발적으로 녹취, 공유하는 것도 모자라 해외의 교포들에게 전달되고
                외국어로 까지 번역되었던 화제의 명품 강의입니다! 논리 없이
                무조건적인 애국심만 강조했던 기존의 역사 강연들과는 달리 아주
                객관적으로, 아주 논리적으로 기록과 사실에 근거하여 한국 역사의
                우수성을 밝혀내는 허성도 교수님의 놀라운 통찰을 엿볼 수 있어요.
                한국인이라면 꼭 한 번 들어봐야 할 역사 명강, 주변에도 많이
                추천해주세요!
              </Text>
              <Text style={styles.title}>강의 클립</Text>
              {itemData.map((item, key) => {
                return (
                  <ClassListItem
                    key={key}
                    id={item.id}
                    itemData={item}
                    itemType={'series'}
                    style={{ marginBottom: 15 }}
                  />
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(HomeSeriesDetailPage);
