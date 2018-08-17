import React from "react";
import {observer} from 'mobx-react';
import {View,Text,} from "react-native";
// import store from "../../commons/store";
import net from "../../commons/net";
import CommonStyles from "../../../styles/common";
import createStore from "../../commons/createStore";
import DetailLayout from "../../components/detail/DetailLayout";

@observer
class LectureDetailPage extends React.Component {
	store = createStore({
		itemData: null,
		lectureClipData: {
			items: [],
		},
		tabStatus: 'info',
		lectureView: false,
		teacherView: false,
		slideHeight: null,
		reviewText: '',
		reviewStar: 0,
	});

	getData = async () => {
		const resultLectureData = await net.getLectureItem(this.props.navigation.state.params.id);
		const resultLectureClipData = await net.getLectureClipList(this.props.navigation.state.params.id);

		this.store.itemData = resultLectureData.item;
		this.store.lectureClipData = resultLectureClipData;
	};

	componentDidMount() {
		this.getData();
	}

	render() {
		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			{this.store.itemData !== null &&
			<DetailLayout learnType={"class"} store={this.store}/>
			}
		</View>
	}
}

export default LectureDetailPage;