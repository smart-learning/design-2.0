import React, { Component } from 'react';
import {Text, View} from "react-native";
import Styles from "../../styles/common";

class HeaderWithSearch extends Component {
    render() {
        return <View style={ Styles.alignJustify }>
            <Text>로고</Text>
            <Text>검색바</Text>
        </View>
    }
}

export default HeaderWithSearch;
