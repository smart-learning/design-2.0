import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View, AsyncStorage, Alert} from "react-native";
import {COLOR_PRIMARY} from "../../../styles/common";
import {withNavigation} from "react-navigation";
import net from "../../commons/net";
import store from "../../commons/store";
import axios from "axios";

const styles = StyleSheet.create({
	contentContainer: {
		width: '100%',
	},
	inputWrap: {
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
	linkWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	btnLinkText: {
		fontSize: 12,
		color: COLOR_PRIMARY,
	}
});

class EmailAuthPack extends Component {

	constructor() {
		super();

		this.state = {
			email: null,
			password: null,
		};
	}

	handleLogin = () => {
		if (this.state.email === null) {
			Alert.alert('이메일은 필수 입력항목입니다.');
			return false;
		} else if (this.state.password === null) {
			Alert.alert('비밀번호는 필수 입력항목입니다.');
			return false;
		}

		this.props.onAccess( this.state.email, this.state.password );
	};

	render() {
		return <View style={styles.contentContainer}>

			<View borderRadius={4} style={styles.inputWrap}>
				<TextInput
					style={styles.input}
					underlineColorAndroid={'rgba(0,0,0,0)'}
					value={this.state.email}
					autoCapitalize={'none'}
					onChangeText={text => {
						this.setState({email: text});
					}}/>
				<View style={styles.inputBr}/>
				<TextInput
					style={styles.input}
					underlineColorAndroid={'rgba(0,0,0,0)'}
					secureTextEntry={true}
					autoCapitalize={'none'}
					value={this.state.password}
					onChangeText={text => {
						this.setState({password: text})
					}}/>
			</View>

			<TouchableOpacity activeOpacity={0.9}
							  onPress={this.handleLogin}>
				<View borderRadius={4}
					  style={styles.btnSubmit}>
					<Text style={styles.textSubmit}>윌라 계정으로</Text>
				</View>
			</TouchableOpacity>

			<View style={styles.linkWrap}>
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={() => this.props.onNavigate('FindPassword')}>
					<Text style={styles.btnLinkText}>비밀번호 찾기</Text>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.9}
					onPress={() => this.props.onNavigate('SignUpPage')}>
					<Text style={styles.btnLinkText}>무료 계정만들기</Text>
				</TouchableOpacity>
			</View>

		</View>
	}
}


export default EmailAuthPack;
