import React, { Component } from 'react';
import {View, Image, TouchableOpacity} from "react-native";
import CommonStyles from "../../styles/common";
import logo from "../../images/logo-white.png"
import SearchButton from "./SearchButton";
import HomeButton from "./HomeButton";

class HeaderWithSearch extends Component {
    render() {
        return <View style={ CommonStyles.alignJustify }>
            <HomeButton/>
            <Image source={logo} style={ CommonStyles.headerLogo }/>
            <SearchButton/>
        </View>
    }
}

export default HeaderWithSearch;
