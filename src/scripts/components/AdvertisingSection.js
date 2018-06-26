import React, {Component} from 'react';
import {AsyncStorage, Button, Modal, StyleSheet, Text, View} from "react-native";
import {COLOR_PRIMARY} from "../../styles/common";
import moment from 'moment';

class AdvertisingSection extends Component {

	constructor() {
		super();

		this.style = StyleSheet.create({

			frame: {
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#00000099',
			},

			footer: {
				flexDirection: 'row',
				backgroundColor: COLOR_PRIMARY,
			},

			button: {
				backgroundColor: COLOR_PRIMARY,
			}
		});


		this.state = {
			// modalId: 'b'
		}
	}

	componentDidMount() {

		// alert( new Date() );
		// AsyncStorage.setItem('sample', JSON.stringify({ expiryDate: new Date(), data: 'sample data'}));

		// AsyncStorage.getItem( 'sample' ).then( res=>{
		// 	let data = JSON.parse( res );
		// 	alert( moment( new Date() ).diff( data.expiryDate, 'days' ));
		// });

	}



	onConfirm = () => {
		this.setState({ modalId:null });
	}

	onCancel = () => {
		this.setState({ modalId:null });
	}

	hide3Days = (id) => {
		// console.log( e );
		// alert( JSON.stringify( e ));
	}


	render() {

		/*
        * onConfirm: 이 있으면 푸터에 확인&취소 노출, 아니라면 닫기만 노출
        * hideForDays: "n일동안 보지 않기" 노출,
        *
        * ex) 평점 주기,
        * */
		// const {onClose, onConfirm, hideForDays} = this.props;
		//
		//
		//
		// let hideButton;
		// const footer = onConfirm ?
		// 	<View style={ this.style.footer }>
		// 		<Button style={ this.style.button } title="닫기"/>
		// 	</View>
		// 	:
		// 	<View style={ this.style.footer }>
		// 		<Button style={ this.style.button } title="확인"/>
		// 		<Button style={ this.style.button } title="취소"/>
		// 	</View>;
		//
		//
		// if( hideForDays ) hideButton = <View>
		// 	<Text>3일동안 보지 않기</Text>
		// </View>;

		let { modalId } = this.state;

		// alert( modalId );


		return <View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={ modalId === 'a' }
				style={this.style.container}
				onRequestClose={()=>{}}
			>

				<View style={this.style.frame}>

					<View>
						<Text>It's a Modal A</Text>
					</View>

					<View style={this.style.footer}>
						<Button title="확인" onPress={()=>this.onConfirm()}/>
						<Button title="취소" onPress={()=>this.onCancel()}/>
					</View>

				</View>

			</Modal>

			<Modal
				animationType="slide"
				transparent={true}
				visible={ modalId === 'b' }
				style={this.style.container}
				onRequestClose={()=>{}}
			>

				<View style={this.style.frame}>

					<View>
						<Text>It's a Modal B</Text>
					</View>

					<View>
						<Button title="3일동안 보지 않기" onPress={this.hide3Days}/>
					</View>

					<View style={this.style.footer}>
						<Button title="확인" onPress={()=>this.onConfirm()}/>
						<Button title="취소" onPress={()=>this.onCancel()}/>
					</View>

				</View>

			</Modal>
		</View>
	}

}


export default AdvertisingSection;
