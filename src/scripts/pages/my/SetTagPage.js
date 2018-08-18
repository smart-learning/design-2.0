import React from "react";
import {AsyncStorage, Button, ScrollView, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import CommonStyles from "../../../styles/common";
import Store from '../../../scripts/commons/store';
import TagItem from "../../components/my/TagItem";

const styles = StyleSheet.create({
	tagParagraph: {
		marginBottom: 10,
		fontSize: 15,
		color: '#4a4a4a',
	},
	labelContainer: {
		flexDirection: 'row',
		marginBottom: 20,
		marginLeft: 'auto',
	},
	label: {
		marginLeft: 15,
		marginRight: 7,
		width: 30,
		height: 15,
		borderWidth: 2,
		borderColor: '#26c281',
	},
	labelActive: {
		backgroundColor: '#26c281',
	},
	labelNormal: {
		backgroundColor: '#ffffff',
	},
	labelText: {
		fontSize: 13,
		color: '#787878',
	},
	tagFlex: {
		flexDirection: 'row',
	},
	tagNormal: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 38,
		paddingLeft: 15,
		paddingRight: 15,
		borderWidth: 2,
		borderColor: '#dbdbdb',
	},
	tagNormalText: {
		fontSize: 15,
		color: '#4a4a4a',
	},
	tagNew: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 38,
		paddingLeft: 15,
		paddingRight: 15,
		borderWidth: 2,
		borderColor: '#26c281',
	},
	tagNewText: {
		fontSize: 15,
		color: '#4a4a4a',
	},
	tagActive: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 38,
		paddingLeft: 15,
		paddingRight: 15,
		borderWidth: 2,
		borderColor: '#26c281',
		backgroundColor: '#26c281'
	},
	tagActiveText: {
		fontSize: 15,
		color: '#ffffff',
	},
});

export default class SetTagPage extends React.Component {

	render() {
		return <View style={CommonStyles.container}>
			<ScrollView style={{width: '100%'}}>
				<View style={{height: 50}}><Text>!!!header area!!!</Text></View>
				<View style={CommonStyles.contentContainer}>
					<Text style={styles.tagParagraph}>관심 태그를 선택하시면 김나람님께 꼭 맞춘 프리미엄 컨텐츠가 추천됩니다.</Text>
					<View style={styles.labelContainer}>
						<View style={[styles.label, styles.labelActive]} borderRadius={3}/>
						<Text style={styles.labelText}>나의태그</Text>
						<View style={[styles.label, styles.labelNormal]} borderRadius={3}/>
						<Text style={styles.labelText}>신규</Text>
					</View>

					{/*<TagItem/>*/}
					<TouchableOpacity activeOpacity={0.9}>
						<View style={styles.tagNormal} borderRadius={8}>
							<View style={styles.tagFlex}>
								<Text style={styles.tagNormalText}>#</Text>
								<Text style={styles.tagNormalText}>기본태그</Text>
							</View>
						</View>
					</TouchableOpacity>

					<TouchableOpacity activeOpacity={0.9}>
						<View style={styles.tagNew} borderRadius={8}>
							<View style={styles.tagFlex}>
								<Text style={styles.tagNewText}>#</Text>
								<Text style={styles.tagNewText}>신규태그</Text>
							</View>
						</View>
					</TouchableOpacity>

					<TouchableOpacity activeOpacity={0.9}>
						<View style={styles.tagActive} borderRadius={8}>
							<View style={styles.tagFlex}>
								<Text style={styles.tagActiveText}>#</Text>
								<Text style={styles.tagActiveText}>선택된태그</Text>
							</View>
						</View>
					</TouchableOpacity>

					<Text>SetTagPage 서브페이지</Text>
					<Button
						onPress={() => this.props.navigation.navigate('MyInfoHome')}
						title="뒤로"
					/>
				</View>
			</ScrollView>
		</View>
	}
}