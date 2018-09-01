import React, { Component } from 'react';
import { requireNativeComponent, View } from 'react-native';

class BottomControllerComponent extends Component {

	render() {
        return <BottomController {...this.props} />
	}

}

BottomControllerComponent.propTypes = {
    ...View.propTypes,
}

let BottomController = requireNativeComponent('RCTBottomController', BottomControllerComponent);

export default BottomControllerComponent;
