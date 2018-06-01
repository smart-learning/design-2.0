import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter as Router, Route } from 'react-router-native'
import Index from './pages/index';
import Login from './pages/login';

export default class App extends React.Component {
  render() {
    return (
      <View style={ styles.container }>
	<Router>
		<View>
			<Route exact path="/" component={ Index }/>
			<Route path="/login" component={ Login }/>
		</View>
	</Router>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
