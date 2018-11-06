import React from 'react';
import {
	Text,
	StyleSheet,
	View,
	Dimensions,
	ImageBackground,
	TouchableOpacity,
	BackHandler,
	Image, Alert,
} from "react-native";
import KakaoLoginButton from "../../components/auth/KakaoLoginButton";
import FBLoginButton from "../../components/auth/FBLoginButton";
import Swiper from 'react-native-swiper';
import Slide1 from '../../../images/login_bg1.png';
import Slide2 from '../../../images/login_bg2.png';
import Slide3 from '../../../images/login_bg3.png';
import Slide4 from '../../../images/login_bg4.png';
import icEmail from '../../../images/ic-email.png';
import icLogin from '../../../images/ic-login.png';
import logo from '../../../images/logo-en-primary.png';
import CommonStyles from "../../../styles/common";
import net from "../../commons/net";
import store from "../../commons/store";


const styles = StyleSheet.create({
	landingContainer: {
		position: 'relative',
	},
	background: {
		width: '100%',
		height: '100%',
		paddingTop: 50,
	},
	logoWrap: {
		position: 'absolute',
		top: 20,
		zIndex: 9,
		alignItems: 'center',
		height: 50,
	},
	logo: {
		width: 88,
		height: 22,
		marginTop: 15,
	},
	contentWrap: {
		// flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
		position: 'absolute',
		bottom: 60,
		width: '80%',
		marginLeft: '10%',
	},
	thumbnail: {
		width: '100%',
		height: '100%',
	},
	alignJustify: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	emailButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 40,
		marginTop: 10,
	},
	emailImage: {
		width: 22,
		height: 20,
		marginRight: 30,
	},
	emailText: {
		lineHeight: 40,
		fontSize: 15,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	loginWrap: {
		width: '70%',
		marginLeft: '10%',
		marginBottom: 10,
	},
	loginButton: {
		flexDirection: 'row',
	},
	loginLabel: {
		fontSize: 15,
		color: '#ffffff',
	},
	loginImage: {
		width: 16,
		height: 14,
		marginRight: 5,
		marginLeft: 15,
	},
	loginText: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	ruleWrap: {
		marginTop: 15,
		alignItems: 'center',
	},
	ruleTextContainer: {
		flexDirection: 'row',
	},
	ruleText: {
		fontSize: 12,
		color: '#ffffff',
	},
	ruleButton: {
		position: 'relative',
		top: 1,
		paddingLeft: 3,
		paddingRight: 3,
		fontSize: 12,
		fontWeight: 'bold',
		color: '#ffffff',
		textDecorationLine: 'underline',
	},
});


class SignUpLandingPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			slideHeight: null,
		};
	}

	componentDidMount() {
		let windowHeight = Dimensions.get('window').height;

		this.setState({
			slideHeight: windowHeight,
		});

		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		console.log('back press:' + store.isAppFirstLoad);
		if (!store.isAppFirstLoad) {
			BackHandler.exitApp();
		} else {
			this.props.navigation.goBack();
		}
	};

  onAccessToken(type, token) {
    let { navigation } = this.props;
    const resultAuthToken = net.signUp('', type, token);
    resultAuthToken
      .then(data => {
        store.socialType = type;
        store.welaaaAuth = JSON.stringify(data);
        navigation.navigate('HomeScreen');
      })
      .catch(error => {
        const code = error.response.code;
        let message = '회원가입 실패';
        if (error.response.data && error.response.data.error) {
          message += ` (server message: ${error.response.data.error})`;
        }
        Alert.alert(message);
        console.log(error);
      });
  }

	render() {
		return <View style={[CommonStyles.container, styles.landingContainer]}>

			{/* 이미지 스와이퍼 */}
			<View style={{ width: '100%', height: this.state.slideHeight }}>
				<Swiper style={styles.wrapper}
					showsButtons={false}
					dotColor={"#888888"}
					activeDotColor={"#ffffff"}
					height={window.width}
					paginationStyle={{ bottom: '50%' }}>
					<View style={styles.slide}>
						<ImageBackground source={Slide1} resizeMode="cover" style={styles.thumbnail} />
					</View>
					<View style={styles.slide}>
						<ImageBackground source={Slide2} resizeMode="cover" style={styles.thumbnail} />
					</View>
					<View style={styles.slide}>
						<ImageBackground source={Slide3} resizeMode="cover" style={styles.thumbnail} />
					</View>
					<View style={styles.slide}>
						<ImageBackground source={Slide4} resizeMode="cover" style={styles.thumbnail} />
					</View>
				</Swiper>
			</View>
			{/* /이미지 스와이퍼 */}

			<View style={styles.contentWrap}>
				<View style={[styles.alignJustify, styles.loginWrap]}>
					<Text style={styles.loginLabel}>이미 윌라 계정이 있으신가요?</Text>
					<TouchableOpacity style={styles.loginButton} activeOpacity={0.9}
						onPress={() => this.props.navigation.navigate('Login')}>
						<Image source={icLogin} style={styles.loginImage} />
						<Text style={styles.loginText}>로그인</Text>
					</TouchableOpacity>
				</View>

				<FBLoginButton
					onAccess={token => this.onAccessToken('facebook', token)}
					type={'landing'} />

				<KakaoLoginButton
					onAccess={token => this.onAccessToken('kakaotalk', token)}
					type={'landing'} />

				<TouchableOpacity activeOpacity={0.9} onPress={() => this.props.navigation.navigate('EmailSignUpForm')}>
					<View style={styles.emailButton}
						borderWidth={1}
						borderStyle={'solid'}
						borderColor={'#ffffff'}
						borderRadius={4}>
						<Image source={icEmail} style={styles.emailImage} />
						<Text style={styles.emailText}>이메일 간편 가입</Text>
					</View>
				</TouchableOpacity>

				<View style={styles.ruleWrap}>
					<View style={styles.ruleTextContainer}>
						<Text style={styles.ruleText}>무료 계정을 생성하시면 월라</Text>
						<TouchableOpacity activeOpacity={0.9}
							onPress={() => this.props.navigation.navigate('PolicyPage')}>
							<Text style={styles.ruleButton} textDecorationLine={'underline'}>
								이용약관
							</Text>
						</TouchableOpacity>
						<Text style={styles.ruleText}>및</Text>
					</View>
					<View style={styles.ruleTextContainer}>
						<TouchableOpacity activeOpacity={0.9}
							onPress={() => this.props.navigation.navigate('PrivacyPage')}>
							<Text style={styles.ruleButton} textDecorationLine={'underline'}>
								개인정보보호정책
							</Text>
						</TouchableOpacity>
						<Text style={styles.ruleText}>에 동의하는 것으로 간주합니다.</Text>
					</View>
				</View>
			</View>

		</View>
	}
}


SignUpLandingPage.navigationOptions = () => {
	return {
		header: null
	}
}


export default SignUpLandingPage;
