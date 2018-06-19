import React from 'react';
import {requireNativeComponent, View} from 'react-native';

class MapView extends React.Component {
    render() {
        return <RNTMap {...this.props}/>;
    }
}


let RNTMap = requireNativeComponent('RnnModuleSample', null);

export default MapView;
