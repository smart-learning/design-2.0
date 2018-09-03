import React from "react";
import {AsyncStorage, ScrollView, StyleSheet, Switch, Text, View, TouchableOpacity} from "react-native";
import CommonStyles from "../../../styles/common";
import {SafeAreaView} from "react-navigation";
import {observer} from "mobx-react";
import {observable} from "mobx";
import globalStore from '../../../scripts/commons/store';
import Native from "../../commons/native";
import VersionNumber from "react-native-version-number";

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

	logout = () => {
		globalStore.clearTokens();
		this.props.navigation.navigate('Login');
	};

	setIsAutoLoginChange = ( value ) => {
		AsyncStorage.setItem( 'config:isAutoLogin', value.toString() );
		globalStore.appSettings.isAutoLogin = value;
	};

	setIsWifiPlayChange = ( value ) => {
		AsyncStorage.setItem( 'config:isWifiPlay', value.toString() );
		globalStore.appSettings.isWifiPlay = value;
	};
	setIsWifiDownloadChange = ( value ) => {
		AsyncStorage.setItem( 'config:isWifiDownload', value.toString() );
		globalStore.appSettings.isWifiDownload = value;
	};
	setIsAlertChange = ( value ) => {
		AsyncStorage.setItem( 'config:isAlert', value.toString() );
		globalStore.appSettings.isAlert = value;
	};
	setIsEmailChange = ( value ) => {
		AsyncStorage.setItem( 'config:isEmail', value.toString() );
		globalStore.appSettings.isEmail = value;
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
									<Switch value={globalStore.appSettings.isAutoLogin}
											onValueChange={this.setIsAutoLoginChange}/>
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
									<Switch value={globalStore.appSettings.isWifiPlay}
											onValueChange={this.setIsWifiPlayChange}/>
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
									<Switch value={globalStore.appSettings.isWifiDownload}
											onValueChange={this.setIsWifiDownloadChange}/>
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
									<Switch value={globalStore.appSettings.isAlert}
											onValueChange={this.setIsAlertChange}/>
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
									<Switch value={globalStore.appSettings.isEmail}
											onValueChange={this.setIsEmailChange}/>
								</View>
							</View>
						</View>
						<Text style={styles.title}>버전정보</Text>
						<View style={styles.setBox}>
							<View style={[CommonStyles.alignJustifyContentBetween, styles.setContent]}>
								<View>
									<Text style={styles.label}>현재버전 { VersionNumber.appVersion }</Text>
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