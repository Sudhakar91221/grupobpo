/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getBankSelector,
  updateBankSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {getBank, updateBank} from '../Actions/MemberActions';
import {GET_BANK, UPDATE_BANK} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';

class EditBank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.currentPageRef = {};
    this.currentFieldsRef = {};
    this.onSubmitButtonTapped = this.onSubmitButtonTapped.bind(this);
  }

  componentWillMount() {
    this.callGetBank();
  }

  callGetBank() {
    var input = {
      employeeId: this.props.navigation.state.params.item.employeeId,
      userId: this.props.user.userId,
      request: GET_BANK,
    };
    this.props.getBank(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_BANK ||
        this.props.error.request == UPDATE_BANK)
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

    //get bank
    if (this.props.api === GET_BANK) {
      if (this.props.error !== null && this.props.api === GET_BANK) {
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

      if (!this.props.error && this.props.api === GET_BANK) {
        if (this.props.bankModel !== prevProps.bankModel) {
          let formData = {
            fields: [
              {
                name: 'bankName',
                type: '1',
                lable: 'Bank Name',
                rules: 'required',
                value: this.props.bankModel.bank,
              },
              {
                name: 'accountType',
                type: '6',
                lable: 'Account Type',
                option: {
                  '0': 'Saving',
                  '1': 'Current',
                },
                value: this.props.bankModel.type,
              },
              {
                name: 'bankAddress',
                type: '1',
                lable: 'Bank Address',
                rules: 'required',
                value: this.props.bankModel.address,
              },
              {
                name: 'accountNumber',
                type: '10',
                lable: 'Account Number',
                rules: 'required',
                value: this.props.bankModel.account,
              },
              {
                name: 'ifsc',
                type: '1',
                lable: 'IFSC Code',
                value: this.props.bankModel.ifscCode,
              },
              {
                name: 'swift',
                type: '1',
                lable: 'Swift Code',
                value: this.props.bankModel.swiftCode,
              },
            ],
          };

          this.setState({
            formData: formData,
            bankModel: this.props.bankModel,
          });
        }
      }
    }

    //update job
    if (this.props.api === UPDATE_BANK) {
      if (this.props.error !== null && this.props.api === UPDATE_BANK) {
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

      if (this.props.api === UPDATE_BANK) {
        if (!this.props.error && this.props.api === UPDATE_BANK) {
          if (this.props.bankSuccess !== prevProps.bankSuccess) {
            this.props.navigation.navigate('Family');
          }
        }
      }
    }
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.state.formData === undefined ? (
            <ActivityIndicatorCustom />
          ) : (
            <View style={{flex: 1}}>
              <InputForm
                onRef={ref => {
                  this.currentPageRef['bank'] = ref;
                }}
                item={this.state.formData}
                blockModel={this.state.formData}
                formId={'0'}
                navigation={this.props.navigation}
                editable={true}
                fromDetail={true}
                hideBottomButton={true}
                isRequireHeader={false}
              />
              <BottomButton
                style={{height: 50, borderRadius: 50, margin: 10, width: '50%'}}
                title={translate('save')}
                action={() => this.onSubmitButtonTapped()}
              />
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  onSubmitButtonTapped() {
    let bankName =
      this.currentPageRef.bank.currentFieldsRef.bankName.state.bankName ===
      undefined
        ? this.currentPageRef.bank.currentFieldsRef.bankName.props.item.value
        : this.currentPageRef.bank.currentFieldsRef.bankName.state.bankName;
    let bankAddress =
      this.currentPageRef.bank.currentFieldsRef.bankAddress.state
        .bankAddress === undefined
        ? this.currentPageRef.bank.currentFieldsRef.bankAddress.props.item.value
        : this.currentPageRef.bank.currentFieldsRef.bankAddress.state
            .bankAddress;
    let accountNumber =
      this.currentPageRef.bank.currentFieldsRef.accountNumber.state
        .accountNumber === undefined
        ? this.currentPageRef.bank.currentFieldsRef.accountNumber.props.item
            .value
        : this.currentPageRef.bank.currentFieldsRef.accountNumber.state
            .accountNumber;
    let ifscCode =
      this.currentPageRef.bank.currentFieldsRef.ifsc.state.ifsc === undefined
        ? this.currentPageRef.bank.currentFieldsRef.ifsc.props.item.value
        : this.currentPageRef.bank.currentFieldsRef.ifsc.state.ifsc;
    let swiftCode =
      this.currentPageRef.bank.currentFieldsRef.swift.state.swift === undefined
        ? this.currentPageRef.bank.currentFieldsRef.swift.props.item.value
        : this.currentPageRef.bank.currentFieldsRef.swift.state.swift;
    let accountType =
      this.currentPageRef.bank.state.newInputDict === undefined
        ? this.state.bankModel.type
        : this.currentPageRef.bank.state.newInputDict.accountType;

    var input = {
      employeeId: this.props.navigation.state.params.item.employeeId,
      bank: bankName,
      address: bankAddress,
      account: accountNumber,
      type: accountType,
      ifscCode: ifscCode,
      swiftCode: swiftCode,
      userId: this.props.user.userId,
    };
    this.props.updateBank(input);
  }
}
const EditBankNew = withTheme(EditBank);
function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    bankModel: getBankSelector(state.MemberReducer),
    bankSuccess: updateBankSelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getBank: input => dispatch(getBank(input)),
    updateBank: input => dispatch(updateBank(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBankNew);
