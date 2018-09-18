import React from "react";
import CommonStyles from "../../../styles/common";
import {Button, Text, View, Keyboard, TextInput, TouchableOpacity} from "react-native";
import AdvertisingSection from "../../components/AdvertisingSection";
import {observer} from "mobx-react";
import createStore from '../../commons/createStore';

@observer
export default class SampleSubScreen1 extends React.Component {
	data = createStore({
		isKeyboardOn: false,
	});

	componentDidMount () {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}

	componentWillUnmount () {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	_keyboardDidShow = () => {
		// alert('Keyboard Shown');
		this.data.isKeyboardOn= true;
	}

	_keyboardDidHide = () => {
		// alert('Keyboard Hidden');
		this.data.isKeyboardOn= false;
	}

	hideKeyboard = () => {
		Keyboard.dismiss();
		this.data.isKeyboardOn= false;
	}

    render() {
        return <View style={[CommonStyles.container, {position: 'relative'}]}>
            <Text>여기는 샘플 서브페이지1</Text>
            <Button
				// 두번째 파라미터로 {title}을 넘기면 페이지 헤더타이틀로 사용합니다. 고정적 제목이면 이곳에서, 아니면 SampleSubScreen2 페이지 내부 샘플을 참조하세요.
                onPress={()=>this.props.navigation.navigate('HomeScreen2', {title:'새 타이틀'})}
                title="서브페이지2로.."
            />

			<Button title="외부 페이지 로그인 테스트" onPress={
				()=> this.props.navigation.navigate('AuthCheck', { requestScreenName:'AuthorizedMyScreen' } ) }
			/>

			<TextInput
				onSubmitEditing={Keyboard.dismiss}
			/>

			{!!this.data.isKeyboardOn &&
			<TouchableOpacity onPress={ this.hideKeyboard } style={{width: '100%', height: '100%', backgroundColor: '#f0f', opacity: 0.5, position: 'absolute', top: 0, left: 0}}/>
			}
        </View>
    }
}