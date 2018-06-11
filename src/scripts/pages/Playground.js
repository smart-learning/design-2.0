import React, {Component} from 'react';
import {Button, StatusBar, Text, View} from "react-native";
import CommonStyles from "../../styles/common";
import {SafeAreaView} from "react-navigation";
import VideoPack from "../commons/VideoPack";
import Video from "react-native-video";

class Playground extends Component {

    render() {
        return <SafeAreaView style={[ CommonStyles.container, {backgroundColor: '#ecf0f1'}]}>

                <Text>PLAYGROUND</Text>
                <Button
                    title="Home screen"
                    onPress={() => this.props.navigation.navigate('HomeScreen')}
                />

                <VideoPack/>


            </SafeAreaView>
    }
}


export default Playground;
