import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, Image} from 'react-native';

export default class Logo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actualAsset: null,
    };
  }
  componentDidMount() {
    let style = this.props.style ? this.props.style : {width:'100%'}
    let asset = (
      <Image
        // source={require('../../asset/logo.png')}
        source={require('../../assets/LNWLogo.png')}
        style={(styles.image, style)}
        resizeMode="contain"
      />
    );

    this.state.actualAsset = asset;
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Image
          // source={require('../../asset/logo.png')}
          source={require('../../assets/LNWLogo.png')}
          style={(styles.image, this.props.style)}
          resizeMode="contain"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
});
