/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {withTheme} from 'react-native-paper';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import InputTextField from '../../FormsComponent/Component/InputTextField';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getPersonalDropdownSelector,
  getShiftDropdownSelector,
  getJobSelector,
  updateJobSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {getShiftDropdown, getJob, updateJob} from '../Actions/MemberActions';
import {GET_SHIFT_DROPDOWN, GET_JOB, UPDATE_JOB} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {styless} from '../../../components/common/Styles';
import {TextField} from 'react-native-material-textfield';

class EditJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      probationList: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
      },
      workingStatusList: {
        '1': 'Working',
        '2': 'Disengaged/Terminated',
      },
    };
    this.currentPageRef = {};
    this.currentFieldsRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
  }

  componentWillMount() {
    this.callGetJob();
  }

  callGetJob() {
    var input = {
      company: this.props.user.userCompany,
      userId: this.props.user.userId,
      employeeId: this.props.navigation.state.params.item.employeeId,
      request: GET_JOB,
    };
    this.props.getJob(input);
  }

  callGetShiftDropdown() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      request: GET_SHIFT_DROPDOWN,
    };
    this.props.getShiftDropdown(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_SHIFT_DROPDOWN ||
        this.props.error.request == UPDATE_JOB ||
        this.props.error.request == GET_JOB)
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

    //get job data
    if (this.props.api === GET_JOB) {
      if (this.props.error !== null && this.props.api === GET_JOB) {
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

      if (!this.props.error && this.props.api === GET_JOB) {
        if (this.props.jobData !== prevProps.jobData) {
          this.callGetShiftDropdown();
          this.state.jobData = this.props.jobData;
        }
      }
    }

    //get shift dropdown
    if (this.props.api === GET_SHIFT_DROPDOWN) {
      if (this.props.error !== null && this.props.api === GET_SHIFT_DROPDOWN) {
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

      if (!this.props.error && this.props.api === GET_SHIFT_DROPDOWN) {
        if (this.props.shiftDropdown !== prevProps.shiftDropdown) {
          let shiftList = {};
          for (let i = 0; i < this.props.shiftDropdown.shift.length; i++) {
            shiftList[i] = this.props.shiftDropdown.shift[i].shiftTitle;
          }

          let formData = {
            fields: [
              {
                name: 'engagementDate',
                type: '7',
                lable: 'Date Of Engagement',
                rules: 'required',
                value: this.state.jobData.joiningDate,
              },
              {
                name: 'probabtion',
                type: '4',
                lable: 'Probation Period (Months)',
                rules: 'required',
                childFields: {
                  option: this.state.probationList,
                },
                value: this.state.jobData.probationPeriod,
              },
              {
                name: 'regularizationDate',
                type: '7',
                lable: 'Regularization Date',
                rules: 'required',
                value: this.state.jobData.confirmDate,
              },
              {
                name: 'schedule',
                type: '4',
                lable: 'Schedule',
                rules: 'required',
                childFields: {
                  option: shiftList,
                },
              },
              {
                name: 'workingStatus',
                type: '4',
                lable: 'Working Status',
                rules: 'required',
                childFields: {
                  option: this.state.workingStatusList,
                },
              },
            ],
          };

          this.setState({
            formData: formData,
            shiftDropdown: this.props.shiftDropdown,
          });
        }
      }
    }

    //update job
    if (this.props.api === UPDATE_JOB) {
      if (this.props.error !== null && this.props.api === UPDATE_JOB) {
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

      if (!this.props.error && this.props.api === UPDATE_JOB) {
        if (this.props.jobSuccess !== prevProps.jobSuccess) {
          this.props.navigation.navigate('Salary');
        }
      }
    }
  }

  render() {
    let supervisorItem = {type: 1, rules: 'required', lable: 'Supervisor'};
    let hrItem = {type: 1, rules: 'required', lable: 'HR'};
    let deptItem = {type: 1, rules: 'required', lable: 'Department'};
    let desgnItem = {type: 1, rules: 'required', lable: 'Designation'};

    if (this.state.formData === undefined) {
      return <ActivityIndicatorCustom />;
    }

    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View style={{flex: 1}}>
            <InputForm
              onRef={ref => {
                this.currentPageRef['job'] = ref;
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
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('UsersList', {
                  type: 2,
                  getSupervisor: this.getSupervisor.bind(this),
                })
              }
              style={{paddingLeft: 15, paddingRight: 15}}>
              <InputTextField
                onRef={ref => {
                  this.currentFieldsRef['supervisor'] = ref;
                }}
                values={this.state.supervisorName}
                item={supervisorItem}
                editable={false}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('UsersList', {
                  type: 1,
                  getHr: this.getHr.bind(this),
                })
              }
              style={{paddingLeft: 15, paddingRight: 15}}>
              <InputTextField
                onRef={ref => {
                  this.currentFieldsRef['hr'] = ref;
                }}
                values={this.state.hrName}
                item={hrItem}
                editable={false}
              />
            </TouchableOpacity>
            
            {/* <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('UsersList', {
                  type: 5,
                  getAreaLead: this.getAreaLead.bind(this),
                })
              }
              style={{padding: 15}}>
              <TextField
                label="Area Lead*"
                placeholder={this.state.areaLeadName}
                maxLength={100}
                multiline={false}
                editable={false}
                placeholderTextColor={'black'}
              />
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('DepartmentList', {
                  getDepartment: this.getDepartment.bind(this),
                })
              }
              style={{paddingLeft: 15, paddingRight: 15}}>
              <InputTextField
                onRef={ref => {
                  this.currentFieldsRef['department'] = ref;
                }}
                values={this.state.departmentName}
                item={deptItem}
                editable={false}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('DesignationList', {
                  getDesignation: this.getDesignation.bind(this),
                })
              }
              style={{paddingLeft: 15, paddingRight: 15}}>
              <InputTextField
                onRef={ref => {
                  this.currentFieldsRef['designation'] = ref;
                }}
                values={this.state.designationName}
                item={desgnItem}
                editable={false}
              />
            </TouchableOpacity>
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

  getSupervisor(item) {
    this.setState({
      supervisor: item.userId,
      supervisorName: item.userName,
    });
  }

  getHr(item) {
    this.setState({
      hr: item.userId,
      hrName: item.userName,
    });
  }

  getDesignation(item) {
    this.setState({
      designation: item.id,
      designationName: item.designation,
    });
  }

  getAreaLead(item) {
    this.setState({
      areaLead: item.userId,
      areaLeadName: item.userName,
    });
  }
  getDepartment(item) {
    this.setState({
      department: item.id,
      departmentName: item.department,
    });
  }

  onSubmitTapped() {
    let engagementDate =
      this.currentPageRef.job.currentFieldsRef.engagementDate.props.value ===
      undefined
        ? this.currentPageRef.job.currentFieldsRef.engagementDate.state.date
        : this.currentPageRef.job.currentFieldsRef.engagementDate.props.value;
    let probation =
      this.currentPageRef.job.currentFieldsRef.probabtion.state.data ===
      undefined
        ? this.currentPageRef.job.currentFieldsRef.probabtion.props.value
        : this.currentPageRef.job.currentFieldsRef.probabtion.state.data;
    let regularizationDate =
      this.currentPageRef.job.currentFieldsRef.regularizationDate.props
        .value === undefined
        ? this.currentPageRef.job.currentFieldsRef.regularizationDate.state.date
        : this.currentPageRef.job.currentFieldsRef.regularizationDate.props
            .value;
    let schedule =
      this.currentPageRef.job.currentFieldsRef.schedule.state.data === undefined
        ? this.currentPageRef.job.currentFieldsRef.schedule.props.value
        : this.currentPageRef.job.currentFieldsRef.schedule.state.schedule;
    let Index = this.state.shiftDropdown.shift
      .map(function(item) {
        return item.shiftTitle;
      })
      .indexOf(schedule);
    let scheduleId = this.state.shiftDropdown.shift[Index].shiftId;
    let workingStatus =
      this.currentPageRef.job.currentFieldsRef.workingStatus.state.data ===
      undefined
        ? this.currentPageRef.job.currentFieldsRef.workingStatus.props.value
        : this.currentPageRef.job.currentFieldsRef.workingStatus.state.schedule;

    let supervisor = this.state.supervisor;
    let hr = this.state.hr;
    let areaLead =  this.state.areaLead;
    let department = this.state.department;
    let designation = this.state.designation;

    var input = {
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      employeeId: this.props.navigation.state.params.item.employeeId,
      joiningDate: engagementDate,
      probabtionPeriod: probation,
      confirmDate: regularizationDate,
      supervisor: supervisor,
      hr: hr,
      areaLead: areaLead,
      shift: scheduleId,
      workingStatus: workingStatus,
      department: department,
      designation: designation,
      request: UPDATE_JOB,
    };
    this.props.updateJob(input);
  }
}

const EditJobNew = withTheme(EditJob);

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    personalDropdown: getPersonalDropdownSelector(state.MemberReducer),
    shiftDropdown: getShiftDropdownSelector(state.MemberReducer),
    jobData: getJobSelector(state.MemberReducer),
    jobSuccess: updateJobSelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getJob: input => dispatch(getJob(input)),
    getShiftDropdown: input => dispatch(getShiftDropdown(input)),
    updateJob: input => dispatch(updateJob(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditJobNew);
