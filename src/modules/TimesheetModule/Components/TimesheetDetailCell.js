/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, Image, Modal} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import CardView from 'react-native-cardview';
import moment from 'moment';
import TimesheetDayStatus from './TimesheetDayStatus';
import DayStatus from './DayStatus';

class TimesheetDetailCell extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
    };
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;

    let momentObj = moment(item.date, 'DD-MM-YYYY');
    let date = moment(momentObj).format('DD MMM YYYY');

    return (
      <View style={{margin: 2, flex: 1}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showInfo}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderColor: 'gray',
                  borderRadius: 5,
                  borderWidth: 1,
                  padding: 5,
                  width: '70%',
                }}>
                {this.renderDialogView()}
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            style={[
              styless.textVertical,
              {
                width: '100%',
                height: '100%',
                padding: 5,
              },
            ]}
            onPress={() =>
              this.props.navigation.navigate('DailyTimesheet', {
                data: this.props.totalData.data,
                totalData: this.props.totalData,
                index: this.props.index,
              })
            }>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  theme.header,
                  {
                    color:
                      item.inTime !== '-' && item.outTime === '-'
                        ? theme.redText
                        : theme.black,
                    fontWeight: 'bold',
                    fontSize: 18,
                  },
                ]}
                numberOfLines={1}>
                {date}
              </Text>
              <View style={{flex: 1, marginRight: 5}}>
                <Text
                  style={[
                    theme.detail,
                    {
                      textAlign: 'right',
                      color: theme.disableButtonColor,
                      fontSize: 18,
                    },
                  ]}
                  numberOfLines={1}>
                  {item.totalTimes}
                </Text>
              </View>
              {item.totalTimes === '0.00' ? null : (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => this.setState({showInfo: true})}>
                    <Image
                      source={require('../../../assets/ic_info.png')}
                      style={{
                        width: 23,
                        height: 23,
                        marginRight: 5,
                        marginTop: 5,
                        tintColor: 'gray',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={{flexDirection: 'row'}}>
              {item.inTime === '-' && item.outTime === '-' ? (
                <Text
                  style={[
                    theme.detail,
                    {textAlign: 'right', color: theme.disableButtonColor},
                  ]}
                  numberOfLines={1}>
                  {translate('not_available')}
                </Text>
              ) : (
                <View style={{flex: 1, marginRight: 5, flexDirection: 'row'}}>
                  <Text
                    style={[
                      theme.detail,
                      {
                        flex: 0.5,
                        color: theme.greenText,
                        textTransform: 'uppercase',
                        alignSelf: 'center',
                      },
                    ]}
                    numberOfLines={1}>
                    {item.inTime}
                  </Text>
                  <Text
                    style={[
                      theme.detail,
                      {
                        alignSelf: 'center',
                        color: theme.disableButtonColor,
                        fontSize: 18,
                        marginRight: 2,
                      },
                    ]}
                    numberOfLines={1}>
                    -
                  </Text>
                  {item.outTime !== '-' ? (
                    <Text
                      style={[
                        theme.detail,
                        {
                          flex: 0.5,
                          color: theme.redText,
                          textTransform: 'uppercase',
                          alignSelf: 'center',
                        },
                      ]}
                      numberOfLines={1}>
                      {item.outTime}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        theme.detail,
                        {
                          flex: 0.5,
                          color: theme.disableButtonColor,
                          textTransform: 'uppercase',
                          alignSelf: 'center',
                        },
                      ]}
                      numberOfLines={1}>
                      N/A
                    </Text>
                  )}
                </View>
              )}

              <View style={{flex: 1, marginRight: 5}}>
                <Text
                  style={[
                    theme.detail,
                    {
                      textAlign: 'right',
                      color: theme.disableButtonColor,
                      marginRight: item.totalTimes === '0.00' ? 0 : 30,
                    },
                  ]}
                  numberOfLines={1}>
                  {translate('hrs')}
                </Text>
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                <TimesheetDayStatus item={this.props.item.dayFlag} />
              </View>
              <View style={{flex: 0.5}}>
                <DayStatus
                  item={this.props.item.dayStatus}
                  timesheetStatus={this.props.timesheetStatus}
                />
              </View>
            </View>
          </TouchableOpacity>
        </CardView>
      </View>
    );
  }
  renderDialogView() {
    const {theme} = this.props;
    const {item} = this.props;

    let regulerTime;
    let overTime;
    let nightOT;
    let totalTimes;
    let nightTime;
    if (item.regularTime === '0' || item.regularTime === '0.00') {
      regulerTime = '0.00 Hrs';
    } else {
      regulerTime = item.regularTime + ' Hrs';
    }
    if (item.overTime === '0' || item.overTime === '0.00') {
      overTime = '0.00 Hrs';
    } else {
      overTime = item.overTime + ' Hrs';
    }
    if (item.nightOT === '0' || item.nightOT === '0.00') {
      nightOT = '0.00 Hrs';
    } else {
      nightOT = item.nightOT + ' Hrs';
    }
    if (item.totalTimes === '0' || item.totalTimes === '0.00') {
      totalTimes = '0.00 Hrs';
    } else {
      totalTimes = item.totalTimes + ' Hrs';
    }
    if (item.nighttime === '0' || item.nighttime === '0.00') {
      nightTime = '0.00 Hrs';
    } else {
      nightTime = item.nighttime + ' Hrs';
    }

    return (
      <View style={{width: '100%'}}>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                flex: 1,
                textAlign: 'center',
              },
            ]}
            numberOfLines={1}>
            {translate('actual')}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                flex: 1,
              },
            ]}
            numberOfLines={1}>
            : {totalTimes}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                flex: 1,
                textAlign: 'center',
              },
            ]}
            numberOfLines={1}>
            {translate('regular')}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                flex: 1,
              },
            ]}
            numberOfLines={1}>
            : {regulerTime}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                flex: 1,
                textAlign: 'center',
              },
            ]}
            numberOfLines={1}>
            {translate('overtime')}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                flex: 1,
              },
            ]}
            numberOfLines={1}>
            : {overTime}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                flex: 1,
                textTransform: 'none',
                textAlign: 'center',
              },
            ]}
            numberOfLines={1}>
            {translate('nightOT')}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                flex: 1,
              },
            ]}
            numberOfLines={1}>
            : {nightOT}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                flex: 1,
                textAlign: 'center',
              },
            ]}
            numberOfLines={1}>
            {translate('night')}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                flex: 1,
              },
            ]}
            numberOfLines={1}>
            : {nightTime}
          </Text>
        </View>
        <View
          style={{width: '100%', height: 1, backgroundColor: 'lightgray'}}
        />
        <TouchableOpacity
          onPress={() => {
            this.setState({showInfo: false});
          }}>
          <Text
            style={{
              color: theme.primaryColor,
              fontWeight: 'bold',
              fontSize: 18,
              alignSelf: 'center',
              marginBottom: 10,
              textTransform: 'uppercase',
              marginTop: 10,
            }}>
            OK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withTheme(TimesheetDetailCell);
