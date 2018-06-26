import React, {Component} from 'react';
import {Text, TextInput, TouchableOpacity, View} from "react-native";

class EmailAuthPack extends Component {

	constructor() {
		super();

		this.state = {
			email: null,
			password: null,
		}
	}

	render() {
		return <View>
			<TextInput
				value={this.state.email}
				onChangeText={ text =>
					this.setState({email: text})
				}/>

			<TextInput
				value={this.state.password}
				onChangeText={ text =>
					this.setState({password: text})
				}/>

			<TouchableOpacity>
				<Text>윌라 계정으로</Text>
			</TouchableOpacity>

			<TouchableOpacity>
				<Text>비밀번호 찾기</Text>
			</TouchableOpacity>

			<TouchableOpacity>
				<Text>무료 계정만들기</Text>
			</TouchableOpacity>
		</View>
	}
}


export default EmailAuthPack;
