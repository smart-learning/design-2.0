import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';

let navigation = null;
export default class BotmIntroPage extends React.Component {
  static navigationOptions = {
    title: '이달의 책',
  };

  windowWidth = null;

  constructor(props) {
    super(props);

    const imageBase = 'https://static.welaaa.co.kr/static/botm/intro_page';
    const month = props.navigation.state.params.info;

    this.windowWidth = Dimensions.get('window').width;
    this.state = {
      is_loading: true,
      month: month,
      img_A: `${imageBase}/${month}_A.jpg`,
      img_A_button: `${imageBase}/${month}_A_button.jpg`,
      img_B: `${imageBase}/${month}_B.jpg`,
    };
  }

  componentWillMount() {
    Image.getSize(this.state.img_A, (width, height) => {
      if (this.windowWidth != null) {
        this.setState({
          botm_A_width: this.windowWidth,
          botm_A_height: (this.windowWidth * height) / width,
        });
      } else {
        this.setState({ botm_A_width: width, botm_A_height: height });
      }
    });
    Image.getSize(this.state.img_B, (width, height) => {
      if (this.windowWidth != null) {
        this.setState({
          botm_B_width: this.windowWidth,
          botm_B_height: (this.windowWidth * height) / width,
        });
      } else {
        this.setState({ botm_B_width: width, botm_B_height: height });
      }
    });

    if (this.state.month === '2018-12-01') {
      // 12월 이달의 책을 위한 임시 코드
      Image.getSize(
        this.state.img_A_button,
        (width, height) => {
          if (this.windowWidth != null) {
            this.setState({
              botm_A_button_width: this.windowWidth,
              botm_A_button_height: (this.windowWidth * height) / width,
            });
          } else {
            this.setState({
              botm_A_button_width: width,
              botm_A_button_height: height,
            });
          }
        },
        error => {
          console.log(error);
          Alert.alert('Error', '통신에 실패했습니다.');
        },
      );
    }
  }

  gotoBotm_A = () => {
    this.props.navigation.navigate('HomeMonthlyReviewPage', {
      month: this.props.navigation.state.params.info,
      sort: 'A',
      title: '이달의 책 북리뷰',
    });
  };

  gotoBotm_B = () => {
    this.props.navigation.navigate('HomeMonthlyReviewPage', {
      month: this.props.navigation.state.params.info,
      sort: 'B',
      title: '이달의 책 북리뷰',
    });
  };

  outLink = () => {
    const url = 'http://www.yes24.com/24/Goods/67077027';
    Linking.openURL(url);
  };

  render() {
    return (
      <View>
        <ScrollView>
          <View>
            <TouchableOpacity activeOpacity={0.9} onPress={this.gotoBotm_A}>
              <Image
                source={{ uri: this.state.img_A }}
                resizeMode="cover"
                style={{
                  width: this.state.botm_A_width,
                  height: this.state.botm_A_height,
                }}
              />
            </TouchableOpacity>
          </View>
          {this.state.month === '2018-12-01' && (
            <View>
              <TouchableOpacity activeOpacity={0.9} onPress={this.outLink}>
                <Image
                  source={{ uri: this.state.img_A_button }}
                  resizeMode="cover"
                  style={{
                    width: this.state.botm_A_button_width,
                    height: this.state.botm_A_button_height,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
          <View>
            <TouchableOpacity activeOpacity={0.9} onPress={this.gotoBotm_B}>
              <Image
                source={{ uri: this.state.img_B }}
                resizeMode="cover"
                style={{
                  width: this.state.botm_B_width,
                  height: this.state.botm_B_height,
                }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
