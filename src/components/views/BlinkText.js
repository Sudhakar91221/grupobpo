import React, {Component} from 'react';
import {Text} from 'react-native';

export default class BlinkText extends Component {
  componentDidMount() {
    // Toggle the state every second
    setInterval(
      () =>
        this.setState(previousState => ({
          isShowingText: !previousState.isShowingText,
        })),
      1000,
    );
  }

  //state object
  state = {isShowingText: true};

  render() {
    if (!this.state.isShowingText) {
      return <Text style={[styless.orangeText]}>{this.props.text}</Text>;
    }

    return <Text style={this.props.style}>{this.props.text}</Text>;
  }
}

const styless = {
  orangeText: {
    fontSize: 25,
    fontWeight: '700',
    color: 'transparent',
  },
};
