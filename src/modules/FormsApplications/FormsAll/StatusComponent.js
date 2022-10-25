/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import Moment from 'moment';
import {translate} from '../../../../App';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';

export default class ApplicationStatusComponent extends React.Component {
  render() {
    if (this.props.item === undefined) {
      return <ActivityIndicatorCustom />;
    }
    // const status =
    //   this.props.item && this.props.item.length >= 0
    //     ? this.props.item[0] !== undefined
    //       ? this.props.item[0].id
    //       : 0
    //     : 0;
    const status = this.props.item.length;
    let lables = this.props.labels;
    return (
      <View style={style.container}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <ImageBackground
              source={require('../../../asset/time-left.png')}
              resizeMode="contain"
              style={style.imageStyle}
              imageStyle={{tintColor: status >= 1 ? 'black' : '#cdcdcd'}}
            />
            <View style={style.textContainer}>
              <Text style={{color: status >= 1 ? 'black' : '#cdcdcd'}}>
                {' '}
                {translate(lables[0])}
              </Text>
              <Text
                style={{
                  color: status >= 1 ? 'black' : '#cdcdcd',
                  marginLeft: 5,
                  fontSize: 12,
                }}>
                {this.props.item.length > 0
                  ? this.props.item[0].addedOn != undefined
                    ? Moment.unix(this.props.item[0].addedOn).format(
                        'DD/MM/YYYY',
                      )
                    : '--/--/--'
                  : '--/--/--'}
              </Text>
            </View>
          </View>
          <View
            style={{width: 1, backgroundColor: '#cdcdcd', height: '100%'}}
          />

          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <ImageBackground
              source={require('../../../asset/hand-over-tablet.png')}
              resizeMode="contain"
              style={style.imageStyle}
              imageStyle={{tintColor: status >= 2 ? 'black' : '#cdcdcd'}}
            />
            <View style={style.textContainer}>
              <Text style={{color: status >= 2 ? 'black' : '#cdcdcd'}}>
                {' '}
                {translate(lables[1])}
              </Text>
              <Text
                style={{
                  color: status >= 2 ? 'black' : '#cdcdcd',
                  marginLeft: 5,
                  fontSize: 12,
                }}>
                {this.props.item.length > 1
                  ? this.props.item[1].addedOn != undefined
                    ? Moment.unix(this.props.item[1].addedOn).format(
                        'DD/mm/YYYY',
                      )
                    : '--/--/--'
                  : '--/--/--'}
              </Text>
            </View>
          </View>

          <View
            style={{width: 1, backgroundColor: '#cdcdcd', height: '100%'}}
          />

          <View style={{flex: 0.5, flexDirection: 'row'}}>
            <ImageBackground
              source={require('../../../asset/success.png')}
              resizeMode="contain"
              style={style.imageStyle}
              imageStyle={{tintColor: status >= 3 ? 'black' : '#cdcdcd'}}
            />
            <View style={style.textContainer}>
              <Text style={{color: status >= 3 ? 'black' : '#cdcdcd'}}>
                {' '}
                {translate(lables[2])}
              </Text>
              <Text
                style={{
                  color: status >= 3 ? 'black' : '#cdcdcd',
                  marginLeft: 5,
                  fontSize: 12,
                }}>
                {this.props.item.length > 2
                  ? this.props.item[2].addedOn != undefined
                    ? Moment.unix(this.props.item[2].addedOn).format(
                        'DD/mm/YYYY',
                      )
                    : '--/--/--'
                  : '--/--/--'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const style = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#cdcdcd',
    flex: 1,
    margin: 5,
    borderRadius: 5,
    marginBottom: 20,
    height: 60,
  },
  dateText: {
    fontSize: 12,
    marginLeft: 5,
  },
  imageStyle: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    margin: 5,
    alignSelf: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
});
