import React, { PureComponent } from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');


class Toast extends PureComponent {
  state = {
    isConnected: true
  };

  componentDidMount() {
    // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    // NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  // handleConnectivityChange = isConnected => {
  //   if (isConnected) {
  //     this.setState({ isConnected });
  //   } else {
  //     this.setState({ isConnected });
  //   }
  // };

  render() {
    // if (!this.state.isConnected) {
      return ( 
      <View style={styles.offlineContainer,{backgroundColor:this.props.backColor !== undefined ? this.props.backColor : 'red'}}>
      <Text style={styles.offlineText}>{this.props.message}</Text>
    </View>
    );
    // }
    // return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: 'red',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 0
  },
  offlineText: { color: 'white',paddingHorizontal:15,fontSize:16 }
});

export default Toast;