import React from 'react';
import CommonStyles from '../../../styles/common';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { SafeAreaView, withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import net from '../../commons/net';
import ClassList from '../../components/home/ClassList';

const styles = StyleSheet.create({
  titleH2: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34342C'
  },
  titleH3: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34342C'
  },
  titleHr: {
    height: 1,
    marginTop: 7,
    backgroundColor: '#34342C'
  },
  container: {
    flex: 1
  },
  screen: {
    backgroundColor: 'yellow',
    flexDirection: 'column',
    height: Dimensions.get('window').height,
    justifyContent: 'center'
  },
  screenA: {
    backgroundColor: '#F7CAC9'
  },
  screenB: {
    backgroundColor: '#92A8D1'
  },
  screenC: {
    backgroundColor: '#88B04B'
  },
  letter: {
    color: '#000',
    fontSize: 60,
    textAlign: 'center'
  },
  scrollButton: {
    alignSelf: 'center',
    backgroundColor: 'white',
    height: 50,
    marginTop: 50,
    width: 150
  },
  scrollButtonText: {
    padding: 20,
    textAlign: 'center'
  }
});

class Data {
  @observable
  isLoading = false;
  @observable
  seriesData = [];
}

class SeriesGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: null,
      height: null,
      x: null,
      y: null
    };
  }

  onLayout = e => {
    this.props.onChildLayoutChange(
      this.props.item.category,
      e.nativeEvent.layout.y
    );

    this.setState({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
      x: e.nativeEvent.layout.x,
      y: e.nativeEvent.layout.y
    });
  };

  render() {
    return (
      <View onLayout={this.onLayout}>
        <Text style={styles.titleH3}>{this.props.item.title}</Text>
        <View style={styles.titleHr} />
        <View>
          {<ClassList classType={'series'} itemData={this.props.item.item} />}
        </View>
      </View>
    );
  }
}

@observer
class HomeSeriesPage extends React.Component {
  data = new Data();
  anchors = {};

  getData = async (isRefresh = false) => {
    this.data.isLoading = true;
    this.data.seriesData = await net.getSeriesContents();

    this.setState({
      categoryData: this.data.seriesData.map((item, idx) => {
        return {
          id: idx,
          title: item.title,
			category: item.category
        };
      })
    });
    this.data.isLoading = false;
  };

  constructor(props) {
    super(props);
    this.state = {
      screenHeight: Dimensions.get('window').height,
      screenWidth: Dimensions.get('window').width,
      defaultOffset: 0,
      dimensions: {},
      categoryData: [],
      selectedCategory: 0
    };
  }

  onChildLayoutChange = (key, layout) => {
    this.setState({
      dimensions: {
        ...this.state.dimensions,
        [key]: layout
      }
    });
  };

  async componentDidMount() {
    try {
      await this.getData();
      const focus = this.props.navigation.getParam('focus', null);
      if (focus) {
        setTimeout(() => {
          this.scrollTo(focus);
        }, 100);
      }
    } catch (e) {
      console.log(e);
    }
  }

  scrollTo = key => {
    try {
      this.scroller.scrollTo({
        x: 0,
        y: this.state.defaultOffset + this.state.dimensions[key]
      });
    } catch (e) {
      console.log(e);
    }
  };

  setDefaultOffset = e => {
    console.log('setDefaultOffset', e.nativeEvent.layout);
    this.setState({
      defaultOffset: e.nativeEvent.layout.y
    });
  };

  render() {
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView
            ref={scroller => {
              this.scroller = scroller;
            }}
            style={{ flex: 1 }}
          >
            <View
              style={[
                CommonStyles.contentContainer,
                styles.seriesContentContainer
              ]}
            >
              <View onLayout={this.setDefaultOffset}>
                {this.data.isLoading ? (
                  <View style={{ marginTop: 12 }}>
                    <ActivityIndicator
                      size="large"
                      color={CommonStyles.COLOR_PRIMARY}
                    />
                  </View>
                ) : (
                  undefined
                )}

                {!this.data.isLoading &&
                this.data.seriesData &&
                this.data.seriesData.length > 0 ? (
                  <View>
                    {this.data.seriesData.map((item, key) => {
                      return (
                        <SeriesGroup
                          ref={ref => (this.anchors[item.category] = ref)}
                          key={key}
                          item={item}
                          onChildLayoutChange={this.onChildLayoutChange}
                        />
                      );
                    })}
                  </View>
                ) : (
                  undefined
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(HomeSeriesPage);
