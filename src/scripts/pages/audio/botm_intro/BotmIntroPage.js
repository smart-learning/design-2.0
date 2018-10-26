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
import globalStore from '../../../commons/store';

let navigation = null;
export default class BotmIntroPage extends React.Component {
	windowWidth = null;


	constructor(props) {
		super(props);

		let info = null;
		this.windowWidth = Dimensions.get('window').width;
		navigation = props.navigation;
		this.state = {
			is_loading: true,
			img_A:'https://static.welaaa.co.kr/static/botm/intro_page/'+navigation.state.params.info+'_A.jpg',
			img_B:'https://static.welaaa.co.kr/static/botm/intro_page/'+navigation.state.params.info+'_B.jpg'
		}
	}

	componentWillMount() {
		

		Image.getSize(this.state.img_A, (width, height) => {
			
			if (this.windowWidth != null) {
				this.setState({
					botm_A_width: this.windowWidth,
					botm_A_height: this.windowWidth * height / width
				});
			} else {
				this.setState({ botm_A_width: width, botm_A_height: height });
			}
		});
		Image.getSize(this.state.img_B, (width, height) => {
		
			if (this.windowWidth != null) {
				this.setState({
					botm_B_width: this.windowWidth,
					botm_B_height: this.windowWidth * height / width
				});
			} else {
				this.setState({ botm_B_width: width, botm_B_height: height });
			}
		});
	}

	handleBackPress = () => {

		if (this.props.navigation.isFocused()) {
			navigation.commonBack();
		}

		return true;
	};
	gotoBotm_A() {
		navigation.navigate('HomeMonthlyReviewPage', {
			month: navigation.state.params.info,
			sort: 'A',
			title: '이달의 책 북리뷰'
		});
	}
	gotoBotm_B() {
		navigation.navigate('HomeMonthlyReviewPage', {
			month: navigation.state.params.info,
			sort: 'B',
			title: '이달의 책 북리뷰'
		});
	}


	render() {

		return (
			<View>
				<ScrollView >
					<View>
						<TouchableOpacity activeOpacity={0.9} onPress={this.gotoBotm_A}>
							<Image source={{ uri: this.state.img_A }}
								resizeMode="cover"
								style={{
									width: this.state.botm_A_width,
									height: this.state.botm_A_height
								}} ></Image>
						</TouchableOpacity>
					</View>
					<View>
						<TouchableOpacity activeOpacity={0.9} onPress={this.gotoBotm_B}>
							<Image source={{ uri: this.state.img_B }}
								resizeMode="cover" style={{
									width: this.state.botm_B_width,
									height: this.state.botm_B_height
								}} ></Image>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		);
	}
}