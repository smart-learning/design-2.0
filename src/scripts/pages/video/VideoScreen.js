import React from "react";
import Styles from "../../../styles/common";
import {Image, Text, View} from "react-native";


export default class VideoScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: '동영상 강의',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../../images/chats-icon.png')}
                style={[Styles.size24, {tintColor: tintColor}]}
            />
        ),

        headerTitle: <View>
            <Text>헤더.....</Text>
        </View>
    };

    render() {
        return <View style={Styles.container}>
            <Text>동영상 강의 페이지</Text>
        </View>
    }
}