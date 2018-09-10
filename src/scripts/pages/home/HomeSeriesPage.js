import React from "react";
import CommonStyles from "../../../styles/common";
import {StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator} from "react-native";
import {SafeAreaView} from "react-navigation";
import {observer} from "mobx-react";
import {observable} from "mobx";
import net from "../../commons/net";
import IcAngleRight from "../../../images/ic-angle-right-primary.png";
import ClassList from "../../components/home/ClassList";
import DetailLayout from "../../components/detail/DetailLayout";

const styles = StyleSheet.create({

	titleH2: {
		marginTop: 20,
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333333',
	},
	titleH3: {
		marginTop: 30,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333333',
	},
	titleHr: {
		height: 1,
		marginTop: 7,
		backgroundColor: '#333333',
	},
});

class Data {
	@observable isLoading = false;
	@observable seriesData = [];
}

@observer
class HomeSeriesPage extends React.Component {
	data = new Data();

	getData = async (isRefresh = false) => {
		this.data.isLoading = true;
		this.data.seriesData = await net.getSeriesContents();
		this.data.isLoading = false;
	};

	componentDidMount() {
		try {
			this.getData();
		}
		catch (e) {
			console.log(e);
		}
	}

	render() {

		return (
			<View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
				<SafeAreaView style={{flex: 1, width: '100%'}}>
					<ScrollView style={{flex: 1}}>

						<View style={[CommonStyles.contentContainer, styles.seriesContentContainer]}>

							<Text style={styles.titleH2}>
								윌라 추천 시리즈
							</Text>

							{
								this.data.isLoading ? (
									<View style={{marginTop: 12}}>
										<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
									</View>
								) : undefined
							}

							{
								(!this.data.isLoading && this.data.seriesData && this.data.seriesData.length > 0) ? (
									<View>
										{
											this.data.seriesData.map((item, key) => {
												return (
													<View key={key} style={styles.seriesItem}>
														<Text style={styles.titleH3}>{item.title}</Text>

														<View style={styles.titleHr}/>
														<View>
															{
																<ClassList classType={"series"} itemData={item.item}/>
															}
														</View>
													</View>
												)
											})
										}
									</View>
								) : undefined
							}
						</View>
					</ScrollView>
				</SafeAreaView>
			</View>
		)
	}
}

export default HomeSeriesPage;