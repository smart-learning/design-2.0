import React from "react";
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { SafeAreaView } from "react-navigation";
import CommonStyles from "../../../styles/common";
import Lecture from "../../components/video/Lecture";
import net from "../../commons/net";
import PageCategory from "../../components/PageCategory";
import PageCategoryItemVO from "../../vo/PageCategoryItemVO";
import SummaryVO from "../../vo/SummaryVO";
import _ from "underscore";
import createStore from "../../commons/createStore";
import { observer } from 'mobx-react';

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

@observer class ClassListPage extends React.Component {

	store = createStore( {
		isLoading: true,
		displayData: null,
		categories: [],
		selectedCategory: null,
		ccode: null,
		pagination: {},
		has_next: false,
	} );

	loadClassList = async ( ccode = null, page = 1, sort = 'hot' ) => {
		this.store.isLoading = true;
		if( page === 1 ) {
			this.store.displayData = null;
		}
		const data = await net.getClassList( ccode, page, sort );
		let list = data;
		if( !_.isArray( list ) ) {
			list = [];
		}
		const VOs = data.items.map( element => {
			const vo = new SummaryVO();
			_.each( element, ( value, key ) => vo[ key ] = value );
			vo.key = element.id.toString();
			if ( !vo.thumbnail ) {
				vo.thumbnail = vo.images.wide;
			}
			return vo;
		} );

		if( page === 1 ) {
			this.store.displayData = VOs;
		}
		else {
			_.each( VOs, e => this.store.displayData.push( e ) );
		}
		this.store.ccode = ccode;
		// TODO: V1.1 대응 페이지네이션 처리 추가.
		this.store.pagination = data.pagination;
		this.store.isLoading = false;
	};

	loadMore = () => {
		if( this.store.pagination['has-next'] ) {
			this.loadClassList( this.store.ccode, this.store.pagination.page + 1);
		}
	};

	async componentDidMount() {
		await this.loadClassList();
		let categories = await net.getLectureCategory();
		if( !_.isArray( categories ) ) {
			categories = [];
		}
		this.store.categories = categories.map( element => {
			const vo = new PageCategoryItemVO();
			_.each( element, ( value, key ) => vo[ key ] = value );
			vo.key = element.id.toString();
			vo.label = element.title;
			return vo;
		} );

		// // action으로 정해둔 네임에 따라 초기 행동을 결정
		// const action = this.props.navigation.getParam('action');
		// const actionData = this.props.navigation.getParam('data');
		//
		// // console.log( 'navigate params:', action, actionData );
		//
		// switch( action ){
		// 	case 'category': // from HomeVideoPage
		// 		this.onCategorySelect( actionData );
		// 		break;
		//
		// 	// case 'item': // from ClassListPage
		// 	// 	// TODO: 들어온 actionData로 뭔가 해주셔야할듯...
		// 	// 	break;
		// }
		this.loadClassList();
	}

	onCategorySelect = item => {
		this.store.selectedCategory = item.id;
		this.loadClassList( item.ccode );
	};

	render() {
		return <SafeAreaView style={[ CommonStyles.container, { backgroundColor: '#ecf0f1' } ]}>
			<ScrollView style={{ width: '100%' }}>
				{
				<View style={styles.toggleGroup}>
					<View style={styles.alignJustify}>
						<View style={styles.sortWrap}>
							<View style={styles.alignJustify}>
								<TouchableOpacity activeOpacity={0.9}
												  onPress={() => {
													this.loadClassList(null,1,'hot');
												  }}
												  style={[styles.alignJustify, styles.sortButton]}>
									<View style={styles.sortDot} borderRadius={3}/>
									<Text style={styles.sortText}>인기</Text>
								</TouchableOpacity>
								<View style={styles.sortBar}/>
								<TouchableOpacity activeOpacity={0.9}
												  onPress={() => {
													this.loadClassList(null,1,'new');
												  }}
												  style={[styles.alignJustify, styles.sortButton]}>
									<View style={styles.sortDot} borderRadius={3}/>
									<Text style={styles.sortText}>신규</Text>
								</TouchableOpacity>
							</View>
						</View>
						{/* <TouchableOpacity activeOpacity={0.9}
										  style={{marginLeft: 'auto'}}
										  onPress={() => {
											  this.props.navigation.navigate('ClipPage')
										  }}
						>
							<View style={styles.clipButton} borderRadius={3}>
								<Text style={styles.clipButtonText}>강의클립 전체보기</Text>
							</View>
						</TouchableOpacity> */}
					</View>
				</View>
				}

				<PageCategory data={this.store.categories}
							  selectedCategory={this.store.selectedCategory}
							  onCategorySelect={this.onCategorySelect}
				/>

				{
					this.store.displayData !== null ? (
						<FlatList
							style={{width: '100%'}}
							data={this.store.displayData}
							renderItem={
								({item}) => <Lecture id={item.id}
													 navigation={this.props.navigation}
													 item={item}/>
							}
						/>
					) : undefined
				}

				<View style={CommonStyles.contentContainer}>
					{
						this.store.isLoading ? (
							<View style={{marginTop: 12}}>
								<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
							</View>
						) : undefined
					}
					{
						(!this.store.isLoading && this.store.pagination['has-next']) ? (
							<TouchableOpacity activeOpacity={0.9} onPress={this.loadMore}>
								<View style={[styles.linkViewAll, styles.classLinkViewAll]} borderRadius={5}>
									<Text style={styles.linkViewAllText}>더보기</Text>
								</View>
							</TouchableOpacity>
						) : undefined
					}
				</View>
			</ScrollView>
		</SafeAreaView>
	}
}

export default ClassListPage;