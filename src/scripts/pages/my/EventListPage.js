import React from 'react';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CommonStyles from '../../../styles/common';
import Store from '../../../scripts/commons/store';
import { SafeAreaView } from 'react-navigation';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import net from '../../commons/net';
import _ from 'underscore';
import moment from 'moment';

const styles = StyleSheet.create({
  eventList: {
    marginTop: 20,
    marginBottom: 20
  },
  listContainer: {
    marginBottom: 15
  },
  listItem: {
    position: 'relative',
    padding: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    backgroundColor: '#ffffff'
  },
  listItemTitle: {
    paddingTop: 10,
    fontSize: 16,
    color: '#4a4a4a'
  },
  listItemThumbnail: {
    width: '100%',
    paddingTop: '56.8571428572%',
    paddingBottom: '56.8571428572%'
  },
  listItemDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  listItemDimText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff'
  }
});

class Data {
  @observable
  eventData = [];
}

@observer
class EventListPage extends React.Component {
  data = new Data();

  getData = async () => {
    this.data.eventData = await net.getEventList();
  };

  componentDidMount() {
    try {
      this.getData();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    let list;

    if (!_.isObject(this.data.eventData)) {
      list = [];
    } else {
      list = this.data.eventData;
    }

    let today = moment().format();

    return (
      <View style={CommonStyles.container}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={[CommonStyles.contentContainer, styles.eventList]}>
              <FlatList
                style={{ width: '100%' }}
                data={list}
                renderItem={({ item }) => (
                  <View key={item.id} style={styles.listContainer}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() =>
                        this.props.navigation.navigate('EventDetailPage', {
                          id: item.id,
                          title: item.title
                        })
                      }
                      navigation={this.props.navigation}
                    >
                      <View style={styles.listItem}>
                        <ImageBackground
                          source={{ uri: item.thumbnail }}
                          resizeMode={'cover'}
                          style={styles.listItemThumbnail}
                        />
                        <Text style={styles.listItemTitle}>{item.title}</Text>
                      </View>
                      {item.expire_at < today && (
                        <View style={styles.listItemDim}>
                          <Text style={styles.listItemDimText}>종료</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

export default EventListPage;
