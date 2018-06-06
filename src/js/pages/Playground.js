import React, {Component} from 'react';
import {Button, StatusBar, Text, View} from "react-native";
import S from "../../styles/common";
import {SafeAreaView} from "react-navigation";

class Playground extends Component {
    render() {
        return <SafeAreaView style={[ S.container, {backgroundColor: '#ecf0f1'}]}>

                <Text>PLAYGROUND</Text>
                <Button
                    title="Home screen"
                    onPress={() => this.props.navigation.navigate('HomeScreen')}
                />

            </SafeAreaView>
    }
}


export default Playground;
