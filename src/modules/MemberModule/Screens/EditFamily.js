/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getFamilySelector,
  addFamilySelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {getFamily, addFamily} from '../Actions/MemberActions';
import {GET_FAMILY, ADD_FAMILY} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {translate} from '../../../../App';
import {flatListItemSeparator} from '../../../components/utility/common';
import FamilyCell from './FamilyCell';
import Icons from '../../../components/common/Icons';
import {WhiteButton} from '../../../components/views/Button';

class EditBank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
    this.currentPageRef = {};
    this.currentFieldsRef = {};
    this.renderAddMemberView = this.renderAddMemberView.bind(this);
  }

  componentWillMount() {
    this.callGetFamily();
  }

  callGetFamily() {
    var input = {
      employeeId: this.props.navigation.state.params.item.employeeId,
      userId: this.props.user.userId,
      request: GET_FAMILY,
    };
    this.props.getFamilyList(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_FAMILY ||
        this.props.error.request == ADD_FAMILY)
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

    //get family
    if (this.props.api === GET_FAMILY) {
      if (this.props.error !== null && this.props.api === GET_FAMILY) {
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

      if (!this.props.error && this.props.api === GET_FAMILY) {
        if (this.props.familyList.data !== this.state.familyList) {
          this.setState({
            familyList: this.props.familyList.data,
          });
        }
      }
    }

    //add family
    if (this.props.api === ADD_FAMILY) {
      if (this.props.error !== null && this.props.api === ADD_FAMILY) {
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

      if (!this.props.error && this.props.api === ADD_FAMILY) {
        if (this.props.ufId !== this.prevProps.ufId) {
          this.setState({
            familyList: this.props.familyList.data,
          });
        }
      }
    }
  }

  render() {
    const {theme} = this.props;
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          {this.state.familyList === undefined ? (
            <ActivityIndicatorCustom />
          ) : (
            <View style={{flex: 1}}>
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: true})}>
                <View
                  style={{
                    position: 'relative',
                    borderRadius: 50,
                    backgroundColor: '#383C55',
                    width: '50%',
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    margin: 5,
                    flexDirection: 'row',
                  }}>
                  <Icons.MaterialCommunityIcons
                    name={'plus'}
                    size={30}
                    tintColor="white"
                    color={'white'}
                    style={{tintColor: 'white', paddingRight: 3}}
                  />

                  <Text
                    style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
                    {translate('new_member')}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    theme.header,
                    {
                      textAlign: 'center',
                      fontSize: 20,
                      flex: 1,
                    },
                  ]}
                  numberOfLines={1}>
                  {translate('relationship')}
                </Text>
                <Text
                  style={[
                    theme.header,
                    {
                      textAlign: 'center',
                      fontSize: 20,
                      flex: 1,
                    },
                  ]}
                  numberOfLines={1}>
                  {translate('birthDate')}
                </Text>
                <Text
                  style={[
                    theme.header,
                    {
                      textAlign: 'center',
                      fontSize: 20,
                      flex: 1,
                    },
                  ]}
                  numberOfLines={1}>
                  {translate('age')}
                </Text>
              </View>
              <FlatList
                data={this.state.familyList}
                renderItem={this.renderItem}
                numColumns={1}
                extraData={this.props}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={flatListItemSeparator}
              />
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
                  {this.renderAddMemberView()}
                </View>
              </Modal>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  renderAddMemberView() {
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
          Add Member
        </Text>
        <View style={{height: 150}}>
          <InputForm
            onRef={ref => {
              this.currentPageRef['family'] = ref;
            }}
            item={formData}
            blockModel={formData}
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
              value={''}
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
              value={''}
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
          value={''}
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
            action={() => this.setState({modalVisible: false})}
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
            title={translate('add')}
            action={() => this.callAddFamily()}
          />
        </View>
      </View>
    );
  }

  renderItem = ({item}) => {
    return <FamilyCell item={item} navigation={this.props.navigation} />;
  };

  callAddFamily() {
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
      request: ADD_FAMILY,
    };
    this.props.addFamily(input);
  }
}
const EditBankNew = withTheme(EditBank);
function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    familyList: getFamilySelector(state.MemberReducer),
    ufId: addFamilySelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getFamilyList: input => dispatch(getFamily(input)),
    addFamily: input => dispatch(addFamily(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBankNew);

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
    },
    {
      name: 'dob',
      type: '7',
      lable: 'Birth Date',
      rules: 'required',
    },
  ],
};
