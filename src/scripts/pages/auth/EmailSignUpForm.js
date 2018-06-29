import React, { Component } from 'react';
import {Button, Text, View} from "react-native";

class EmailSignUpForm extends Component {
    render() {
        return <View>

			<Button title="뒤로"
					onPress={ ()=> this.props.navigation.navigate('SignUp') }
			/>

				<Text>이메일 입력 폼</Text>
            </View>;
    }
}


export default EmailSignUpForm;
