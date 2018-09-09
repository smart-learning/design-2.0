import React from "react";
import {observer} from 'mobx-react';
import {ActivityIndicator, View, Alert} from "react-native";
import net from "../../commons/net";
import CommonStyles from "../../../styles/common";
import createStore from "../../commons/createStore";
import DetailLayout from "../../components/detail/DetailLayout";

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
		voucherStatus: {},
	});

	purchase = (paymentType) => {
		if (paymentType === 1) { // 구매
			Alert.alert('알림', '오디오북 단품 결제는 준비중입니다.')
		} else if (paymentType === 2) { // 이용권 사용
			this.store.permissions = {
				permission: true,
				expire_at: new Date(),
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
	};

	async getPermissions() {
		this.store.permissions = await net.getContentPermission('audiobooks', this.props.navigation.state.params.id)
		this.store.voucherStatus = await net.getVoucherStatus(true)
	}

	async componentDidMount() {
		this.getData();
		await this.getPermissions()
	}

	render() {
		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			{this.store.isLoading &&
			<View style={{ marginTop: 12 }}>
				<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
			</View>
			}
			{( !this.store.isLoading && this.store.itemData !== null ) &&
			<DetailLayout purchase={this.purchase} voucherStatus={this.store.voucherStatus} permissions={this.store.permissions} itemData={this.store.itemData} learnType={"audioBook"} store={this.store}/>
			}
		</View>
	}
}

export default AudioBookDetailPage;