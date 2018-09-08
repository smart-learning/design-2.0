import React from "react";
import { toJS, observable } from 'mobx';
import { observer } from 'mobx-react';
import CommonStyles from "../../../styles/common";
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import net from "../../commons/net";
import { SafeAreaView } from "react-navigation";
import createStore from "../../commons/createStore";
import HomeVideoPage from "./HomeVideoPage";
import ViewPager from 'react-native-view-pager';
import HomeAudioPage from "./HomeAudioPage";
import PageCategoryItemVO from "../../vo/PageCategoryItemVO";
import SummaryVO from "../../vo/SummaryVO";
import _ from 'underscore';
import AdvertisingSection from "../../components/AdvertisingSection";

const styles = StyleSheet.create({
	tabContainer: {
		position: 'absolute',
		alignSelf: 'flex-start',
		top: 0,
		left: 0,
		width: '100%',
		height: 40,
		backgroundColor: '#ffffff'
	},
	tabFlex: {
		flexDirection: 'row',
	},
	tabItemContainer: {
		width: '50%',
	},
	tabItem: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		height: 40,
	},
	tabText: {
		fontSize: 14,
		color: '#a4a4a4',
	},
	tabTextActive: {
		fontSize: 14,
		color: '#000000',
	},
	tabHr: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		width: '100%',
		height: 3,
		backgroundColor: '#ffffff',
	},
	tabHrActive: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		width: '100%',
		height: 3,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	tabContentContainer: {
		paddingTop: 40,
	},
});

@observer
class HomePage extends React.Component {

	@observable tabStatus = 'video';

	store = createStore({
		slideHeight: null,
		windowWidth: null,
		clipRankContentSize: null,
		homeSeriesData: {},
		videoCategoryData: [],
		classHotData: {},
		classNewData: {},
		classRecommendData: {},
		clipRankData: [],
		homeBannerData: [],
		audioHotData: [],
		audioNewData: [],
		audioRecommendData: [],
		audioMonth: [],
		voucherStatus: null,
		classUseData: [],
		audioBuyData: [],
		audioUseData: [],
		test: {
			hot: [],
			new: [],
			recommend: [],
		},

		// audioPlayRecentData: [],
	});

	getData = async ( isRefresh = false ) => {
		// 시리즈는 제일 먼저 읽어온다
		this.store.homeSeriesData = await net.getHomeSeries();

		// 데이터 가져와서
		const videoCategoryData = await net.getLectureCategory( isRefresh );
		const homeContents = await net.getHomeContents( isRefresh );
		const homeAudioBookContents = await net.getHomeAudioBookContents( isRefresh );
		// VO로 정리해서 사용
		const categoryVOs = videoCategoryData.map( element => {
			const vo = new PageCategoryItemVO();
			_.each( element, ( value, key ) => vo[ key ] = value );
			vo.key = element.id.toString();
			vo.label = element.title;
			return vo;
		} );
		const hotVOs = homeContents.hot.map( ( element, n ) => {
			const vo = new SummaryVO();
			_.each( element, ( value, key ) => vo[ key ] = value );
			vo.key = element.id.toString();
			vo.rankNumber = n + 1;
			if( !vo.thumbnail ) {
				vo.thumbnail = vo.images.wide;
			}
			return vo;
		} );
		const newVOs = homeContents.new.map( element => {
			const vo = new SummaryVO();
			_.each( element, ( value, key ) => vo[ key ] = value );
			vo.key = element.id.toString();
			if( !vo.thumbnail ) {
				vo.thumbnail = vo.images.wide;
			}
			return vo;
		} );
		const recommendVOs = homeContents.recommend.map( element => {
			const vo = new SummaryVO();
			_.each( element, ( value, key ) => vo[ key ] = value );
			vo.key = element.id.toString();
			if( !vo.thumbnail ) {
				vo.thumbnail = vo.images.wide;
			}
			return vo;
		} );

		// 오디오 카테고리 로드
		try {
			const audioCategoryData = await net.getAudioBookCategory( isRefresh );
			// VO로 정리해서 사용
			this.store.audioBookCategoryData = audioCategoryData.map( element => {
				const vo = new PageCategoryItemVO();
				_.each( element, ( value, key ) => vo[ key ] = value );
				vo.key = element.id.toString();
				vo.label = element.title;
				return vo;
			} );
		}
		catch( error ) { console.log( error ) }

		// mobx 바인딩
		this.store.videoCategoryData = categoryVOs;
		this.store.classHotData = hotVOs;
		this.store.classNewData = newVOs;
		this.store.classRecommendData = recommendVOs;
		try {
			this.store.clipRankData = await net.getHomeClipRank( isRefresh );
		}
		catch( error ) { console.log( error ) }
		try {
			this.store.homeBannerData = await net.getMainBanner( isRefresh );
		}
		catch( error ) { console.log( error ) }
		try {
			this.store.audioNewData = await net.getAudioBookList( isRefresh );
		}
		catch( error ) { console.log( error ) }
		try {
			this.store.audioMonth = await net.getHomeAudioBookMonth( isRefresh );
		}
		catch( error ) { console.log( error ) }
		this.store.audioHotData = homeAudioBookContents.hot;
		this.store.audioNewData = homeAudioBookContents.new;
		this.store.audioRecommendData = homeAudioBookContents.recommend;
		// this.store.audioPlayRecentData = await net.getPlayRecentAudioBook( isRefresh );

		try {
			this.store.voucherStatus = await net.getVoucherStatus( isRefresh );
		}
		catch( e ) {
			console.log( e );
		}
		try {
			this.store.classUseData = await net.getPlayRecentVideoCourses( isRefresh );
		}
		catch( error ) { console.log( error ) }
		try {
			this.store.audioBuyData = await net.getPurchasedAudioBooks( isRefresh );
		}
		catch( error ) { console.log( error ) }
		try {
			this.store.audioUseData = await net.getPlayRecentAudioBook( isRefresh );
		}
		catch( error ) { console.log( error ) }
	};

	componentDidMount() {
		let windowWidth = Dimensions.get('window').width;
		let windowHeight = Dimensions.get('window').height;

		this.store.windowWidth = windowWidth;
		this.store.windowHeight = windowHeight;
		this.store.slideHeight = windowWidth * 0.347;
		this.store.clipRankContentSize = windowWidth - 85;

		try {
			this.getData();
		}
		catch( error ) {
			console.log( error );
		}
	}

	goPage = pageName => {
		if( pageName === 'video' ) {
			this.tabStatus = 'video';
			this.refs.pager.setPage( 0 );
		}
		else if( pageName === 'audioBook' ) {
			this.tabStatus = 'audioBook';
			this.refs.pager.setPage( 1 );
		}
	};

	onPageSelected = (event) => {
		if( event.nativeEvent.position === 0 ) {
			this.tabStatus = 'video';
		}
		else if( event.nativeEvent.position === 1 ) {
			this.tabStatus = 'audioBook';
		}
	};

	render() {
		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ViewPager
					ref={ 'pager' }
					initialPage={0}
					style={{ flex:1, height: this.store.windowHeight - 40 }}
					onPageSelected={ this.onPageSelected }
					>
					<View style={styles.tabContentContainer}>
						<HomeVideoPage store={this.store} onRefresh={ () => this.getData( true ) }/>
					</View>
					<View style={styles.tabContentContainer}>
						<HomeAudioPage store={this.store} onRefresh={ () => this.getData( true ) }/>
					</View>
				</ViewPager>
				<View style={styles.tabContainer}>
					<View style={styles.tabFlex}>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={ ()=>this.goPage( 'video' ) }>
								<View style={styles.tabItem}>
									<Text style={this.tabStatus === 'video' ? styles.tabTextActive : styles.tabText}>
										클래스
									</Text>
									<View style={this.tabStatus === 'video' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.goPage( 'audioBook' )}>
								<View style={styles.tabItem}>
									<Text
										style={this.tabStatus === 'audioBook' ? styles.tabTextActive : styles.tabText}>
										오디오북
									</Text>
									<View style={this.tabStatus === 'audioBook' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>

			</SafeAreaView>
		</View>
	}
}

export default HomePage;