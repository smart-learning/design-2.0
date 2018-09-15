import React from 'react';
import { observer } from 'mobx-react';
import { ActivityIndicator, Text, View } from 'react-native';
import net from '../../commons/net';
import CommonStyles from '../../../styles/common';
import createStore from '../../commons/createStore';
import DetailLayout from '../../components/detail/DetailLayout';

@observer
class ClassDetailPage extends React.Component {
  store = createStore({
    isLoading: true,
    itemData: null,
    itemClipData: [],
    tabStatus: 'info',
    lectureView: false,
    teacherView: false,
    slideHeight: null,
    reviewText: '',
    reviewStar: 0,
    permissions: {
      permission: false,
      expire_at: null
    },
    voucherStatus: {}
  });

  getData = async () => {
    const resultLectureData = await net.getLectureItem(
      this.props.navigation.state.params.id
    );
    const resultLectureClipData = await net.getLectureClipList(
      this.props.navigation.state.params.id
    );

    this.store.itemData = resultLectureData;
    this.store.itemClipData = resultLectureClipData;

    this.store.isLoading = false;
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <View style={[CommonStyles.container, { backgroundColor: '#ffffff' }]}>
        {this.store.isLoading ? (
          <View style={{ marginTop: 12 }}>
            <ActivityIndicator
              size="large"
              color={CommonStyles.COLOR_PRIMARY}
            />
          </View>
        ) : this.store.itemData !== null ? (
          <DetailLayout
            learnType={'class'}
            itemData={this.store.itemData}
            store={this.store}
          />
        ) : (
          <View>
            <Text> </Text>
          </View>
        )}
      </View>
    );
  }
}

export default ClassDetailPage;
