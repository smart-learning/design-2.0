import React, {Component} from 'react';
import {
	Alert,
	Button,
	Image,
	ImageBackground,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from "react-native";
import bgSignUp from "../../../images/bg-join.png";
import CommonStyles, {COLOR_PRIMARY} from "../../../styles/common";
import logo from "../../../images/logo-en-primary.png";
import {observer} from "mobx-react";
import {observable} from "mobx";
import BulletBoxCheck from "../../../images/ic-checkbox.png"
import BulletBoxChecked from "../../../images/ic-checkbox-checked.png"
import SignUpLandingPage from "./SignUpLandingPage";

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
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '80%',
		marginLeft: '10%',
		height: 100,
	},
	content: {
		width: '100%'
	},
	headline: {
		paddingBottom: 60,
		textAlign: 'center',
		fontSize: 40,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	inputWrap: {
		width: '100%',
		backgroundColor: '#ffffff',
	},
	inputBr: {
		width: '100%',
		height: 1,
		backgroundColor: '#d8d8d8',
	},
	input: {
		width: '100%',
		height: 40,
		paddingLeft: 15,
	},
	submitContainer: {
		width: '100%',
	},
	btnSubmit: {
		width: '100%',
		height: 48,
		marginTop: 10,
		marginBottom: 10,
		backgroundColor: COLOR_PRIMARY,
	},
	textSubmit: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 16,
		lineHeight: 48,
		textAlign: 'center',
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
	checkboxContainer: {
		position: 'relative',
		width: '100%',
		marginBottom: 15,
	},
	checkbox: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
	checkBoxImage: {
		width: 17,
		height: 17,
	},
	agreeText: {
		position: 'absolute',
		top: -15,
		left: 25,
		width: 200,
		fontSize: 12,
		color: '#ffffff',
	},
});

@observer
class EmailSignUpForm extends Component {
	@observable name = '이름';
	@observable email = '이메일';
	@observable password = '비밀번호';
	@observable passconf = '비밀번호확인';
	@observable isAgree = false;

	validityNameOnFocus = () => {
		if (this.name === '이름') {
			this.name = '';
		}
	};
	validityEmailOnFocus = () => {
		if (this.email === '이메일') {
			this.email = '';
		}
	};
	validityPasswordOnFocus = () => {
		if (this.password === '비밀번호') {
			this.password = '';
		}
	};
	validityPassconfOnFocus = () => {
		if (this.passconf === '비밀번호확인') {
			this.passconf = '';
		}
	};

	handleJoin = () => {
		if (this.email === null) {
			Alert.alert('이메일은 필수 입력항목입니다.');
			return false;
		} else if (this.password === null) {
			Alert.alert('비밀번호는 필수 입력항목입니다.');
			return false;
		}

		this.props.onAccess(this.state.email, this.state.password);
	};

	agreeStatus = () => {
		if (this.isAgree === false) {
			this.isAgree = true;
		} else {
			this.isAgree = false;
		}
	};

	render() {
		return <KeyboardAvoidingView style={[CommonStyles.container, styles.loginContainer]} behavior="padding">

			<View style={styles.logoWrap}>
				<Image source={logo} style={styles.logo}/>
			</View>
			<ImageBackground source={bgSignUp}
							 style={styles.background}
			>
				<View style={styles.contentWrap}>
					<View style={styles.content}>
						<Text style={styles.headline}>무료계정만들기</Text>

						<View borderRadius={4} style={styles.inputWrap}>
							<TextInput
								style={styles.input}
								underlineColorAndroid={'rgba(0,0,0,0)'}
								onFocus={this.validityNameOnFocus}
								value={this.name}
								autoCapitalize={'none'}
								onChangeText={text => {
									this.name = text
								}}/>
							<View style={styles.inputBr}/>
							<TextInput
								style={styles.input}
								underlineColorAndroid={'rgba(0,0,0,0)'}
								onFocus={this.validityEmailOnFocus}
								value={this.email}
								autoCapitalize={'none'}
								onChangeText={text => {
									this.email = text
								}}/>
							<View style={styles.inputBr}/>
							<TextInput
								style={styles.input}
								underlineColorAndroid={'rgba(0,0,0,0)'}
								onFocus={this.validityPasswordOnFocus}
								secureTextEntry={true}
								autoCapitalize={'none'}
								value={this.password}
								onChangeText={text => {
									this.password = text
								}}/>
							<View style={styles.inputBr}/>
							<TextInput
								style={styles.input}
								underlineColorAndroid={'rgba(0,0,0,0)'}
								onFocus={this.validityPassconfOnFocus}
								secureTextEntry={true}
								autoCapitalize={'none'}
								value={this.passconf}
								onChangeText={text => {
									this.passconf = text
								}}/>
						</View>

						<View style={styles.submitContainer}>
							<TouchableOpacity activeOpacity={0.9}
											  onPress={this.handleJoin}>
								<View borderRadius={4}
									  style={styles.btnSubmit}>
									<Text style={styles.textSubmit}>가입하기</Text>
								</View>
							</TouchableOpacity>
						</View>

						<View style={styles.checkboxContainer}>
							<View style={styles.checkbox}>
								<TouchableOpacity activeOpacity={0.9} onPress={this.agreeStatus}>
								{this.isAgree === true &&
								<Image source={BulletBoxChecked} style={styles.checkBoxImage}/>
								}
								{this.isAgree === false &&
								<Image source={BulletBoxCheck} style={styles.checkBoxImage}/>
								}
								</TouchableOpacity>
								<View>
									<Text style={styles.agreeText}>
										새로운 콘텐츠 및 이벤트 정보 받기
									</Text>
								</View>
							</View>
						</View>

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

			</ImageBackground>

		</KeyboardAvoidingView>
	}
}

EmailSignUpForm.navigationOptions = () => {
	return {
		header: null
	}
}

export default EmailSignUpForm;
