import React from "react";
import {Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image,} from "react-native";
import CommonStyles from "../../../styles/common";
import Dummy from "../../../images/dummy-detail-banner.png";
import IcPlay from "../../../images/ic-play-detail.png";
import AuthorDummy from "../../../images/dummy-audiobook-author.png";
import {observer} from "mobx-react";
import Native from "../../commons/native";

const styles = StyleSheet.create({
	banner: {
		position: 'relative',
		height: 350,
		paddingTop: 15,
		paddingLeft: 15,
		paddingRight: 15,
	},
	labelContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	label: {
		marginRight: 7,
		paddingTop: 2,
		paddingRight: 7,
		paddingBottom: 2,
		paddingLeft: 7,
	},
	labelText: {
		fontSize: 12,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	labelAudioBook: {
		backgroundColor: '#ffb71b',
	},
	labelClass: {
		backgroundColor: '#ff761b',
	},
	labelTitle: {
		fontSize: 12,
		color: '#ff761b',
	},
	headline: {
		width: '65%',
		fontSize: 15,
		color: CommonStyles.COLOR_PRIMARY,
	},
	title: {
		width: '65%',
		fontSize: 22,
		fontWeight: 'bold',
		color: '#ffffff',
	},
	author: {
		width: '65%',
		fontSize: 13,
		color: '#ffffff',
	},
	audioBookPlayButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: '30%',
		right: 15,
		width: 140,
		height: 140,
	},
	audioBookAuthorThumbnail: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
	},
	classPlayButtonContainer: {
		position: 'absolute',
		top: '50%',
		right: 15,
		width: 50,
		height: 50,
	},
	playButton: {
		width: 50,
		height: 50,
	},
	tagContainer: {
		flexDirection: 'row',
	},
	tag: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 22,
		marginRight: 10,
		marginBottom: 10,
		paddingRight: 10,
		paddingLeft: 10,
		borderWidth: 1,
		borderColor: '#7a7a7a',
	},
	tagText: {
		fontSize: 12,
		color: '#888888',
	},
	itemDownload: {
		alignItems: 'center',
		position: 'absolute',
		bottom: 30,
		left: 15,
		height: 40,
		width: '100%',
	},
	itemDownloadSize: {
		fontSize: 12,
		color: '#555555',
	},
	itemDownloadCount: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 22,
		paddingRight: 15,
		paddingLeft: 15,
		borderWidth: 1,
		borderColor: CommonStyles.COLOR_PRIMARY,
	},
	itemDownloadCountText: {
		fontSize: 12,
		color: CommonStyles.COLOR_PRIMARY,
	},
});

@observer
export default class TopBanner extends React.Component {
	constructor(props) {
		super(props);

		this.learnType = this.learnType.bind(this);
	}

	learnType() {
		if (this.props.learnType === 'audioBook') {
			return '오디오북';
		} else if (this.props.learnType === 'class') {
			return '클래스';
		} else {
			return '';
		}
	}

	render() {
		return <ImageBackground style={styles.banner} resizeMode="cover" source={Dummy}>
			<View style={styles.labelContainer}>
				<View
					style={this.props.learnType === 'audioBook' ? [styles.label, styles.labelAudioBook] : [styles.label, styles.labelClass]}
					borderRadius={10}>
					<Text style={styles.labelText}>인기{this.learnType()}</Text>
				</View>
				<Text style={styles.labelTitle}>종합순위 30위! 비즈니스스킬 5위!</Text>
			</View>
			<Text style={styles.headline}>
				{this.props.store.itemData.headline}
			</Text>
			<Text style={styles.title}>
				{this.props.store.itemData.title}
			</Text>
			<Text style={styles.author}>
				{this.props.store.itemData.teacher.name}
			</Text>
			<View style={styles.tagContainer}>
				{this.props.store.itemData.is_new === 'true' &&
				<View style={styles.tag} borderRadius={11}><Text style={styles.tagText}>NEW</Text></View>
				}
				{this.props.store.itemData.is_exculsive === 'true' &&
				<View style={styles.tag} borderRadius={11}><Text style={styles.tagText}>독점</Text></View>
				}
				{this.props.store.itemData.is_featured === 'true' &&
				<View style={styles.tag} borderRadius={11}><Text style={styles.tagText}>추천</Text></View>
				}
			</View>
			<View style={[CommonStyles.alignJustifyContentBetween, styles.itemDownload]}>
				<Text style={styles.itemDownloadSize}>
					전체 다운로드 500mb
				</Text>
				<View style={styles.itemDownloadCount} borderRadius={5}>
					<Text style={styles.itemDownloadCountText}>
						3/{this.props.store.itemData.clip_count} 다운로드 완료
					</Text>
				</View>
			</View>
			{this.props.learnType === 'audioBook' &&
			<View style={styles.audioBookPlayButtonContainer}>
				<ImageBackground source={AuthorDummy} resizeMode={"cover"} borderRadius={70} style={styles.audioBookAuthorThumbnail}>
					<TouchableOpacity activeOpacity={0.9} onPress={() => Native.play(this.props.store.itemData.id)}>
						<Image source={IcPlay} style={styles.playButton}/>
					</TouchableOpacity>
				</ImageBackground>
			</View>
			}
			{this.props.learnType === 'class' &&
			<View style={styles.classPlayButtonContainer}>
				<TouchableOpacity activeOpacity={0.9} onPress={() => Native.play(this.props.store.itemData.id)}>
					<Image source={IcPlay} style={styles.playButton}/>
				</TouchableOpacity>
			</View>
			}
		</ImageBackground>
	}
}