import React, { Component } from 'react';
import {WebView} from "react-native";
import {SafeAreaView, withNavigation} from "react-navigation";
import HeaderForWebView from "../components/header/HeaderForWebView";
import {observable} from "mobx";
import {observer} from "mobx-react";

@observer
class WebViewScreen extends Component {

	@observable url = null;

	componentDidMount(){
		const u = this.props.navigation.getParam('url');
		this.url = decodeURIComponent(u);
	}

	render() {

		return <SafeAreaView style={{ flex:1 }}>
			<HeaderForWebView/>
			{ this.url &&
			<WebView
				style={{ flex:1, position:'absolute', width:'100%', height:'100%', top:0, left:0 }}
				source={{ uri: this.url }}
			/>
			}

		</SafeAreaView >
	}
}

export default withNavigation(WebViewScreen);
