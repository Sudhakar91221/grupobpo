import React from 'react';
import {View, Text} from 'react-native';
import PhoneInput from './PhoneInput/index';
import ModalPickerImage from './ModalPickerImage';
import {withTheme} from '../../../../components/common/Theme/themeProvider';
import Divider from '../../../../components/views/Divider';
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info';

import {Component, StyleSheet, StatusBarIOS, PixelRatio} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
const NORTH_AMERICA = ['CA', 'MX', 'US'];
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../../../../components/views/AndroidBackButton';

class CountryList extends React.Component {
  constructor(props) {
    super(props);

    let userLocaleCountryCode = DeviceInfo.getCodename();
    // const userCountryData = getAllCountries
    //   .filter(country => NORTH_AMERICA.includes(country.cca2))
    //   .filter(country => country.cca2 === userLocaleCountryCode)
    //   .pop();
    let callingCode = null;
    let cca2 = userLocaleCountryCode;
    if (!cca2) {
      cca2 = 'US';
      callingCode = '1';
    } else {
      callingCode = DeviceInfo.callingCode;
    }
    this.state = {
      cca2,
      callingCode,
      pickerData: null,
    };

    this.selectCountry = this.selectCountry.bind(this);
    this.onCountrySelect = this.onCountrySelect.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);

    this.setCountryPicker = ref => (this.countryPicker = ref);
  }
  componentDidMount() {
    handleAndroidBackButton(this.handleGoBack);
  }

  componentWillUnmount() {
    removeAndroidBackButtonHandler(this.handleGoBack);
  }

  handleGoBack() {
    console.log('handle go back called');
    this.props.navigation.goBack();
    return true;
  }

  onPressFlag() {
    // this.countryPicker.openModal();

    // console.log(this.currentPageRef)

    // this.setCountryPicker.openModal()
    console.log(this.currentPageRef);
    this.setState({visible: true});
  }

  selectCountry(country) {
    console.log(this.currentPageRef);

    // this.phone.selectCountry(country.iso2);
    // this.currentPageRef.phone.selectCountry(country.cca2.toLowerCase());
    // this.setState({cca2: country.cca2})
  }
  onCountrySelect = country => {
    console.log(this.currentPageRef);

    console.log(country);
    // this.props.navigation.goBack('Register')
    this.props.navigation.state.params.onCountrySelection(country);
    this.props.navigation.goBack(null);
  };

  onClose = () => {
    // this.state.visible = false
    this.handleGoBack();
  };

  onOpen = () => {
    // this.state.visible = true
  };

  render() {
    const {item, theme} = this.props;
    return (
      <View style={styles.container}>
        <CountryPicker
          ref={this.setCountryPicker}
          onChange={value => {
            this.setState({cca2: value.cca2, callingCode: value.callingCode});
          }}
          // renderFlagButton={this.state.country.flag}
          withFilter
          cca2={this.state.cca2}
          translation="eng"
          onSelect={this.onCountrySelect}
          // onChange={value => this.selectCountry(value)}
          // cca2={this.state.cca2}
          withCloseButton={false}
          visible={true}
          placeholder=""
          transparent
          autoFocusFilter
          withCountryNameButton={true}
          onClose={this.onClose}
          onOpen={this.onOpen}
          onRef={onRef => {
            this.currentPageRef.phone = onRef;
          }}>
          <View />
        </CountryPicker>
      </View>
    );
  }

  onSubmitEditingField = () => {
    this.props.focusTheField(this.props.item.name);
  };
  validateTheField = () => {
    this.props.validateTheField(this.props.item.name);
  };
}

let styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  flag: {
    height: 30,
    width: 40,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#cecece',
    backgroundColor: '#cecece',
  },
};

export default withTheme(CountryList);
