import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {primaryColor} from '../../components/common/Theme/themeProvider'
import {ActivityIndicator} from 'react-native-paper';

class ActivityIndicatorCustom extends Component {
  state = {animating: true};

  closeActivityIndicator = () =>
    setTimeout(
      () =>
        this.setState({
          animating: false,
        }),
      60000,
    );

  // componentDidMount = () => this.closeActivityIndicator();
  render() {
    const animating = this.state.animating;

    if (this.props.isSpinner) {
      return (
        <View style={this.props.style}>
          <ActivityIndicator
            animating={animating}
            color={primaryColor}
            size="large"
            style={styles.activityIndicator}
            // style={styles.ActivityIndicatorStyle}
          />
        </View>
      );
    }
    {
      return null;
    }
  }
}
export default ActivityIndicatorCustom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    paddingBottom: 8,
  },
});
