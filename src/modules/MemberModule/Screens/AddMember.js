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
  addMemberSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {
  getPersonalDropdown,
  getShiftDropdown,
  addMember,
} from '../Actions/MemberActions';
import {
  GET_PERSONAL_DROPDOWN,
  GET_SHIFT_DROPDOWN,
  ADD_MEMBER,
} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {TextField} from 'react-native-material-textfield';

class AddMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supervisorName: '',
      hrName: '',
    };
    this.currentPageRef = {};
    this.currentFieldsRef = {};
    this.onSubmitButtonTapped = this.onSubmitButtonTapped.bind(this);
  }

  componentWillMount() {
    this.callGetPersonalDropdown();
  }

  callGetPersonalDropdown() {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      request: GET_PERSONAL_DROPDOWN,
    };
    this.props.getPersonalDropdown(input);
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
      (this.props.error.request == GET_PERSONAL_DROPDOWN ||
        this.props.error.request == GET_SHIFT_DROPDOWN ||
        this.props.error.request == ADD_MEMBER)
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

    //get personal dropdown
    if (this.props.api === GET_PERSONAL_DROPDOWN) {
      if (
        this.props.error !== null &&
        this.props.api === GET_PERSONAL_DROPDOWN
      ) {
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

      if (!this.props.error && this.props.api === GET_PERSONAL_DROPDOWN) {
        if (this.props.personalDropdown !== prevProps.personalDropdown) {
          this.callGetShiftDropdown();

          let leaveGroupList = {};
          for (
            let i = 0;
            i < this.props.personalDropdown.leaveGroup.length;
            i++
          ) {
            leaveGroupList[i] = this.props.personalDropdown.leaveGroup[
              i
            ].groupTitle;
          }

          let userGroupList = {};
          for (
            let i = 0;
            i < this.props.personalDropdown.userGroup.length;
            i++
          ) {
            userGroupList[i] = this.props.personalDropdown.userGroup[i].name;
          }
          this.state.leaveGroupList = leaveGroupList;
          this.state.userGroupList = userGroupList;
          this.state.personalDropdown = this.props.personalDropdown;
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
                name: 'id',
                type: '1',
                lable: 'Member ID',
                rules: 'required',
              },
              {
                name: 'fName',
                type: '1',
                lable: 'First Name',
                rules: 'required',
              },
              {
                name: 'lName',
                type: '1',
                lable: 'Last Name',
                rules: 'required',
              },
              {
                name: 'userName',
                type: '1',
                lable: 'User Name',
                rules: 'required',
              },
              {
                name: 'email',
                type: '2',
                lable: 'Email',
                rules: 'required',
              },
              {
                name: 'password',
                type: '9',
                lable: 'Password (optional)',
              },
              {
                name: '',
                type: '18',
                lable: 'Country',
                id: '',
                rules: 'required',
                childFields: [
                  {
                    name: 'country',
                    type: '10',
                    lable: 'Country',
                    option: '',
                    rules: 'required',
                  },
                  {
                    name: 'mobile',
                    type: '10',
                    lable: 'Phone Number',
                    rules:
                      'required|min5min|max10max',
                  },
                ],
              },
              {
                name: 'dob',
                type: '7',
                lable: 'Birth Date',
                rules: 'required',
              },
              {
                name: 'loginRights',
                type: '4',
                lable: 'Login Rights',
                rules: 'required',
                childFields: {
                  option: this.state.userGroupList,
                },
              },
              {
                name: 'sss',
                type: '1',
                lable: 'SSS Number',
                rules: 'required|max15max',
              },
              {
                name: 'pag',
                type: '1',
                lable: 'PAG-IBIG',
                rules: 'required|max15max',
              },
              {
                name: 'philhealth',
                type: '1',
                lable: 'Philhealth',
                rules: 'required|max15max',
              },
              {
                name: 'tin',
                type: '1',
                lable: 'Tin Number',
                rules: 'required|max15max',
              },
              {
                name: 'leaveGroup',
                type: '4',
                lable: 'Leave Entitlement',
                rules: 'required',
                childFields: {
                  option: this.state.leaveGroupList,
                },
              },
              {
                name: 'gender',
                type: '6',
                lable: 'Gender',
                rules: 'required',
                option: {
                  '1': 'Male',
                  '2': 'Female',
                },
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
                name: 'engagementDate',
                type: '7',
                lable: 'Date Of Engagement',
                rules: 'required',
              },
              {
                name: 'grossPay',
                type: '25',
                lable: 'Gross Pay',
                rules: 'required',
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
                  },
                  {
                    name: 'child2',
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
                  },
                ],
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
              },
            ],
          };
          console.log(formData);
          this.setState({formData: formData});
          this.state.shiftDropdown = this.props.shiftDropdown;
        }
      }
    }

    //add member
    if (this.props.api === ADD_MEMBER) {
      if (this.props.error !== null && this.props.api === ADD_MEMBER) {
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

      if (!this.props.error && this.props.api === ADD_MEMBER) {
        if (this.props.employeeId !== prevProps.employeeId) {
          Alert.alert(
            '',
            'Member added successfully',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
    }
  }

  render() {
    let supervisorItem = {type: 1, rules: 'required', lable: 'Supervisor'};
    let hrItem = {type: 1, rules: 'required', lable: 'HR'};

    if (this.state.formData === undefined) {
      return <ActivityIndicatorCustom />;
    }

    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <InputForm
            onRef={ref => {
              this.currentPageRef['member'] = ref;
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
            style={{padding: 15}}>
            <TextField
              label="Supervisor*"
              placeholder={this.state.supervisorName}
              maxLength={100}
              multiline={false}
              editable={false}
              placeholderTextColor={'black'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('UsersList', {
                type: 1,
                getHr: this.getHr.bind(this),
              })
            }
            style={{paddingLeft: 15,paddingRight:15,paddingBottom:2}}>
            <TextField
              label="HR*"
              placeholder={this.state.hrName}
              maxLength={100}
              multiline={false}
              editable={false}
              placeholderTextColor={'black'}
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
        </View>

        <BottomButton
          style={{height: 60, borderRadius: 50, margin: 10, width: '60%'}}
          title={translate('submit')}
          action={() => this.onSubmitButtonTapped()}
        />
      </ScrollView>
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

  getAreaLead(item) {
    this.setState({
      areaLead: item.userId,
      areaLeadName: item.userName,
    });
  }

  onSubmitButtonTapped() {
    this.setState({submitLoader: true});
    let memberId = this.currentPageRef.member.currentFieldsRef.id.state.id;
    let fName = this.currentPageRef.member.currentFieldsRef.fName.state.fName;
    let lName = this.currentPageRef.member.currentFieldsRef.lName.state.lName;
    let userName = this.currentPageRef.member.currentFieldsRef.userName.state
      .userName;
    let email = this.currentPageRef.member.currentFieldsRef.email.state.email;
    let password = this.currentPageRef.member.currentFieldsRef.password.state
      .password;
    let countryCode = this.currentPageRef.member.currentFieldsRef.mobile
      .currentPageRef.phone.state.countryCode;
    let mobile = this.currentPageRef.member.currentFieldsRef.mobile
      .currentPageRef.phone.state.inputValue;
    let dob = this.currentPageRef.member.currentFieldsRef.dob.state.date;

    let loginRights = this.currentPageRef.member.currentFieldsRef.loginRights
      .state.loginRights;
    let loginIndex = this.state.personalDropdown.userGroup
      .map(function(item) {
        return item.name;
      })
      .indexOf(loginRights);
    let loginRightsId = this.state.personalDropdown.userGroup[loginIndex].id;

    let supervisor = this.state.supervisor;
    let hr = this.state.hr;
    let areaLead =  this.state.areaLead;
    let sss = this.currentPageRef.member.currentFieldsRef.sss.state.sss;
    let pag = this.currentPageRef.member.currentFieldsRef.pag.state.pag;
    let philhealth = this.currentPageRef.member.currentFieldsRef.philhealth
      .state.philhealth;
    let tin = this.currentPageRef.member.currentFieldsRef.tin.state.tin;

    let leaveGroup = this.currentPageRef.member.currentFieldsRef.leaveGroup
      .state.leaveGroup;
    let index = this.state.personalDropdown.leaveGroup
      .map(function(item) {
        return item.groupTitle;
      })
      .indexOf(leaveGroup);
    let leaveGroupId = this.state.personalDropdown.leaveGroup[index].groupId;

    let gender = this.currentPageRef.member.state.newInputDict.gender;

    let schedule = this.currentPageRef.member.currentFieldsRef.schedule.state
      .schedule;
    let Index = this.state.shiftDropdown.shift
      .map(function(item) {
        return item.shiftTitle;
      })
      .indexOf(schedule);
    let scheduleId = this.state.shiftDropdown.shift[Index].shiftId;

    let engagementDate = this.currentPageRef.member.currentFieldsRef
      .engagementDate.state.date;
      let paytype = "";
      let grossPay = "";
      if(this.currentPageRef.member.currentFieldsRef.multiany) {
        grossPay = this.currentPageRef.member.currentFieldsRef.multiany.child1.state.child1
        paytype = this.currentPageRef.member.currentFieldsRef.multiany.child2.state.child2
      
      }

   
   
  
    let salarySettings = this.currentPageRef.member.currentFieldsRef
      .salarySetting.state.value;

    var input = {
      employeeId: memberId,
      firstName: fName,
      lastName: lName,
      userName: userName,
      email: email,
      password: password,
      country: countryCode,
      mobile: mobile,
      dob: dob,
      employeeType: loginRightsId,
      supervisor: supervisor,
      hr: hr,
      areaLead: areaLead,
      sssNumber: sss,
      pagibigNumber: pag,
      philhealthNumber: philhealth,
      tinNumber: tin,
      leaveEntitlement: leaveGroupId,
      gender: gender,
      shift: scheduleId,
      joiningDate: engagementDate,
      // currency: currency,
      grossSalary: grossPay,
      payType: paytype,
      workingHour: salarySettings,
      designation: loginRights,
      userId: this.props.user.userId,
      companyId: this.props.user.userCompany,
      request: ADD_MEMBER,
    };
    this.props.addMember(input);
  }
}

const AddMemberNew = withTheme(AddMember);
AddMemberNew.navigationOptions = ({navigation, screenProps, params}) => {
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
function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    personalDropdown: getPersonalDropdownSelector(state.MemberReducer),
    shiftDropdown: getShiftDropdownSelector(state.MemberReducer),
    employeeId: addMemberSelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getPersonalDropdown: input => dispatch(getPersonalDropdown(input)),
    getShiftDropdown: input => dispatch(getShiftDropdown(input)),
    addMember: input => dispatch(addMember(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMemberNew);
