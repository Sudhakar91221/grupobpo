/* eslint-disable react-native/no-inline-styles */
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

class PhoneInputField extends React.Component {
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
      cca2 = 'PH';
      callingCode = '63';
    } else {
      cca2 = 'PH';
      callingCode = '63';
    }
    this.state = {
      cca2:
        props.values !== undefined ? props.values.country.toLowerCase() : 'PH',
      callingCode,
      pickerData: null,
      error: props.error,
      errorDisplay: undefined,
      // pickerData:null,
      // countryCode:props.values.country,
      inputValue: props.values !== undefined ? props.values.mobile : '',
      // initialCountry:props.values.country.toLowerCase()
      // selectedCountry:null
    };

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.onCountrySelect = this.onCountrySelect.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.setError = this.setError.bind(this);
    this.validateTheField = this.validateTheField.bind(this);
    this.onSubmitEditingField = this.onSubmitEditingField.bind(this);

    this.currentPageRef = {};
    this.setCountryPicker = ref => (this.countryPicker = ref);

    // if(global.country !== undefined) {

    //   this.state.selectedCountry = global.country
    //   if(this.currentPageRef.phone) {
    //     this.currentPageRef.phone.selectCountry(this.state.selectedCountry.cca2.toLowerCase());
    //   }

    // }
  }
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }

    if (this.currentPageRef.phone) {
      this.currentPageRef.phone.selectCountry(this.state.cca2);
      this.state.pickerData = this.currentPageRef.phone.getPickerData();
      // this.setState({pickerData: });
    }
  }

  onPressFlag() {
    // this.countryPicker.openModal();

    // console.log(this.currentPageRef)

    // this.setCountryPicker.openModal()
    // console.log(this.currentPageRef);
    // this.setState({visible: true});
    this.props.navigation.navigate('CountryList', {
      onCountrySelection: this.onCountrySelect,
    });
  }

  selectCountry(country) {
    // this.phone.selectCountry(country.iso2);
    this.currentPageRef.phone.selectCountry(
      this.state.selectedCountry.cca2.toLowerCase(),
    );
    // this.setState({cca2: country.cca2})
  }
  onCountrySelect = country => {
    console.log(country);
    this.currentPageRef.phone.selectCountry(country.cca2.toLowerCase());

    // this.setState={
    //   countryCode:country.cca2,
    //   country:country
    // }
  };

  onClose = () => {
    this.state.visible = false;
  };

  onOpen = () => {
    this.state.visible = true;
  };

  render() {
    const {item, theme} = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.flag, {backgroundColor: 'yellow'}]}
          onPress={this.props.editable === true ? this.onPressFlag : null}
        />
        {this.props.isCountryOnly ? (
          <Text style={{color: 'gray', fontSize: 16}}>Country*</Text>
        ) : (
          <Text style={{color: 'gray', fontSize: 16}}>Mobile Number</Text>
        )}
        <PhoneInput
          ref={ref => {
            this.currentPageRef.phone = ref;
          }}
          initialCountry={this.state.cca2.toLowerCase()}
          countryCode={this.state.countryCode}
          inputValue={this.state.inputValue}
          cca2={this.state.cca2.toLowerCase()}
          // selectCountry={this.state.cca2}
          onPressFlag={this.onPressFlag}
          onSubmitEditingField={this.onSubmitEditingField}
          validateTheField={this.validateTheField}
          editable={this.props.editable}
          item={item}
          setError={this.setError}
          isCountryOnly={this.props.isCountryOnly}
        />

        <View
          style={{
            backgroundColor:
              this.props.error === undefined || this.state.errorDisplay == '-1'
                ? 'gray'
                : 'rgb(213, 0, 0)',
            height: 2,
            width: '100%',
          }}
        />
        {this.state.errorDisplay !== '-1' && (
          <Text
            style={{
              fontSize: 12,
              color: 'rgb(213, 0, 0)',
            }}>
            {this.props.error}
          </Text>
        )}
        {/* </View> */}
      </View>
    );
  }

  onSubmitEditingField = () => {
    this.props.focusTheField(this.props.item.name);
  };
  validateTheField = () => {
    this.props.validateTheField(this.props.item.name, this.props.item.type);
  };
  setError = () => {
    if (this.props.error) {
      this.props.emptiesTheError('mobile');
      this.setState({errorDisplay: '-1'});
    }
    this.props.validateTheField(this.props.item.name, this.props.item.type);
  };
}

let styles = {
  container: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 0,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  flag: {
    paddingLeft: 0,
    paddingBottom: 0,
    height: 30,
    width: 100,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#cecece',
    backgroundColor: '#cecece',
    position: 'absolute',
  },
};

export default withTheme(PhoneInputField);
