import React from 'react';
import { Text, View } from 'react-native';
import { Link } from 'react-router-native';

export default () => <View>
	<Text>Login</Text>
	<Link to="/">
		<Text>: Back to index</Text>
	</Link>
</View>;
