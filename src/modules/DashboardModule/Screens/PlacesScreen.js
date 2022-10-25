/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export default class PlacesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: this.props.navigation.getParam('latitude', 0.0),
      longitude: this.props.navigation.getParam('longitude', 0.0),
      address: '',
    };
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            minLength={2} // minimum length of text to search
            autoFocus={true}
            returnKeyType={'search'} // Can be left out for default return key
            listViewDisplayed={false} // true/false/undefined
            fetchDetails={true}
            enablePoweredByContainer={true}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              this.setState({
                address: data.description,
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                title: data.structured_formatting.main_text,
              });
              this.props.navigation.state.params.getSelectedPlace(
                data.description,
                details.geometry.location,
                data.structured_formatting.main_text,
                details.id,
              );
              this.props.navigation.goBack();
            }}
            query={{
              key: 'AIzaSyDoaAE7APoAvrKR1ZrN-ffgtsVnAsKmQ0s',
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={300}
          />
        </View>
      </View>
    );
  }
}
PlacesScreen.navigationOptions = ({navigation, screenProps, params}) => {
  //To hide the NavigationBar from current Screen
  const {state, setParams, navigate} = navigation;
  const {theme} = screenProps;

  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
  };
};
