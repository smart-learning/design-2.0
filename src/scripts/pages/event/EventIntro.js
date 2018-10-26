import React from "react";
import {
	TouchableOpacity,
	Text,
	View,
	Image,
	StyleSheet,
	ScrollView,
	Dimensions
} from "react-native";
import nav from '../../commons/nav';
import Styles from "../../../styles/common";

const styles = StyleSheet.create({
	btnContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 60,
		marginLeft: 'auto',
		marginRight: 20,
		padding: 4,
	},
	textColor: {
		fontSize: 12,
		color: '#ffffff',
	}
});

let navigation = null;
export default class EventIntroView extends React.Component {
	windowWidth = null;
	

	constructor(props) {
		super(props);
		let id = null;
		this.windowWidth = Dimensions.get('window').width;
		navigation = props.navigation;
		console.log(props);
	}

	//     try {
	//       id = props.navigation.state.params.id;
	//     } catch (e) {}

	//     this.state = {
	//       id: id,
	//       eventDetail: null
	//     };

	//     this.windowWidth = Dimensions.get('window').width;
	//     this.initialize();
	//   }

	//   async initialize() {
	//     const { id } = this.state;
	//     if (id) {
	//       this.setState({
	//         eventDetail: await net.getEventDetail(id)
	//       });
	//     }
	//   }

	//   componentDidMount() {
	//     BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);  
	//   };

	//   componentWillUnmount() {
	//     BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	//   }

	handleBackPress = () => {

		// if (this.props.navigation.isFocused()) {
		navigation.commonBack();
		// }

		return true;
	};
	gotoBotm_A() {
		navigation.navigate('AudioBookDetailPage', { id: 814 });
	}


	render() {

		const imageWidth = this.windowWidth;
		const imageHeight_a = this.windowWidth * 2023 / 680;
		const imageHeight_b = this.windowWidth * 1084 / 680;
		

		return (
			<View>
				<ScrollView >
					<View>
						<TouchableOpacity activeOpacity={0.9} onPress={this.gotoBotm_A}>
							<Image source={{ uri: 'http://welaaa.co.kr/event/20181001_10botm/page_01.jpg' }}
								resizeMode="cover" style={{
									width: imageWidth,
									height: imageHeight_a
								}} ></Image>
						</TouchableOpacity>
					</View>
					<View>
						<TouchableOpacity activeOpacity={0.9} onPress={this.gotoBotm_A}>
						<Image source={{ uri: 'http://welaaa.co.kr/event/20181001_10botm/page_03.jpg' }}
								resizeMode="cover" style={{
									width: imageWidth,
									height: imageHeight_b
								}} ></Image>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		);
	}
}