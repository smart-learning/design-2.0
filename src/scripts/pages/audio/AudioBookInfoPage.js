import React from "react";
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	ImageBackground,

} from "react-native";
import {SafeAreaView, withNavigation} from "react-navigation";
import CommonStyles, {COLOR_PRIMARY} from "../../../styles/common";
import m from "moment";
import {observer} from "mobx-react";
import {observable} from "mobx";
import bookIcon from "../../../images/ic-book-white.png";
import playIcon from "../../../images/ic-play-white.png";
import Native from "../../commons/native";

const styles = StyleSheet.create({
	infoContainer: {
		position: 'relative',
		height: 300,
		padding: 25,
	},
	headline: {
		paddingBottom: 10,
	},
	headlineH3: {
		textAlign: 'right',
		fontSize: 12,
		color: 'rgba(74, 74, 74, 0.5)',
	},
	headlineSpan: {
		paddingLeft: 4,
		fontSize: 15,
		fontWeight: 'bold',
		color: '#4a4a4a',
	},
	headlineMonth: {
		textAlign: 'right',
		fontSize: 12,
		color: CommonStyles.COLOR_PRIMARY,
	},
	infoContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	contentHeadline: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-end',
		width: '100%',
		paddingRight: 111,
	},
	headlineH2: {
		width: 130,
		marginBottom: 18,
		fontSize: 16,
		color: '#4A4A4A',
		textAlign: 'right',
	},
	infoButtonWrap: {
		height: 25,
		marginBottom: 3,
	},
	infoButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 4,
		paddingBottom: 4,
		paddingRight: 8,
		paddingLeft: 8,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
		borderRadius: 7,
	},
	infoButtonText: {
		color: '#ffffff',
		fontSize: 15,
		textAlign: 'center',
	},
	infoBook: {
		position: 'absolute',
		bottom: 0,
		right: -10,
		width: 111,
		height: 178,
	},
	bookThumbnail: {
		width: '100%',
		paddingTop: '80%',
		paddingBottom: '80%',
	},
	teacherContainer: {
		width: '100%',
		padding: 25,
		backgroundColor: '#ffffff',
	},
	teacherThumbnail: {
		position: 'absolute',
		left: 0,
		width: 72,
		height: 72,
		borderRadius: 35,
	},
	teacherTitle: {
		fontSize: 14,
		fontWeight: '200',
		color: '#4a4a4a',
		marginBottom: 5,
	},
	teacherHeadline: {
		fontSize: 15,
		fontWeight: 'normal',
		color: '#333333',
	},
	teacherName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333333',
	},
	teacherMemo: {
		paddingTop: 25,
		paddingBottom: 25,
	},
	teacherMemoText: {
		color: '#000000',
		fontWeight: '200',
		fontSize: 14,
	},
	showMemoButtonText: {
		textAlign: 'right',
		fontSize: 14,
		color: '#a1a1a1',
	},
	memoContainer: {
		width: '100%',
		padding: 25,
		backgroundColor: '#EFEFEF',
	},
	memoTitle: {
		width: '100%',
		fontSize: 17,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#4a4a4a',
	},
	memoBody: {
		width: '100%',
		fontSize: 15,
		fontWeight: '400',
		marginBottom: 25,
		color: '#4a4a4a',
	},
	memoButton: {
		width: '100%',
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 8,
		backgroundColor: COLOR_PRIMARY,
		borderRadius: 7,
	},
	memoButtonText: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
	},
	buttonSmallIcon: {
		width: 12,
		height: 12,
		marginLeft: 4,
	},
	buttonLargeIcon: {
		width: 14,
		height: 14,
		marginRight: 4,
	}
});

@observer
class AudioBookInfoPage extends React.Component {
	@observable isMemoShow = false;
	@observable buttonTextStatus = true;

	showTeacherMemo = () => {
		if (this.isMemoShow === false) {
			this.isMemoShow = true;
			this.buttonTextStatus = false;
		}
		else if (this.isMemoShow === true) {
			this.isMemoShow = false;
			this.buttonTextStatus = true;
		}
	};

	render() {
		const itemData = this.props.navigation.state.params.itemData;
		const year = m(itemData.year).format("YYYY");
		const month = m(itemData.month).format("MM");
		return <SafeAreaView style={CommonStyles.container}>
			<ScrollView style={{width: '100%'}}>
				<ImageBackground source={{uri: itemData.images.header_bg}} resizeMode="cover" style={{width: '100%'}}>
					<View style={styles.infoContainer}>
						<View style={styles.headline}>
							<View>
								<Text style={styles.headlineH3}>리딩멘토와 함께 읽는
									<Text style={styles.headlineSpan}> 이달의 책</Text>
								</Text>
							</View>
							<Text style={styles.headlineMonth}>{year}.{month}</Text>
						</View>
						<View style={styles.infoContent}>
							<View style={styles.contentHeadline}>
								<View>
									<Text style={styles.headlineH2}>{itemData.headline}</Text>
								</View>
								<View style={styles.infoButtonWrap}>
									<TouchableOpacity activeOpacity={0.9}
													  onPress={() => Native.play(itemData.audiobook.cid)}>
										<View style={styles.infoButton}>
											<Text style={styles.infoButtonText}>추천사 듣기</Text>
											<Image source={playIcon} style={styles.buttonSmallIcon}/>
										</View>
									</TouchableOpacity>
								</View>
								<View style={styles.infoButtonWrap}>
									<TouchableOpacity activeOpacity={0.9}
													  onPress={() => this.props.navigation.navigate('AudioBookDetailPage', {
														  id: itemData.audiobook.id,
														  title: itemData.audiobook.title
													  })}>
										<View style={styles.infoButton}>
											<Text style={styles.infoButtonText}>이달의 책 상세보기</Text>
											<Image source={bookIcon} style={styles.buttonSmallIcon}/>
										</View>
									</TouchableOpacity>
								</View>
							</View>
							<View style={styles.infoBook}>
								<TouchableOpacity activeOpacity={0.9}
												  onPress={() => this.props.navigation.navigate('AudioBookDetailPage', {
													  id: itemData.audiobook.id,
													  title: itemData.audiobook.title
												  })}>
									<ImageBackground source={{uri: itemData.audiobook.images.cover}}
													 resizeMode={"cover"} style={styles.bookThumbnail}/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ImageBackground>
				<View style={styles.teacherContainer}>
					<View style={{position: "relative"}}>
						<Image source={{uri: itemData.mentor.images.default}} style={styles.teacherThumbnail}/>
						<View style={{width: '100%', paddingLeft: 100,}}>
							<Text style={styles.teacherTitle}>리딩멘토</Text>
							<Text style={styles.teacherHeadline}>{itemData.mentor.headline}</Text>
							<Text style={styles.teacherName}>{itemData.mentor.name}</Text>
						</View>
					</View>
					{this.isMemoShow === true &&
					<View style={styles.teacherMemo}>
						<Text style={styles.teacherMemoText}>
							{itemData.mentor.memo}
						</Text>
					</View>
					}
					<View style={{width: "100%"}}>
						<TouchableOpacity activeOpacity={0.9} onPress={this.showTeacherMemo}>
							{this.buttonTextStatus &&
							<Text style={styles.showMemoButtonText}>소개보기</Text>
							}
							{!this.buttonTextStatus &&
							<Text style={styles.showMemoButtonText}>닫기</Text>
							}
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.memoContainer}>
					<Text style={styles.memoTitle}>{itemData.title}</Text>
					<Text style={styles.memoBody}>{itemData.body}</Text>
					<View style={{width: '100%'}}>
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => this.props.navigation.navigate('AudioBookDetailPage', {
											  id: itemData.audiobook.id,
											  title: itemData.audiobook.title
										  })}>
							<View style={styles.memoButton}>
								<Image source={bookIcon} style={styles.buttonLargeIcon}/>
								<Text style={styles.memoButtonText}>이달의 책 상세보기</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	}
}

export default AudioBookInfoPage;