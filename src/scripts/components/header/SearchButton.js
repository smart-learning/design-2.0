import React, { Component } from 'react';
import {Image, View} from "react-native";
import Styles from "../../../styles/common";
import IcSearch from "../../../images/ic-search.png"

class SearchButton extends Component {
    render() {
        return <View>
				<Image source={IcSearch} style={ Styles.size24 }/>
            </View>;
    }
}

export default SearchButton;
