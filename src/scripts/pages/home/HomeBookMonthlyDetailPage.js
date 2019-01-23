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

const styles = StyleSheet.create({});

@observer
class HomeBookMonthlyDetailPage extends React.Component {
  render() {
    console.log(
      'this.props.navigation.state.params.itemData',
      this.props.navigation.state.params.itemData,
    );
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <Text>monthly-detail</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(HomeBookMonthlyDetailPage);
