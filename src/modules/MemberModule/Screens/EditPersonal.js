/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, ScrollView} from 'react-native';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getPersonalDropdownSelector,
  editMemberSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {getPersonalDropdown, editMember} from '../Actions/MemberActions';
import {GET_PERSONAL_DROPDOWN, EDIT_MEMBER} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {withTheme} from 'react-native-paper';
import {BottomButton} from '../../../components/views/Button';
import {styless} from '../../../components/common/Styles';
import {translate} from '../../../../App';

class EditPersonal extends React.Component {
  constructor(props) {
    super(props);

    let item = this.props.navigation.state.params.item;
    let maritalStatusOptions = {
      '0': 'Single',
      '1': 'Married',
      '2': 'Divorced',
      '3': 'Widowed',
    };

    this.state = {
      item: item,
      maritalStatusOptions: maritalStatusOptions,
    };

    this.currentPageRef = {};
    this.currentFieldsRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
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

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_PERSONAL_DROPDOWN ||
        this.props.error.request == EDIT_MEMBER)
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

      //get personal dropdown
      if (!this.props.error && this.props.api === GET_PERSONAL_DROPDOWN) {
        if (this.props.personalDropdown !== prevProps.personalDropdown) {
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

          let formData = {
            fields: [
              {
                name: 'id',
                type: '1',
                lable: 'Member ID',
                rules: 'required',
                value: this.state.item.code,
              },
              {
                name: 'fName',
                type: '1',
                lable: 'First Name',
                rules: 'required',
                value: this.state.item.firstName,
              },
              {
                name: 'lName',
                type: '1',
                lable: 'Last Name',
                rules: 'required',
                value: this.state.item.lastName,
              },
              {
                name: 'userName',
                type: '1',
                lable: 'User Name',
                rules: 'required',
                value: this.state.item.userName,
              },
              {
                name: 'email',
                type: '2',
                lable: 'Email',
                rules: 'required',
                value: this.state.item.email,
              },
              {
                name: 'password',
                type: '9',
                lable: 'Password (optional)',
                value: this.state.item.password,
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
                    value: this.state.item.countryId,
                  },
                  {
                    name: 'mobile',
                    type: '10',
                    lable: 'Phone Number',
                    rules:
                      'required|min_length[5]|max_length[10]|callback_min5min|callback_max10max',
                    value: this.state.item.phone,
                  },
                ],
              },
              {
                name: 'dob',
                type: '7',
                lable: 'Birth Date',
                rules: 'required',
                value: this.state.item.birthDate,
              },
              {
                name: 'maritalStatus',
                type: '4',
                lable: 'Marital Status',
                rules: 'required',
                childFields: {
                  option: this.state.maritalStatusOptions,
                },
                value: this.state.item.maritalStatus,
              },
              {
                name: 'loginRights',
                type: '4',
                lable: 'Login Rights',
                rules: 'required',
                childFields: {
                  option: this.state.userGroupList,
                },
                value: this.state.item.userGroup.id,
              },

              {
                name: 'leaveGroup',
                type: '4',
                lable: 'Leave Entitlement',
                rules: 'required',
                childFields: {
                  option: this.state.leaveGroupList,
                },
                value: this.state.item.leaveGroup.groupId,
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
                value: this.state.item.gender,
              },
            ],
          };
          console.log(formData);
          this.setState({formData: formData});
        }
      }
      //edit personal information
      if (!this.props.error && this.props.api === EDIT_MEMBER) {
        if (this.props.editSuccess !== prevProps.editSuccess) {
          this.props.navigation.navigate('Address');
        }
      }
    }
  }

  render() {
    if (this.state.formData === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
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
          </View>
          <View
            style={{
              paddingLeft: '25%',
              paddingRight: '25%',
              paddingTop: 10,
              paddingBottom: 20,
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
      </ScrollView>
    );
  }

  onSubmitTapped() {
    let memberId =
      this.currentPageRef.member.currentFieldsRef.id.state === undefined
        ? this.currentPageRef.member.currentFieldsRef.id.props.values
        : this.currentPageRef.member.currentFieldsRef.id.state.id;
    let fName =
      this.currentPageRef.member.currentFieldsRef.fName.state === undefined
        ? this.currentPageRef.member.currentFieldsRef.fName.props.values
        : this.currentPageRef.member.currentFieldsRef.fName.state.id;
    let lName =
      this.currentPageRef.member.currentFieldsRef.lName.state === undefined
        ? this.currentPageRef.member.currentFieldsRef.lName.props.values
        : this.currentPageRef.member.currentFieldsRef.lName.state.lName;
    let userName =
      this.currentPageRef.member.currentFieldsRef.userName.state === undefined
        ? this.currentPageRef.member.currentFieldsRef.userName.props.values
        : this.currentPageRef.member.currentFieldsRef.userName.state.userName;
    let email =
      this.currentPageRef.member.currentFieldsRef.email.state === undefined
        ? this.currentPageRef.member.currentFieldsRef.email.props.values
        : this.currentPageRef.member.currentFieldsRef.email.state.email;
    let password =
      this.currentPageRef.member.currentFieldsRef.password.state === undefined
        ? this.currentPageRef.member.currentFieldsRef.password.props.values
        : this.currentPageRef.member.currentFieldsRef.password.state.password;
    let countryCode = this.currentPageRef.member.currentFieldsRef.mobile
      .currentPageRef.phone.state.countryCode;
    let mobile = this.currentPageRef.member.currentFieldsRef.mobile
      .currentPageRef.phone.state.inputValue;
    let dob =
      this.currentPageRef.member.currentFieldsRef.dob.state === undefined
        ? this.currentPageRef.member.currentFieldsRef.dob.props.values
        : this.currentPageRef.member.currentFieldsRef.dob.state.date;

    let loginRights =
      this.currentPageRef.member.currentFieldsRef.loginRights.state ===
      undefined
        ? this.currentPageRef.member.currentFieldsRef.loginRights.props.values
        : this.currentPageRef.member.currentFieldsRef.loginRights.state
            .loginRights;
    let loginIndex = this.state.personalDropdown.userGroup
      .map(function(item) {
        return item.name;
      })
      .indexOf(loginRights);
    let loginRightsId = this.state.personalDropdown.userGroup[loginIndex].id;

    let leaveGroup =
      this.currentPageRef.member.currentFieldsRef.leaveGroup.state === undefined
        ? this.currentPageRef.member.currentFieldsRef.leaveGroup.props.values
        : this.currentPageRef.member.currentFieldsRef.leaveGroup.state
            .leaveGroup;
    let index = this.state.personalDropdown.leaveGroup
      .map(function(item) {
        return item.groupTitle;
      })
      .indexOf(leaveGroup);
    let leaveGroupId = this.state.personalDropdown.leaveGroup[index].groupId;

    let gender =
      this.currentPageRef.member.state.newInputDict === undefined
        ? this.currentPageRef.member.state.item.fields[11].value
        : this.currentPageRef.member.currentFieldsRef.id.state.id;

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
      leaveEntitlement: leaveGroupId,
      gender: gender,
      designation: loginRights,
      maritalStatus: '',
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      request: EDIT_MEMBER,
    };
    this.props.editMember(input);
  }
}

const EditPersonalNew = withTheme(EditPersonal);
function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    personalDropdown: getPersonalDropdownSelector(state.MemberReducer),
    editSuccess: editMemberSelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getPersonalDropdown: input => dispatch(getPersonalDropdown(input)),
    editMember: input => dispatch(editMember(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPersonalNew);
