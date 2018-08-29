import React from "react";
import {observer} from 'mobx-react';
import {ActivityIndicator, View,} from "react-native";
import net from "../../commons/net";
import CommonStyles from "../../../styles/common";
import createStore from "../../commons/createStore";
import DetailLayout from "../../components/detail/DetailLayout";

@observer
class ClassDetailPage extends React.Component {
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
	});

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

	componentDidMount() {
		this.getData();
	}

	render() {
		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			{this.store.isLoading &&
			<View style={{ marginTop: 12 }}>
				<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
			</View>
			}
			{( !this.store.isLoading && this.store.itemData !== null ) &&
			<DetailLayout learnType={"audioBook"} store={this.store}/>
			}
		</View>
	}
}

export default ClassDetailPage;