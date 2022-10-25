/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text, ScrollView} from 'react-native';
import {withTheme} from 'react-native-paper';
import {getAddress, updateAddress} from '../Actions/MemberActions';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  getAddressSelector,
  isLoadingSelector,
  apiSelector,
  errorSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {GET_ADDRESS, UPDATE_ADDRESS} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {BottomButton} from '../../../components/views/Button';
import {styless} from '../../../components/common/Styles';
import {translate} from '../../../../App';
import Icon from 'react-native-vector-icons/Ionicons';

class EditAddress extends React.Component {
  constructor(props) {
    super(props);

    let relationshipOptions = {
      '1': 'Father',
      '2': 'Mother',
      '3': 'Brother',
      '4': 'Sister',
      '5': 'Husband',
      '6': 'Wife',
      '7': 'Son',
      '8': 'Daughter',
      '9': 'Friend',
      '10': 'Other',
    };

    this.state = {
      sameSelected: false,
      relationshipOptions: relationshipOptions,
    };
    this.currentFieldsRef = {};
    this.currentPageRef = {};
    this.onCheckboxClicked = this.onCheckboxClicked.bind(this);
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
  }

  componentWillMount() {
    this.callGetAddress();
  }

  callGetAddress() {
    var input = {
      employeeId: this.props.navigation.state.params.item.employeeId,
      userId: this.props.user.userId,
      request: GET_ADDRESS,
    };
    this.props.getAddress(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_ADDRESS ||
        this.props.error.request == UPDATE_ADDRESS)
    ) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                //this.props.navigation.navigate('Login');
                console.log('OK Pressed');
              },
            },
          ],

          {cancelable: false},
        );
      }
    }

    //get address
    if (this.props.api === GET_ADDRESS) {
      if (this.props.error !== null && this.props.api === GET_ADDRESS) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  console.log('OK Pressed');
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === GET_ADDRESS) {
        if (this.props.addressModel !== prevProps.addressModel) {
          let addressformData = {
            fields: [
              {
                name: 'line1',
                type: '1',
                lable: 'House Number and Street',
                rules: 'required',
                value: this.props.addressModel.tempAddress.line1,
              },
              {
                name: 'line2',
                type: '1',
                lable: 'Village',
                rules: 'required',
                value: this.props.addressModel.tempAddress.line2,
              },
              {
                name: 'line3',
                type: '1',
                lable: 'Barangay',
                rules: 'required',
                value: this.props.addressModel.tempAddress.line3,
              },
              {
                name: 'zipCode',
                type: '10',
                lable: 'Zip Code',
                rules: 'required',
                value: this.props.addressModel.tempAddress.zipcode,
              },
              {
                name: 'city',
                type: '1',
                lable: 'City',
                rules: 'required',
                value: this.props.addressModel.tempAddress.city,
              },
              {
                name: 'state',
                type: '1',
                lable: 'State',
                rules: 'required',
                value: this.props.addressModel.tempAddress.state,
              },
              {
                name: '',
                type: '18',
                lable: 'Country',
                id: '',
                rules: 'required',
                isCountryOnly: true,
                childFields: [
                  {
                    name: 'country',
                    type: '10',
                    lable: 'Country',
                    option: '',
                    rules: 'required',
                    value: this.props.addressModel.tempAddress.country,
                  },
                ],
              },
            ],
          };

          let permanentAddressData = {
            fields: [
              {
                name: 'line1',
                type: '1',
                lable: 'House Number and Street',
                rules: 'required',
                value: this.props.addressModel.permAddress.line1,
              },
              {
                name: 'line2',
                type: '1',
                lable: 'Village',
                rules: 'required',
                value: this.props.addressModel.permAddress.line2,
              },
              {
                name: 'line3',
                type: '1',
                lable: 'Barangay',
                rules: 'required',
                value: this.props.addressModel.permAddress.line3,
              },
              {
                name: 'zipCode',
                type: '10',
                lable: 'Zip Code',
                rules: 'required',
                value: this.props.addressModel.permAddress.zipcode,
              },
              {
                name: 'city',
                type: '1',
                lable: 'City',
                rules: 'required',
                value: this.props.addressModel.permAddress.city,
              },
              {
                name: 'state',
                type: '1',
                lable: 'State',
                rules: 'required',
                value: this.props.addressModel.permAddress.state,
              },
              {
                name: '',
                type: '18',
                lable: 'Country',
                id: '',
                rules: 'required',
                isCountryOnly: true,
                childFields: [
                  {
                    name: 'country',
                    type: '10',
                    lable: 'Country',
                    option: '',
                    rules: 'required',
                    value: this.props.addressModel.permAddress.country,
                  },
                ],
              },
            ],
          };

          let emergencyFormData = {
            fields: [
              {
                name: 'contactPerson',
                type: '1',
                lable: 'Contact Person',
                rules: 'required',
                value: this.props.addressModel.emergencyInfo.name,
              },
              {
                name: 'relationship',
                type: '4',
                lable: 'Relationship',
                rules: 'required',
                childFields: {
                  option: this.state.relationshipOptions,
                },
                value: this.props.addressModel.emergencyInfo.relationship,
              },
              {
                name: 'phone1',
                type: '10',
                lable: 'Phone 1',
                rules: 'required',
                value: this.props.addressModel.emergencyInfo.phone1,
              },
              {
                name: 'phone2',
                type: '10',
                lable: 'Phone 2',
                rules: 'required',
                value: this.props.addressModel.emergencyInfo.phone2,
              },
              {
                name: 'address',
                type: '1',
                lable: 'Address',
                rules: 'required',
                value: this.props.addressModel.emergencyInfo.address,
              },
              {
                name: 'remark',
                type: '1',
                lable: 'Remark',
                rules: 'required',
                value: this.props.addressModel.emergencyInfo.remark,
              },
            ],
          };

          this.setState({
            addresModel: this.props.addressModel,
            refreshing: false,
            addressformData: addressformData,
            permanentAddressData: permanentAddressData,
            emergencyFormData: emergencyFormData,
          });
        }
      }
    }

    //edit address
    if (!this.props.error && this.props.api === UPDATE_ADDRESS) {
      if (this.props.addressSuccess !== prevProps.addressSuccess) {
        this.props.navigation.navigate('Job');
      }
    }
  }

  render() {
    const {theme} = this.props;
    if (this.state.addressformData === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View style={{flex: 1}}>
            <InputForm
              onRef={ref => {
                this.currentPageRef['tempAddress'] = ref;
              }}
              item={this.state.addressformData}
              blockModel={this.state.addressformData}
              formId={'0'}
              navigation={this.props.navigation}
              editable={true}
              fromDetail={true}
              hideBottomButton={true}
              isRequireHeader={false}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: theme.black,
                fontSize: 18,
                paddingLeft: 15,
                flex: 1,
              }}>
              Permanent Address
            </Text>

            <Icon
              name={
                this.state.sameSelected === true
                  ? 'ios-checkbox'
                  : 'ios-square-outline'
              }
              color="#383C55"
              size={30}
              onPress={() => this.onCheckboxClicked()}
            />
            <Text
              style={{
                color: theme.black,
                fontSize: 16,
                paddingLeft: 15,
                flex: 1,
                alignSelf: 'center',
              }}>
              {translate('sameAsAbove')}
            </Text>
          </View>

          <View style={{flex: 1}}>
            <InputForm
              onRef={ref => {
                this.currentPageRef['permAddress'] = ref;
              }}
              item={this.state.permanentAddressData}
              blockModel={this.state.permanentAddressData}
              formId={'0'}
              navigation={this.props.navigation}
              editable={true}
              fromDetail={true}
              hideBottomButton={true}
              isRequireHeader={false}
            />
          </View>
          <Text style={{color: theme.black, fontSize: 18, paddingLeft: 15}}>
            Emergency Contact Info
          </Text>
          <View style={{flex: 1}}>
            <InputForm
              onRef={ref => {
                this.currentPageRef['emergencyContact'] = ref;
              }}
              item={this.state.emergencyFormData}
              blockModel={this.state.emergencyFormData}
              formId={'0'}
              navigation={this.props.navigation}
              editable={true}
              fromDetail={true}
              hideBottomButton={true}
              isRequireHeader={false}
            />
          </View>
        </ScrollView>
        <View
          style={{
            paddingLeft: '25%',
            paddingRight: '25%',
            paddingBottom: 10,
            paddingTop: 10,
          }}>
          <BottomButton
            style={styless.bottomButton}
            title={translate('save')}
            action={
              !this.state.submitLoader && !this.state.submitGray
                ? this.onSubmitTapped
                : null
            }
            isLoader={this.state.submitLoader}
            isGray={this.state.submitGray}
          />
        </View>
      </View>
    );
  }

  onSubmitTapped() {
    //temporary address
    let line1 =
      this.currentPageRef.tempAddress.currentFieldsRef.line1.state.line1 ===
      undefined
        ? this.currentPageRef.tempAddress.currentFieldsRef.line1.props.values
        : this.currentPageRef.tempAddress.currentFieldsRef.line1.state.line1;
    let line2 =
      this.currentPageRef.tempAddress.currentFieldsRef.line2.state.line2 ===
      undefined
        ? this.currentPageRef.tempAddress.currentFieldsRef.line2.props.values
        : this.currentPageRef.tempAddress.currentFieldsRef.line2.state.line2;
    let line3 =
      this.currentPageRef.tempAddress.currentFieldsRef.line3.state.line3 ===
      undefined
        ? this.currentPageRef.tempAddress.currentFieldsRef.line3.props.values
        : this.currentPageRef.tempAddress.currentFieldsRef.line3.state.line3;
    let zip =
      this.currentPageRef.tempAddress.currentFieldsRef.zipCode.state.zipCode ===
      undefined
        ? this.currentPageRef.tempAddress.currentFieldsRef.zipCode.props.values
        : this.currentPageRef.tempAddress.currentFieldsRef.zipCode.state
            .zipCode;
    let city =
      this.currentPageRef.tempAddress.currentFieldsRef.city.state.city ===
      undefined
        ? this.currentPageRef.tempAddress.currentFieldsRef.city.props.values
        : this.currentPageRef.tempAddress.currentFieldsRef.city.state.city;
    let state =
      this.currentPageRef.tempAddress.currentFieldsRef.state.state.state ===
      undefined
        ? this.currentPageRef.tempAddress.currentFieldsRef.state.props.values
        : this.currentPageRef.tempAddress.currentFieldsRef.state.state.state;
    let country = this.currentPageRef.tempAddress.currentFieldsRef.mobile
      .currentPageRef.phone.state.countryCode;

    let tempAddressObj = {};
    tempAddressObj['line1'] = line1;
    tempAddressObj['line2'] = line2;
    tempAddressObj['line3'] = line3;
    tempAddressObj['zipcode'] = zip;
    tempAddressObj['city'] = city;
    tempAddressObj['state'] = state;
    tempAddressObj['country'] = country;
    let tempAddressArray = [];
    tempAddressArray.push(tempAddressObj);

    //permanent address
    let permAddressObj = {},
      permAddressArray = [];
    if (this.state.sameSelected === true) {
      permAddressArray = tempAddressArray;
    } else {
      let line1 =
        this.currentPageRef.permAddress.currentFieldsRef.line1.state.line1 ===
        undefined
          ? this.currentPageRef.permAddress.currentFieldsRef.line1.props.values
          : this.currentPageRef.permAddress.currentFieldsRef.line1.state.line1;
      let line2 =
        this.currentPageRef.permAddress.currentFieldsRef.line2.state.line2 ===
        undefined
          ? this.currentPageRef.permAddress.currentFieldsRef.line2.props.values
          : this.currentPageRef.permAddress.currentFieldsRef.line2.state.line2;
      let line3 =
        this.currentPageRef.permAddress.currentFieldsRef.line3.state.line3 ===
        undefined
          ? this.currentPageRef.permAddress.currentFieldsRef.line3.props.values
          : this.currentPageRef.permAddress.currentFieldsRef.line3.state.line3;
      let zip =
        this.currentPageRef.permAddress.currentFieldsRef.zipCode.state
          .zipCode === undefined
          ? this.currentPageRef.permAddress.currentFieldsRef.zipCode.props
              .values
          : this.currentPageRef.permAddress.currentFieldsRef.zipCode.state
              .zipCode;
      let city =
        this.currentPageRef.permAddress.currentFieldsRef.city.state.city ===
        undefined
          ? this.currentPageRef.permAddress.currentFieldsRef.city.props.values
          : this.currentPageRef.permAddress.currentFieldsRef.city.state.city;
      let state =
        this.currentPageRef.permAddress.currentFieldsRef.state.state.state ===
        undefined
          ? this.currentPageRef.permAddress.currentFieldsRef.state.props.values
          : this.currentPageRef.permAddress.currentFieldsRef.state.state.state;
      let country = this.currentPageRef.permAddress.currentFieldsRef.mobile
        .currentPageRef.phone.state.countryCode;

      permAddressObj['line1'] = line1;
      permAddressObj['line2'] = line2;
      permAddressObj['line3'] = line3;
      permAddressObj['zipcode'] = zip;
      permAddressObj['city'] = city;
      permAddressObj['state'] = state;
      permAddressObj['country'] = country;
      let permAddressArray = [];
      permAddressArray.push(permAddressObj);
    }

    //emergency contact info
    let contactPerson =
      this.currentPageRef.emergencyContact.currentFieldsRef.contactPerson.state
        .contactPerson === undefined
        ? this.currentPageRef.emergencyContact.currentFieldsRef.contactPerson
            .props.values
        : this.currentPageRef.emergencyContact.currentFieldsRef.contactPerson
            .state.contactPerson;
    let phone1 =
      this.currentPageRef.emergencyContact.currentFieldsRef.phone1.state
        .phone1 === undefined
        ? this.currentPageRef.emergencyContact.currentFieldsRef.phone1.props
            .values
        : this.currentPageRef.emergencyContact.currentFieldsRef.phone1.state
            .phone1;
    let phone2 =
      this.currentPageRef.emergencyContact.currentFieldsRef.phone2.state
        .phone2 === undefined
        ? this.currentPageRef.emergencyContact.currentFieldsRef.phone2.props
            .values
        : this.currentPageRef.emergencyContact.currentFieldsRef.phone2.state
            .phone2;
    let address =
      this.currentPageRef.emergencyContact.currentFieldsRef.address.state
        .address === undefined
        ? this.currentPageRef.emergencyContact.currentFieldsRef.address.props
            .values
        : this.currentPageRef.emergencyContact.currentFieldsRef.address.state
            .address;
    let remark =
      this.currentPageRef.emergencyContact.currentFieldsRef.remark.state
        .remark === undefined
        ? this.currentPageRef.emergencyContact.currentFieldsRef.remark.props
            .values
        : this.currentPageRef.emergencyContact.currentFieldsRef.remark.state
            .remark;
    let relationship =
      this.currentPageRef.emergencyContact.currentFieldsRef.relationship.state
        .value === undefined
        ? this.currentPageRef.emergencyContact.currentFieldsRef.relationship
            .props.value
        : this.currentPageRef.emergencyContact.currentFieldsRef.relationship
            .state.value;

    let emergencyObj = {},
      emergencyArray = [];
    emergencyObj['name'] = contactPerson;
    emergencyObj['relationship'] = relationship;
    emergencyObj['phone1'] = phone1;
    emergencyObj['phone2'] = phone2;
    emergencyObj['address'] = address;
    emergencyObj['remark'] = remark;

    emergencyArray.push(emergencyObj);

    var input = {
      employeeId: this.props.navigation.state.params.item.employeeId,
      userType: this.props.user.userType,
      userId: this.props.user.userId,
      tempAddress: tempAddressArray,
      permAddress: permAddressArray,
      emergencyInfo: emergencyArray,
      request: UPDATE_ADDRESS,
    };
    this.props.updateAddress(input);
  }

  onCheckboxClicked() {
    if (this.state.sameSelected === false) {
      let line1 =
        this.currentPageRef.tempAddress.currentFieldsRef.line1.state.line1 ===
        undefined
          ? this.currentPageRef.tempAddress.currentFieldsRef.line1.props.values
          : this.currentPageRef.tempAddress.currentFieldsRef.line1.state.line1;
      let line2 =
        this.currentPageRef.tempAddress.currentFieldsRef.line2.state.line2 ===
        undefined
          ? this.currentPageRef.tempAddress.currentFieldsRef.line2.props.values
          : this.currentPageRef.tempAddress.currentFieldsRef.line2.state.line2;
      let line3 =
        this.currentPageRef.tempAddress.currentFieldsRef.line3.state.line3 ===
        undefined
          ? this.currentPageRef.tempAddress.currentFieldsRef.line3.props.values
          : this.currentPageRef.tempAddress.currentFieldsRef.line3.state.line3;
      let zip =
        this.currentPageRef.tempAddress.currentFieldsRef.zipCode.state
          .zipCode === undefined
          ? this.currentPageRef.tempAddress.currentFieldsRef.zipCode.props
              .values
          : this.currentPageRef.tempAddress.currentFieldsRef.zipCode.state
              .zipCode;
      let city =
        this.currentPageRef.tempAddress.currentFieldsRef.city.state.city ===
        undefined
          ? this.currentPageRef.tempAddress.currentFieldsRef.city.props.values
          : this.currentPageRef.tempAddress.currentFieldsRef.city.state.city;
      let state =
        this.currentPageRef.tempAddress.currentFieldsRef.state.state.state ===
        undefined
          ? this.currentPageRef.tempAddress.currentFieldsRef.state.props.values
          : this.currentPageRef.tempAddress.currentFieldsRef.state.state.state;
      let country = this.currentPageRef.tempAddress.currentFieldsRef.mobile
        .currentPageRef.phone.state.countryCode;
      let permanentAddressData = {
        fields: [
          {
            name: 'line1',
            type: '1',
            lable: 'House Number and Street',
            rules: 'required',
            value: line1,
          },
          {
            name: 'line2',
            type: '1',
            lable: 'Village',
            rules: 'required',
            value: line2,
          },
          {
            name: 'line3',
            type: '1',
            lable: 'Barangay',
            rules: 'required',
            value: line3,
          },
          {
            name: 'zipCode',
            type: '10',
            lable: 'Zip Code',
            rules: 'required',
            value: zip,
          },
          {
            name: 'city',
            type: '1',
            lable: 'City',
            rules: 'required',
            value: city,
          },
          {
            name: 'state',
            type: '1',
            lable: 'State',
            rules: 'required',
            value: state,
          },
          {
            name: '',
            type: '18',
            lable: 'Country',
            id: '',
            rules: 'required',
            isCountryOnly: true,
            childFields: [
              {
                name: 'country',
                type: '10',
                lable: 'Country',
                option: '',
                rules: 'required',
                value: country,
              },
            ],
          },
        ],
      };
      this.setState({
        sameSelected: true,
        permanentAddressData: permanentAddressData,
      });
    } else {
      this.setState({
        sameSelected: false,
      });
    }
  }
}

const EditAddressNew = withTheme(EditAddress);
function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    addressModel: getAddressSelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateAddress: input => dispatch(updateAddress(input)),
    getAddress: input => dispatch(getAddress(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAddressNew);
