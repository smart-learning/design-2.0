import React from "react";
import { View, Button } from "react-native";
import BottomController from '../components/BottomController'
import Styles from "../../styles/common";

export default class BottomControllerPage extends React.Component {

	render() {
		return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={ Styles.container }>
                    <Button title="TEST" />
                </View>
                <BottomController style={{ height: 45 }} />
            </View>
        )
	}
}