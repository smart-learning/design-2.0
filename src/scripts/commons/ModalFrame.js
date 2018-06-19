import React, {Component} from 'react';
import {Button, Modal, StyleSheet, Text, View} from "react-native";
import {COLOR_PRIMARY} from "../../styles/common";

class ModalFrame extends Component {

	constructor(){
		super();

		this.style = StyleSheet.create({
			frame: {
				flex: 1,
				backgroundColor: '#FFFFFF',
				alignItems: 'center',
				justifyContent: 'center'
			},

			footer: {
				backgroundColor: COLOR_PRIMARY,
			},

			button: {
				backgroundColor: COLOR_PRIMARY,
				textColor: '#FFFFFF'
			}
		});
	}


	render() {

		/*
        * onConfirm: 이 있으면 푸터에 확인&취소 노출, 아니라면 닫기만 노출
        * hideForDays: "n일동안 보지 않기" 노출
        * */
		const {onClose, onConfirm, hideForDays} = this.props;



		let hideButton;
		const footer = onConfirm ?
			<View style={ this.style.footer }>
				<Button style={ this.style.button } title="닫기"/>
			</View>
			:
			<View style={ this.style.footer }>
				<Button style={ this.style.button } title="확인"/>
				<Button style={ this.style.button } title="취소"/>
			</View>;


		if( hideForDays ) hideButton = <View>
			<Text>3일동안 보지 않기</Text>
		</View>;



		return <Modal
			animationType="slide"
			transparent={true}
			visible={true}
		>

			<View style={ this.style.frame }>
				<View>
					<Text>It's a Modal</Text>
					{this.children}
				</View>

				{hideButton}
				{footer}
			</View>

		</Modal>;
	}
}


export default ModalFrame;
