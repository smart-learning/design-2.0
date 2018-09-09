import React from "react";
import {observer} from 'mobx-react';
import {ActivityIndicator, Alert, Text, View} from "react-native";
import net from "../../commons/net";
import CommonStyles from "../../../styles/common";
import createStore from "../../commons/createStore";
import DetailLayout from "../../components/detail/DetailLayout";
import moment from "moment";

@observer
class AudioBookDetailPage extends React.Component {
	store = createStore({
		isLoading: true,
		itemData: null,
		itemClipData: [],
		itemReviewData: [],
		tabStatus: 'info',
		lectureView: false,
		teacherView: false,
		slideHeight: null,
		reviewText: '',
		reviewStar: 0,

		permissions: {
			permission: false,
			expire_at: null,
		},
		paymentType: 1,
		expire: null,
		voucherStatus: {},
	});

	state = {
		paymentType: 1,
		expire: null,
		permissionLoading: true,
	}

	purchase = async (paymentType) => {
		if (paymentType === 1) { // 구매
			Alert.alert('알림', '오디오북 단품 결제는 준비중입니다.')
		} else if (paymentType === 2) { // 이용권 사용
			const audiobook_id = this.props.navigation.state.params.id
			const res = await net.voucherExchange(audiobook_id)
			console.log('purchase resp', res)
			if (res.status === 200) {
				Alert.alert('이용권을 이용한 오디오북 구매에 성공했습니다.')

				this.store.permissions = await this.getPermissions()

				return true
			} else {
				Alert.alert('이용권을 이용한 오디오북 구매 중 오류가 발생하였습니다.')

				return false
			}
		}
	}

	getData = async () => {
		this.store.isLoading = true;
		const resultBookData = await net.getBookItem(this.props.navigation.state.params.id);
		const resultChapterData = await net.getBookChapterList(this.props.navigation.state.params.id);

		this.store.itemData = resultBookData;
		this.store.itemClipData = resultChapterData;
		if( resultBookData && resultBookData.cid ) {
			try {
				const comments = await net.getBookReviewList( resultBookData.cid );
				this.store.itemReviewData = comments;
			}
			catch( error ) { console.log( error ) }
		}

		this.store.isLoading = false;

		await this.getPermissions()
	};

	async getPermissions() {
		let permissionLoading = true;

		this.setState({permissionLoading})
		let { sale_price } = this.store.itemData

		if (sale_price === 0) {
			this.store.permissions = {
				is_free: true,
				permission: true,
				expire_at: null,
			}
		} else {
			this.store.permissions = await net.getContentPermission('audiobooks', this.props.navigation.state.params.id)
			if (!this.store.permissions.permission) {
				this.store.voucherStatus = await net.getVoucherStatus(true)
			}
		}

		////////////////

		let paymentType = 0
		let expire = null

		let { itemData, permissions, voucherStatus } = this.store
		if (permissions.is_free) {
			// 무료
			paymentType = 0
		} else {
			// 유료
			if (permissions.permission) {
				// 소장 중
				paymentType = 3

				if (permissions.expire_at) {
					expire = `${moment(permissions.expire_at).format('YYYY-MM-DD')} 만료`
				} else {
					expire = '영구소장'
				}
			} else {
				if ((itemData.is_botm && voucherStatus.botm > 0) ||
					(!itemData.is_botm && voucherStatus.total > 0)) {
					paymentType = 2
				} else {
					paymentType = 1
				}
			}
		}

		this.store.paymentType = paymentType
		this.store.expire = expire
		permissionLoading = false

		this.setState({
			paymentType, expire, permissionLoading
		})
	}

	async componentDidMount() {
		this.getData();
	}

	render() {
		return (
			<View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
				{this.store.isLoading ? (
					<View style={{marginTop: 12}}>
						<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
					</View>
				) : (
					 this.store.itemData !== null ? (

						<DetailLayout purchase={this.purchase}
									  voucherStatus={this.store.voucherStatus}
									  permissions={this.store.permissions}
									  itemData={this.store.itemData}
									  learnType={"audioBook"}
									  store={this.store}
									  paymentType={this.state.paymentType}
									  expire={this.state.expire}
									  permissionLoading={this.state.permissionLoading}
						/>

					) : (
						<View>
							<Text>!!! </Text>
						</View>
					 )

				)
			}
			</View>
			)
	}
}

export default AudioBookDetailPage;