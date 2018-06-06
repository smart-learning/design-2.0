import React from "react";
import S from "../../../styles/common";
import {Button, Image, Text, View} from "react-native";

export default class HomeSubScreen1 extends React.Component {

    render() {
        return <View style={S.container}>
            <Text>여기는 홈 서브페이지1</Text>
            <Button
                onPress={()=>this.props.navigation.navigate('HomeScreen2')}
                title="서브페이지2로.."
            />
        </View>
    }
}