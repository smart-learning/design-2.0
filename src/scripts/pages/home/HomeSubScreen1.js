import React from "react";
import CommonStyles from "../../../styles/common";
import {Button, Text, View} from "react-native";

export default class HomeSubScreen1 extends React.Component {

    render() {
        return <View style={CommonStyles.container}>
            <Text>여기는 홈 서브페이지1</Text>
            <Button
				// 두번째 파라미터로 {title}을 넘기면 페이지 헤더타이틀로 사용합니다. 고정적 제목이면 이곳에서, 아니면 HomeSubScreen2 페이지 내부 샘플을 참조하세요.
                onPress={()=>this.props.navigation.navigate('HomeScreen2', {title:'새 타이틀'})}
                title="서브페이지2로.."
            />

        </View>
    }
}