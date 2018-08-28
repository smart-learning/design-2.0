import React from "react";
import {observer} from 'mobx-react';
import {View, } from "react-native";
// import store from "../../commons/store";
import net from "../../commons/net";
import CommonStyles from "../../../styles/common";
import createStore from "../../commons/createStore";
import DetailLayout from "../../components/detail/DetailLayout";

@observer
class ClassDetailPage extends React.Component {
	store = createStore({
		itemData: null,
		itemClipData: [],
		tabStatus: 'info',
		lectureView: false,
		teacherView: false,
		slideHeight: null,
		reviewText: '',
		reviewStar: 0,
	});

	getData = async () => {
		const resultBookData = await net.getBookItem(this.props.navigation.state.params.id);
		const resultChapterData = await net.getBookChapterList(this.props.navigation.state.params.id);

		this.store.itemData = resultBookData;
		this.store.itemClipData = resultChapterData;
	};

	componentDidMount() {
		this.getData();
	}

	render() {
		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			{this.store.itemData !== null &&
			<DetailLayout learnType={"audioBook"} store={this.store}/>
			}
		</View>
	}
}

export default ClassDetailPage;