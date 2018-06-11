import React, { Component } from 'react';
import {View, Image, TouchableOpacity} from "react-native";
import CommonStyles from "../../styles/common";
import IcBars from "../../images/ic-bars.png"
import logo from "../../images/logo-white.png"
import Store from "./store";
import {DrawerActions} from "react-navigation";
import SearchButton from "./SearchButton";

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
            <SearchButton/>
        </View>
    }
}

export default HeaderWithSearch;
