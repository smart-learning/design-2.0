import React, {Component} from 'react';
import {View} from "react-native";
import Video from "react-native-video";

class VideoPack extends Component {


    componentDidMount(){

    }


    onBuffer( evt ){
        // alert( 'onBuffer:' + evt );
    }

    videoError( evt ){
        alert( 'videoError:' + JSON.stringify( evt ) );
    }

    loadStart( evt ){
        // alert( 'loadStart:' + JSON.stringify( evt ) );
    }

    setDuration( evt ){
        // alert( 'setDuration:' + evt );
    }

    setTime( evt ){
        // alert( 'setTime:' + evt );
    }


    onTimedMetadata( evt ){
        // alert( 'onTimedMetadata:' + evt );
    }

    render() {
        return <View style={{ width: 300, height: 300 }}>
            <Video
                ref={ ref => this.player = ref }
                source={require('../../video/sample.mp4')}
                // source={{uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'}}
                style={{position: 'absolute', top:0, bottom:0, left:0, right:0 }}
                poster={"https://baconmockup.com/300/200/"}
                resizeMode={"cover"}

                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                onError={this.videoError}
                onLoadStart={this.loadStart}            // Callback when video starts to load
                onLoad={this.setDuration}               // Callback when video loads
                onProgress={this.setTime}               // Callback every ~250ms with currentTime
                onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
            />
        </View>;
    }
}


export default VideoPack;
