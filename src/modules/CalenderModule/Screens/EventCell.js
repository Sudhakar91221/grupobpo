/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import {withTheme} from '../../../components/common/Theme/themeProvider';

class EventCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;
    const startTime = Moment(item.startTime, ['HH:mm:ss']).format('h:mm A');
    const endTime = Moment(item.endTime, ['HH:mm:ss']).format('h:mm A');

    return (
      <View style={{flex: 1}}>
        {this.props.item.isHeader === true ? (
          <View
            style={[
              styless.textVertical,
              {
                width: '100%',
                height: '100%',
                backgroundColor: '#EFEFF4',
              },
            ]}>
            <View style={{flex: 1}}>
              <Text
                style={[
                  theme.header,
                  {
                    textAlign: 'left',
                    color: theme.black,
                    fontSize: 18,
                    marginLeft: 10,
                  },
                ]}
                numberOfLines={1}>
                {this.props.item.name}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (item.flag === 1) {
                this.props.navigation.navigate('EventDetail', {
                  eventId: item.eventId,
                });
              }
            }}
            style={styles.item}>
            <View>
              <Text style={styles.itemHourText}>{startTime}</Text>

              <View
                style={{
                  borderColor: 'white',
                  borderWidth: 1,
                  width: 1,
                  height: 40,
                  alignSelf: 'center',
                }}
              />

              <Text
                style={[
                  styles.itemDurationText,
                  {position: 'absolute', bottom: 5},
                ]}>
                {endTime}
              </Text>
            </View>

            <View>
              <View
                style={{
                  height: 60,
                  paddingTop: 0,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <View
                  style={item.flag == 1 ? styles.dotText : styles.redDotText}
                />
                <View
                  style={{
                    borderColor: item.flag == 1 ? 'black' : 'red',
                    borderWidth: 1,
                    width: 1,
                    height: 40,
                    alignSelf: 'center',
                  }}
                />
                <View
                  style={item.flag == 1 ? styles.dotText : styles.redDotText}
                />
              </View>
            </View>

            <View>
              <Text style={styles.itemTitleText}>{item.title}</Text>
              {item.flag == 1 ? (
                <Text style={[styles.itemDurationText, {marginLeft: 15}]}>
                  {item.type}
                </Text>
              ) : (
                <Text style={styles.itemDurationText}>
                  {/* {getHoildayTypeStatusText(type)} */}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default withTheme(EventCell);

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  section: {
    backgroundColor: '#f0f4f7',
    color: '#79838a',
  },
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf0',
    flexDirection: 'row',
  },

  dotText: {
    color: 'black',
    fontSize: 80,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    // paddingTop:-10,
    backgroundColor: '#383C55',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  redDotText: {
    color: 'red',
    fontSize: 80,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    // paddingTop:-10,
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  verticalLine: {
    // color:'black',
    // width:2,
    // backgroundColor:'black',
    borderLeftWidth: 1,
    borderLeftColor: 'black',
  },
  redVerticalLine: {
    // color:'black',
    // width:2,
    // backgroundColor:'black',
    borderLeftWidth: 1,
    borderLeftColor: 'red',
  },
  itemHourText: {
    color: 'black',
    marginRight: 5,
  },
  itemDurationText: {
    color: 'black',
    // fontSize: 12,
    // marginTop: 10,
    marginRight: 5,
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  itemDetailText: {
    color: 'gray',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf0',
  },
  emptyItemText: {
    color: '#79838a',
    fontSize: 14,
  },
  nextToEach: {
    flex: 1,
    flexDirection: 'row',
  },
});
