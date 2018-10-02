import React from 'react';

import {
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const styles = StyleSheet.create({
  thumbnail: {
    width: '100%',
    paddingTop: '17.3571428572%',
    paddingBottom: '17.3571428572%'
  }
});

export default class HomeBanner extends React.Component {
  handleAction = () => {
    const { action_type, action_param } = this.props;

    if (action_type === 'event') {
      this.props.navigation.push('EventDetailPage', {
        title: '공지사항 및 이벤트',
        id: action_param
      });
    } else if (action_type === 'membershippage') {
      this.props.navigation.navigate('MembershipScreen', {
        title: '멤버십'
      });
    } else if (action_type === 'videocourse') {
      this.props.navigation.navigate('ClassDetailPage', {
        id: action_param,
        title: '멤버십'
      });
    } else if (action_type === 'outlink') {
      Linking.openURL(action_param);
    } else if (action_type === 'botm') {
      const params = action_param.split(',');

      this.props.navigation.navigate('HomeMonthlyReviewPage', {
        month: params[0],
        sort: params[1],
        title: '이달의 책 북리뷰'
      });
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
          <ImageBackground
            source={{ uri: bannerImageUrl }}
            resizeMode="cover"
            style={styles.thumbnail}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
