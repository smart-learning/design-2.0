import React, { Component } from 'react';
import {Button, Text, View} from "react-native";

class FindPasswordPage extends Component {

    render() {
        return <View>
				<Button title="뒤로"
						onPress={ ()=> this.props.navigation.navigate('Login') }
				/>


				<Text>비밀번호 찾기</Text>
            </View>;
    }
}


export default FindPasswordPage;
