import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

export default class RadioButtons extends Component {
  state = {
    value: 'All',
  };

  static propTypes = {
    getSelected: PropTypes.func,
  };


  onRadioClick = data => e =>{
    this.setState({
      value: data,
    });
    this.props.getSelected(data);
  }

  render() {
    const options = this.props.options;
    const value = this.state.value;
    return (
      <View>
        {options.map(item => {
          return (
            <View key={item.key} style={styles.buttonContainer}>
              <Text
                style={{color: '#717273', fontWeight: 'bold', fontSize: 16}}>
                {item.text}
              </Text>
              <TouchableOpacity
                style={styles.circle}
                onPress={this.onRadioClick(item.key)}>
                {value === item.key && <View style={styles.checkedCircle} />}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
    marginTop: 7,
  },

  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#049afb',
  },
});
