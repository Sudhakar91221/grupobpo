/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getSalarySelector,
  updateSalarySelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {getSalary, updateSalary} from '../Actions/MemberActions';
import {GET_SALARY, UPDATE_SALARY} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';

class EditSalary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.currentPageRef = {};
    this.currentFieldsRef = {};
    this.onSubmitButtonTapped = this.onSubmitButtonTapped.bind(this);
  }

  componentWillMount() {
    this.callGetSalary();
  }

  callGetSalary() {
    var input = {
      employeeId: this.props.navigation.state.params.item.employeeId,
      userId: this.props.user.userId,
      request: GET_SALARY,
    };
    this.props.getSalary(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_SALARY ||
        this.props.error.request == UPDATE_SALARY)
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

    //get salary
    if (this.props.api === GET_SALARY) {
      if (this.props.error !== null && this.props.api === GET_SALARY) {
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

      if (!this.props.error && this.props.api === GET_SALARY) {
        if (this.props.salaryModel !== prevProps.salaryModel) {
          let formData = {
            fields: [
              {
                name: 'tin',
                type: '1',
                lable: 'Tin Number',
                value: this.props.salaryModel.tinNumber,
              },
              {
                name: 'sss',
                type: '1',
                lable: 'SSS Number',
                value: this.props.salaryModel.sssNumber,
              },
              {
                name: 'pag',
                type: '1',
                lable: 'PAG-IBIG',
                value: this.props.salaryModel.pagibigNumber,
              },
              {
                name: 'philhealth',
                type: '1',
                lable: 'Philhealth',
                value: this.props.salaryModel.philhealthNumber,
              },
              {
                name: 'payout',
                type: '6',
                lable: 'Email Payout Slip',
                option: {
                  '0': 'Yes',
                  '1': 'No',
                },
                value: this.props.salaryModel.paySlip,
              },
              {
                name: 'engaggementType',
                type: '4',
                lable: 'Engagement Type',
                childFields: {
                  option: {
                    '1': 'Permanent',
                    '2': 'Intern',
                    '3': 'Apprentice',
                    '4': 'Project-based',
                  },
                },
                value: this.props.salaryModel.employmentType,
              },
              {
                name: 'applicableDate',
                type: '7',
                lable: 'Applicable From Month',
                value: this.props.salaryModel.appliedFrom,
              },

              {
                name: 'multiany',
                type: '27',
                lable: 'Gross Pay',
                rules: 'required',
                childFields : [
                  {
                    name: 'child0',
                    type: '1',
                    lable: 'php',
                    rules: '',
                    editable:'0'
                  },
                  {
                    name: 'child1',
                    type: '1',
                    lable: 'gross pay',
                    rules: 'required',
                    value: this.props.salaryModel.grossSalary,
                  },
                  {
                    name: 'child2',
                    type: '4',
                    lable: 'Pay Type',
                    rules: 'required',
                    value: this.props.salaryModel.payType,
                    childFields: {
                      option: {
                        '1': 'Per Month',
                        '2': 'Per Day',
                        '3': 'Per Hour',
                      },
                    },
                  },
                ],
              },
              {
                name: 'grossPay',
                type: '25',
                lable: 'Gross Pay',
                rules: 'required',
                value: this.props.salaryModel.grossSalary,
              },
              {
                name: 'paytype',
                type: '4',
                lable: 'Pay Type',
                rules: 'required',
                childFields: {
                  option: {
                    '1': 'Per Month',
                    '2': 'Per Day',
                    '3': 'Per Hour',
                  },
                },
                value: this.props.salaryModel.payType,
              },
              {
                name: 'salarySetting',
                type: '4',
                lable: 'Salary Setting',
                rules: 'required',
                childFields: {
                  option: {
                    '1': 'Flexible Hours',
                    '2': 'Fixed Hours',
                  },
                },
                value: this.props.salaryModel.salarySetting,
              },
            ],
          };

          this.setState({
            formData: formData,
            salaryModel: this.props.salaryModel,
          });
        }
      }
    }

    //update salary
    if (this.props.api === UPDATE_SALARY) {
      if (this.props.error !== null && this.props.api === UPDATE_SALARY) {
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

      if (!this.props.error && this.props.api === UPDATE_SALARY) {
        if (this.props.salarySuccess !== prevProps.salarySuccess) {
          this.props.navigation.navigate('Bank');
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
                  this.currentPageRef['salary'] = ref;
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
    let tinNumber =
      this.currentPageRef.salary.currentFieldsRef.tin.state.tin === undefined
        ? this.currentPageRef.salary.currentFieldsRef.tin.props.item.value
        : this.currentPageRef.salary.currentFieldsRef.tin.state.tin;
    let sssNumber =
      this.currentPageRef.salary.currentFieldsRef.sss.state.sss === undefined
        ? this.currentPageRef.salary.currentFieldsRef.sss.props.item.value
        : this.currentPageRef.salary.currentFieldsRef.sss.state.sss;
    let pagNumber =
      this.currentPageRef.salary.currentFieldsRef.pag.state.pag === undefined
        ? this.currentPageRef.salary.currentFieldsRef.pag.props.item.value
        : this.currentPageRef.salary.currentFieldsRef.pag.state.pag;
    let philhealth =
      this.currentPageRef.salary.currentFieldsRef.philhealth.state
        .philhealth === undefined
        ? this.currentPageRef.salary.currentFieldsRef.philhealth.props.item
            .value
        : this.currentPageRef.salary.currentFieldsRef.philhealth.state
            .philhealth;
    let payout =
      this.currentPageRef.salary.state.newInputDict === undefined
        ? this.state.salaryModel.paySlip
        : this.currentPageRef.salaryModel.state.newInputDict.payout;
    let engaggementType =
      this.currentPageRef.salary.currentFieldsRef.engaggementType.state.data ===
      undefined
        ? this.currentPageRef.salary.currentFieldsRef.engaggementType.props.item
            .value
        : this.currentPageRef.salary.currentFieldsRef.engaggementType.state
            .data;

            let paytype = "";
            let grossPay = "";
            if(this.currentPageRef.member.currentFieldsRef.multiany) {
              grossPay = this.currentPageRef.member.currentFieldsRef.multiany.child1.state.child1
              paytype = this.currentPageRef.member.currentFieldsRef.multiany.child2.state.child2
            
            }

            
    // let grossPay =
    //   this.currentPageRef.salary.currentFieldsRef.grossPay.state.grossPay ===
    //   undefined
    //     ? this.currentPageRef.salary.currentFieldsRef.grossPay.props.item.value
    //     : this.currentPageRef.salary.currentFieldsRef.grossPay.state.grossPay;
    let applicableFrom =
      this.currentPageRef.salary.currentFieldsRef.applicableDate.state.date ===
      ''
        ? this.currentPageRef.salary.currentFieldsRef.applicableDate.props.item
            .value
        : this.currentPageRef.salary.currentFieldsRef.applicableDate.state.date;
    let payType =
      this.currentPageRef.salary.currentFieldsRef.paytype.state.data ===
      undefined
        ? this.currentPageRef.salary.currentFieldsRef.paytype.props.item.value
        : this.currentPageRef.salary.currentFieldsRef.paytype.state.data;
    let salarySetting =
      this.currentPageRef.salary.currentFieldsRef.salarySetting.state.data ===
      undefined
        ? this.currentPageRef.salary.currentFieldsRef.salarySetting.props.item
            .value
        : this.currentPageRef.salary.currentFieldsRef.salarySetting.state.data;
    let currency =
      this.currentPageRef.salary.currentFieldsRef.grossPay.state.currency ===
      undefined
        ? this.currentPageRef.salary.currentFieldsRef.grossPay.props.item.value
        : this.currentPageRef.salary.currentFieldsRef.grossPay.state.currency;

    var input = {
      employeeId: this.props.navigation.state.params.item.employeeId,
      appliedFrom: applicableFrom,
      paySlip: payout,
      employmentType: engaggementType,
      grossSalary: grossPay,
      payType: payType,
      tinNumber: tinNumber,
      userId: this.props.user.userId,
      companyId: this.props.user.userCompany,
      sssNumber: sssNumber,
      pagibigNumber: pagNumber,
      philhealthNumber: philhealth,
      salaryType: salarySetting,
      currency: currency,
      designation: this.state.salaryModel.designation.id,
    };
    this.props.updateSalary(input);
  }
}
const EditSalaryNew = withTheme(EditSalary);
function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    salaryModel: getSalarySelector(state.MemberReducer),
    salarySuccess: updateSalarySelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getSalary: input => dispatch(getSalary(input)),
    updateSalary: input => dispatch(updateSalary(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSalaryNew);
