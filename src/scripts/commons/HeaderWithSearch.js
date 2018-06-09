import React, { Component } from 'react';
import {Text, View, Image, TouchableOpacity} from "react-native";
import Styles from "../../styles/common";
import IcBars from "../../images/ic-bars.png"
import IcSearch from "../../images/ic-search.png"
import logo from "../../images/logo-white.png"
import Store from "./store";
import {DrawerActions} from "react-navigation";

class HeaderWithSearch extends Component {
    render() {
        return <View style={ Styles.alignJustify }>
            <TouchableOpacity
                onPress={() => {
                    Store.drawer.dispatch(DrawerActions.toggleDrawer())
                }}
            >
                <Image source={IcBars} style={ Styles.size24 }/>
            </TouchableOpacity>
            <Image source={logo} style={ Styles.headerLogo }/>
            <Image source={IcSearch} style={ Styles.size24 }/>
        </View>
    }
}

export default HeaderWithSearch;
