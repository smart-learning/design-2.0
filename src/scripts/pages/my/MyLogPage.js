import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CommonStyles from "../../../styles/common";
import globalStore from '../../../scripts/commons/store';
import { SafeAreaView } from "react-navigation";
import { observable } from 'mobx';
import { observer } from "mobx-react";

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
	dayLabel: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 15,
		marginBottom: 20,
		height: 24,
		paddingLeft: 20,
		paddingRight: 20,
		borderWidth: 1,
		borderColor: '#dbdbdb',
	},
	dayLabelText: {
		fontSize: 13,
		color: '#4a4a4a'
	},
	logItem: {
		flexDirection: 'row',
		marginBottom: 10,
	},
	logBullet: {
		position: 'relative',
		top: 7,
		width: 3,
		height: 3,
		marginRight: 7,
		backgroundColor: '#4a4a4a',
	},
	logTextContainer: {
		flexDirection: 'row',
	},
	logTextPoint: {
		position: 'relative',
		top: 1,
		marginRight: 5,
		fontSize: 15,
		color: CommonStyles.COLOR_PRIMARY,
	},
	logText: {
		marginRight: 5,
		fontSize: 15,
		color: '#4a4a4a',
	},
	logHr: {
		width: '100%',
		height: 1,
		backgroundColor: '#dbdbdb',
	}
});

@observer
export default class MyLogPage extends React.Component {

	@observable tabStatus = 'me';

	render() {
		return <View style={[ CommonStyles.container, { backgroundColor: '#ffffff' } ]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					<View style={styles.tabContentContainer}>
						{this.tabStatus === 'me' &&
						<View style={[CommonStyles.contentContainer, styles.tabContent]}>
							<View style={styles.logSection}>
								<View>
									<View style={styles.dayLabel} borderRadius={12}>
										<Text style={styles.dayLabelText}>날짜라벨</Text>
									</View>
								</View>
								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>타이틀</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>강좌를 스크랩 했습니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>타이틀</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>강의를 스크랩 했습니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>타이틀</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>오디오북을 스크랩 했습니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>타이틀</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>오디오북을 구매하셨습니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>타이틀</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>오디오북을 좋아합니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이 태그이름(을)를</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>관심태그</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>에 추가했습니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이 멤버십 회원이 되셨습니다!</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이 윌라의 회원이 되셨습니다!</Text>
										</View>
									</View>
								</View>

								<View style={styles.logHr}/>

							</View>
						</View>
						}

						{this.tabStatus === 'friend' &&
						<View style={styles.tabContent}>
							<View style={styles.logSection}>
								<View>
									<View style={styles.dayLabel} borderRadius={12}>
										<Text style={styles.dayLabelText}>날짜라벨</Text>
									</View>
								</View>
								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>타이틀</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>강좌를 스크랩 했습니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>타이틀</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>강의를 스크랩 했습니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>타이틀</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>오디오북을 스크랩 했습니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>타이틀</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>오디오북을 구매하셨습니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>타이틀</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>오디오북을 좋아합니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이 태그이름(을)를</Text>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>관심태그</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>에 추가했습니다.</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이 멤버십 회원이 되셨습니다!</Text>
										</View>
									</View>
								</View>

								<View style={styles.logItem}>
									<View style={styles.logBullet}/>
									<View>
										<View style={styles.logTextContainer}>
											<TouchableOpacity activeOpacity={0.9}>
												<Text style={styles.logTextPoint}>{ globalStore.profile ? globalStore.profile.name || '사용자' : '' }</Text>
											</TouchableOpacity>
											<Text style={styles.logText}>님이 윌라의 회원이 되셨습니다!</Text>
										</View>
									</View>
								</View>

								<View style={styles.logHr}/>

							</View>
						</View>
						}
					</View>
				</ScrollView>
				<View style={styles.tabContainer}>
					<View style={styles.tabFlex}>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.tabStatus = 'me'}>
								<View style={styles.tabItem}>
									<Text style={this.tabStatus === 'me' ? styles.tabTextActive : styles.tabText}>
										나의활동
									</Text>
									<View style={this.tabStatus === 'me' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
						<View style={styles.tabItemContainer}>
							<TouchableOpacity activeOpacity={0.9} onPress={() => this.tabStatus = 'friend'}>
								<View style={styles.tabItem}>
									<Text style={this.tabStatus === 'friend' ? styles.tabTextActive : styles.tabText}>
										친구의활동
									</Text>
									<View style={this.tabStatus === 'friend' ? styles.tabHrActive : styles.tabHr}/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</SafeAreaView>
		</View>
	}
}