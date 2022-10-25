/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Moment from 'moment';

export default class ChatBubble extends React.Component {
  render() {
    const time = Moment.unix(this.props.date).format('MMM DD , YYYY');
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          marginLeft: this.props.isLeftView === true ? 20 : 70,
          marginRight: this.props.isLeftView === true ? 40 : -20,
        }}>
        <View
          style={[
            styles.talkBubbleSquare,
            {backgroundColor: this.props.backgroundColor},
          ]}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                styles.textStyle,
                {
                  marginLeft: 10,
                  flex: 0.7,
                  fontWeight: 'bold',
                  marginTop: 10,
                  fontSize: 16,
                },
              ]}>
              {this.props.name}
            </Text>
            <Text
              style={[
                styles.textStyle,
                {
                  marginLeft: 10,
                  flex: 0.3,
                  fontSize: 12,
                  alignSelf: 'center',
                  marginTop: 10,
                },
              ]}>
              {time}
            </Text>
          </View>
          <Text style={styles.textStyle}>{this.props.message}</Text>
        </View>
        <View
          style={
            this.props.isLeftView === true
              ? [
                  styles.talkBubbleTriangleLeft,
                  {borderRightColor: this.props.backgroundColor},
                ]
              : styles.talkBubbleTriangleRight
          }
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  talkBubble: {},
  talkBubbleSquare: {
    width: '90%',
    borderRadius: 10,
  },
  talkBubbleTriangleLeft: {
    position: 'absolute',
    left: -15,
    top: 30,
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 13,
    borderRightWidth: 26,
    borderRightColor: '#ededed',
    borderBottomWidth: 13,
    borderBottomColor: 'transparent',
  },
  talkBubbleTriangleRight: {
    position: 'absolute',
    right: 20,
    top: 30,
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 13,
    borderRightWidth: 26,
    borderRightColor: '#ededed',
    borderBottomWidth: 13,
    borderBottomColor: 'transparent',
    transform: [{scaleX: -1}],
  },
  textStyle: {
    fontFamily: 'SFProText-Regular',
    color: '#454F63',
    fontSize: 16,
    textTransform: 'capitalize',
    marginLeft: 10,
  },
});
