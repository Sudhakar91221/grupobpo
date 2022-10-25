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
import {UPDATE_TASK} from '../Actions/type';
import {updateTask} from '../Actions/TimesheetActions';
import {updateTaskSelector} from '../Actions/selectors';
import {translate} from '../../../../App';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';

class CheckinCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
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
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == UPDATE_TASK) {
      if (
        this.props.error !== prevProps.error &&
        this.props.error.message !== ''
      ) {
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

    if (this.props.api === UPDATE_TASK) {
      if (this.props.error !== null && this.props.api === UPDATE_TASK) {
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

      if (!this.props.error && this.props.api === UPDATE_TASK) {
        if (this.props.checkinModel !== this.state.checkinModel) {
          this.setState({checkinModel: this.props.checkinModel});
          Alert.alert(
            'Task updated successfully',
            '',
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
            item.outTime == '-' && this.props.isFromManualCheckout == true
              ? true
              : false
          }
          onToggle={isCollapsed => this.setState({collapsed: isCollapsed})}>
          <CollapseHeader>{this.renderHeader(item)}</CollapseHeader>
          <CollapseBody>
            {item.outTime !== '-' && item.task == ''
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
      </View>
    );
  }
  onViewAttachmentTapped() {
    console.log(this.state.showAttachment);

    this.setState({showAttachment: true});

    // this.props.navigation.push('ImageViewer')
  }

  renderHeader(item) {
    return (
      <View style={[styles.nextToEach]}>
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
                  <Text style={styles.detail}>
                    {' '}
                    {item.inTime}
                    {' - '}{' '}
                  </Text>
                  {this.state.collapsed == true ? (
                    <TouchableOpacity>
                      <Text style={styles.detailRed}>
                        {' '}
                        {this.state.selectedTime
                          ? this.state.selectedTime
                          : 'Checkout Here'}{' '}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.detailRed}>
                      {' '}
                      {this.state.selectedTime
                        ? this.state.selectedTime
                        : 'Checkout Here'}{' '}
                    </Text>
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
            style={{paddingBottom: 15, paddingRight: 10, alignSelf: 'flex-end'}}
          />
        ) : (
          <Icons.Ionicons
            name="md-arrow-dropright"
            size={30}
            color="black"
            style={{paddingBottom: 15, paddingRight: 10, alignSelf: 'flex-end'}}
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
        }}>
        <BottomButton
          style={{
            width: '40%',
            height: 50,
            borderRadius: 30,
            backgroundColor: '#343957',
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
    var result = this.validateAllDetails();
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

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    taskModel: updateTaskSelector(state.TimesheetReducer),
    isLoading: state.TimesheetReducer.isLoading,
    api: state.TimesheetReducer.api,
    error: state.TimesheetReducer.error,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateTask: input => dispatch(updateTask(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckinCell);

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
    height: 30,
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
    color: 'white',
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
    color: 'black',
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
