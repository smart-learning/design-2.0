import React, { Component } from 'react';
import { requireNativeComponent, View } from 'react-native';

class BottomControllerComponent extends Component {

	componentDidMount(){
		// alert('mounted');
	}

	render() {
        return <BottomController {...this.props} style={ { height: 50 } }  />
	}

}

BottomControllerComponent.propTypes = {
    ...View.propTypes,
}

let BottomController = requireNativeComponent('RCTBottomController', BottomControllerComponent);

export default BottomControllerComponent;
