import React from 'react';
import { Text, View } from 'react-native';
import { Link } from 'react-router-native';

export default () => <View>
	<Text>Welass App 2.0 Ready</Text>
	<Link to="/login">
		<Text>: login</Text>
	</Link>
</View>
