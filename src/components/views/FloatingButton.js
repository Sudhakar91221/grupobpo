import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export default class FloatingButton extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.fab} onPress={this.onFloatButtonTapped}>
          <Text style={styles.text}>{this.props.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  onFloatButtonTapped = () => {
    this.props.onFloatButtonTapped();
  };
}

const styles = StyleSheet.create({
  fab: {
    height: '100%',
    width: '100%',
    borderRadius: 200,
    // position: 'absolute',
    // bottom: 20,
    // right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343957',
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#fff',

    width: 70,
    height: 70,
    borderRadius: 35,
    right: 10,
    position: 'absolute',
    bottom: 10,
  },
});
