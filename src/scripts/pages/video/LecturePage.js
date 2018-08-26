import React from "react";
import {
	Text,
	View,
	Button,
	FlatList,
	ScrollView,
	TouchableOpacity, StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import CommonStyles from "../../../styles/common";
import Lecture from "../../components/video/Lecture";
import net from "../../commons/net";
import PageCategory from "../../components/PageCategory";
import PageCategoryItemVO from "../../vo/PageCategoryItemVO";
import SummaryVO from "../../vo/SummaryVO";
import _ from "underscore";

const styles = StyleSheet.create( {
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
	clipButton: {
		paddingTop: 3,
		paddingBottom: 3,
		paddingLeft: 10,
		paddingRight: 10,
		borderWidth: 1,
		borderColor: '#CBCBCB',
	},
	clipButtonText: {
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
} );

export default class CourseList extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			displayData: [],
			videoCategoryData: [],
			selectedCategory: null,
		};
	}

	async componentDidMount() {
		const initialData = await net.getLectureList();
		const allData = await net.getLectureListByCategories();
		const categories = await net.getLectureCategory();
		const categoryVOs = categories.map( element => {
			const vo = new PageCategoryItemVO();
			vo.id = element.id;
			vo.key = element.id.toString();
			vo.label = element.title;
			return vo;
		} );
		const initialVOs = initialData.items.map( element => {
			const vo = new SummaryVO();
			_.each( element, ( value, key ) => vo[ key ] = value );
			vo.key = element.id.toString();
			if( !vo.thumbnail ) {
				vo.thumbnail = vo.images.wide;
			}
			return vo;
		} );
		const allVOs = [];
		allData.forEach( element => {
			if( element.type === 'contents' ) {
				allVOs[ element.category.id ] = element.items.map( ( item, n ) => {
					const vo = new SummaryVO();
					_.each( item, ( value, key ) => vo[ key ] = value );
					vo.key = item.id.toString() + n + Math.random();
					if( !vo.thumbnail ) {
						vo.thumbnail = vo.images.wide;
					}
					return vo;
				} );
			}
		} );
		console.log( 'initialVOs', initialVOs );
		console.log( 'allVOs', allVOs );

		this.setState( {
			displayData: initialVOs,
			initialVOs,
			allVOs,
			categoryVOs,
		} );
	}

	onCategorySelect = item => {
		let selectedList = this.state.allVOs[ item.id ];
		if( !selectedList ) {
			selectedList = [];
		}
		console.log( 'selectedList', selectedList );
		this.setState({
			displayData: selectedList,
			selectedCategory: item.id,
		});
	};

	render() {
		return <SafeAreaView style={[ CommonStyles.container, { backgroundColor: '#ecf0f1' } ]}>
			<ScrollView style={{ width: '100%' }}>
				<View style={styles.toggleGroup}>
					<View style={styles.alignJustify}>
						<View style={styles.sortWrap}>
							<View style={styles.alignJustify}>
								<TouchableOpacity activeOpacity={0.9}
												  style={[ styles.alignJustify, styles.sortButton ]}>
									<View style={styles.sortDot} borderRadius={3}/>
									<Text style={styles.sortText}>인기</Text>
								</TouchableOpacity>
								<View style={styles.sortBar}/>
								<TouchableOpacity activeOpacity={0.9}
												  style={[ styles.alignJustify, styles.sortButton ]}>
									<View style={styles.sortDot} borderRadius={3}/>
									<Text style={styles.sortText}>신규</Text>
								</TouchableOpacity>
							</View>
						</View>
						<TouchableOpacity activeOpacity={0.9}
										  style={{ marginLeft: 'auto' }}
										  onPress={() => {
											  this.props.navigation.navigate( 'ClipPage' )
										  }}
						>
							<View style={styles.clipButton} borderRadius={3}>
								<Text style={styles.clipButtonText}>강의클립 전체보기</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				<PageCategory data={ this.state.categoryVOs }
							  selectedCategory={ this.state.selectedCategory }
							  onCategorySelect={ this.onCategorySelect }
				/>

				<FlatList
					style={{ width: '100%' }}
					data={this.state.displayData}
					renderItem={
						( { item } ) => <Lecture id={item.id}
												 navigation={this.props.navigation}
												 item={ item }/>
					}
				/>

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

