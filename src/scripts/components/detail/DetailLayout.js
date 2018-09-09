import React from "react";
import {observer} from 'mobx-react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import CommonStyles from "../../../styles/common";
import TabContentInfo from "./TabContentInfo";
import PaymentStatus from "./PaymentStatus";
import TopBanner from "./TopBanner";
import TabContentList from "./TabContentList";

const styles = StyleSheet.create( {
	tabContainer: {
		// width: '33.3%',
		width: '50%',
	},
	tabItem: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
		height: 60,
		backgroundColor: '#ffffff',
	},
	tabNormalText: {
		fontSize: 15,
		color: '#555555',
	},
	tabActiveText: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#333333',
	},
	tabNormalHr: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		height: 3,
		backgroundColor: '#ffffff',
	},
	tabActiveHr: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		width: '100%',
		height: 3,
		backgroundColor: CommonStyles.COLOR_PRIMARY,
	},
} );

@observer
class DetailLayout extends React.Component {

	state = {
		permission: false,
	}

	constructor( props ) {
		super( props );
	}

	render() {
		return <View style={[ CommonStyles.container, { backgroundColor: '#ffffff', width: '100%' } ]}>
			<ScrollView style={{ width: '100%' }}>
				<TopBanner learnType={this.props.learnType} store={this.props.store}/>

				<PaymentStatus
					purchase={this.props.purchase}
					voucherStatus={this.props.voucherStatus}
					permissions={this.props.permissions}
					itemData={this.props.itemData}
					learnType={this.props.learnType}
					store={this.props.store}
					paymentType={this.props.paymentType}
					expire={this.props.expire}
					permissionLoading={this.props.permissionLoading}

					// paymentType={"normal"}
				/>

				<View style={CommonStyles.alignJustifyContentBetween}>
					<View style={styles.tabContainer}>
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => {
											  this.props.store.tabStatus = 'info'
										  }}>
							<View style={styles.tabItem}>
								<Text style={this.props.store.tabStatus === 'info' ? styles.tabActiveText : styles.tabNormalText}>
									{this.props.learnType === 'audioBook' &&
									<Text>도서정보</Text>
									}
									{this.props.learnType === 'class' &&
									<Text>클래스정보</Text>
									}

								</Text>
								<View style={ this.props.store.tabStatus === 'info' ? styles.tabActiveHr : styles.tabNormalHr }/>
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.tabContainer}>
						<TouchableOpacity activeOpacity={0.9}
										  onPress={() => {
											  this.props.store.tabStatus = 'list'
										  }}>
							<View style={styles.tabItem}>
								<Text style={this.props.store.tabStatus === 'list' ? styles.tabActiveText : styles.tabNormalText}>
									{this.props.learnType === 'audioBook' &&
									<Text>목차({this.props.store.itemClipData.length})</Text>
									}
									{this.props.learnType === 'class' &&
									<Text>강의목차({this.props.store.itemClipData.length})</Text>
									}
								</Text>
								<View style={ this.props.store.tabStatus === 'list' ? styles.tabActiveHr : styles.tabNormalHr }/>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				{this.props.store.tabStatus === 'info' &&
				<TabContentInfo store={ this.props.store } learnType={this.props.learnType}/>
				}
				{this.props.store.tabStatus === 'list' &&
				<TabContentList store={ this.props.store } learnType={this.props.learnType}/>
				}
			</ScrollView>
		</View>
	}

}

export default DetailLayout