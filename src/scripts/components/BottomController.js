import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { requireNativeComponent, View } from 'react-native';

class BottomControllerComponent extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		// alert('mounted');
		console.log('BottomController componentDidMount ', this.props)
	}

	render() {
		console.log('BottomController IN ', this.props)
		return <BottomController {...this.props} style={{ height: 50 }} miniPlayer={this.props} />
	}
}

BottomControllerComponent.propTypes = {
	miniPlayer: PropTypes.string,
	...View.propTypes,
}

let BottomController = requireNativeComponent('RCTBottomController',
	BottomControllerComponent,
);

export default BottomControllerComponent;
