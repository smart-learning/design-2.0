import React from "react";
import Styles from "../../../styles/common";
import {Image, Text, View} from "react-native";

export default class AudioScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: '오디오북',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../../images/chats-icon.png')}
                style={[Styles.size24, {tintColor: tintColor}]}
            />
        ),
    };

    render() {
        return <View style={Styles.container}>
            <Text>오디오북</Text>
        </View>
    }
}