import React from "react";
import CommonStyles from "../../../styles/common";
import {Button, Text, View} from "react-native";
import AdvertisingSection from "../../components/AdvertisingSection";

export default class SampleSubScreen1 extends React.Component {

    render() {
        return <View style={CommonStyles.container}>
            <Text>여기는 샘플 서브페이지1</Text>
            <Button
				// 두번째 파라미터로 {title}을 넘기면 페이지 헤더타이틀로 사용합니다. 고정적 제목이면 이곳에서, 아니면 SampleSubScreen2 페이지 내부 샘플을 참조하세요.
                onPress={()=>this.props.navigation.navigate('HomeScreen2', {title:'새 타이틀'})}
                title="서브페이지2로.."
            />

			<Button title="외부 페이지 로그인 테스트" onPress={
				()=> this.props.navigation.navigate('AuthCheck', { requestScreenName:'AuthorizedMyScreen' } ) }
			/>

        </View>
    }
}