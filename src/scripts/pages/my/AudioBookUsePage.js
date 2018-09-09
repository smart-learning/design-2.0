import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import CommonStyles from "../../../styles/common";
import { SafeAreaView } from "react-navigation";
import SummaryListItem from "../../components/my/SummaryListItem";
import createStore from "../../commons/createStore";
import net from "../../commons/net";
import { observer } from "mobx-react";

@observer class AudioBookUsePage extends React.Component {

	store = createStore( {
		isLoading: true,
		list: [],
	} );

	load = async () => {
		this.store.isLoading = true;
		this.store.list = await net.getPlayRecentAudioBook( true );
		if( !this.store.list ) {
			this.store.list = [];
		}
		this.store.isLoading = false;
	};

	componentDidMount() {
		this.load();
	}

	go = ( item ) => {
		this.props.navigation.navigate( 'AudioBookDetailPage', { id: item.data.id } );
	};

	render() {
		return <View style={[CommonStyles.container, {backgroundColor: '#ffffff'}]}>
			<SafeAreaView style={{flex: 1, width: '100%'}}>
				<ScrollView style={{flex: 1}}>
					{this.store.isLoading &&
					<View style={{ marginTop: 12 }}>
						<ActivityIndicator size="large" color={CommonStyles.COLOR_PRIMARY}/>
					</View>
					}
					{(!this.store.isLoading && this.store.list.length === 0) &&
					<View style={{ marginTop: 12 }}>
						<Text style={{ textAlign: 'center' }}>최근 재생 오디오북이 없습니다.</Text>
					</View>
					}
					{ this.store.list && this.store.list.map( ( item, key ) => {
						return (
							<SummaryListItem key={ key }
											 thumbnail={ ( item.data.teacher && item.data.teacher.images ) ? item.data.teacher.images.default : null }
											 title={ item.data.title }
											 author={ item.data.teacher ? item.data.teacher.name : '' }
											 likeCount={ item.data.like_count }
											 reviewCount={ item.data.review_count }
											 isLike={ false }
											 navigation={ this.props.navigation }
											 onPress={ () => this.go( item ) }
							/>
					) } ) }
				</ScrollView>
			</SafeAreaView>
		</View>
	}
}

export default AudioBookUsePage;