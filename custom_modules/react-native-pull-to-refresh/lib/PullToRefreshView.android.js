'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {View, RefreshControl, ScrollView} from 'react-native'

export default class PTRViewAndroid extends React.Component {
	constructor() {
		super()
		this.state = {
			isLoading: false
		}

		this.sv = null;
	}

	_delay() {
		return new Promise((resolve) => {
			setTimeout(resolve, this.props.delay)
		})
	}

	_handleOnRefresh() {
		this.setState({isLoading: true})
		return new Promise((resolve) => {
			Promise.all([
				this.props.onRefresh(resolve),
				this._delay()
			])
				.then(() => {
					this._endLoading()
				})
		})
	}

	_endLoading() {
		this.setState({
			isLoading: false
		})
	}

	componentWillReceiveProps(prop, prev) {
		if (!prop.forceScrollValue && prop.forceScrollValue === prop.forceScrollValue) return;
		console.log('이동', prop.forceScrollValue);
		this.sv.scrollTo({x: 0, y: prop.forceScrollValue, animated: true});
	}

	render() {
		return (
			<ScrollView
				ref={ref => (this.sv = ref)}
				{...this.props}
				refreshControl={
					<RefreshControl
						refreshing={this.state.isLoading}
						onRefresh={this._handleOnRefresh.bind(this)}
						progressViewOffset={this.props.offset}
					/>
				}
			>
				{this.props.children}
			</ScrollView>
		)
	}
}

PTRViewAndroid.defaultProps = {
	colors: ['#000'],
	progressBackgroundColor: '#fff',
	offset: 0,
	delay: 0
}

PTRViewAndroid.propTypes = {
	delay: PropTypes.number,
	onRefresh: PropTypes.func,
	style: PropTypes.object,
	children(props, propName, componentName) {
	}
}
