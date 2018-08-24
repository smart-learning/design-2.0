import React from "react";
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import CommonStyles from "../../../styles/common";
import Swiper from 'react-native-swiper';
import {
	Button,
	Dimensions,
	Image,
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text, TextInput,
	TouchableOpacity,
	View
} from "react-native";
import Dummy1 from '../../../images/dummy-swiper-1.png';
import Dummy2 from '../../../images/dummy-swiper-2.png';
import IcAngleRightGrey from '../../../images/ic-angle-right-grey.png';
import Series from "../../components/home/Series";
import net from "../../commons/net";
import PageCategory from "../../components/PageCategory";
import ClassList from "../../components/home/ClassList";
import ClipRank from "../../components/home/ClipRank";
import ClassContinueList from "../../components/home/ClassContinueList";
import IcSearch from "../../../images/ic-my-friend-search.png";
import IcFb from "../../../images/ic-my-friend-fb.png";
import IcBook from "../../../images/ic-my-friend-book.png";
import DummyProfile from "../../../images/dummy-my-profile.png";
import {SafeAreaView} from "react-navigation";
import createStore from "../../commons/createStore";
import HomeVideoPage from "./HomeVideoPage";

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
		backgroundColor: '#26c281',
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
	});

	getData = async () => {
		if( this.tabStatus === 'video' ) {
			this.store.homeSeriesData = await net.getHomeSeries();
			this.store.videoCategoryData = await net.getLectureCategory();
			this.store.classHotData = await net.getHomeClassHot();
			this.store.classNewData = await net.getHomeClassNew();
			this.store.classRecommendData = await net.getHomeClassRecommend();
			this.store.clipRankData = await net.getHomeClipRank();
		}else{
			this.store.homeSeriesData = {};
			this.store.videoCategoryData = [];
			this.store.classHotData = {};
			this.store.classNewData = {};
			this.store.classRecommendData = {};
			this.store.clipRankData = [];
		}
	};

	componentDidMount() {
		let windowWidth = Dimensions.get('window').width;

		this.store.windowWidth = windowWidth;
		this.store.slideHeight = windowWidth * 0.42;
		this.store.clipRankContentSize = windowWidth - 85;

		try {
			this.getData();
		}
		catch( e ) {
			console.log( e );
		}
	}

	changeTab( tabName ){
		this.tabStatus = tabName;
		this.getData();
	}

	render() {
		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					{this.tabStatus === 'video' &&
					<View style={styles.tabContentContainer}>
						<HomeVideoPage store={this.store}/>
					</View>
					}

					{this.tabStatus === 'audioBook' &&
					<View style={styles.tabContentContainer}>
						<Text>audio</Text>
					</View>
					}
				</ScrollView>
				<View style={styles.tabContainer}>
					<View style={styles.tabFlex}>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={ ()=>this.changeTab('video') }>
								<View style={styles.tabItem}>
									<Text style={this.tabStatus === 'video' ? styles.tabTextActive : styles.tabText}>
										비디오
									</Text>
									<View style={this.tabStatus === 'video' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.changeTab('audioBook')}>
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