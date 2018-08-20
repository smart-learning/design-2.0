import React, { Component } from 'react';
import { Button, Text, View, TextInput, StyleSheet, ImageBackground } from "react-native";
import bgEmail from '../../../images/bg-emailform.png';

const styles = StyleSheet.create( {
	background: {
		width: '100%',
		height: '100%',
		paddingTop: 50,
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
} );

class EmailSignUpForm extends Component {
	constructor() {
		super();

		this.state = {
			name: null,
			email: null,
			password: null,
			passconf: null,
		};
	}

	render() {
		return <View>
			<ImageBackground source={bgEmail}
							 style={styles.background}
			>
				<Text>이메일 입력 폼</Text>
				<View borderRadius={4} style={styles.inputWrap}>
					<TextInput
						style={styles.input}
						value={this.state.name}
						autoCapitalize={'none'}
						onChangeText={text => {
							this.setState( { name: text } );
						}}/>
					<View style={styles.inputBr}/>
					<TextInput
						style={styles.input}
						value={this.state.email}
						autoCapitalize={'none'}
						onChangeText={text => {
							this.setState( { email: text } );
						}}/>
					<View style={styles.inputBr}/>
					<TextInput
						style={styles.input}
						secureTextEntry={true}
						autoCapitalize={'none'}
						value={this.state.password}
						onChangeText={text => {
							this.setState( { password: text } )
						}}/>
					<View style={styles.inputBr}/>
					<TextInput
						style={styles.input}
						secureTextEntry={true}
						value={this.state.passconf}
						autoCapitalize={'none'}
						onChangeText={text => {
							this.setState( { passconf: text } );
						}}/>
					<View style={styles.inputBr}/>
				</View>
			</ImageBackground>
			{/*<Button title="뒤로"*/}
					{/*onPress={() => this.props.navigation.navigate( 'SignUp' )}*/}
			{/*/>*/}

		</View>;
	}
}


export default EmailSignUpForm;
