import React from "react";
import CommonStyles from "../../../styles/common";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { SafeAreaView } from "react-navigation";
import PageCategory from "../../components/PageCategory";
import net from "../../commons/net";
import Book from "../../components/audio/Book";
import _ from 'underscore';
import { observer } from "mobx-react";
import PageCategoryItemVO from "../../vo/PageCategoryItemVO";
import BookVO from "../../vo/BookVO";
import createStore from "../../commons/createStore";


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
	},
	linkViewAll: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: 36,
		marginLeft: 'auto',
		marginRight: 'auto',
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	classLinkViewAll: {
		marginTop: 15,
		marginBottom: 30,
	},
	linkViewAllText: {
		fontSize: 14,
		color: '#ffffff',
	},
	linkViewAllIcon: {
		paddingLeft: 7,
		height: 13,
	},
});

@observer class AudioBookPage extends React.Component {
	store = createStore({
		categories: [],
		displayList: [],
		selectedCategory: null,
	});

	loadAudioList = async ( ccode = null ) => {
		const data = await net.getAudioBookList( ccode );
		this.store.displayList = data.items.map( element => {
			const vo = new BookVO();
			_.each( element, ( value, key ) => vo[ key ] = value );
			vo.key = element.id.toString();
			if( !vo.thumbnail ) {
				vo.thumbnail = vo.images.book;
			}
			if( !vo.banner_color ) {
				vo.banner_color = 'transparent';
			}
			return vo;
		} );
	};

	async componentDidMount() {
		const loadedCategories = await net.getAudioBookCategory();
		this.store.categories = loadedCategories.map( element => {
			const vo = new PageCategoryItemVO();
			_.each( element, ( value, key ) => vo[ key ] = value );
			vo.key = element.id.toString();
			vo.label = element.title;
			return vo;
		} );
		this.loadAudioList();
	}

	onCategorySelect = item => {
		this.selectedCategory = item.id;
		this.loadAudioList( item.ccode );
	};

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

				<PageCategory selectedCategory={ this.store.selectedCategory }
							  data={this.store.categories} onCategorySelect={ this.onCategorySelect }/>

				{this.store.displayList !== null &&
				<FlatList
					style={{width: '100%'}}
					data={this.store.displayList}
					renderItem={
						({item}) => <Book id={item.id}
										  type="best"
										  navigation={this.props.navigation}
										  itemData={item}/>
					}
				/>
				}

				<View style={CommonStyles.contentContainer}>
					<TouchableOpacity activeOpacity={0.9}>
						<View style={[ styles.linkViewAll, styles.classLinkViewAll ]} borderRadius={5}>
							<Text style={styles.linkViewAllText}>더보기</Text>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	}
}

export default AudioBookPage;