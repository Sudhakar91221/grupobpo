/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import {
  CollapseBody,
  CollapseHeader,
  Collapse,
} from '../../../components/external/CollapsibleView';
import Icons from '../../../components/common/Icons';
import {ScreenHeight, ScreenWidth} from '../../../components/utility/Settings';
import CardView from 'react-native-cardview';
import {TextField} from 'react-native-material-textfield';
import ImageViewer from '../../../components/external/ImageViewer';
import {BottomButton} from '../../../components/views/Button';
import ImagePicker from 'react-native-image-picker';
import {connect} from 'react-redux';
import {UPDATE_TASK, UPDATE_CHECKOUT} from '../Actions/type';
import {updateTask, updateCheckout} from '../Actions/TimesheetActions';
import {updateTaskSelector, updateCheckoutSelector} from '../Actions/selectors';
import {translate} from '../../../../App';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import Moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';
import MomentTz from 'moment-timezone';
import {myDashboardSelector} from '../../DashboardModule/Actions/selector';
const timeZone = 'Asia/Manila';

class ManualCheckoutCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      isDateTimePickerVisible: false,
    };

    this.onAddAttachmentTapped = this.onAddAttachmentTapped.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.renderMapButton = this.renderMapButton.bind(this);
    this.tasksRef = this.updateRef.bind(this, 'tasks');
    this.notesRef = this.updateRef.bind(this, 'notes');
    this.renderEditableBody = this.renderEditableBody.bind(this);
    this.renderSubmitButton = this.renderSubmitButton.bind(this);
    this.onSubmitButtonTapped = this.onSubmitButtonTapped.bind(this);
    this.onCheckoutTimeButtonTapped = this.onCheckoutTimeButtonTapped.bind(
      this,
    );
  }

  componentDidMount() {
    var firstCheckin24Hour = Moment(this.props.firstCheckinTime, [
      'h:mm A',
    ]).format('HH:mm');
    var currentCheckin24Hour = Moment(this.props.item.inTime, [
      'h:mm A',
    ]).format('HH:mm');

    console.log(this.props.selectedDay + 'T' + firstCheckin24Hour);

    let firstCheckinDate = new Date(
      Moment(
        this.props.selectedDay + 'T' + firstCheckin24Hour,
        'YYYY-MM-DDTHH:mm',
      )
        .utc()
        .format(),
    );

    console.log('firstCheckinDate => ' + firstCheckinDate);

    let currentCheckinDate = new Date(
      // Moment(global.uadate + 'T' + currentCheckin24Hour, 'YYYY-MM-DDTHH:mm')
      Moment(
        Moment().format('YYYY-MM-DD') + 'T' + currentCheckin24Hour,
        'YYYY-MM-DDTHH:mm',
      )
        .utc()
        .format(),
    );
    console.log('currentCheckinDate => ' + currentCheckinDate);

    let dateAfter20Hours = new Date(
      Moment(firstCheckinDate)
        .add(20, 'hours')
        .format(),
    );
    console.log('dateAfter20Hours => ' + dateAfter20Hours);

    // let currentCheckinDateTimezone = new Date(MomentTz.tz(firstCheckinDate,timeZone).format())
    // let dateAfter20HoursTimezone = new Date(MomentTz.tz(dateAfter20Hours,timeZone).format())

    this.setState({
      firstCheckinDate: firstCheckinDate,
      dateAfter20Hours: dateAfter20Hours,
      currentCheckinDate: currentCheckinDate,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == UPDATE_TASK ||
        this.props.error.request == UPDATE_CHECKOUT)
    ) {

      if (this.props.error !== prevProps.error) {
              this.setState({submitLoader:false});

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
    //update task
    if (this.props.api === UPDATE_TASK) {
      if (this.props.error !== null && this.props.api === UPDATE_TASK) {
        if (this.props.error !== prevProps.error) {
          this.setState({submitLoader:false});

          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  console.log();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === UPDATE_TASK) {
        if (this.props.checkinModel !== this.state.checkinModel) {
          this.setState({checkinModel: this.props.checkinModel,submitLoader:false});
          Alert.alert(
            'Task updated successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.navigation.state.params.fetchData();
                  // this.props.navigation.state.params.refreshScreen();
                  this.props.navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
    }

    //update checkout
    if (this.props.api === UPDATE_CHECKOUT) {
      if (this.props.error !== null && this.props.api === UPDATE_CHECKOUT) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  console.log();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === UPDATE_CHECKOUT) {
        if (this.props.checkInId !== this.state.checkInId) {
          this.setState({checkInId: this.props.checkInId,checkinModel:this.props.checkinModel});
          if (this.state.selectedTime !== undefined) {
            this.props.submitCheckoutData(
              this.state.selectedTime,
              this.state.tasks ? this.state.tasks : '',
              this.state.notes ? this.state.notes : '',
            );
          }
          this.setState({isLoading: false,submitLoader:false, hideSubmitManualCheckout: true});

          Alert.alert(
            'Submitted successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.navigation.state.params.fetchData();
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

  updateRef(name, ref) {
    this[name] = ref;
  }

  render() {
    const item = this.props.item;

    return (
      <View style={{marginBottom: 15}}>
        <Collapse
          style={{backgroundColor: 'white'}}
          isCollapsed={
            item.outTime == '-' || this.props.isFromManualCheckout == true && item.task == ''
              ? true
              : false
          }
          onToggle={isCollapsed => this.setState({collapsed: isCollapsed})}>
          <CollapseHeader>{this.renderHeader(item)}</CollapseHeader>
          <CollapseBody>
            {this.props.isFromManualCheckout == true && item.task == ''
              ? this.renderEditableBody(item)
              : this.renderBody(item)}
          </CollapseBody>
        </Collapse>
        {this.state.showAttachment && (
          <ImageViewer
            style={{height: ScreenHeight - 80, width: ScreenWidth}}
            isVisible={this.state.showAttachment ? true : false}
            imageName={item.attachment}
            navigation={this.props.navigation}
            hideImage={() => this.setState({showAttachment: false})}
          />
        )}
        {item.outTime == '-' && this.props.isFromManualCheckout == true && (
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode="datetime"
            is24Hour={false}
            minimumDate={
              this.state.firstCheckinDate === undefined
                ? new Date()
                : this.state.firstCheckinDate
            }
            maximumDate={
              this.state.dateAfter20Hours === undefined
                ? new Date()
                : this.state.dateAfter20Hours
            }
          />
        )}
      </View>
    );
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    console.log('A date has been picked: ', date);

    let newTime = MomentTz.tz(date, timeZone).format('h:mm A');
    var newTime24Hour = MomentTz.tz(newTime, ['h:mm A'], timeZone).format(
      'HH:mm',
    );

    console.log('12 Hour: ', newTime);
    console.log('12 Hour: ', newTime24Hour);

    this.setState({
      selectedTime: newTime.toString(),
      selectedTime24Hr: newTime24Hour.toString(),
    });
    this.hideDateTimePicker();
  };

  onViewAttachmentTapped() {
    console.log(this.state.showAttachment);

    this.setState({showAttachment: true});

    // this.props.navigation.push('ImageViewer')
  }

  renderHeader(item) {
    return (
      <View style={[styles.nextToEach,{flex:1}]}>
        <View style={[styles.nextToEach, {paddingRight: 5, paddingLeft: 5}]}>
          <Image
            style={{width: 25, height: 25}}
            source={require('../../../assets/location.png')}
          />
          <View>
            <Text
              style={[
                styles.header,
                {height: null, width: null, textTransform: 'capitalize'},
              ]}>
              {item.placeName ? item.placeName : ''}
            </Text>
            <View style={[styles.nextToEach, {paddingTop: 5, paddingLeft: 10}]}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/time.png')}
              />
              {item.outTime == '-' &&
              this.props.isFromManualCheckout == true ? (
                <View style={styles.nextToEach}>
                  <Text style={[styles.detail,{width:100}]}>
                    {' '}
                    {item.inTime}
                    {' - '}{' '}
                  </Text>
                  {this.state.collapsed == true ? (
                    <TouchableOpacity style={{width:180,height:50,top:-15}}
                      onPress={this.showDateTimePicker.bind(this)}>
                    <Text style={[styles.detailRed,{width:180,height:60,fontSize:20,top:10}]}>
                        {' '}
                        {this.state.selectedTime
                          ? this.state.selectedTime
                          : 'Checkout Here...'}{' '}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={{width:180,height:50,top:-15}}
                      onPress={this.showDateTimePicker.bind(this)}>
                    <Text style={[styles.detailRed,{width:180,height:60,fontSize:20,top:10}]}>
                      {' '}
                      {this.state.selectedTime
                        ? this.state.selectedTime
                        : 'Checkout Here'}{' '}
                    </Text>
                    </TouchableOpacity>

                  )}
                </View>
              ) : (
                <Text style={[styles.detail, {fontSize: 16}]}>
                  {' '}
                  {item.inTime}
                  {' - '}
                  {item.outTime != '-' ? item.outTime : 'N/A'}{' '}
                </Text>
              )}
            </View>
          </View>
        </View>

        {this.state.collapsed == true ? (
          <Icons.Ionicons
            name="md-arrow-dropdown"
            size={30}
            color="black"
            style={{paddingBottom: 15, paddingRight: 10, alignSelf: 'flex-end',width:30}}
          />
        ) : (
          <Icons.Ionicons
            name="md-arrow-dropright"
            size={30}
            color="black"
            style={{paddingBottom: 15, paddingRight: 10, alignSelf: 'flex-end',width:30}}
          />
        )}
      </View>
    );
  }

  onAddAttachmentTapped = () => {
    Keyboard.dismiss();
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      imageFileType: 'png',
      cameraRoll: true,
      waitUntilSaved: true,
      storageOptions: {
        skipBackup: true,
      },
    };
    var self = this;

    ImagePicker.showImagePicker(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert(response.error);
      } else {
        // const source = { uri: response.uri };
        // this.state.newImages.concat(response)
        // console.log(self.state)
        const source = {uri: 'data:image/jpeg;base64,' + response.data};
        console.log('-------image ----------');
        console.log('-------image ----------');

        const newImageObj = [
          {uri: source.uri, fileName: response.fileName, type: response.type},
        ];
        console.log(response.fileName);
        console.log(response.name);

        let imgName = newImageObj.fileName;

        if (newImageObj.fileName === undefined) {
          var getFilename = response.uri.split('/');
          imgName = getFilename[getFilename.length - 1];
        }
        console.log(imgName);

        self.setState({newImages: newImageObj, attachment: imgName});
      }
    });
  };

  renderEditableBody(item) {
    let {errors = {}, secureTextEntry, ...data} = this.state;

    return (
      <View style={{paddingLeft: 35, paddingRight: 35}}>
        <View>
          <TextField
            ref={this.tasksRef}
            label="Tasks"
            // value={this.state.tasks}
            placeholder="Enter Task Here"
            onChangeText={tasks => this.setState({tasks})}
            maxLength={150}
            multiline={true}
            onFocus={this.onFocus}
            error={errors.tasks}
            textColor={'#383C55'}
            baseColor={'gray'}
            tintColor={'#383C55'}
            prefix={
              <Image
                style={{width: 15, height: 15}}
                source={require('../../../assets/task.png')}
              />
            }
          />
        </View>

        <View>
          <TextField
            ref={this.notesRef}
            label="Notes"
            // value={this.state.notes}
            placeholder="Enter Notes Here"
            onChangeText={notes => this.setState({notes})}
            maxLength={150}
            multiline={true}
            onFocus={this.onFocus}
            error={errors.notes}
            textColor={'#383C55'}
            baseColor={'gray'}
            tintColor={'#383C55'}
            prefix={
              <Image
                style={{width: 15, height: 15}}
                size={30}
                source={require('../../../assets/notes.png')}
              />
            }
          />
        </View>

        <View style={[styles.nextToEach, {paddingTop: 10}]}>
          <Image
            style={{width: 15, height: 15}}
            size={30}
            source={require('../../../assets/attachment.png')}
          />
          <TouchableOpacity onPress={() => this.onAddAttachmentTapped()}>
            <Text style={styles.detail}>
              {this.state.attachment === undefined
                ? 'Add Attachment'
                : this.state.attachment}
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderMapButton()}
        {this.renderSubmitButton()}
      </View>
    );
  }
  renderBody(item) {
    return (
      <View style={{paddingLeft: 35, paddingRight: 35}}>
        <View style={[styles.nextToEach, {paddingTop: 5}]}>
          <Image
            style={{width: 15, height: 15}}
            source={require('../../../assets/task.png')}
          />
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={[styles.detail, {flex: 1, flexShrink: 1}]}>
              {item.task ? item.task : translate('not_available')}
            </Text>
          </View>
        </View>

        <View style={[styles.nextToEach, {paddingTop: 5}]}>
          <Image
            style={{width: 15, height: 15}}
            source={require('../../../assets/notes.png')}
          />
          <Text style={[styles.detail, {flex: 1, flexGrow: 1, width: 0}]}>
            {item.notes ? item.notes : translate('not_available')}
          </Text>
        </View>

        <View style={[styles.nextToEach, {paddingTop: 5}]}>
          <Image
            style={{width: 15, height: 15}}
            source={require('../../../assets/attachment.png')}
          />
          <TouchableOpacity
            onPress={() =>
              item.attachment ? this.onViewAttachmentTapped() : null
            }>
            <Text style={styles.detail}>
              {item.attachment ? item.attachment : translate('not_available')}
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderMapButton()}
      </View>
    );
  }

  renderMapButton() {
    const {item} = this.props;
    if (item.outTime != '-') {
      return (
        <View
          style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
          <CardView
            style={[styles.buttonAnywhereStyle, {backgroundColor: 'white'}]}
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('CheckinMapScreen', {
                  checkinObject: item,
                })
              }
              style={styles.centerText}>
              <View style={styles.buttonContainerStyle}>
                <Text style={styles.blackButtonTextStyle}>View MAP</Text>
              </View>
            </TouchableOpacity>
          </CardView>
        </View>
      );
    }
  }

  //Textfield methods

  onChangeText(text, id, data) {
    ['tasks', 'notes']
      .map(name => ({name, ref: this[name]}))
      .filter(({ref}) => ref && ref.isFocused())
      .forEach(({name, ref}) => {
        this.setState({[name]: text}, () => {
          // this.typeDropdownRef = null
        });
      });
  }
  onFocus() {
    let {errors = {}} = this.state;
    // let ref = this['attachment'];
    // if (ref && ref.isFocused()) {
    //      this.onAddAttachmentTapped()
    // }

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }

    this.setState({errors});
  }

  validateAllDetails() {
    let errors = {};
    let errorCount = 0;

    let validates = ['tasks', 'notes'];

    validates.forEach(name => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'Should not be empty';
        errorCount = errorCount + 1;
      } else {
        if (name === 'password' && value.length < 6) {
          errors[name] = 'Too short';
          errorCount = errorCount + 1;
        }
      }
    });

    this.setState({errors});

    if (errorCount > 0) {
      return false;
    } else {
      return true;
    }
  }

  renderSubmitButton() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          paddingTop:20
        }}>
        <BottomButton
          style={{
            width: '40%',
            height: 50,
            borderRadius: 30,
            backgroundColor: '#343957',
            width:'100%'
          }}
          title={translate('submit')}
          action={() => this.onSubmitButtonTapped()}
          isLoader={this.state.submitLoader}
          isGray={this.state.submitGray}
        />
      </View>
    );
  }

  onSubmitButtonTapped() {
    this.setState({submitLoader:true});
    var result = this.validateAllDetails();
    if (this.props.item.outTime === '-') {
      if (this.state.selectedTime === undefined) {
        this.setState({submitLoader:false});

        Alert.alert('Please select checkout time');
      } else {
        this.callSubmitManualCheckout();
      }
    } else {
      if (result === true) {
        if (this.state.newImageObj === undefined) {
          var input = {
            userId: this.props.user.userId,
            checkInId: this.props.item.checkInId,
            task: this.state.tasks,
            notes: this.state.notes,
            request: UPDATE_TASK,
          };
        } else {
          var input = {
            userId: this.props.user.userId,
            checkInId: this.props.item.checkInId,
            task: this.state.tasks,
            notes: this.state.notes,
            attachment:
              this.state.newImageObj === undefined
                ? null
                : this.state.newImageObj[0].uri,
            request: UPDATE_TASK,
          };
        }

        this.props.updateTask(input);
      }
    }
  }

  callSubmitManualCheckout() {
    if (this.validateAllDetails() == false) {
      return;
    }

    const lastCheckin = this.props.item;

    if (this.state.newImages && this.state.newImages.length > 0) {
      const newFile = {
        type: this.state.newImages[0].type,
        name: this.state.attachment,
        uri: this.state.newImages[0].uri,
      };
      var input = {
        userId: this.props.user.userId,
        checkInId: lastCheckin.checkInId,
        task: this.state.tasks,
        note: this.state.notes,
        dateTime: this.state.selectedTime24Hr,
        uadate: this.props.dashboardModel.checkin.date,
        attachment: newFile ? newFile : '',
      };
    } else {
      var input = {
        userId: this.props.user.userId,
        checkInId: lastCheckin.checkInId,
        task: this.state.tasks,
        note: this.state.notes,
        dateTime: this.state.selectedTime24Hr,
        uadate: this.props.dashboardModel.checkin.date,
      };
    }

    console.log(input);
    this.props.updateCheckout(input);
  }

  onCheckoutTimeButtonTapped() {}
}

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    checkinModel: updateTaskSelector(state.TimesheetReducer),
    isLoading: state.TimesheetReducer.isLoading,
    api: state.TimesheetReducer.api,
    error: state.TimesheetReducer.error,
    checkInId: updateCheckoutSelector(state.TimesheetReducer),
    dashboardModel: myDashboardSelector(state.DashboardReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateTask: input => dispatch(updateTask(input)),
    updateCheckout: input => dispatch(updateCheckout(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManualCheckoutCell);

const styles = {
  nextToEach: {
    flex: 1,
    flexDirection: 'row',
  },
  leftRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontWeight: '700',
    color: 'black',
    height: 30,
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
  },

  detail: {
    fontWeight: '700',
    color: '#808080',
    // height:30,
    paddingLeft: 10,
  },

  detailRed: {
    fontWeight: '700',
    color: 'red',
    height: 60,
    paddingLeft: 10,
  },
  bottomButtonViewStyle: {
    position: 'relative',
    borderRadius: 10,
    backgroundColor: '#383C55',
    height: ScreenHeight * 0.07,
    // alignSelf: "center",
    margin: 5,
    width: '50%',
  },
  buttonTextStyle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
  },
  blackButtonTextStyle: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainerStyle: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  buttonAnywhereStyle: {
    position: 'relative',
    borderRadius: 10,
    // padding: ScreenHeight*0.07/4,
    // padding:10,
    width: 120,
    height: 30,
    // paddingRight:5,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight:5
  },
};
