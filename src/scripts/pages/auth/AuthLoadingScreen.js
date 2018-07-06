import React from 'react';
import {ActivityIndicator, StatusBar, View} from "react-native";
import Styles from "../../../styles/common";
import Store from "../../../scripts/commons/store";

/*
* 로그인 검증용 페이지
* */
class AuthLoadingScreen extends React.Component {

	// Fetch the token from storage then navigate to our appropriate place
	componentDidMount(){

		let requestScreenName = this.props.navigation.getParam('requestScreenName', 'MyInfoHome');

		if( Store.token )
			this.props.navigation.navigate(requestScreenName);
		else
			this.props.navigation.navigate('Login', { requestScreenName: requestScreenName });

	};

	// Render any loading content that you like here
	render() {
		return (
			<View style={Styles.container}>
				<ActivityIndicator/>
				<StatusBar barStyle="default"/>
			</View>
		);
	}
}

export default AuthLoadingScreen;