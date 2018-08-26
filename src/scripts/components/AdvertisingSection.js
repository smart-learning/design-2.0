import React, {Component} from 'react';
import {AsyncStorage, Button, Modal, StyleSheet, Dimensions, View} from "react-native";
import Image from 'react-native-scalable-image';
import {COLOR_PRIMARY} from "../../styles/common";
import moment from 'moment';
import net from "../commons/net";

class AdvertisingSection extends Component {

	constructor() {
		super();

		this.style = StyleSheet.create({

			container: {
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#00000099',
			},

			frame:{
				width: Dimensions.get('window').width - 30,
				borderRadius: 20,
				overflow: 'hidden',
				backgroundColor: '#FFFFFF',
			},

			img: {
				// borderTopRightRadius: 20,
				// borderTopLeftRadius: 20,
				// overflow: 'hidden',
			},

			footer: {
				flexDirection: 'row',
				width: '100%',
				// borderBottomLeftRadius: 20,
				// borderBottomRightRadius: 20,
				// overflow: 'hidden',
				alignItems:'center'
			},

			hideOption:{
				alignItems: 'flex-start',
			},

			footerBg:{
				width: '100%',
				height: 50,
				backgroundColor: COLOR_PRIMARY,
			},

			footerBtn:{

			}
		});


		this.state = {
			visible: false,
			img: null,
		}
	}

	componentDidMount = async () => {
		// console.log('load popup');
		// let data = await net.getMainPopup();
		// console.log('loaded popup:', data[0] );
        //
		// if( data.length === 0 ) return;
        //
		// this.setState({
		// 	visible: true,
		// 	img: data[0].img_url,
		// });
        //
		// console.log( data[0].img_url );
	}



	onConfirm = () => {
		this.setState({ visible: false });
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


		return <Modal
				animationType="slide"
				transparent={true}
				visible={ this.state.visible }
				onRequestClose={()=>{}}
			>

			<View style={this.style.container}>


				<View style={this.style.frame}>
					<Image source={ {uri:this.state.img} }
						   width={ Dimensions.get('window').width - 30 }
						   style={ this.style.img }
						   resizeMode={'cover'}
					/>

					<View style={ this.style.hideOption }>
						<Button title="3일동안 보지 않기"
								color="#000000"
								onPress={this.hide3Days}/>
					</View>

					<View style={this.style.footer}>
						<View style={this.style.footerBg}>
							<Button title="확인"
									color="#FFFFFF"
									style={ this.style.footerBtn }
									onPress={() => this.onConfirm()}/>
						</View>
					</View>
				</View>

			</View>

			</Modal>
	}

}


export default AdvertisingSection;
