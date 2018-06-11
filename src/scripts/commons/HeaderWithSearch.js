import React, { Component } from 'react';
import {Text, View, Image, TouchableOpacity} from "react-native";
import CommonStyles from "../../styles/common";
import IcBars from "../../images/ic-bars.png"
import IcSearch from "../../images/ic-search.png"
import logo from "../../images/logo-white.png"
import Store from "./store";
import {DrawerActions} from "react-navigation";

class HeaderWithSearch extends Component {
    render() {
        return <View style={ CommonStyles.alignJustify }>
            <TouchableOpacity
                onPress={() => {
                    Store.drawer.dispatch(DrawerActions.toggleDrawer())
                }}
            >
                <Image source={IcBars} style={ CommonStyles.size24 }/>
            </TouchableOpacity>
            <Image source={logo} style={ CommonStyles.headerLogo }/>
            <Image source={IcSearch} style={ CommonStyles.size24 }/>
        </View>
    }
}

export default HeaderWithSearch;
