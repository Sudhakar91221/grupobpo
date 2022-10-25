/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, Image, Modal, Alert} from 'react-native';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import CardView from 'react-native-cardview';
import {isPermissionAllowed} from '../../../network/APICall';
import {DELETE_REQUEST} from '../Actions/type';
import {deleteRequest} from '../Actions/RequestActions';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  deleteRequestSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';

class MyRequestCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {
      modalVisible: false,
    };
    this.showDeleteAlert = this.showDeleteAlert.bind(this);
    this.callDeleteRequest = this.callDeleteRequest.bind(this);
  }
  setModalVisible(visible) {
    this.setState({
      modalVisible: visible,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == DELETE_REQUEST) {
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

    //delete request
    if (this.props.api === DELETE_REQUEST) {
      if (this.props.error !== null && this.props.api === DELETE_REQUEST) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (this.props.error.message === 'Invalid Token') {
                    this.props.navigation.navigate('Login');
                  }
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === DELETE_REQUEST) {
        if (this.props.message !== prevProps.message) {
          Alert.alert(
            'Request deleted successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
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

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;
    var status = '';
    switch (item.status) {
      case '0':
        status = 'completed';
        break;
      case '1':
        status = 'pending';
        break;
      case '2':
        status = 'in_progress';
        break;
      case '3':
        status = 'declined';
    }

    var title = '';
    switch (item.categoryType) {
      case '1':
        title = 'gmbc';
        break;
      case '2':
        title = 'bir';
        break;
      case '3':
        title = 'coe';
        break;
      case '4':
        title = 'reimbursement';
        break;
      case '5':
        title = 'other';
    }

    return (
      <View
        style={[
          styless.textVertical,
          {
            width: '100%',
            height: '100%',
            padding: 2,
          },
        ]}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            padding: 5,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('MyRequestDetail', {
                item: item,
              })
            }>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  theme.header,
                  {
                    flex: item.categoryType === '5' ? 0.2 : 1,
                    color: theme.primaryColor,
                    textTransform: 'none',
                  },
                ]}>
                {translate(title)}
              </Text>
              {item.categoryType === '5' ? (
                <Text style={[theme.header, {color: theme.primaryColor}]}>
                  : {item.categorySpecified}
                </Text>
              ) : null}
              {item.status === '1' &&
              (isPermissionAllowed('Requests/update') ||
                isPermissionAllowed('Requests/delete')) ? (
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
            <View style={{flexDirection: 'row'}}>
              <Text style={[theme.detail]} numberOfLines={1}>
                Date : {Moment(item.addedon).format('DD MMM YYYY')}
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
            </View>
          </TouchableOpacity>
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
                  this.props.navigation.navigate('UpdateRequest', {item: item});
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
        {text: 'OK', onPress: this.callDeleteRequest},
      ],
      {cancelable: false},
    );
  }

  callDeleteRequest() {
    var input = {
      requestId: this.props.item.requestId,
      userId: this.props.user.userId,
      request: DELETE_REQUEST,
    };
    this.props.deleteRequest(input);
  }
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.RequestReducer),
    api: apiSelector(state.RequestReducer),
    error: errorSelector(state.RequestReducer),
    message: deleteRequestSelector(state.RequestReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    deleteRequest: input => dispatch(deleteRequest(input)),
  };
}
const MyRequestCellNew = withTheme(MyRequestCell);
export default connect(mapStateToProps, mapDispatchToProps)(MyRequestCellNew);
