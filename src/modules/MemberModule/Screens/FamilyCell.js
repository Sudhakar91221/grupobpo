/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, Image, Alert, Modal} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import {USER_IMAGE_DOWNLOAD_URL, API_KEY} from '../../../network/config';
import AsyncImage from '../../../components/views/AsyncImage';
import {isPermissionAllowed} from '../../../network/APICall';
import CardView from 'react-native-cardview';
import {DELETE_FAMILY, UPDATE_FAMILY} from '../Actions/type';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getFamilySelector,
  updateFamilySelector,
} from '../Actions/selector';
import {deleteFamily, updateFamily} from '../Actions/MemberActions';
import {WhiteButton} from '../../../components/views/Button';
import {TextField} from 'react-native-material-textfield';
import InputForm from '../../FormsComponent/Forms/InputForm';

class FamilyCell extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);

    let formData = {
      fields: [
        {
          name: 'relation',
          type: '4',
          lable: 'Relationship',
          rules: 'required',
          childFields: {
            option: {
              '1': 'Father',
              '2': 'Mother',
              '3': 'Brother',
              '4': 'Sister',
              '5': 'Husband',
              '6': 'Wife',
              '7': 'Son',
              '8': 'Daughter',
            },
          },
          value: this.props.item.relation,
        },
        {
          name: 'dob',
          type: '7',
          lable: 'Birth Date',
          rules: 'required',
          value: this.props.item.dob,
        },
      ],
    };

    this.state = {
      modalVisible: false,
      editModalVisible: false,
      formData: formData,
    };
    this.callDeleteFamilyMember = this.callDeleteFamilyMember.bind(this);
    this.showDeleteAlert = this.showDeleteAlert.bind(this);
    this.renderEditMemberView = this.renderEditMemberView.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == DELETE_FAMILY ||
        this.props.error.request == UPDATE_FAMILY)
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

    //delete family
    if (this.props.api === DELETE_FAMILY) {
      if (this.props.error !== null && this.props.api === DELETE_FAMILY) {
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

      if (!this.props.error && this.props.api === DELETE_FAMILY) {
        if (this.props.familyList !== this.state.familyList) {
          this.setState({familyList: this.props.familyList});
        }
      }
    }

    //delete family
    if (this.props.api === UPDATE_FAMILY) {
      if (this.props.error !== null && this.props.api === UPDATE_FAMILY) {
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

      if (!this.props.error && this.props.api === UPDATE_FAMILY) {
        if (this.props.familySuccess !== this.state.familySuccess) {
          this.setState({familyList: this.props.familyList});
        }
      }
    }
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    let relationship = '';
    switch (this.props.item.relation) {
      case '1':
        relationship = 'Father';
        break;
      case '2':
        relationship = 'Mother';
        break;
      case '3':
        relationship = 'Brother';
        break;
      case '4':
        relationship = 'Sister';
        break;
      case '5':
        relationship = 'Husband';
        break;
      case '6':
        relationship = 'Wife';
        break;
      case '7':
        relationship = 'Son';
        break;
      case '8':
        relationship = 'Daughter';
        break;
    }
    return (
      <View style={{margin: 2, flex: 1}}>
        <View
          style={[
            styless.textVertical,
            {
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              padding: 5,
              backgroundColor: 'white',
            },
          ]}>
          <View style={{flex: 1, marginLeft: 5}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  theme.detail,
                  {
                    color: theme.disableButtonColor,
                    fontSize: 16,
                    flex: 1,
                    textAlign: 'center',
                  },
                ]}
                numberOfLines={1}>
                {relationship}
              </Text>
              <Text
                style={[
                  theme.detail,
                  {
                    color: theme.disableButtonColor,
                    fontSize: 16,
                    flex: 1,
                    textAlign: 'center',
                  },
                ]}
                numberOfLines={1}>
                {this.props.item.dob === '' ? '-' : this.props.item.dob}
              </Text>
              <Text
                style={[
                  theme.detail,
                  {
                    color: theme.disableButtonColor,
                    fontSize: 16,
                    flex: 1,
                    textAlign: 'center',
                    textTransform: 'none',
                  },
                ]}
                numberOfLines={1}>
                {this.props.item.age}
              </Text>

              <TouchableOpacity
                onPress={() => this.setState({modalVisible: true})}
                style={{flex: 0.15}}>
                <Image
                  source={require('../../../assets/ic_more.png')}
                  tintColor={'#343957'}
                  style={{tintColor: '#343957', width: 20, height: 30}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                marginRight: '20%',
                marginLeft: '20%',
                backgroundColor: 'white',
                borderColor: 'gray',
                borderRadius: 5,
                borderWidth: 1,
                padding: 20,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({modalVisible: false, editModalVisible: true});
                }}>
                <Text style={[theme.detail, {color: theme.primaryColor}]}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.showDeleteAlert()}
                style={{marginTop: 10}}>
                <Text style={[theme.detail, {color: theme.primaryColor}]}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.editModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            {this.renderEditMemberView()}
          </View>
        </Modal>
      </View>
    );
  }

  renderEditMemberView() {
    const {theme} = this.props;
    return (
      <View
        style={{
          marginRight: '10%',
          marginLeft: '10%',
          backgroundColor: 'white',
          borderColor: 'gray',
          borderRadius: 5,
          borderWidth: 1,
          padding: 20,
        }}>
        <Text
          style={[
            theme.header,
            {color: theme.primaryColor, textAlign: 'center'},
          ]}>
          Edit Member
        </Text>
        <View style={{height: 150}}>
          <InputForm
            onRef={ref => {
              this.currentPageRef['family'] = ref;
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
        <Text
          style={[
            theme.header,
            {
              color: theme.primaryColor,
              textAlign: 'center',
              padding: 10,
              textTransform: 'uppercase',
            },
          ]}>
          OR
        </Text>
        <Text
          style={[
            theme.detail,
            {
              color: theme.primaryColor,
              textAlign: 'left',
              paddingLeft: 10,
              fontSize: 16,
            },
          ]}>
          {translate('age')}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{paddingRight: 10, flex: 1}}>
            <TextField
              label={'Years'}
              value={this.props.item.year}
              onChangeText={text => this.setState({years: text})}
              multiline={false}
              textColor={theme.headerColor}
              baseColor={theme.detailPlaceholderColor}
              fontSize={18}
              tintColor={theme.centerColor}
              lineWidth={2.0}
              editable={true}
              keyboardType={'numeric'}
            />
          </View>
          <View style={{paddingRight: 10, flex: 1}}>
            <TextField
              label={'Months'}
              value={this.props.item.month}
              onChangeText={text => this.setState({months: text})}
              multiline={false}
              textColor={theme.headerColor}
              baseColor={theme.detailPlaceholderColor}
              fontSize={18}
              tintColor={theme.centerColor}
              lineWidth={2.0}
              editable={true}
              keyboardType={'numeric'}
            />
          </View>
        </View>
        <TextField
          label={'Enter details here if any disease'}
          value={this.props.item.remark}
          onChangeText={text => this.setState({details: text})}
          multiline={true}
          textColor={theme.headerColor}
          baseColor={theme.detailPlaceholderColor}
          fontSize={18}
          tintColor={theme.centerColor}
          lineWidth={2.0}
          editable={true}
        />
        <View style={{flexDirection: 'row'}}>
          <WhiteButton
            style={{
              flex: 1,
              borderRadius: 50,
              margin: 10,
              padding: 10,
              width: 120,
              height: 90,
            }}
            title={translate('cancel')}
            action={() => this.setState({editModalVisible: false})}
          />
          <WhiteButton
            style={{
              flex: 1,
              borderRadius: 50,
              margin: 10,
              padding: 10,
              width: 120,
              height: 90,
            }}
            title={translate('edit')}
            action={() => this.callEditFamily()}
          />
        </View>
      </View>
    );
  }

  callEditFamily() {
    let relation = this.currentPageRef.family.currentFieldsRef.relation.state
      .value;
    let dob = this.currentPageRef.family.currentFieldsRef.dob.state.date;
    let years = this.state.years;
    let months = this.state.months;
    let remark = this.state.details;
    var input = {
      relation: relation,
      dob: dob,
      year: years,
      month: months,
      employeeId: this.props.navigation.state.params.item.employeeId,
      userId: this.props.user.userId,
      remark: remark,
      ufId: '',
      request: UPDATE_FAMILY,
    };
    this.props.updateFamily(input);
  }

  showDeleteAlert() {
    this.setState({modalVisible: false});
    Alert.alert(
      '',
      translate('delete_family_hint'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this.callDeleteFamilyMember},
      ],
      {cancelable: false},
    );
  }

  callDeleteFamilyMember() {
    var input = {
      ufId: this.props.item.ufId,
      userId: this.props.user.userId,
      request: DELETE_FAMILY,
    };
    this.props.deleteFamily(input);
  }
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    familyList: getFamilySelector(state.MemberReducer),
    familySuccess: updateFamilySelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    deleteFamily: input => dispatch(deleteFamily(input)),
    updateFamily: input => dispatch(updateFamily(input)),
  };
}
const FamilyCellNew = withTheme(FamilyCell);
export default connect(mapStateToProps, mapDispatchToProps)(FamilyCellNew);
