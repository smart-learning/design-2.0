import React, { Component } from 'react';
import { Image, Dimensions } from 'react-native';

export default class ScaledImage extends Component {
  constructor(props) {
    super(props);
    this.state = { source: { uri: this.props.uri } };
    this.windowWidth = Dimensions.get('window').width;
  }

  componentWillMount() {
    Image.getSize(this.props.uri, (width, height) => {
      if (this.props.width && !this.props.height) {
        this.setState({
          width: this.props.width,
          height: height * (this.props.width / width),
        });
      } else if (!this.props.width && this.props.height) {
        this.setState({
          width: width * (this.props.height / height),
          height: this.props.height,
        });
      } else {
        // this.setState({ width: width, height: height });
        this.setState({
          width: this.windowWidth,
          height: height * (this.windowWidth / width),
        });
      }
    });
  }

  render() {
    return (
      <Image
        source={this.state.source}
        style={{ height: this.state.height, width: this.state.width }}
      />
    );
  }
}
