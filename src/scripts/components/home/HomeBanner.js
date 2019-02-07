import React from 'react';
import nav from '../../commons/nav';
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  thumbnail: {
    width: '100%',
    paddingTop: '22.22%',
    paddingBottom: '22.22%'
  }
});

export default class HomeBanner extends React.Component {
  handleAction = () => {
    const { action_type, action_param } = this.props;

    if (action_type === 'event') {
      this.props.navigation.push('EventDetailPage', {
        title: '공지사항 및 이벤트',
        id: action_param,
      });
    } else if (action_type === 'membershippage') {
      this.props.navigation.navigate('MembershipScreen', {
        title: '멤버십',
      });
    } else if (action_type === 'videocourse') {
      this.props.navigation.navigate('ClassDetail', {
        id: action_param,
        title: ' ',
      });
    } else if (action_type === 'audiobook') {
      this.props.navigation.navigate('AudioBookDetail', {
        id: action_param,
        title: ' ',
      });
    } else if (action_type === 'outlink') {
      Linking.openURL(action_param);
    } else if (action_type === 'botm') {
      const params = action_param.split(',');

      this.props.navigation.navigate('HomeMonthlyReviewPage', {
        month: params[0],
        sort: params[1],
        title: '이달의 책 북리뷰',
      });
    } else {
      nav.parseDeepLink('welaaa://' + action_type + '/' + action_param);
    }
  };

  render() {
    const { bannerImageUrl } = this.props;
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.handleAction();
          }}
          activeOpacity={0.9}
        >
          <FastImage
            source={{ uri: bannerImageUrl }}
            resizeMode="cover"
            style={styles.thumbnail}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
