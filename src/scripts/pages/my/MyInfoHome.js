import Styles from "../../../styles/common";
import {AsyncStorage, Button, Image, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import store from '../../../scripts/commons/store';

/*
* 로그인 후 보여지는 화면
* */
export default class MyInfoHome extends React.Component {

	logout=()=>{
		store.clearTokens();
		this.props.navigation.navigate('Login');
	}

	render() {

		const { navigation } = this.props;

		return <View style={Styles.container}>

			{/*<Image*/}
				{/*style={{ position:'absolute', top:0, width:'100%', height:'50%' }}*/}
					{/*source={ { uri:"https://t1.daumcdn.net/cfile/tistory/99361E475B24737B2D"}}/>*/}


			<Text>내정보</Text>

			{/*<Button title="Logout이 원래 이 위치는 아니지만 그냥 테스트로..." onPress={this.logout}/>*/}

			{/*<Button title="서브페이지로..." onPress={ ()=> this.props.navigation.navigate('MyInfoSubExample')}/>*/}


			{/*<TouchableOpacity activeOpacity={0.9}*/}
							  {/*onPress={ ()=> navigation.navigate('DownloadContent') }*/}
			{/*>*/}
				{/*<Text>다운로드 콘텐츠</Text>*/}
			{/*</TouchableOpacity>*/}

			<Button title={"이용중 강좌"} onPress={ ()=> this.props.navigation.navigate( 'LectureUsePage' ) }/>
			<Button title={"구매한 강좌"} onPress={ ()=> this.props.navigation.navigate( 'LectureBuyPage' ) }/>
			<Button title={"나의 오디오북 이용권"} onPress={ ()=> this.props.navigation.navigate( 'AudioBookTicketPage' ) }/>
			<Button title={"이용중 오디오북"} onPress={ ()=> this.props.navigation.navigate( 'AudioBookUsePage' ) }/>
			<Button title={"구매한 오디오북"} onPress={ ()=> this.props.navigation.navigate( 'AudioBookBuyPage' ) }/>
			<Button title={"다운로드 컨텐츠"} onPress={ ()=> this.props.navigation.navigate( 'DownloadContentPage' ) }/>
			<Button title={"관심태그 설정하기"} onPress={ ()=> this.props.navigation.navigate( 'SetTagContentPage' ) }/>
			<Button title={"최근 재생 강의클립 목록"} onPress={ ()=> this.props.navigation.navigate( 'SetTagPage' ) }/>
			<Button title={"활동로그보기"} onPress={ ()=> this.props.navigation.navigate( 'ClipPlayListPage' ) }/>
			<Button title={"윌라친구"} onPress={ ()=> this.props.navigation.navigate( 'FriendPage' ) }/>
			<Button title={"윌라소개 & 이용가이드"} onPress={ ()=> this.props.navigation.navigate( 'GuideListPage' ) }/>
			<Button title={"1:1 문의"} onPress={ ()=> this.props.navigation.navigate( 'InquireListPage' ) }/>

		</View>
	}
}