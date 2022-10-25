/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, Modal, Alert, Image} from 'react-native';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import CardView from 'react-native-cardview';
import {DELETE_ANNOUNCEMENT} from '../Actions/type';
import {isPermissionAllowed} from '../../../network/APICall';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  deleteAnnouncementSelector,
} from '../Actions/selectors';
import {deleteAnnouncement} from '../Actions/AnnouncementActions';
import {translate} from '../../../../App';
import ModalView from '../../../components/views/ModalView';

class AnnouncementCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {
      modalVisible: false,
    };
    this.showDeleteAlert = this.showDeleteAlert.bind(this);
    this.callDeleteAnnouncement = this.callDeleteAnnouncement.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == DELETE_ANNOUNCEMENT) {
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

    //get holidays
    if (this.props.api === DELETE_ANNOUNCEMENT) {
      if (this.props.error !== null && this.props.api === DELETE_ANNOUNCEMENT) {
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

      if (!this.props.error && this.props.api === DELETE_ANNOUNCEMENT) {
        if (this.props.message !== this.state.message) {
          this.setState({message: this.props.message});
        }
      }
    }
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;

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
            backgroundColor:'white'
            // flex: 1,
            // padding: 5,
          }}
          cardElevation={5}
          cardMaxElevation={5}
          cornerRadius={5}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('AnnouncementDetail', {
                item: item,
                announcementId: item.announcementId,
              })
            }>
            <View style={[styless.leftRight, {padding: 5}]}>
              <View style={[styless.textVertical]}>
                <Text style={[theme.header]}>{item.title}</Text>
                <Text style={[theme.detail]}>{item.type}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    theme.header,
                    {
                      marginRight: 10,
                    },
                  ]}>
                  {Moment(item.date).format('DD MMM YYYY')}
                </Text>
                {this.props.isUpcoming === true ? (
                  isPermissionAllowed('Announcement/delete') ||
                  (isPermissionAllowed('Announcement/update') &&
                    item.userId === this.props.user.userId) ? (
                    <TouchableOpacity
                      onPress={() => this.modalView.show()}>
                      <Image
                        source={require('../../../assets/ic_more.png')}
                        tintColor={'#343957'}
                        style={{tintColor: '#343957', width: 20, height: 30}}
                      />
                    </TouchableOpacity>
                  ) : null
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        </CardView>
        <ModalView ref={ref=>this.modalView=ref} 
       
       // visible={this.state.modalVisible}
        >
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
                padding: 30,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.modalView.close()
                  this.props.navigation.navigate('UpdateAnnouncement', {
                    item: item,
                  });
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
          </View>
        </ModalView>
      </View>
    );
  }

  showDeleteAlert() {
    this.modalView.close()
    Alert.alert(
      '',
      translate('delete_announcement_hint'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this.callDeleteAnnouncement},
      ],
      {cancelable: false},
    );
  }

  callDeleteAnnouncement() {
    var input = {
      announcementId: this.props.item.announcementId,
      userId: this.props.user.userId,
      request: DELETE_ANNOUNCEMENT,
    };
    this.props.deleteAnnouncement(input);
  }
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.AnnouncementReducer),
    api: apiSelector(state.AnnouncementReducer),
    error: errorSelector(state.AnnouncementReducer),
    message: deleteAnnouncementSelector(state.AnnouncementReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    deleteAnnouncement: input => dispatch(deleteAnnouncement(input)),
  };
}
const AnnouncementCellNew = withTheme(AnnouncementCell);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnnouncementCellNew);
