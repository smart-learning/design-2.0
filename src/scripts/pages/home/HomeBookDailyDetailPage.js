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

const styles = StyleSheet.create({});

@observer
class HomeBookDailyDetailPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <View>
              <Text>HomeBookDailyDetailPage</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(HomeBookDailyDetailPage);
