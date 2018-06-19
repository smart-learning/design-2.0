import React, { Component } from 'react';
import {Modal, Text, TouchableHighlight, View} from "react-native";
import CommonStyles from "../../styles/common";
import {SafeAreaView} from "react-navigation";
import Video from "react-native-video";
import VideoPack from "../components/VideoPack";
import ModalFrame from "../components/ModalFrame";
// import RnnModuleSample from "rnn-module-sample"
// import CustomModule from 'react-native-custom-module';
import MapView from './MapView';


/*
* Acount: test/test
* http://www.media-drm.com/Demo1.aspx
* */
class VideoTest extends Component {


	constructor(){
		super();

		// alert( RnnModuleSample + CustomModule );

		RnnModuleSample.callback((error, list) => {
			if (error) {
				//error
			} else {
				alert( list );
				//array list returned [...]
			}
		});
	}


    render() {
        return <SafeAreaView style={[ CommonStyles.container, {backgroundColor: '#cccccc'}]}>

            <Text>VIDEO TEST</Text>
            {/*<VideoPack/>*/}


            {/*<MapView style={{flex: 1, backgroundColor:'red'}}/>*/}


			{/*<ModalFrame>*/}
				{/*<Text>모달자식노무색히</Text>*/}
			{/*</ModalFrame>*/}

        </SafeAreaView>
    }
}


export default VideoTest;
