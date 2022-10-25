/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, StyleSheet, Platform, Image} from 'react-native';

import MapView, {Marker} from 'react-native-maps';

export default class CheckinsMapScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => {
    return {
      // title: ' Filter',
      largeTitle: 'true',
      style: {
        marginTop: Platform.OS === 'ios' ? 0 : 24,
      },
      headerStyle: {
        backgroundColor: '#383C55',
      },
      titleStyle: {color: 'white'},
      headerTintColor: 'white',
    };
  };

  constructor(props) {
    super(props);
    let placeLocation = this.getCoordinates(
      this.props.navigation.state.params.checkinObject.placeLocation,
    );
    this.state = {
      latitude: placeLocation.latitude,
      longitude: placeLocation.longitude,
      isMapReady: false,
      checkinObject: this.props.navigation.state.params.checkinObject,
    };
  }

  getCoordinates(location) {
    const splitLocation = location.split(',');

    return {
      latitude: Number(splitLocation[0]),
      longitude: Number(splitLocation[1]),
    };
  }

  onMapLayout = () => {
    this.setState({isMapReady: true});
  };

  render() {
    const {params} = this.props.navigation.state;
    const checkinObject = params.checkinObject;

    let checkin = undefined;
    if (checkinObject.inLocation) {
      checkin = this.getCoordinates(checkinObject.inLocation);
    }
    let checkOut = undefined;
    if (checkinObject.outLocation) {
      checkOut = this.getCoordinates(checkinObject.outLocation);
    }

    let place = undefined;
    if (checkinObject.placeLocation) {
      const splitLocation = checkinObject.placeLocation.split(',');

      place = {
        latitude: Number(splitLocation[0]),
        longitude: Number(splitLocation[1]),
        title: checkinObject.placeName,
        descrition: checkinObject.placeName,
      };
    }

    return (
      <View style={styles.container}>
        <MapView
          style={{flex: 1}}
          zoomEnabled={true}
          zoomControlEnabled={true}
          region={{
            latitude: Number(this.state.latitude),
            longitude: Number(this.state.longitude),
            latitudeDelta: 0.0021,
            longitudeDelta: 0.0021,
          }}
          onMapReady={this.onMapLayout}
          loadingIndicatorColor="#343957"
          loadingEnabled={true}
          showsUserLocation={false}>
          {checkin && (
            <MapView.Marker
              coordinate={checkin}
              title={this.state.checkinObject.inTime}>
              <Image
                source={require('../../../assets/Checkin_icon.png')}
                style={{width: 60, height: 60}}
              />
            </MapView.Marker>
          )}
          {checkOut && (
            <MapView.Marker
              coordinate={checkOut}
              title={this.state.checkinObject.outTime}>
              <Image
                source={require('../../../assets/Checkout_icon.png')}
                style={{width: 60, height: 60}}
              />
            </MapView.Marker>
          )}

          {place && (
            <MapView.Marker
              coordinate={place}
              title={this.state.checkinObject.placeName}>
              <Image
                source={require('../../../asset/address.png')}
                style={{width: 35, height: 50, tintColor: 'red'}}
                tintColor={'red'}
                resizeMethod={'resize'}
              />
            </MapView.Marker>
          )}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
