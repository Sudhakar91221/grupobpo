/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, View} from 'react-native';
// import { theme } from '../styles';
import {ScreenWidth} from '../utility/Settings';

const SCREENWIDTH = ScreenWidth;

export default class Divider extends Component {
  render() {
    const props = this.props;

    if (props.dashed == true) {
      return (
        <View style={styles.container}>
          <Text
            style={{width: '100%', color: '#999999'}}
            numberOfLines={1}
            ellipsizeMode="clip">
            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
            - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          </Text>
        </View>
      );
    }
    return (
      <View style={[styles.container,{height:props.height !== undefined ? 30 : 1.5}]}>
        <View
          style={[
            styles.line,
            // {color:this.props.color},
            {borderBottomWidth: props.height},
            {
              borderColor:
                props.borderColor === undefined ? '#999999' : props.borderColor,
            },
            props.dashed && styles.dashed,
            props.orientation === 'left' ? styles.shortWidth : {flex: 1},
            
          ]}
        />
        {props.text !== undefined && (
          <Text style={[styles.text, {color: props.color}]}>
            {' '}
            {props.text}{' '}
          </Text>
        )}
        <View
          style={[
            styles.line,
            {borderBottomWidth: props.height},
            {
              borderColor:
                props.borderColor === undefined ? '#999999' : props.borderColor,
            },
            props.dashed && styles.dashed,
            props.orientation === 'right' ? styles.shortWidth : {flex: 1},

          ]}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    height: 1.5,
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 0,
    paddingLeft: 0,
    paddingRight: 0,
    width: '100%',
    marginHorizontal: 0,
    backgroundColor :'white'
  },
  line: {
    height: 1.5,
    // borderBottomWidth: 1,
    // transform: [{translateY: -12}],
    backgroundColor: 'darkgray',
  },
  shortWidth: {
    width: 20,
  },
  dashed: {
    borderStyle: 'dashed',
    color: 'gray',
  },
  text: {
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: '500',
  },
};
