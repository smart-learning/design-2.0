import React from "react";
import {AsyncStorage, Button, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, TextInput} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';
import {SafeAreaView} from "react-navigation";
import {observer} from "mobx-react";
import {observable} from "mobx";
import IcBook from "../../../images/ic-my-friend-book.png";
import IcFb from "../../../images/ic-my-friend-fb.png";
import IcSearch from "../../../images/ic-my-friend-search.png";
import DummyProfile from "../../../images/dummy-my-profile.png";

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
	searchButton: {
		alignItems: 'center',
		flexDirection: 'row',
		height: 40,
		marginTop: 20,
		marginBottom: 20,
		paddingLeft: 20,
		paddingRight: 20,
		borderWidth: 1,
		borderColor: '#BEBEBE',
	},
	searchButtonIcon: {
		width: 20,
		height: 20,
		marginRight: 5,
	},
	searchButtonFbText: {
		fontSize: 13,
		color: '#3B5998',
	},
	searchButtonMyText: {
		fontSize: 13,
		color: '#23AC71',
	},
	searchContainer: {
		position: 'relative',
		marginTop: 20,
	},
	IcSearch: {
		position: 'absolute',
		top: 12,
		left: 15,
		width: 13,
		height: 15,
	},
	searchInput: {
		height: 40,
		paddingLeft: 35,
		backgroundColor: '#eaebed',
	},
	friendItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	friendThumbnail: {
		width: 40,
		height: 40,
		marginRight: 10,
	},
	friendName: {
		fontSize: 15,
	},
	followButton: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 30,
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
	followButtonText: {
		fontSize: 13,
		color: '#ffffff',
	},
});

@observer
export default class FriendPage extends React.Component {

	@observable tabStatus = 'my';
	@observable name = '';

	render() {
		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<View style={styles.tabContentContainer}>
						{this.tabStatus === 'my' &&
						<View style={[CommonStyles.contentContainer, styles.tabContent]}>
							<View>
								<View style={styles.searchContainer}>
									<TextInput
										style={styles.searchInput}
										onChangeText={(text) => this.name = {text} }
										value={this.name}
										underlineColorAndroid={'rgba(0,0,0,0)'}
									/>
									<Image source={IcSearch} style={styles.IcSearch}/>
								</View>
								<View style={[CommonStyles.alignJustifyContentBetween]}>
									<View>
										<TouchableOpacity activeOpacity={0.9}>
											<View style={styles.searchButton} borderRadius={5}>
												<Image source={IcFb} style={styles.searchButtonIcon}/>
												<Text style={styles.searchButtonFbText}>페이스북 친구찾기</Text>
											</View>
										</TouchableOpacity>
									</View>
									<View>
										<TouchableOpacity activeOpacity={0.9}>
											<View style={styles.searchButton} borderRadius={5}>
												<Image source={IcBook} style={styles.searchButtonIcon}/>
												<Text style={styles.searchButtonMyText}>내 주소록 친구찾기</Text>
											</View>
										</TouchableOpacity>
									</View>
								</View>
							</View>
							<View>
								<View style={styles.friendItem}>
									<Image source={DummyProfile} style={styles.friendThumbnail}/>
									<Text style={styles.friendName}>Name</Text>
									<View style={{marginLeft: 'auto'}}>
										<TouchableOpacity activeOpacity={0.9}>
											<View style={styles.followButton}>
												<Text style={styles.followButtonText}>팔로우</Text>
											</View>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</View>
						}

						{this.tabStatus === 'follower' &&
						<View style={[CommonStyles.contentContainer, styles.tabContent]}>
							<View>
								<View style={styles.searchContainer}>
									<TextInput
										style={styles.searchInput}
										onChangeText={(text) => this.name = {text} }
										value={this.name}
										underlineColorAndroid={'rgba(0,0,0,0)'}
									/>
									<Image source={IcSearch} style={styles.IcSearch}/>
								</View>
								<View style={[CommonStyles.alignJustifyContentBetween]}>
									<View>
										<TouchableOpacity activeOpacity={0.9}>
											<View style={styles.searchButton} borderRadius={5}>
												<Image source={IcFb} style={styles.searchButtonIcon}/>
												<Text style={styles.searchButtonFbText}>페이스북 친구찾기</Text>
											</View>
										</TouchableOpacity>
									</View>
									<View>
										<TouchableOpacity activeOpacity={0.9}>
											<View style={styles.searchButton} borderRadius={5}>
												<Image source={IcBook} style={styles.searchButtonIcon}/>
												<Text style={styles.searchButtonMyText}>내 주소록 친구찾기</Text>
											</View>
										</TouchableOpacity>
									</View>
								</View>
							</View>
							<View>
								<View style={styles.friendItem}>
									<Image source={DummyProfile} style={styles.friendThumbnail}/>
									<Text style={styles.friendName}>Name</Text>
									<View style={{marginLeft: 'auto'}}>
										<TouchableOpacity activeOpacity={0.9}>
											<View style={styles.followButton}>
												<Text style={styles.followButtonText}>팔로우</Text>
											</View>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</View>
						}
					</View>
				</ScrollView>
				<View style={styles.tabContainer}>
					<View style={styles.tabFlex}>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.tabStatus = 'my'}>
								<View style={styles.tabItem}>
									<Text style={this.tabStatus === 'my' ? styles.tabTextActive : styles.tabText}>
										내친구 0
									</Text>
									<View style={this.tabStatus === 'my' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.tabStatus = 'follower'}>
								<View style={styles.tabItem}>
									<Text style={this.tabStatus === 'follower' ? styles.tabTextActive : styles.tabText}>
										나를 관심있어한 친구 0
									</Text>
									<View style={this.tabStatus === 'follower' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</SafeAreaView>
		</View>
	}
}