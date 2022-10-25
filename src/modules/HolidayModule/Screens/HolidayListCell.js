/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, TouchableOpacity, Modal, Alert} from 'react-native';
import {styless} from '../../../components/common/Styles';
import moment from 'moment';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import CardView from 'react-native-cardview';
import {DELETE_HOLIDAY} from '../Actions/type';
import {isPermissionAllowed} from '../../../network/APICall';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  holidaysListSelector,
  requestSelector
} from '../Actions/selectors';
import {deleteHoliday} from '../Actions/HolidayActions';
import ModalView from '../../../components/views/ModalView';
class HolidayListCell extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      error: undefined
    };
    this.showDeleteAlert = this.showDeleteAlert.bind(this);
    this.callDeleteHoliday = this.callDeleteHoliday.bind(this);
  }
  setModalVisible(visible) {
    this.setState({
      modalVisible: visible,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.request === DELETE_HOLIDAY  ) {
      if (this.props.error !== this.state.error) {
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
      this.state.error = this.props.error

    }

    //get holidays
    if (this.props.api === DELETE_HOLIDAY && prevProps.api === DELETE_HOLIDAY  ) {
      if (this.props.error !== null && this.props.request === DELETE_HOLIDAY) {
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

      if (!this.props.error && this.props.api === DELETE_HOLIDAY) {
        if (this.props.holidays !== this.state.holidays) {
          this.setState({holidays: this.props.holidays});
        }
      }
    }
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;
    var status = '';
    switch (item.type) {
      case '1':
        status = 'public_holiday';
        break;
      case '2':
        status = 'special_day';
        break;
      case '3':
        status = 'double_holiday';
    }

    let momentObj = moment(item.date, 'DD-MM-YYYY');
    let date = moment(momentObj).format('DD MMM YYYY');

    return (
      <View style={{margin: 2, flex: 1}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor: 'white',
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <View
            style={[
              styless.textVertical,
              {
                width: '100%',
                height: '100%',
                padding: 5,
              },
            ]}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  theme.header,
                  {textAlign: 'left', color: theme.primaryColor},
                ]}
                numberOfLines={1}>
                {date}
              </Text>
              <View style={{flex: 1}}>
                <Text
                  style={[
                    theme.header,
                    {textAlign: 'right', color: theme.primaryColor},
                  ]}
                  numberOfLines={1}>
                  {translate(status)}
                </Text>
              </View>
              {isPermissionAllowed('Holiday/update') ||
              isPermissionAllowed('Holiday/delete') ? (
                <TouchableOpacity
                  onPress={() => this.setState({modalVisible: true})}>
                  <Image
                    source={require('../../../assets/ic_more.png')}
                    tintColor={'#343957'}
                    style={{tintColor: '#343957', width: 20, height: 30}}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <Text
              style={[theme.detail, {flex: 1, color: theme.primaryColor}]}
              numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        </CardView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                this.setModalVisible(false);
              }}>
              <View
                style={{
                  marginTop: '80%',
                  marginRight: '20%',
                  marginLeft: '20%',
                  backgroundColor: 'white',
                  borderColor: 'gray',
                  borderRadius: 5,
                  borderWidth: 1,
                  padding: 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({modalVisible: false});
                    this.props.navigation.navigate('UpdateHoliday', {item: item});
                  }}>
                  <Text style={[theme.detail, {color: theme.primaryColor}]}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.showDeleteAlert()}>
                  <Text
                    style={[
                      theme.detail,
                      {color: theme.primaryColor, marginTop: 20},
                    ]}>
                      Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  showDeleteAlert() {
    this.setState({modalVisible: false});
    Alert.alert(
      '',
      translate('delete_request'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this.callDeleteHoliday},
      ],
      {cancelable: false},
    );
  }

  callDeleteHoliday() {
    var input = {
      holidayId: this.props.item.holidayId,
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      request: DELETE_HOLIDAY,
    };
    this.props.deleteHoliday(input);
  }
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.HolidayReducer),
    api: apiSelector(state.HolidayReducer),
    error: errorSelector(state.HolidayReducer),
    holidays: holidaysListSelector(state.HolidayReducer),
    request : requestSelector(state.HolidayReducer)
  };
}
function mapDispatchToProps(dispatch) {
  return {
    deleteHoliday: input => dispatch(deleteHoliday(input)),
  };
}
const HolidayListCellNew = withTheme(HolidayListCell);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HolidayListCellNew);
