import React from "react";
import {ScrollView, StyleSheet, Switch, Text, View, TouchableOpacity} from "react-native";
import CommonStyles from "../../../styles/common";
import {SafeAreaView} from "react-navigation";
import {observer} from "mobx-react";
import {observable} from "mobx";
import globalStore from '../../../scripts/commons/store';

const styles = StyleSheet.create({
	title: {
		paddingTop: 35,
		paddingBottom: 20,
		fontSize: 18,
		fontWeight: 'bold',
		color: '#000000'
	},
	setBox: {
		width: '100%',
		alignItems: 'center',
		height: 50,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#ffffff',
	},
	setContent: {
		width: '100%',
		alignItems: 'center',
	},
	label: {
		fontSize: 16,
		color: '#000000'
	},
	logoutButton: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
		marginTop: 25,
		marginBottom: 25,
		backgroundColor: '#dbdbdb',
	},
	logoutText: {
		fontSize: 16,
		color: '#000000'
	},
});

@observer
class SetAppPage extends React.Component {

	@observable isAutoLogin = false;
	@observable isWifiPlay = false;
	@observable isWifiDownload = false;
	@observable isAlert = false;
	@observable isEmail = false;

	logout = () => {
		globalStore.clearTokens();
		this.props.navigation.navigate('Login');
	};

	render() {
		return <View style={CommonStyles.container}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<View style={CommonStyles.contentContainer}>
						<Text style={styles.title}>로그인설정</Text>
						<View style={styles.setBox}>
							<View style={[CommonStyles.alignJustifyContentBetween, styles.setContent]}>
								<View>
									<Text style={styles.label}>자동로그인</Text>
								</View>
								<View style={styles.switch}>
									<Switch value={this.isAutoLogin}
											onValueChange={value => this.isAutoLogin = value}/>
								</View>
							</View>
						</View>
						<Text style={styles.title}>재생설정</Text>
						<View style={styles.setBox}>
							<View style={[CommonStyles.alignJustifyContentBetween, styles.setContent]}>
								<View>
									<Text style={styles.label}>Wifi에서만 재생</Text>
								</View>
								<View style={styles.switch}>
									<Switch value={this.isWifiPlay}
											onValueChange={value => this.isWifiPlay = value}/>
								</View>
							</View>
						</View>
						<Text style={styles.title}>다운로드</Text>
						<View style={styles.setBox}>
							<View style={[CommonStyles.alignJustifyContentBetween, styles.setContent]}>
								<View>
									<Text style={styles.label}>Wifi에서만 다운</Text>
								</View>
								<View style={styles.switch}>
									<Switch value={this.isWifiDownload}
											onValueChange={value => this.isWifiDownload = value}/>
								</View>
							</View>
						</View>
						<Text style={styles.title}>알림</Text>
						<View style={styles.setBox}>
							<View style={[CommonStyles.alignJustifyContentBetween, styles.setContent]}>
								<View>
									<Text style={styles.label}>원격푸쉬알림허용</Text>
								</View>
								<View style={styles.switch}>
									<Switch value={this.isAlert}
											onValueChange={value => this.isAlert = value}/>
								</View>
							</View>
						</View>
						<Text style={styles.title}>이메일수신동의</Text>
						<View style={styles.setBox}>
							<View style={[CommonStyles.alignJustifyContentBetween, styles.setContent]}>
								<View>
									<Text style={styles.label}>이메일수신동의</Text>
								</View>
								<View style={styles.switch}>
									<Switch value={this.isEmail}
											onValueChange={value => this.isEmail = value}/>
								</View>
							</View>
						</View>
						<Text style={styles.title}>버전정보</Text>
						<View style={styles.setBox}>
							<View style={[CommonStyles.alignJustifyContentBetween, styles.setContent]}>
								<View>
									<Text style={styles.label}>현재버전 0.0</Text>
								</View>
							</View>
						</View>
						<View style={styles.logoutButton}>
							<TouchableOpacity activeOpacity={0.9} onPress={this.logout}>
								<Text style={styles.logoutText}>로그아웃</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}

export default SetAppPage