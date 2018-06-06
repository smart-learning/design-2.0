import React from "react";
import S from "../../../styles/common";
import {Button, Image, Text, View} from "react-native";

export default class HomeSubScreen2 extends React.Component {

    render() {
        return <View style={S.container}>
            <Text>홈 서브페이지2</Text>
            <Button
                onPress={()=>this.props.navigation.goBack()}
                title="뒤로"
            />
        </View>
    }
}