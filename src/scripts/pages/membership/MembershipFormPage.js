import React from "react";
import {
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	Platform,
	TextInput,
	Image
} from "react-native";
import {SafeAreaView} from "react-navigation";
import CommonStyles from "../../../styles/common";
import {observer} from "mobx-react";
import {observable} from "mobx";
import BulletBoxCheck from "../../../images/ic-checkbox.png"
import BulletBoxChecked from "../../../images/ic-checkbox-checked.png"


const styles = StyleSheet.create({
	itemInfoContainer: {
		position: 'relative',
		marginTop: 20,
	},
	itemInfoHrTop: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: 3,
		backgroundColor: '#d3d3d3',
	},
	itemInfoHrBottom: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		height: 3,
		backgroundColor: '#d3d3d3',
	},
	itemInfo: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 90,
		backgroundColor: '#f7f5fb',
	},
	itemMonthlyPrice: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	itemText: {
		fontSize: 16,
		color: '#4a4a4a',
	},
	itemTextSm: {
		paddingTop: 3,
		fontSize: 12,
		color: '#4a4a4a',
	},
	itemTextImportant: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#5f45b4'
	},
	itemPriceOrigin: {
		fontSize: 16,
		color: '#4a4a4a',
		textDecorationLine: 'line-through',
	},
	sectionTitleContainer: {
		marginTop: 40,
	},
	sectionHr: {
		height: 3,
		marginTop: 10,
		backgroundColor: '#d3d3d3',
	},
	formItem: {
		paddingTop: 15,
		paddingBottom: 15,
		alignItems: 'center',
	},
	formLabel: {
		fontSize: 16,
		color: '#4a4a4a',
	},
	formInputContainer: {
		width: '55%'
	},
	formInput: {
		width: '100%',
		height: 50,
		borderWidth: 1,
		borderColor: '#dbdbdb',
	},
	formHr: {
		width: '100%',
		height: 1,
		backgroundColor: '#efefef'
	},
	formValidityPeriod: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	validityPeriodInput: {
		width: 60,
		height: 50,
		borderWidth: 1,
		borderColor: '#dbdbdb',
	},
	validityPeriodBullet: {
		paddingLeft: 7,
		paddingRight: 7,
		fontSize: 16,
		color: '#4a4a4a',
	},
	birthInput: {
		width: 100,
		height: 50,
		borderWidth: 1,
		borderColor: '#dbdbdb',
	},
	genderInput: {
		width: 30,
		height: 50,
		borderWidth: 1,
		borderColor: '#dbdbdb',
	},
	total: {
		marginTop: 20,
		marginBottom: 20,
	},
	totalHr: {
		width: '100%',
		height: 1,
		backgroundColor: '#4a4a4a',
	},
	totalContent: {
		alignItems: 'center',
		paddingTop: 15,
		paddingBottom: 15,
	},
	totalPrice: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#ff4f72',
	},
	submitButton: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		width: '100%',
		height: 60,
	},
	submitButtonText: {
		fontSize: 16,
		color: '#ffffff',
	},
	checkboxContainer: {
		position: 'relative',
	},
	checkbox: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
	checkBoxImage: {
		width: 17,
		height: 17,
	},
	agreeText: {
		paddingLeft: 25,
		fontSize: 12,
		color: '#626262',
	},
});

@observer
class MembershipFormPage extends React.Component {

	@observable formType = null;
	@observable name = null;
	@observable phone = null;
	@observable email = null;
	@observable creditNumber = null;
	@observable validityPeriodMonth = '월';
	@observable validityPeriodYear = '년';
	@observable birth = 'YYMMDD';
	@observable gender = null;
	@observable password = null;
	@observable isAgree = false;

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.formType = this.props.navigation.state.params.type;
	}

	validityPeriodMonthOnFocus = () => {
		if (this.validityPeriodMonth === '월') {
			this.validityPeriodMonth = '';
		}
	};
	validityPeriodYearOnFocus = () => {
		if (this.validityPeriodYear === '년') {
			this.validityPeriodYear = '';
		}
	};
	birthOnFocus = () => {
		if (this.birth === 'YYMMDD') {
			this.birth = '';
		}
	};

	// agreeStatus = () => {
	// 	if (this.isAgree === false) {
	// 		this.isAgree = true;
	// 	} else {
	// 		this.isAgree = false;
	// 	}
	// };

	render() {
		return <SafeAreaView style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<ScrollView style={{width: '100%'}}>
				<View style={CommonStyles.contentContainer}>
					<View style={styles.itemInfoContainer}>
						<View style={styles.itemInfo}>
							<View>
								<Text style={styles.itemText}>구매상품 : <Text style={styles.itemTextImportant}>멤버십이름</Text></Text>
								<View style={styles.itemMonthlyPrice}>
									<Text style={styles.itemText}>매월</Text>
									<View>
										{this.formType === 'campus' &&
										<View>
											{Platform.select({
												ios: <Text style={styles.itemTextImportant}> $9.89 </Text>,
												android: <Text>
													<Text style={styles.itemTextImportant}> 7,700원 </Text>
													<Text style={styles.itemPriceOrigin}>(30,000원)</Text>
												</Text>,
											})}
										</View>
										}
										{this.formType === 'bookClub' &&
										<View>
											{Platform.select({
												ios: <Text style={styles.itemTextImportant}> $8.79 </Text>,
												android: <Text>
													<Text style={styles.itemTextImportant}> 6,600원 </Text>
													<Text style={styles.itemPriceOrigin}>(15,000원)</Text>
												</Text>,
											})}
										</View>
										}
										{this.formType === 'premium' &&
										<View>
											{Platform.select({
												ios: <Text style={styles.itemTextImportant}> $18.69 </Text>,
												android: <Text>
													<Text style={styles.itemTextImportant}> 14,300원 </Text>
													<Text style={styles.itemPriceOrigin}>(40,000원)</Text>
												</Text>,
											})}
										</View>
										}
									</View>
									<Text style={styles.itemText}> 정기결제</Text>
								</View>
							</View>
						</View>
						<View style={styles.itemInfoHrTop}/>
						<View style={styles.itemInfoHrBottom}/>
					</View>

					<View style={styles.sectionTitleContainer}>
						<Text style={styles.itemText}>결제자 정보</Text>
						<View style={styles.sectionHr}/>
					</View>

					<View>
						<View style={[CommonStyles.alignJustifyContentBetween, styles.formItem]}>
							<Text style={styles.formLabel}>이름</Text>
							<View style={styles.formInputContainer}>
								<TextInput style={styles.formInput}
										   underlineColorAndroid={'rgba(0,0,0,0)'}
										   value={this.name}
										   onChangeText={text => {
											   this.name = {text}
										   }}/>
							</View>
						</View>
						<View style={styles.formHr}/>
						<View style={[CommonStyles.alignJustifyContentBetween, styles.formItem]}>
							<Text style={styles.formLabel}>휴대폰</Text>
							<View style={styles.formInputContainer}>
								<TextInput style={styles.formInput}
										   underlineColorAndroid={'rgba(0,0,0,0)'}
										   keyboardType={'numeric'}
										   value={this.phone}
										   onChangeText={text => {
											   this.phone = {text}
										   }}/>
							</View>
						</View>
						<View style={styles.formHr}/>
						<View style={[CommonStyles.alignJustifyContentBetween, styles.formItem]}>
							<Text style={styles.formLabel}>이메일</Text>
							<View style={styles.formInputContainer}>
								<TextInput style={styles.formInput}
										   underlineColorAndroid={'rgba(0,0,0,0)'}
										   value={this.email}
										   onChangeText={text => {
											   this.email = {text}
										   }}/>
							</View>
						</View>
						<View style={styles.formHr}/>
					</View>

					<View style={styles.sectionTitleContainer}>
						<Text style={styles.itemText}>카드 정보</Text>
						<View style={styles.sectionHr}/>
					</View>

					<View>
						<View style={[CommonStyles.alignJustifyContentBetween, styles.formItem]}>
							<Text style={styles.formLabel}>카드번호</Text>
							<View style={styles.formInputContainer}>
								<TextInput style={styles.formInput}
										   underlineColorAndroid={'rgba(0,0,0,0)'}
										   keyboardType={'numeric'}
										   value={this.creditNumber}
										   onChangeText={text => {
											   this.creditNumber = {text}
										   }}/>
								<Text style={styles.itemTextSm}>'-'없이 기재해주세요.</Text>
							</View>
						</View>
						<View style={styles.formHr}/>
						<View style={[CommonStyles.alignJustifyContentBetween, styles.formItem]}>
							<Text style={styles.formLabel}>유효기간</Text>
							<View style={styles.formInputContainer}>
								<View style={styles.formValidityPeriod}>
									<TextInput style={styles.validityPeriodInput}
											   underlineColorAndroid={'rgba(0,0,0,0)'}
											   onFocus={this.validityPeriodMonthOnFocus}
											   keyboardType={'numeric'}
											   value={this.validityPeriodMonth}
											   onChangeText={text => {
												   this.validityPeriodMonth = {text}
											   }}/>
									<Text style={styles.validityPeriodBullet}>/</Text>
									<TextInput style={styles.validityPeriodInput}
											   underlineColorAndroid={'rgba(0,0,0,0)'}
											   onFocus={this.validityPeriodYearOnFocus}
											   keyboardType={'numeric'}
											   value={this.validityPeriodYear}
											   onChangeText={text => {
												   this.validityPeriodYear = {text}
											   }}/>
								</View>
							</View>
						</View>
						<View style={styles.formHr}/>
						<View style={[CommonStyles.alignJustifyContentBetween, styles.formItem]}>
							<Text style={styles.formLabel}>생년월일</Text>
							<View style={styles.formInputContainer}>
								<View style={styles.formValidityPeriod}>
									<TextInput style={styles.birthInput}
											   underlineColorAndroid={'rgba(0,0,0,0)'}
											   onFocus={this.birthOnFocus}
											   keyboardType={'numeric'}
											   value={this.birth}
											   onChangeText={text => {
												   this.birth = {text}
											   }}/>
									<Text style={styles.validityPeriodBullet}>-</Text>
									<TextInput style={styles.genderInput}
											   underlineColorAndroid={'rgba(0,0,0,0)'}
											   keyboardType={'numeric'}
											   value={this.gender}
											   onChangeText={text => {
												   this.gender = {text}
											   }}/>
									<Text style={styles.validityPeriodBullet}>******</Text>
								</View>
							</View>
						</View>
						<View style={styles.formHr}/>
						<View style={[CommonStyles.alignJustifyContentBetween, styles.formItem]}>
							<Text style={styles.formLabel}>비밀번호 앞 두자리</Text>
							<View style={styles.formInputContainer}>
								<View style={styles.formValidityPeriod}>
									<TextInput style={styles.validityPeriodInput}
											   underlineColorAndroid={'rgba(0,0,0,0)'}
											   secureTextEntry={true}
											   keyboardType={'numeric'}
											   value={this.password}
											   onChangeText={text => {
												   this.password = {text}
											   }}/>
									<Text style={styles.validityPeriodBullet}>**</Text>
								</View>
							</View>
						</View>
						<View style={styles.formHr}/>
					</View>

					<View style={styles.total}>
						<View style={styles.totalHr}/>
						<View style={[CommonStyles.alignJustifyContentBetween, styles.totalContent]}>
							<Text style={styles.itemText}>총 결제 예정금액</Text>
							{this.formType === 'campus' &&
							<View>
								{Platform.select({
									ios: <Text style={styles.totalPrice}>$9.89</Text>,
									android: <Text style={styles.totalPrice}>7,700 <Text
										style={styles.itemText}>원</Text></Text>
								})}
							</View>
							}
							{this.formType === 'bookClub' &&
							<View>
								{Platform.select({
									ios: <Text style={styles.totalPrice}>$8.79</Text>,
									android: <Text style={styles.totalPrice}>6,600 <Text
										style={styles.itemText}>원</Text></Text>
								})}
							</View>
							}
							{this.formType === 'premium' &&
							<View>
								{Platform.select({
									ios: <Text style={styles.totalPrice}>$18.69</Text>,
									android: <Text style={styles.totalPrice}>14,300 <Text
										style={styles.itemText}>원</Text></Text>
								})}
							</View>
							}
						</View>
						<View style={styles.totalHr}/>
					</View>

					{/*<View style={styles.checkboxContainer}>*/}
						{/*<TouchableOpacity onPress={this.agreeStatus}>*/}
							{/*<View style={styles.checkbox}>*/}
								{/*{this.isAgree === true &&*/}
								{/*<Image source={BulletBoxChecked} style={styles.checkBoxImage}/>*/}
								{/*}*/}
								{/*{this.isAgree === false &&*/}
								{/*<Image source={BulletBoxCheck} style={styles.checkBoxImage}/>*/}
								{/*}*/}
								{/*<View>*/}
									{/*<Text style={styles.agreeText}>매월 정기결제 되는 것에 동의합니다.</Text>*/}
									{/*<Text style={styles.agreeText}>정기결제는 마이윌라 설정에서 언제든지 해지가 가능합니다.</Text>*/}
								{/*</View>*/}
							{/*</View>*/}
						{/*</TouchableOpacity>*/}
					{/*</View>*/}

					{/*<TouchableOpacity activeOpacity={0.9}>*/}
						{/*<View style={styles.submitButton}>*/}
							{/*<Text style={styles.submitButtonText}>결제하기</Text>*/}
						{/*</View>*/}
					{/*</TouchableOpacity>*/}

				</View>

			</ScrollView>
		</SafeAreaView>
	}
}

export default MembershipFormPage;
