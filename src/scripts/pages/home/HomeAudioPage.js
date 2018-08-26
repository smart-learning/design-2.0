import React from "react";
import CommonStyles from "../../../styles/common";
import {Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {observer} from "mobx-react";
import Swiper from "react-native-swiper";
import Dummy1 from '../../../images/dummy-swiper-1.png';
import Dummy2 from '../../../images/dummy-swiper-2.png';

const styles = StyleSheet.create( {
	wrapper: {},
	slide: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	thumbnail: {
		width: '100%',
		paddingTop: '21%',
		paddingBottom: '21%',
	},
	mainTitleCenter: {
		textAlign: 'center',
	},
	titleH2: {
		fontSize: 26,
		fontWeight: 'bold',
		color: '#333333',
	},
	titleH4: {
		paddingTop: 10,
		fontSize: 13,
		color: '#888888',
	},
	titleH3: {
		fontSize: 13,
		fontWeight: 'bold',
		color: '#333333',
	},
	titleParagraph: {
		paddingLeft: 15,
		fontSize: 11,
		color: '#b7b7b7',
	},
	titleLink: {
		fontSize: 13,
		color: CommonStyles.COLOR_PRIMARY,
	},
	titleHr: {
		height: 1,
		marginTop: 7,
		backgroundColor: '#cecece',
	},
} );

@observer
class HomeAudioPage extends React.Component {

	render() {
		return <ScrollView style={{flex: 1}}>
			{/* 이미지 스와이퍼 */}
			<View style={{ height: this.props.store.slideHeight }}>
				<Swiper style={styles.wrapper}
						showsButtons={false}
						height={window.width}
						paginationStyle={{ bottom: 10 }}>
					<View style={styles.slide}>
						<ImageBackground source={Dummy1} resizeMode="cover" style={styles.thumbnail}/>
					</View>
					<View style={styles.slide}>
						<ImageBackground source={Dummy2} resizeMode="cover" style={styles.thumbnail}/>
					</View>
				</Swiper>
			</View>
			{/* /이미지 스와이퍼 */}

			<View style={[ CommonStyles.contentContainer, styles.monthContainer ]}>
				<View>
					<Text style={[ styles.mainTitleCenter, styles.titleH2 ]}>
						8월 이달의 책
					</Text>
					<Text style={[ styles.mainTitleCenter, styles.titleH4 ]}>
						이 정도는 읽어주자! 리딩멘토가 추천하는 『좋은 책』
					</Text>
				</View>
			</View>

			<View style={[ CommonStyles.contentContainer, styles.dailyContainer ]}>
				<View>
					<Text style={[ styles.mainTitleCenter, styles.titleH2 ]}>
						매일 책 한 권
					</Text>
					<Text style={[ styles.mainTitleCenter, styles.titleH4 ]}>
						책 좀 아는 사람들이 요약해 주는 읽은 척 매뉴얼
					</Text>
				</View>
			</View>

			<View style={[ CommonStyles.contentContainer, styles.audioBookContainer ]}>
				<View>
					<Text style={[ styles.mainTitleCenter, styles.titleH2 ]}>
						매일 책 한 권
					</Text>
					<Text style={[ styles.mainTitleCenter, styles.titleH4 ]}>
						책 좀 아는 사람들이 요약해 주는 읽은 척 매뉴얼
					</Text>
				</View>
			</View>
		</ScrollView>

	}
}

export default HomeAudioPage;