import React from "react";
import {Button, Image, StyleSheet, Text, View} from "react-native";
import S from "../../styles/common";


export class HomeScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: '홈',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../images/chats-icon.png')}
                style={[S.sidebar_icon, {tintColor: tintColor}]}
            />
        ),
    };

    render() {
        return <View style={S.container}>
            <Text>홈</Text>
        </View>
    }
}

export class VideoScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: '동영상 강의',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../images/chats-icon.png')}
                style={[S.sidebar_icon, {tintColor: tintColor}]}
            />
        ),
    };

    render() {
        return <View style={S.container}>
            <Text>동영상 강의 페이지</Text>
        </View>
    }
}


export class AudioScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: '오디오북',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../images/chats-icon.png')}
                style={[S.sidebar_icon, {tintColor: tintColor}]}
            />
        ),
    };

    render() {
        return <View style={S.container}>
            <Text>오디오북</Text>
        </View>
    }
}


export class MyScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: '홈',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../../images/chats-icon.png')}
                style={[S.sidebar_icon, {tintColor: tintColor}]}
            />
        ),
    };

    render() {
        return <View style={S.container}>
            <Text>마이</Text>
        </View>
    }
}