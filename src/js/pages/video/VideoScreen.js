import React from "react";
import S from "../../../styles/common";
import {Image, Text, View} from "react-native";


export default class VideoScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: '동영상 강의',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../../images/chats-icon.png')}
                style={[S.sidebarIcon, {tintColor: tintColor}]}
            />
        ),
    };

    render() {
        return <View style={S.container}>
            <Text>동영상 강의 페이지</Text>
        </View>
    }
}