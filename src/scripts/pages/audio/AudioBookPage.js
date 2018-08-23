import React from "react";
import CommonStyles from "../../../styles/common";
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	FlatList,
} from "react-native";
import {SafeAreaView} from "react-navigation";
import PageCategory from "../../components/PageCategory";
import net from "../../commons/net";
import Book from "../../components/audio/Book";

const styles = StyleSheet.create({
	toggleGroup: {
		width: '100%',
		height: 50,
		padding: 12,
		backgroundColor: '#FFFFFF',
	},
	alignJustify: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	sortWrap: {
		width: 100,
	},
	sortButton: {
		paddingLeft: 8,
		paddingRight: 8,
	},
	sortDot: {
		width: 6,
		height: 6,
		marginRight: 5,
		backgroundColor: '#d7d7d7',
	},
	sortText: {
		fontSize: 12,
		color: '#4A4A4A',
	},
	sortBar: {
		width: 1,
		height: 17,
		backgroundColor: '#CFCFCF',
	},
	myButton: {
		paddingTop: 3,
		paddingBottom: 3,
		paddingLeft: 10,
		paddingRight: 10,
		borderWidth: 1,
		borderColor: '#CBCBCB',
	},
	myButtonText: {
		fontSize: 12,
		color: '#585858',
	}
});

export default class AudioBookPage extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			audioCategoryData: {},
			resultAudioBookData: null,
		};


	}

	async componentDidMount() {
		const resultAudioCategoryData = await net.getAudioBookCategory();
		const resultAudioBookData = await net.getAudioBookList();
		this.setState({
			audioCategoryData: resultAudioCategoryData,
			resultAudioBookData: resultAudioBookData,
		});
	}


	render() {
		return <SafeAreaView style={[CommonStyles.container, {backgroundColor: '#ecf0f1'}]}>
			<ScrollView style={{width: '100%'}}>
				<View style={styles.toggleGroup}>
					<View style={styles.alignJustify}>
						<View style={styles.sortWrap}>
							<View style={styles.alignJustify}>
								<TouchableOpacity activeOpacity={0.9}
												  style={[styles.alignJustify, styles.sortButton]}>
									<View style={styles.sortDot} borderRadius={3}/>
									<Text style={styles.sortText}>인기</Text>
								</TouchableOpacity>
								<View style={styles.sortBar}/>
								<TouchableOpacity activeOpacity={0.9}
												  style={[styles.alignJustify, styles.sortButton]}>
									<View style={styles.sortDot} borderRadius={3}/>
									<Text style={styles.sortText}>신규</Text>
								</TouchableOpacity>
							</View>
						</View>
						<TouchableOpacity activeOpacity={0.9}
										  style={{marginLeft: 'auto'}}
										  onPress={() => {
											  this.props.navigation.navigate('MyAudioBookPage')
										  }}
						>
							<View style={styles.myButton} borderRadius={3}>
								<Text style={styles.myButtonText}>내 오디오북 보기</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				<PageCategory data={this.state.audioCategoryData.items}/>

				{this.state.resultAudioBookData !== null &&
				<FlatList
					style={{width: '100%'}}
					data={this.state.resultAudioBookData.items}
					renderItem={
						({item}) => <Book id={item.id}
										  type="best"
										  navigation={this.props.navigation}
										  itemData={item}/>
					}
				/>
				}
			</ScrollView>
		</SafeAreaView>
	}
}