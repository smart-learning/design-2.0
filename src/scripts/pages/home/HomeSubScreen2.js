import React from "react";
import Styles from "../../../styles/common";
import {Button, Text, View} from "react-native";

export default class HomeSubScreen2 extends React.Component {

	constructor(props){
		super(props);


		// 페이지내에서 다이나믹하게 타이틀 교체 샘플
		setTimeout( ()=>{
			this.props.navigation.setParams({ title: '새 새 새 타이틀' })
		}, 3000 );

	}

    render() {
        return <View style={Styles.container}>
            <Text>홈 서브페이지2</Text>
            <Button
                onPress={()=>this.props.navigation.goBack()}
                title="뒤로"
            />
        </View>
    }
}