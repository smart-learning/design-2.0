import React from 'react';
import CommonStyles from '../../../styles/common';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView, withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import net from '../../commons/net';
import ClassList from '../../components/home/ClassList';

const styles = StyleSheet.create({});

class HomeSeriesDetailPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('props.navigation.state.params', props.navigation.state.params);
  }

  render() {
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <Text>asdf</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(HomeSeriesDetailPage);
